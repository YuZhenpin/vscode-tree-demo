import { GroupModel } from "./models/groupModel";
import { ProjectModel } from "./models/projectModel";
import { RecordModel } from "./models/recordModel";
import { BranchModel } from "./models/branchModel";

export class RestClient {
	public getGroups(): Thenable<GroupModel[]>  {
		return new Promise((resolve, reject) => {
			resolve([new GroupModel("1", "hello"), new GroupModel("2", "world")]);
		});
	}

	public getProjects(groupModel: GroupModel | undefined): Thenable<ProjectModel[]> {
		return new Promise((resolve, rejects) => {
			if (groupModel) {
				resolve([new ProjectModel("1", "tppppp"), new ProjectModel("2", "foooo")]);
			} else {
				resolve([]);
			}
		});
	}

	public getBranches(projectModel: ProjectModel | undefined): Thenable<BranchModel[]> {
		return new Promise((resolve, rejects) => {
			resolve([new BranchModel("master"), new BranchModel("dev")]);
		});
	}

	public getRecords(projectModel: ProjectModel | undefined): Thenable<RecordModel[]> {
		return new Promise((resolve, reject) => {
			if (projectModel) {
				resolve([new RecordModel("3", "4"), new RecordModel("4", "5555")]);
			} else {
				resolve([]);
			}
		});
	}
}