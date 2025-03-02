export const commonColors = {
    "key_purple": "e37dfc",
    "key_dark_blue": "787df9",
    "key_light_yellow": "fefeb3",
    "key_yellow": "faff64",
    "key_light_green": "84ffee",
    "key_green": "107a02",
}


export const keywordColors = {
    "with": commonColors.key_dark_blue, 
    "entry": commonColors.key_purple,
    "print": commonColors.key_light_yellow,
    "if": commonColors.key_purple,   
    "else": commonColors.key_purple, 
    "elif": commonColors.key_purple, 
    "while": commonColors.key_purple,
    "for": commonColors.key_purple,  
    "return": commonColors.key_purple,
    "try": commonColors.key_purple,
    "except": commonColors.key_purple,
    "in": commonColors.key_dark_blue,
    "parenthesis": commonColors.key_yellow,
    "bracket": commonColors.key_light_green,
    "brace": commonColors.key_purple,
    "comment": commonColors.key_green,
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
        { token: 'keyword.elif', foreground: keywordColors['elif'] },
        { token: 'keyword.else', foreground: keywordColors['else'] },
        { token: 'keyword.while', foreground: keywordColors['while'] },
        { token: 'keyword.for', foreground: keywordColors['for'] },
        { token: 'keyword.return', foreground: keywordColors['return'] },
        { token: 'keyword.try', foreground: keywordColors['try'] },
        { token: 'keyword.except', foreground: keywordColors['except'] },
        { token: 'keyword.in', foreground: keywordColors['in'] },
        { token: 'delimiter.parenthesis', foreground: keywordColors['parenthesis'] },
        { token: 'delimiter.bracket', foreground: keywordColors['bracket'] },
        { token: 'delimiter.brace', foreground: keywordColors['brace'] },
        { token: 'comment', foreground: keywordColors['comment'] },
    ],
    colors: {
        'editor.background': '#1E1E1E',
    }
};
