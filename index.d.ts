import * as React from 'react';

interface SearchWords {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (foundText?:string, text?:string, event?:React.MouseEvent)=> void;
    render?: (foundText?:string, startIndex?:number, endIndex?:number)=> any;
}
interface DefaultProps {
    caseSensitive?: boolean,
    searchWords?: SearchWords[],
    textToHighlight?: string|React.ReactNode,
    globalClassName?: string,
    globalStyle?: React.CSSProperties;
    globalOnClick?: (foundText?:string, text?:string, event?:React.MouseEvent)=> void;
}

declare class Highlighter extends React.Component<DefaultProps> {
    // @ts-ignore
    public static defaultProps = {
        caseSensitive: false
    };
    // @ts-ignore
    render(): JSX.Element;
}

export default Highlighter;