import * as React from 'react';

interface SearchWords {
    text: string;
    style?: React.CSSProperties;
    onClick?: (foundText:string, text:string, event:React.MouseEvent)=> void;
}
interface DefaultProps {
    caseSensitive?: boolean,
    searchWords?: SearchWords[],
    textToHighlight?: string|React.ReactNode,
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