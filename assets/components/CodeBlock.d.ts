import React from 'react';
interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
    maxHeight?: string;
}
export declare const CodeBlock: React.FC<CodeBlockProps>;
export default CodeBlock;
