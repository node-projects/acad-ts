export class Node {
  aCadName: string = '';
  handle: number = 0;
  ownerHandle: number = 0;
  dictionaryHandle: number = 0;
  children: Node[] = [];

  getChild(handle: number): Node | undefined {
    return this.children.find(x => x.handle === handle);
  }

  toString(): string {
    return `${this.aCadName}:${this.handle}`;
  }
}

export class TableEntryNode extends Node {
  name: string = '';

  toString(): string {
    return `${this.aCadName}:${this.name}`;
  }
}

export class EntityNode extends Node {
  color: any = {};
  layerName: string = '';
  isInvisible: boolean = false;
  linetypeName: string = '';
  linetypeScale: number = 0;
  lineWeight: number = 0;
  properties: Record<string, any> = {};
}

export class BlockRecordNode extends TableEntryNode {
  isAnonymous: boolean = false;
  isDynamic: boolean = false;
  entities: EntityNode[] = [];
}

export class LayerNode extends TableEntryNode {
  linetypeName: string = '';
  lineWeight: number = 0;
  color: any = {};
}

export interface TableNode<T extends TableEntryNode> {
  aCadName: string;
  handle: number;
  ownerHandle: number;
  entries: T[];
}

export interface CadDocumentTree {
  AppIdsTable: TableNode<TableEntryNode>;
  BlocksTable: TableNode<BlockRecordNode>;
  DimensionStylesTable: TableNode<TableEntryNode>;
  LayersTable: TableNode<LayerNode>;
  LineTypesTable: TableNode<TableEntryNode>;
  TextStylesTable: TableNode<TableEntryNode>;
  UCSsTable: TableNode<TableEntryNode>;
  ViewsTable: TableNode<TableEntryNode>;
  VPortsTable: TableNode<TableEntryNode>;
}
