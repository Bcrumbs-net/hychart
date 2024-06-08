export type SelectModuleFunc = (
  module: NodeType,

  groupSelect?: boolean
) => void;

export enum NodeVariant {
  Person = "Person",
  Book = "Book",
  Idea = "Idea",
  Person = "Person",
  Book = "Book",
  Idea = "Idea",
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
  sub_title: string;
  description: string;
  city: string;
  icon: string;
  main: boolean;
  parentIds: number[];
  tags: string;
  id: number;
};

export type ChartType = {
  nodes: { [key: number]: NodeType };
  init: number;
};
