export class DwgSectionDefinition {
	static readonly AcDbObjects = 'AcDb:AcDbObjects';
	static readonly AppInfo = 'AcDb:AppInfo';
	static readonly AuxHeader = 'AcDb:AuxHeader';
	static readonly Classes = 'AcDb:Classes';
	static readonly FileDepList = 'AcDb:FileDepList';
	static readonly Handles = 'AcDb:Handles';
	static readonly Header = 'AcDb:Header';
	static readonly ObjFreeSpace = 'AcDb:ObjFreeSpace';
	static readonly Preview = 'AcDb:Preview';
	static readonly RevHistory = 'AcDb:RevHistory';
	static readonly SummaryInfo = 'AcDb:SummaryInfo';
	static readonly Template = 'AcDb:Template';

	static readonly EndSentinels: Map<string, Uint8Array> = new Map([
		[DwgSectionDefinition.Header, new Uint8Array([0x30, 0x84, 0xE0, 0xDC, 0x02, 0x21, 0xC7, 0x56, 0xA0, 0x83, 0x97, 0x47, 0xB1, 0x92, 0xCC, 0xA0])],
		[DwgSectionDefinition.Classes, new Uint8Array([0x72, 0x5E, 0x3B, 0x47, 0x3B, 0x56, 0x07, 0x3A, 0x3F, 0x23, 0x0B, 0xA0, 0x18, 0x30, 0x49, 0x75])],
		[DwgSectionDefinition.Preview, new Uint8Array([0xE0, 0xDA, 0x92, 0xF8, 0x2B, 0xC9, 0xD7, 0xD7, 0x62, 0xA8, 0x35, 0xC0, 0x62, 0xBB, 0xEF, 0xD4])],
	]);

	static readonly StartSentinels: Map<string, Uint8Array> = new Map([
		[DwgSectionDefinition.Header, new Uint8Array([0xCF, 0x7B, 0x1F, 0x23, 0xFD, 0xDE, 0x38, 0xA9, 0x5F, 0x7C, 0x68, 0xB8, 0x4E, 0x6D, 0x33, 0x5F])],
		[DwgSectionDefinition.Classes, new Uint8Array([0x8D, 0xA1, 0xC4, 0xB8, 0xC4, 0xA9, 0xF8, 0xC5, 0xC0, 0xDC, 0xF4, 0x5F, 0xE7, 0xCF, 0xB6, 0x8A])],
		[DwgSectionDefinition.Preview, new Uint8Array([0x1F, 0x25, 0x6D, 0x07, 0xD4, 0x36, 0x28, 0x28, 0x9D, 0x57, 0xCA, 0x3F, 0x9D, 0x44, 0x10, 0x2B])],
	]);

	static GetSectionLocatorByName(name: string): number | null {
		switch (name) {
			case DwgSectionDefinition.Header:
				return 0;
			case DwgSectionDefinition.Classes:
				return 1;
			case DwgSectionDefinition.Handles:
				return 2;
			case DwgSectionDefinition.ObjFreeSpace:
				return 3;
			case DwgSectionDefinition.Template:
				return 4;
			case DwgSectionDefinition.AuxHeader:
				return 5;
			default:
				return null;
		}
	}
}
