import { theme, keywordColors } from './theme';
import * as monaco from "monaco-editor";

export function registerJacSuggestions(monaco) {
    monaco.languages.register({ id: "jac" });

    //Define the custom theme
    monaco.editor.defineTheme('jacTheme', theme);
    monaco.editor.setTheme('jacTheme');

    monaco.languages.setMonarchTokensProvider("jac", {
        keywords: ["with", "entry", "print", "if", "else", "while", "for", "return"],
        tokenizer: {
            root: [
                [/\b(with)\b/, { token: "keyword.with" }],
                [/\b(entry)\b/, { token: "keyword.entry" }],
                [/\b(print)\b/, { token: "keyword.print" }],
                [/\b(if)\b/, { token: "keyword.if" }],
                [/\b(else)\b/, { token: "keyword.else" }],
                [/\b(while)\b/, { token: "keyword.while" }],
                [/\b(for)\b/, { token: "keyword.for" }],
                [/\b(return)\b/, { token: "keyword.return" }],
                [/\b\d+\b/, "number"],
                [/"([^"\\]|\\.)*$/, "string.invalid"],
                [/"/, "string", "@string"],
            ],
            string: [
                [/[^\"]+/, "string"],    // Content inside a string
                [/\"/, "string", "@pop"]  // End string
            ],
        },
    });
    

    monaco.languages.registerCompletionItemProvider("jac", {
        provideCompletionItems: () => {
            const suggestions = [
                {
                    label: "print",
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: "print(${1:statement});",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Prints text to the console",
                },
                {
                    label: "if",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "if ${1:condition} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "If statement block",
                },
                {
                    label: "else",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "else {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Else statement block",
                },
                {
                    label: "elif",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "elif ${1:condition} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Elif statement block",
                },
                {
                    label: "with",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "with entry {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines the entry point",
                },
                {
                    label: "can",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "can ${1:abilityName}() -> ${2:returnType} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines an ability",
                },
                {
                    label: "node",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "node ${1:nodeName} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines a node",
                },
                {
                    label: "walker",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "walker ${1:walkerName} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines a walker",
                },
                {
                    label: "has",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "has ${1:attributeName}: ${2:type};",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines an attribute",
                },
                {
                    label: "obj",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "obj ${1:objectName} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines an Object",
                },
                {
                    label: "glob",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "glob: ${1:accessTag} ${2:varName} = ${3:value};",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines an Global Variable",
                },
                {
                    label: "enum",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "enum: ${1:enumName} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines an Enum",
                },
                {
                    label: "for",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "for ${1:item} in ${2:items} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines in For Loop",
                },
                {
                    label: "iterfor",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "for ${1:assignment} to ${2:condition} by ${3:step} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines IterFor Loop",
                },
                {
                    label: "try",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "try {\n\t$1\n} except ${2:exception} {\n\t$0\n}",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines Try Except Block",
                },
                {
                    label: "return",
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: "return ${1:returnVal};",
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: "Defines Return Statement",
                }
            ];

            return {
                suggestions: suggestions,
            };
        },
    });

}
