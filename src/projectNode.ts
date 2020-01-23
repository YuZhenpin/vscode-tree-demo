import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { RestClient } from './restClient';
import { GroupModel } from './models/groupModel';
import { ProjectModel } from './models/projectModel';

export class ProjectNodeProvider implements vscode.TreeDataProvider<ProjectNode> {

	private _groupModel: GroupModel;
	private _onDidChangeTreeData: vscode.EventEmitter<ProjectNode | undefined> = new vscode.EventEmitter<ProjectNode | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ProjectNode | undefined> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string, private restClient: RestClient) {
		vscode.commands.registerCommand('nodeProjects.showProjects', (groupModel) => this.showProjects(groupModel));
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: ProjectNode): vscode.TreeItem {
		return element;
	}

	getChildren(element?: ProjectNode): Thenable<ProjectNode[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No group in empty workspace');
			//return Promise.resolve([]);
		}

		return this.restClient.getProjects(this._groupModel).then(projects => {
			return projects.map(p => { 
				const treeItem = new ProjectNode(p, vscode.TreeItemCollapsibleState.None);
				treeItem.command = { command: 'nodeRecords.showRecords', title: "Show Records", arguments: [p], };
				return treeItem;
			});
		});

	}

	showProjects(groupModel: GroupModel) {
		this._groupModel = groupModel;
		vscode.window.showInformationMessage('Show group');
		this.refresh();
	}
}

export class ProjectNode extends vscode.TreeItem {

	constructor(
		public readonly projectModel: ProjectModel,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	) {
		super(projectModel.name, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.projectModel.name}`;
	}

	get description(): string {
		return this.projectModel.name;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

}
