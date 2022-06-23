import * as React from 'react';

interface DefaultProps {
    searchWords?: array;
    textToHighlight?: string;
}

declare class Help extends React.Component<DefaultProps> {
    // @ts-ignore
    render(): JSX.Element;
}

export default Help;