export class AcisTextCodec {
	static decode(text: string): string;
	static decode(data: Uint8Array): Uint8Array;
	static decode(value: string | Uint8Array): string | Uint8Array {
		if (typeof value === 'string') {
			return [...value].map(char => {
				const code = char.charCodeAt(0);
				return code > 0x20 && code < 0x9f ? String.fromCharCode(0x9f - code) : char;
			}).join('');
		}
		const result = new Uint8Array(value.length);
		for (let i = 0; i < value.length; i++) result[i] = value[i] > 0x20 && value[i] < 0x9f ? 0x9f - value[i] : value[i];
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
		for (const marker of markers) {
			outer: for (let i = 0; i <= data.length - marker.length; i++) {
				for (let j = 0; j < marker.length; j++) if (data[i + j] !== marker[j]) continue outer;
				return data.slice(0, i + marker.length);
			}
		}
		return data;
	}
}
