import React from 'react';
import { IColumn, IRow } from '../components/forms/row-based-form';
import { TypedFunctionCallResults, parseFunction, typedCallFunction } from '../function-util';
import { ValidatedInput } from '../components/validated-input';
import { Form } from '../components/forms/row-based-form';
import { deepEqual } from '../equality';
import { evalm } from '../evalm';
import { code } from '../formatters/jsx-formatters';


abstract class Column<Ps extends any[], R> implements IColumn
{
    public abstract readonly header : JSX.Element;

    public abstract renderCell(fcr : TypedFunctionCallResults<Ps, R>) : JSX.Element;
}

/**
 * Column corresponding to a parameter.
 */
abstract class ParameterColumn<Ps extends any[], R> extends Column<Ps, R>
{
    protected abstract readonly parameterName : string;

    public renderCell(fcr : TypedFunctionCallResults<Ps, R>) : JSX.Element
    {
        return code(fcr.namedArgumentsBeforeCall[this.parameterName]);
    }
}

/**
 * Column corresponding to the return value.
 */
abstract class ReturnValueColumn<Ps extends any[], R> extends Column<Ps, R>
{
    protected abstract equality(input : string, expected : R) : boolean;

    public renderCell(fcr : TypedFunctionCallResults<Ps, R>) : JSX.Element
    {
        return (
            <ValidatedInput validator={(input) => this.equality(input, fcr.returnValue)} />
        );
    }
}

class Row<Ps extends any[], R> implements IRow<Column<Ps, R>>
{
    constructor(private fcr : TypedFunctionCallResults<Ps, R>) { }

    render(column: Column<Ps, R>): JSX.Element
    {
        return column.renderCell(this.fcr);
    }
}

export abstract class ReturnValueInterpretationExercise<Ps extends any[], R>
{
    protected abstract readonly function : (...args : Ps) => R;

    protected abstract generateInputs() : Iterable<Ps>;

    private get rows() : Row<Ps, R>[]
    {
        const inputs = Array.from(this.generateInputs());

        return inputs.map( input => this.createRow(input) );
    }

    private createRow(input : Ps) : Row<Ps, R>
    {
        const fcr : TypedFunctionCallResults<Ps, R> = typedCallFunction(this.function, ...input);

        return new Row<Ps, R>(fcr);
    }

    private get columns()
    {
        return [ ...this.createParameterColumns(), this.createReturnValueColumn() ];
    }

    private createParameterColumns() : Column<Ps, R>[]
    {
        return parseFunction(this.function).parameterNames.map(parameterName => this.createParameterColumn(parameterName));
    }

    private createParameterColumn(parameterName : string) : Column<Ps, R>
    {
        const me = this;

        return new class extends ParameterColumn<Ps, R>
        {
            protected parameterName = parameterName;

            public get header()
            {
                return me.createParameterColumnHeader(parameterName);
            }
        };
    }

    protected createParameterColumnHeader(parameterName : string) : JSX.Element
    {
        return (
            <React.Fragment>
                {parameterName}
            </React.Fragment>
        );
    }

    protected createReturnValueColumnHeader() : JSX.Element
    {
        return (
            <React.Fragment>
                return value
            </React.Fragment>
        );
    }

    private createReturnValueColumn() : Column<Ps, R>
    {
        const me = this;

        return new class extends ReturnValueColumn<Ps, R>
        {
            public get header()
            {
                return me.createReturnValueColumnHeader();
            }

            protected equality(input: string, expected: R): boolean
            {
                return evalm(input).caseOf({
                    just: x => me.equality(x, expected),
                    nothing: () => false
                });
            }
        };
    }

    public render() : JSX.Element
    {
        return (
            <Form rows={this.rows} columns={this.columns} />
        );
    }

    protected equality(input : any, expected : R) : boolean
    {
        return deepEqual(input, expected);
    }
}