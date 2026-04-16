import { ACadVersion } from '../../../ACadVersion.js';
import { DwgFileHeaderAC15 } from './DwgFileHeaderAC15.js';
import { DwgSectionDescriptor } from './DwgSectionDescriptor.js';

export class DwgFileHeaderAC18 extends DwgFileHeaderAC15 {
	dwgVersion: number = 0;
	appReleaseVersion: number = 0;
	summaryInfoAddr: number = 0;
	securityType: number = 0;
	vbaProjectAddr: number = 0;
	rootTreeNodeGap: number = 0;
	gapArraySize: number = 0;
	crcSeed: number = 0;
	lastPageId: number = 0;
	lastSectionAddr: number = 0;
	secondHeaderAddr: number = 0;
	gapAmount: number = 0;
	sectionAmount: number = 0;
	sectionPageMapId: number = 0;
	pageMapAddress: number = 0;
	sectionMapId: number = 0;
	sectionArrayPageSize: number = 0;
	rigthGap: number = 0;
	leftGap: number = 0;

	descriptors: Map<string, DwgSectionDescriptor> = new Map();

	constructor(version?: ACadVersion) {
		super(version);
	}

	override addSection(name: string): void {
		this.descriptors.set(name, new DwgSectionDescriptor(name));
	}

	addSectionDescriptor(descriptor: DwgSectionDescriptor): void {
		this.descriptors.set(descriptor.name, descriptor);
	}

	override getDescriptor(name: string): DwgSectionDescriptor {
		return this.descriptors.get(name)!;
	}
}
