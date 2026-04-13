import { registerStreamReader } from './DwgStreamReaderBase.js';
import { DwgStreamReaderAC12 } from './DwgStreamReaderAC12.js';
import { DwgStreamReaderAC15 } from './DwgStreamReaderAC15.js';
import { DwgStreamReaderAC18 } from './DwgStreamReaderAC18.js';
import { DwgStreamReaderAC21 } from './DwgStreamReaderAC21.js';
import { DwgStreamReaderAC24 } from './DwgStreamReaderAC24.js';

registerStreamReader('AC12', DwgStreamReaderAC12);
registerStreamReader('AC15', DwgStreamReaderAC15);
registerStreamReader('AC18', DwgStreamReaderAC18);
registerStreamReader('AC21', DwgStreamReaderAC21);
registerStreamReader('AC24', DwgStreamReaderAC24);
