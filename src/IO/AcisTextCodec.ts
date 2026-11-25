export class AcisTextCodec {
	static decode(text: string): string;
	static decode(data: Uint8Array): Uint8Array;
	static decode(value: string | Uint8Array): string | Uint8Array {
		if (typeof value === 'string') {
			return [...value].map(char => {
				const code = char.charCodeAt(0);
				return code > 0x20 && code < 0x7f ? String.fromCharCode(0x9f - code) : char;
			}).join('');
		}
		const result = new Uint8Array(value.length);
		for (let i = 0; i < value.length; i++) result[i] = value[i] > 0x20 && value[i] < 0x7f ? 0x9f - value[i] : value[i];
		return result;
	}

	static isEncoded(text: string): boolean {
		for (const char of text) {
			if (char.charCodeAt(0) <= 0x20) continue;
			return !/\d/.test(char);
		}
		return false;
	}

	static trimAtAcisEnd(data: Uint8Array): Uint8Array {
		const markers = ['End-of-ACIS-data', 'End-of-ASM-data'].map(marker => new TextEncoder().encode(marker));
		for (const kernel of ['ACIS','ASM']) markers.push(new Uint8Array([14,3,69,110,100,14,2,111,102,14,kernel.length,...new TextEncoder().encode(kernel),13,4,100,97,116,97]));
		let end = data.length;
		for (const marker of markers) {
			outer: for (let i = 0; i <= data.length - marker.length; i++) {
				for (let j = 0; j < marker.length; j++) if (data[i + j] !== marker[j]) continue outer;
				end = Math.min(end, i + marker.length); break;
			}
		}
		return end === data.length ? data : data.slice(0, end);
	}
}
