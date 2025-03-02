// theme.js
export const keywordColors = {
    "with": "FF6347", 
    "entry": "FF6347",
    "print": "FF6347",
    "if": "32CD32",   
    "else": "32CD32", 
    "while": "32CD32",
    "for": "32CD32",  
    "return": "32CD32"
};

export const theme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        // Customize token colors here
        { token: 'keyword', foreground: 'FF6347' },
        { token: 'keyword.with', foreground: keywordColors['with'] },
        { token: 'keyword.entry', foreground: keywordColors['entry'] },
        { token: 'keyword.print', foreground: keywordColors['print'] },
        { token: 'keyword.if', foreground: keywordColors['if'] },
        { token: 'keyword.else', foreground: keywordColors['else'] },
        { token: 'keyword.while', foreground: keywordColors['while'] },
        { token: 'keyword.for', foreground: keywordColors['for'] },
        { token: 'keyword.return', foreground: keywordColors['return'] },
    ],
    colors: {
        'editor.background': '#1E1E1E',
    }
};
