import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { RestClient } from './restClient';
import { ProjectModel } from './models/projectModel';

export class RecordNodeProvider implements vscode.TreeDataProvider<RecordNode> {

	private _projectModel: ProjectModel;
	private _onDidChangeTreeData: vscode.EventEmitter<RecordNode | undefined> = new vscode.EventEmitter<RecordNode | undefined>();
	readonly onDidChangeTreeData: vscode.Event<RecordNode | undefined> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string, private restClient: RestClient) {
		vscode.commands.registerCommand('nodeRecords.showRecords', (projectModel) => this.showRecords(projectModel));
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: RecordNode): vscode.TreeItem {
		return element;
	}

	getChildren(element?: RecordNode): Thenable<RecordNode[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No record in empty workspace');
			//return Promise.resolve([]);
		}

		return this.restClient.getRecords(this._projectModel).then(records => {
			return records.map(g => { return new RecordNode(g.id, g.name, vscode.TreeItemCollapsibleState.None); });
		});

	}

	showRecords(projectModel: ProjectModel) {
		this._projectModel = projectModel;
		vscode.window.showInformationMessage('Show Projects');
		this.refresh();
	}
}

export class RecordNode extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.version}`;
	}

	get description(): string {
		return this.version;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

}
