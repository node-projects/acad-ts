export class CadSummaryInfo {
	public title: string = "";
	public subject: string = "";
	public author: string = "";
	public keywords: string = "";
	public comments: string = "";
	public lastSavedBy: string = "";
	public revisionNumber: string = "";
	public hyperlinkBase: string = "";
	public createdDate: Date = new Date();
	public modifiedDate: Date = new Date();
	public properties: Map<string, string> = new Map<string, string>();
}
