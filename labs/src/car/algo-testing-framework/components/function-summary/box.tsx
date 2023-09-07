import React from 'react';
import styled from 'styled-components';


export interface Props
{
    className ?: string;

    category : string;

    name ?: string;

    type : string;

    children ?: React.ReactNode;
}


const Container = styled.div`
    margin: 1px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #88F;
    padding: 2px;
`;

const Category = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-variant: small-caps;
    font-weight: bold;
    background: #77F;
    width: 7em;
    user-select: none;
    pointer:
`;

const Name = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-left: 1em;
    font-family: 'Courier New', Courier, monospace;
`;

const Type = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    background: #222;
    color: white;
    font-family: 'Courier New', Courier, monospace;
    min-width: 8em;
    padding: 0.2em 1em;
    user-select: none;
`;

const Description = styled.div`
    background: #AAF;
    padding: 0.5em;
`;

const HorizontalGroup = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;

export class Box extends React.Component<Props>
{
    render() : JSX.Element
    {
        const name = this.props.name ? <Name>{this.props.name}</Name> : <React.Fragment />;

        return (
            <Container className={this.props.className}>
                <Header>
                    <HorizontalGroup>
                        <Category>
                            {this.props.category}
                        </Category>
                        {name}
                    </HorizontalGroup>
                    <Type>
                        {this.props.type}
                    </Type>
                </Header>
                <Description>
                    {this.props.children}
                </Description>
            </Container>
        );
    }
}
