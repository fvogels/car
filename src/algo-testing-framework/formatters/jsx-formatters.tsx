import React from 'react';
import * as Type from '../type';
import { allEqual } from '@/algorithms';
import { Bitmap, Color } from '../imaging';
import { BitmapViewer } from '../components/bitmap-viewer';
import { Invalid } from '../components/invalid';
import { convertToString } from './string-formatters';
import { DiceViewer } from '../components/dice-viewer';
import { InlineCode } from '../components/inline-code';
import { all } from '@/algorithms';
import { Maybe } from 'maybe';


export function jsxify(x : JSX.Element | string)
{
    if ( Type.string.hasType(x) )
    {
        return (
            <React.Fragment>
                {x}
            </React.Fragment>
        );
    }
    else
    {
        return x;
    }
}


export type IToJsxElement<T> = (t : T) => JSX.Element;


export function simple(x : any) : JSX.Element
{
    return (
        <span>
            {convertToString(x)}
        </span>
    );
}

export function code(str : string) : JSX.Element
{
    return (
        <InlineCode content={str} />
    );
}

function invalid(message : string)
{
    return (
        <Invalid message={message} value={message} />
    );
}

function isRectangle2DArray<T>(xss : T[][]) : Maybe<string>
{
    if ( !Type.array(Type.any).hasType(xss) )
    {
        return Maybe.just("Should be an array");
    }
    else if ( !all(xss, xs => Type.array(Type.any).hasType(xs) ) )
    {
        return Maybe.just("All elements should be arrays");
    }
    else
    {
        if ( !allEqual( xss.map(y => y.length) ) )
        {
            return Maybe.just("All rows should have the same length");
        }
        else
        {
            return Maybe.nothing();
        }
    }
}

export function grayscaleBitmap(xss : number[][], resize ?: { width: number, height: number }) : JSX.Element
{
    return isRectangle2DArray(xss).caseOf({
        just: error => invalid(error),
        nothing: () => {
            if ( !all(xss, xs => all( xs, x => isValidPixelValue(x) ) ) )
            {
                return invalid("All values should be integers between 0 and 255");
            }
            else
            {
                const bitmap = Bitmap.fromGrayscale(xss);

                return (
                    <BitmapViewer bitmap={bitmap} resize={resize} />
                );
            }
        }
    });

    function isValidPixelValue(x : any)
    {
        return Type.number.hasType(x) && 0 <= x && x <= 255 && Math.floor(x) === x;
    }
}

export function rgbBitmap(xss : Color[][], resize ?: { width: number, height: number }) : JSX.Element
{
    return isRectangle2DArray(xss).caseOf({
        just: error => invalid(error),
        nothing: () => {
            if ( !all(xss, xs => all( xs, x => isValidPixelValue(x) ) ) )
            {
                return invalid("All values should be color objects");
            }
            else
            {
                const bitmap = Bitmap.fromColors(xss);

                return (
                    <BitmapViewer bitmap={bitmap} resize={resize} />
                );
            }
        }
    });

    function isValidPixelValue(x : any)
    {
        return Type.object.hasType(x) && Type.number.hasType(x.r) && Type.number.hasType(x.g) && Type.number.hasType(x.b);
    }
}

export function blackAndWhiteBitmap(xss : boolean[][], resize ?: { width: number, height: number }) : JSX.Element
{
    return isRectangle2DArray(xss).caseOf({
        just: error => invalid(error),
        nothing: () => {
            if ( !all(xss, xs => all( xs, x => isValidPixelValue(x) ) ) )
            {
                return invalid("All values should be booleans");
            }
            else
            {
                const bitmap = Bitmap.fromBlackAndWhite(xss);

                return (
                    <BitmapViewer bitmap={bitmap} resize={resize} />
                );
            }
        }
    });

    function isValidPixelValue(x : any)
    {
        return Type.boolean.hasType(x) ;
    }
}

export function dice(ns : number[]) : JSX.Element
{
    return (
        <DiceViewer dice={ns} />
    );
}

export function asHorizontalTable<T>(elements : T[], subformatter : (x : T) => JSX.Element, className : string) : JSX.Element
{
    const formattedElements = elements.map( (element, i) => <td key={i}>{subformatter(element)}</td> );

    return (
        <table className={className}>
            <tbody>
                <tr>
                    {formattedElements}
                </tr>
            </tbody>
        </table>
    );
}

export function asVerticalTable<T>(elements : T[], subformatter : (x : T) => JSX.Element, className : string) : JSX.Element
{
    const formattedElements = elements.map( (element, i) => <tr key={i}><td>{subformatter(element)}</td></tr> );

    return (
        <table className={className}>
            <tbody>
                {formattedElements}
            </tbody>
        </table>
    );
}

export function asTable<T>(rows : T[][], subformatter : (x : T) => JSX.Element, className : string) : JSX.Element
{
    const formattedRows = rows.map( (row, i) => {
        const formattedRow = row.map( (element, j) => {
            return (
                <td key={j}>
                    {subformatter(element)}
                </td>
            );
        });

        return (
            <tr key={i}>
                {formattedRow}
            </tr>
        );
    });

    return (
        <table className={className}>
            <tbody>
                {formattedRows}
            </tbody>
        </table>
    );
}
