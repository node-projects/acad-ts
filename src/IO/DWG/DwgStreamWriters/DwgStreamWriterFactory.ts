import { registerStreamWriter, registerMergedWriter } from './DwgStreamWriterBase.js';
import { DwgStreamWriterAC12 } from './DwgStreamWriterAC12.js';
import { DwgStreamWriterAC15 } from './DwgStreamWriterAC15.js';
import { DwgStreamWriterAC18 } from './DwgStreamWriterAC18.js';
import { DwgStreamWriterAC21 } from './DwgStreamWriterAC21.js';
import { DwgStreamWriterAC24 } from './DwgStreamWriterAC24.js';
import { DwgmMergedStreamWriterAC14 } from './DwgmMergedStreamWriterAC14.js';
import { DwgMergedStreamWriter } from './DwgMergedStreamWriter.js';

registerStreamWriter('AC12', DwgStreamWriterAC12);
registerStreamWriter('AC15', DwgStreamWriterAC15);
registerStreamWriter('AC18', DwgStreamWriterAC18);
registerStreamWriter('AC21', DwgStreamWriterAC21);
registerStreamWriter('AC24', DwgStreamWriterAC24);
registerMergedWriter('MergedAC14', DwgmMergedStreamWriterAC14 as any);
registerMergedWriter('Merged', DwgMergedStreamWriter as any);
