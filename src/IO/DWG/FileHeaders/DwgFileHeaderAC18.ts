import { ACadVersion } from '../../../ACadVersion.js';
import { DwgFileHeaderAC15 } from './DwgFileHeaderAC15.js';
import { DwgSectionDescriptor } from './DwgSectionDescriptor.js';

export class DwgFileHeaderAC18 extends DwgFileHeaderAC15 {
	DwgVersion: number = 0;
	AppReleaseVersion: number = 0;
	SummaryInfoAddr: number = 0;
	SecurityType: number = 0;
	VbaProjectAddr: number = 0;
	RootTreeNodeGap: number = 0;
	GapArraySize: number = 0;
	CRCSeed: number = 0;
	LastPageId: number = 0;
	LastSectionAddr: number = 0;
	SecondHeaderAddr: number = 0;
	GapAmount: number = 0;
	SectionAmount: number = 0;
	SectionPageMapId: number = 0;
	PageMapAddress: number = 0;
	SectionMapId: number = 0;
	SectionArrayPageSize: number = 0;
	RigthGap: number = 0;
	LeftGap: number = 0;

	Descriptors: Map<string, DwgSectionDescriptor> = new Map();

	constructor(version?: ACadVersion) {
		super(version);
	}

	override AddSection(name: string): void {
		this.Descriptors.set(name, new DwgSectionDescriptor(name));
	}

	AddSectionDescriptor(descriptor: DwgSectionDescriptor): void {
		this.Descriptors.set(descriptor.Name, descriptor);
	}

	override GetDescriptor(name: string): DwgSectionDescriptor {
		return this.Descriptors.get(name)!;
	}
}
