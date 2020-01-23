'use strict';

import * as vscode from 'vscode';

import { DepNodeProvider, Dependency } from './nodeDependencies';
import { JsonOutlineProvider } from './jsonOutline';
import { FtpExplorer } from './ftpExplorer';
import { FileExplorer } from './fileExplorer';
import { TestView } from './testView';
import { RestClient } from './restClient';
import { GroupNodeProvider } from './groupNode';
import { ProjectNodeProvider } from './projectNode';
import { RecordNodeProvider } from './recordNode';

export function activate(context: vscode.ExtensionContext) {

	const restClient = new RestClient();

	// Samples of `window.registerTreeDataProvider`
	const nodeGroupProvider = new GroupNodeProvider(vscode.workspace.rootPath, restClient);
	vscode.window.registerTreeDataProvider('nodeGroups', nodeGroupProvider);
	vscode.commands.registerCommand('nodeGroups.refreshEntry', () => nodeGroupProvider.refresh());

	const projectNodeProvider = new ProjectNodeProvider(vscode.workspace.rootPath, restClient);
	vscode.window.registerTreeDataProvider('nodeProjects', projectNodeProvider);
	vscode.commands.registerCommand('nodeProjects.refreshEntry', () => projectNodeProvider.refresh());
	vscode.commands.registerCommand('nodeProjects.buildEntry', (projectNode) => projectNodeProvider.buildProject(projectNode));

	const recordNodeProvider = new RecordNodeProvider(vscode.workspace.rootPath, restClient);
	vscode.window.registerTreeDataProvider('nodeRecords', recordNodeProvider);
	vscode.commands.registerCommand('nodeRecords.refreshEntry', () => recordNodeProvider.refresh());
	vscode.commands.registerCommand('nodeRecords.stopEntry', (recordNode) => recordNodeProvider.stopRecord(recordNode));
	vscode.commands.registerCommand('nodeRecords.showEntry', (recordModel) => recordNodeProvider.showRecord(recordModel));

	const nodeDependenciesProvider = new DepNodeProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
	vscode.commands.registerCommand('nodeDependencies.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	vscode.commands.registerCommand('nodeDependencies.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	vscode.commands.registerCommand('nodeDependencies.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));

	const jsonOutlineProvider = new JsonOutlineProvider(context);
	vscode.window.registerTreeDataProvider('jsonOutline', jsonOutlineProvider);
	vscode.commands.registerCommand('jsonOutline.refresh', () => jsonOutlineProvider.refresh());
	vscode.commands.registerCommand('jsonOutline.refreshNode', offset => jsonOutlineProvider.refresh(offset));
	vscode.commands.registerCommand('jsonOutline.renameNode', offset => jsonOutlineProvider.rename(offset));
	vscode.commands.registerCommand('extension.openJsonSelection', range => jsonOutlineProvider.select(range));

	// Samples of `window.createView`
	new FtpExplorer(context);
	new FileExplorer(context);

	// Test View
	new TestView(context);
}