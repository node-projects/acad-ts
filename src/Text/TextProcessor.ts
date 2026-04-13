export class TextProcessor {
	public static parse(text: string): { result: string; groups: string[] } {
		const groups: string[] = [];
		if (!text) {
			return { result: text, groups };
		}

		let sb = '';
		let index = 0;
		let openGroup = false;

		while (index < text.length) {
			const prev: string | undefined = index > 0 ? text[index - 1] : undefined;
			const current: string | undefined = text[index];
			const next: string | undefined = index + 1 < text.length ? text[index + 1] : undefined;

			if (current === '\\' && next !== undefined) {
				switch (next) {
					case '}':
					case '{':
					case '\\':
						sb += next;
						index += 2;
						break;
					case 'A':
						index = TextProcessor.jump(text, index);
						break;
					case 'c':
					case 'C':
						index = TextProcessor.processColor(text, index);
						break;
					case 'f':
					case 'F':
						index = TextProcessor.processFont(text, index);
						break;
					case 'h':
					case 'H':
						index = TextProcessor.processHeight(text, index);
						break;
					case 'p':
						index = TextProcessor.processJustification(text, index);
						break;
					case 'P':
					case 'n':
						sb += '\n';
						index += 2;
						break;
					default:
						index++;
						break;
				}
			} else if (current === '{' && prev !== '\\') {
				openGroup = true;
				index++;
			} else if (current === '}' && prev !== '\\') {
				openGroup = false;
				index++;
			} else {
				sb += current;
				index++;
			}
		}

		return { result: sb, groups };
	}

	public static unescape(text: string): string {
		if (!text) {
			return text;
		}

		let sb = '';
		let index = 0;
		let openGroup = false;

		while (index < text.length) {
			let currIndex = text.indexOf('\\', index);
			if (currIndex <= 0) {
				let s = text.substring(index);
				if (openGroup && s.includes('}')) {
					s = s.replace(/}/g, '');
					openGroup = false;
				}
				sb += s;
				break;
			}

			const prev = text[currIndex - 1];
			const current = text[currIndex];
			const next = text[currIndex + 1];

			if (prev === '{') {
				currIndex--;
				openGroup = true;
			}

			if (currIndex > index) {
				let s = text.substring(index, currIndex);
				if (openGroup && s.includes('}')) {
					s = s.replace(/}/g, '');
					openGroup = false;
				}
				sb += s;
			}

			let f: number;
			switch (next) {
				case 'f':
				case 'F':
					f = TextProcessor.processFont(text, currIndex);
					currIndex = f;
					break;
				case 'c':
				case 'C':
					f = TextProcessor.processColor(text, currIndex);
					currIndex = f;
					break;
				case 'P':
				case 'n':
					sb += '\n';
					currIndex += 2;
					break;
				case 'r':
					break;
				case '}':
				case '{':
				case '\\':
					sb += next;
					break;
			}

			index = currIndex;
		}

		return sb;
	}

	private static processFont(text: string, start: number): number {
		let end = text.indexOf(';', start);
		end += 1;
		// const data = text.substring(start, end).split('|');
		// FontData would be: { name: data[0] }
		return end;
	}

	private static jump(text: string, start: number): number {
		let end = text.indexOf(';', start);
		end += 1;
		return end;
	}

	private static processColor(text: string, start: number): number {
		let end = text.indexOf(';', start);
		end += 1;
		return end;
	}

	private static processHeight(text: string, start: number): number {
		let end = text.indexOf(';', start);
		end += 1;
		return end;
	}

	private static processJustification(text: string, start: number): number {
		let end = text.indexOf(';', start);
		end += 1;
		return end;
	}
}

export interface FontData {
	name: string;
}
