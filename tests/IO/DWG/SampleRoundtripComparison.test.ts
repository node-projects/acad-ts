import { beforeAll, describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { TestVariables } from '../../TestVariables.js';
import { getDwgFiles, readFileAsArrayBuffer } from '../../testHelpers.js';
import { ACadVersion } from '../../../src/ACadVersion.js';
import { DwgReader } from '../../../src/IO/DWG/DwgReader.js';
import { DwgWriter } from '../../../src/IO/DWG/DwgWriter.js';
import { Hatch } from '../../../src/Entities/Hatch.js';

const csharpProject = path.join(process.cwd(), 'reference', 'csharp-ref', 'RoundtripCheck', 'RoundtripCheck.csproj');
const csharpOutDir = path.join(TestVariables.outputSamplesFolder, 'csharp');
const tsOutDir = path.join(TestVariables.outputSamplesFolder, 'ts-roundtrip');
const dwgFiles = getDwgFiles();
const allowedCSharpErrors = new Set(['sample_AC1014.dwg', 'sample_AC1021.dwg']);
const lossyCSharpHatchSamples = new Set(['sample_AC1015.dwg']);

type CSharpRoundtripResult = {
	relativePath: string;
	result?: unknown;
	error?: string;
};

function hasDotnet(): boolean {
	try {
		execFileSync('dotnet', ['--version'], { stdio: 'pipe' });
		return true;
	} catch {
		return false;
	}
}

function writeTsRoundtrip(inputPath: string, outputPath: string): void {
	const doc = new DwgReader(readFileAsArrayBuffer(inputPath)).read();
	if (doc.header.version < ACadVersion.AC1014) {
		return;
	}

	const buffer = new ArrayBuffer(16 * 1024 * 1024);
	const writer = new DwgWriter(buffer, doc);
	writer.write();

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, new Uint8Array(buffer, 0, writer.bytesWritten));
}

function collectionCount(value: any): number {
	if (value == null) return 0;
	if (typeof value.count === 'number') return value.count;
	if (typeof value.length === 'number') return value.length;
	if (typeof value.size === 'number') return value.size;
	if (Symbol.iterator in Object(value)) return [...value].length;
	return 0;
}

function summarizeHatches(filePath: string): Array<Record<string, unknown>> {
	const doc = new DwgReader(readFileAsArrayBuffer(filePath)).read();
	return [...doc.entities]
		.filter((entity): entity is Hatch => entity instanceof Hatch)
		.map(hatch => ({
			handle: hatch.handle,
			isSolid: hatch.isSolid,
			patternName: hatch.pattern?.name ?? '',
			patternType: hatch.patternType,
			patternScale: hatch.patternScale,
			patternLines: hatch.pattern?.lines.length ?? 0,
			pathCount: hatch.paths.length,
			seedCount: hatch.seedPoints.length,
		}));
}

function summarizeDoc(filePath: string): Record<string, unknown> {
	const doc = new DwgReader(readFileAsArrayBuffer(filePath)).read();
	return {
		version: doc.header.version,
		blockRecords: collectionCount(doc.blockRecords),
		layers: collectionCount(doc.layers),
		lineTypes: collectionCount(doc.lineTypes),
		textStyles: collectionCount(doc.textStyles),
		dimStyles: collectionCount(doc.dimensionStyles),
		appIds: collectionCount(doc.appIds),
		classes: collectionCount(doc.classes),
	};
}

const canRunCSharpRoundtrip = fs.existsSync(csharpProject) && hasDotnet();
let csharpResults: CSharpRoundtripResult[] = [];

describe.skipIf(!canRunCSharpRoundtrip)('SampleRoundtripComparison', () => {
	beforeAll(() => {
		fs.mkdirSync(csharpOutDir, { recursive: true });
		fs.mkdirSync(tsOutDir, { recursive: true });

		for (const sample of dwgFiles) {
			writeTsRoundtrip(sample.path, path.join(tsOutDir, sample.fileName));
		}

		let rawOutput = '';
		try {
			rawOutput = execFileSync(
				'dotnet',
				['run', '--project', csharpProject, '--', TestVariables.samplesFolder, csharpOutDir],
				{ cwd: process.cwd(), stdio: 'pipe', encoding: 'utf8' },
			);
		} catch (error: any) {
			if (error?.status !== 2) {
				throw error;
			}
			rawOutput = String(error.stdout ?? '[]');
		}

		csharpResults = JSON.parse(rawOutput) as CSharpRoundtripResult[];
	}, 120000);

	it('writes C# sample roundtrips into output/csharp', () => {
		for (const sample of dwgFiles) {
			const doc = new DwgReader(readFileAsArrayBuffer(sample.path)).read();
			if (doc.header.version < ACadVersion.AC1014) {
				continue;
			}

			const entry = csharpResults.find(result => result.relativePath === sample.fileName);
			expect(entry).toBeDefined();
			if (entry?.error) {
				expect(allowedCSharpErrors.has(sample.fileName)).toBe(true);
				continue;
			}

			expect(fs.existsSync(path.join(csharpOutDir, sample.fileName))).toBe(true);
		}
	});

	describe.each(dwgFiles.map(file => [file.fileName, file] as const))('%s', (_name, sample) => {
		it('matches the C# roundtrip summary and hatch data', () => {
			const original = new DwgReader(readFileAsArrayBuffer(sample.path)).read();
			if (original.header.version < ACadVersion.AC1014) {
				return;
			}

			const entry = csharpResults.find(result => result.relativePath === sample.fileName);
			expect(entry).toBeDefined();
			if (entry?.error) {
				expect(allowedCSharpErrors.has(sample.fileName)).toBe(true);
				return;
			}

			const tsPath = path.join(tsOutDir, sample.fileName);
			const csPath = path.join(csharpOutDir, sample.fileName);

			expect(fs.existsSync(tsPath)).toBe(true);
			expect(fs.existsSync(csPath)).toBe(true);

			expect(summarizeDoc(tsPath)).toEqual(summarizeDoc(csPath));

			const tsHatches = summarizeHatches(tsPath);
			const csHatches = summarizeHatches(csPath);
			if (lossyCSharpHatchSamples.has(sample.fileName)) {
				expect(tsHatches).toEqual(expect.arrayContaining(csHatches));
			} else {
				expect(tsHatches).toEqual(csHatches);
			}
		});
	});
});