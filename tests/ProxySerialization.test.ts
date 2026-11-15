import { describe, expect, it } from 'vitest';
import { CadDocument } from '../src/CadDocument.js';
import { ACadVersion } from '../src/ACadVersion.js';
import { DxfClass } from '../src/Classes/DxfClass.js';
import { ProxyEntity } from '../src/Entities/ProxyEntity.js';
import { Line } from '../src/Entities/Line.js';
import { ProxyCircle, ProxyRawGeometry, ProxyShell, cloneProxyGeometry, GraphicsType } from '../src/Entities/ProxyGraphics.js';
import { ProxyGeometryWriter } from '../src/IO/ProxyGeometryWriter.js';
import { ProxyGeometryReader } from '../src/IO/ProxyGeometryReader.js';
import { DxfWriter } from '../src/IO/DXF/DxfWriter.js';
import { DxfReader } from '../src/IO/DXF/DxfReader.js';
import { DwgWriter } from '../src/IO/DWG/DwgWriter.js';
import { DwgReader } from '../src/IO/DWG/DwgReader.js';

describe('Proxy serialization', () => {
	it('reads common DXF proxy graphics before the entity subclass without skipping geometry', () => {
		const doc = new CadDocument(); const line = new Line(); line.endPoint.x = 17;
		const circle = new ProxyCircle(); circle.radius = 9; line.proxyGeometries = [circle]; doc.entities.add(line);
		const chunks: string[] = [];
		new DxfWriter({ write: (value: string) => chunks.push(value), flush() {}, close() {} } as any, doc, false).write();
		const graphics = ProxyGeometryWriter.writeGeometries([circle]);
		const hex = Array.from(graphics, byte => byte.toString(16).padStart(2, '0')).join('');
		const input = chunks.join('').replace(/100\r?\nAcDbLine/, `92\n${graphics.length}\n310\n${hex}\n100\nAcDbLine`);
		const reader = new DxfReader(new TextEncoder().encode(input)); reader.configuration.ignoreProxyGraphics = false;
		const decoded = [...reader.read().entities][0] as Line;
		expect(decoded.proxyGeometries).toEqual([circle]); expect(decoded.endPoint.x).toBe(17);
	});
	it('retains signed shell holes and opaque trait data independently when cloning', () => {
		const shell = new ProxyShell(); shell.faces = [[0, 1, 2], [3, 4, 5]]; shell.holes = [1];
		shell.traitsData = new Uint8Array([1, 0, 0, 0, 25, 0, 0, 0]);
		const decoded = ProxyGeometryReader.readGeometries(ProxyGeometryWriter.writeGeometries([shell]))[0] as ProxyShell;
		expect(decoded).toEqual(shell);
		const clone = cloneProxyGeometry(decoded); clone.holes.push(0);
		expect(decoded.holes).toEqual([1]);
	});
	it('writes typed and opaque geometry records from a one-shot iterable', () => {
		const circle = new ProxyCircle();
		circle.radius = 12;
		const raw = new ProxyRawGeometry(GraphicsType.UnicodeText, new Uint8Array([1, 2, 3]));
		function* entries() { yield circle; yield raw; }
		const bytes = ProxyGeometryWriter.writeGeometries(entries());
		const decoded = ProxyGeometryReader.readGeometries(bytes);
		expect(new DataView(bytes.buffer).getUint32(0, true)).toBe(bytes.length);
		expect(decoded).toEqual([circle, raw]);
		const entity = new Line();
		entity.proxyGeometries = decoded;
		const clone = entity.clone() as Line;
		(clone.proxyGeometries[0] as ProxyCircle).center.x = 77;
		(clone.proxyGeometries[1] as ProxyRawGeometry).data[0] = 99;
		expect(circle.center.x).toBe(0);
		expect(raw.data[0]).toBe(1);
	});

	it('preserves DXF proxy graphics, binary chunks and string data', () => {
		const doc = new CadDocument(ACadVersion.AC1032);
		const definition = new DxfClass();
		definition.dxfName = 'CUSTOM_PROXY';
		definition.cppClassName = 'AcDbCustomProxy';
		definition.itemClassId = 498;
		doc.classes.add(definition);
		const proxy = new ProxyEntity();
		proxy.dxfClass = definition;
		proxy.version = ACadVersion.AC1032;
		proxy.maintenanceVersion = 3;
		proxy.binaryData = Uint8Array.from({ length: 300 }, (_, i) => i & 255);
		proxy.addStringDataText('Retained text');
		proxy.proxyGeometries = [new ProxyCircle()];
		doc.entities.add(proxy);
		const chunks: string[] = [];
		new DxfWriter({ write: (value: string) => chunks.push(value), flush() {}, close() {} } as any, doc, false).write();
		const reader = new DxfReader(new TextEncoder().encode(chunks.join('')));
		reader.configuration.ignoreProxyGraphics = false;
		const decoded = [...reader.read().entities][0] as ProxyEntity;
		expect(decoded).toBeInstanceOf(ProxyEntity);
		expect(decoded.binaryData).toEqual(proxy.binaryData);
		expect(decoded.getStringDataText()).toBe('Retained text');
		expect(decoded.maintenanceVersion).toBe(3);
		expect(decoded.dxfClass?.cppClassName).toBe('AcDbCustomProxy');
		expect(decoded.proxyGeometries).toEqual(proxy.proxyGeometries);
	});

	it('writes common DWG proxy graphics on regular entities', () => {
		const doc = new CadDocument(ACadVersion.AC1032);
		const line = new Line();
		const circle = new ProxyCircle();
		circle.radius = 9;
		line.proxyGeometries = [circle];
		doc.entities.add(line);
		const buffer = new ArrayBuffer(1024 * 1024);
		const writer = new DwgWriter(buffer, doc);
		writer.write();
		const reader = new DwgReader(buffer.slice(0, writer.bytesWritten));
		reader.configuration.ignoreProxyGraphics = false;
		const decoded = [...reader.read().entities][0];
		expect(decoded.proxyGeometries).toEqual(line.proxyGeometries);
	});
});
