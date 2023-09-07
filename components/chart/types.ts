export type SelectModuleFunc = (id: number, groupSelect?: boolean) => void;

export type DeselectModuleFunc = (callback: () => void) => void;

export enum NodeVariant {
  Person = 'Person',
  Book = 'Book',
  Idea = 'Idea',
}

export type ConnectionType = {
  id: number;
};

export type NodeType = {
  type: NodeVariant;
  x: number;
  y: number;
  connections: ConnectionType[];
  title: string;
  description: string;
  main: boolean;
};

export type ChartType = {
  nodes: { [key: number]: NodeType };
  init: number;
};
