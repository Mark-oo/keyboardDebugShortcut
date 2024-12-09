import * as vscode from 'vscode';
const LARAVEL_DIRECTORIES = [
    'Http',           
    'Models',         
    'Console',        
    'Providers',      
    'Services',       
    'Policies',       
    'Exceptions',     
    'Events',         
    'Listeners',      
    'Jobs',           
    'Notifications',  
    'Mail',           
    'Broadcasting',   
    'Tests',          
    'Observers',      
    'Repositories',   
    'Rules',          
    'Traits',         
    'Views',          
];
const debugHelpers = [
    { id: -1, language: 'raw_php', debugSyntax: 'var_dump($${variable});' },
    { id: 0, language: 'php', debugSyntax: 'dd($${variable});' },
    { id: 1, language: 'blade', debugSyntax: '@dd($${variable})' },
    { id: 2, language: 'javascript', debugSyntax: 'console.log(${variable});' },
    { id: 3, language: 'python', debugSyntax: 'print(${variable})' },
    { id: 4, language: 'ruby', debugSyntax: 'p ${variable}' },
    { id: 5, language: 'csharp', debugSyntax: 'Console.WriteLine(${variable});' },
    { id: 6, language: 'java', debugSyntax: 'System.out.println(${variable});' },
    { id: 7, language: 'go', debugSyntax: 'fmt.Println(${variable})' },
    { id: 8, language: 'swift', debugSyntax: 'print(${variable})' },
    { id: 9, language: 'rust', debugSyntax: 'println!("{}", ${variable});' },
    { id: 10, language: 'kotlin', debugSyntax: 'println(${variable});' },
    { id: 11, language: 'perl', debugSyntax: 'print(${variable});' },
    { id: 12, language: 'lua', debugSyntax: 'print(${variable});' },
    { id: 13, language: 'r', debugSyntax: 'print(${variable})' },
    { id: 14, language: 'elixir', debugSyntax: 'IO.inspect(${variable});' },
    { id: 15, language: 'haskell', debugSyntax: 'print ${variable}' },
    { id: 16, language: 'dart', debugSyntax: 'print(${variable});' },
    { id: 17, language: 'scala', debugSyntax: 'println(${variable});' },
];

async function insertDebugStatement(){

	const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showInformationMessage('No active editor found!,');
        return;
    }

    const document = editor.document;
    const languageId = document.languageId;
    const selection = editor.selection;
    const selectedText = document.getText(selection).trim();
    
    const currentLine = selection.active.line;

    if (!selectedText) {
        vscode.window.showInformationMessage('No text selected or selected text is empty!');
        return;
    }

    const helper = debugHelpers.find(d => d.language === languageId);
    var dumpStatement = '';

    const isLaravel = await isLaravelProject();

    if (helper) {
        if (helper.id === 0 && !isLaravel) {
            // if "raw_php"
            const raw_php = debugHelpers.find(d => d.id === -1);
            dumpStatement = raw_php ? raw_php.debugSyntax.replace('${variable}', selectedText) : "Something went wrong!!!";
        } else {
            // if everithing else
            dumpStatement = helper.debugSyntax.replace('${variable}', selectedText);
        }

        const line = document.lineAt(selection.start.line);
        const lineIndentation = line.text.substring(0, line.firstNonWhitespaceCharacterIndex);

        editor.edit(editBuilder => {     
            const newLinePosition = selection.end.translate(1, -selection.end.character);
            editBuilder.insert(newLinePosition, `${lineIndentation}${dumpStatement}\n`);          
        }).then(() => {
            const insertionLine = selection.end.line + 1;
            const variablePositionIndex = dumpStatement.indexOf(selectedText) + selectedText.length;
            const newCursorPos = new vscode.Position(insertionLine, lineIndentation.length + variablePositionIndex);
            editor.selection = new vscode.Selection(newCursorPos, newCursorPos);
        });
    } else {
        vscode.window.showInformationMessage(`No dump function found for language: ${languageId}`);
    }
}

async function isLaravelProject(): Promise<boolean> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return false;
    }

    const composerPath = `${workspaceFolders[0].uri.fsPath}/composer.json`;

    try {
        const composerContent = await vscode.workspace.fs.readFile(vscode.Uri.file(composerPath));
        const composerJson = JSON.parse(Buffer.from(composerContent).toString('utf8'));

        return (
            composerJson.name === "laravel/laravel" ||
            (composerJson.keywords && composerJson.keywords.includes("laravel")) ||
            (composerJson.require && composerJson.require["laravel/framework"])

        );
    } catch (err) {
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor && activeEditor.document.languageId === "php") {
            if (err instanceof SyntaxError) {
                vscode.window.showWarningMessage(
                    "The composer.json file is malformed and could not be parsed. Assuming this is not a project using a PHP framework."
                );
            } else {
                vscode.window.showErrorMessage(
                    `Error reading composer.json, yes I need to read that file`
                );
            }
        }
        return false;
    }
}

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand('debugExtension.insertDebugStatement', insertDebugStatement);
    context.subscriptions.push(disposable);
}

export function deactivate() {}
