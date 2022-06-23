import * as React from 'react';

interface DefaultProps {
    caseSensitive?: boolean,
    searchWords?: [{text:string,style?:object}],
    textToHighlight?: string|node,
}

declare class Help extends React.Component<DefaultProps> {
    // @ts-ignore
    render(): JSX.Element;
}

export default Help;