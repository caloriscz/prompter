import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';

// Helper function to check if a file is binary
const isBinaryFile = async (filePath: string): Promise<boolean> => {
    try {
        const buffer = await fs.readFile(filePath);
        return buffer.includes(0); // Check for null bytes (binary files usually have these)
    } catch {
        return true; // Treat as binary if reading fails
    }
};

// Helper function to recursively get all files in a directory
const getAllFiles = async (dir: string): Promise<string[]> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map((entry) => {
            const fullPath = path.join(dir, entry.name);
            return entry.isDirectory() ? getAllFiles(fullPath) : [fullPath];
        })
    );
    return files.flat();
};

// Helper function to process a single file
const processFile = async (filePath: string): Promise<string | null> => {
    if (await isBinaryFile(filePath)) {
        console.log(`Skipping binary file: ${filePath}`);
        return null;
    }
    const content = await fs.readFile(filePath, 'utf8');
    return `# ${filePath}\n\n\`\`\`\n${content}\n\`\`\`\n\n`;
};

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'prompter.saveContentToMarkdown',
        async (...commandArgs: any[]) => {
            try {
                let selectedUris: vscode.Uri[] = [];

                // Handle context menu selections (explorer context)
                if (commandArgs.length === 2 && Array.isArray(commandArgs[1])) {
                    selectedUris = commandArgs[1];
                } else if (commandArgs.length === 1 && commandArgs[0] instanceof vscode.Uri) {
                    selectedUris = [commandArgs[0]];
                }

                if (selectedUris.length === 0) {
                    vscode.window.showErrorMessage('No files or folders selected.');
                    return;
                }

                // Collect all file paths
                const allFilePaths: string[] = [];

                for (const uri of selectedUris) {
                    const stat = await fs.stat(uri.fsPath);
                    if (stat.isFile()) {
                        allFilePaths.push(uri.fsPath);
                    } else if (stat.isDirectory()) {
                        const files = await getAllFiles(uri.fsPath);
                        allFilePaths.push(...files);
                    }
                }

                // Process all files
                const fileContents = await Promise.all(
                    allFilePaths.map((filePath) => processFile(filePath))
                );
                const markdownContent = fileContents
                    .filter((content): content is string => content !== null)
                    .join('\n');

                if (!markdownContent.trim()) {
                    vscode.window.showWarningMessage('No valid content found.');
                    return;
                }

                // Prompt user to save the output
                const saveUri = await vscode.window.showSaveDialog({
                    filters: { Markdown: ['md'] },
                    defaultUri: vscode.Uri.file(path.join(
                        path.dirname(allFilePaths[0]),
                        'output.md'
                    )),
                });

                if (saveUri) {
                    await fs.writeFile(saveUri.fsPath, markdownContent, 'utf8');
                    vscode.window.showInformationMessage(`Saved to ${saveUri.fsPath}`);
                }
            } catch (err) {
                vscode.window.showErrorMessage(`Error: ${(err as Error).message}`);
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}