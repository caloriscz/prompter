# Prompter

Prompter is a custom Visual Studio Code extension designed to simplify and enhance your development workflow by allowing you to save the content of selected files and folders into a markdown file.

## Features

- **Save Selected Content to Markdown**: Save the content of selected files (both individual files and folders) into a markdown file. The contents of text files are added, and binary files are skipped.
- Add more features here...

## Usage

1. **Right-click** on one or more files or folders in the Explorer.
2. Choose the **"Save Selected Content to Markdown"** option from the context menu.
3. The content of the selected files will be saved into a markdown file, where each file’s content is enclosed within code blocks.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Use `F5` to debug and run the extension in VS Code.

To package and install the extension locally:

1. Run `vsce package` to generate the `.vsix` file.
2. Open VS Code, go to the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
3. Run `Extensions: Install from VSIX...` and select the `.vsix` file.

## Development

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Use `F5` to launch the extension in a new VS Code window for debugging.

## Contributing

For personal use only, but feel free to modify it as you like!

## License

MIT License (see LICENSE file).