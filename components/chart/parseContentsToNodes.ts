import { GraphContent } from '@bcrumbs.net/bc-api';
import { ChartType, NodeType, NodeVariant } from './types';
import { DEFAULT_X_PADDING, DEFAULT_Y_PADDING } from './Constants';

function parseContentsToNodes(contents: GraphContent[]): ChartType {
  const root = contents[0];
  return {
    init: root.id,
    nodes: convertContentsToNodes(root.children, {}),
  };
}

function convertContentsToNodes(
  contents: GraphContent[],
  finalObj: { [key: number]: NodeType }
) {
  return contents.reduce((nodes: { [key: number]: NodeType }, content) => {
    const contentData: Record<string, string> = content.data.reduce(function (
      map,
      obj
    ) {
      map[obj.Key] = obj.Value;
      return map;
    },
    {});

    nodes[content.id] = {
      id: content.id,
      type: contentData.type as NodeVariant,
      x: Number(contentData.x_position) + DEFAULT_X_PADDING,
      y: Number(contentData.y_position) + DEFAULT_Y_PADDING,
      connections: getNodeConnectionList(content, contentData),
      title: contentData.title,
      description: contentData.description,
      icon: contentData.icon,
      main: Boolean(contentData.main),
    };

    return content.children
      ? convertContentsToNodes(content.children, nodes)
      : nodes;
  }, finalObj);
}

function compareNodesOnY(a, b) {
  return (
    Number(a.data.find((obj) => obj.Key === 'y_position')?.Value) -
    Number(b.data.find((obj) => obj.Key === 'y_position')?.Value)
  );
}

function getNodeConnectionList(content, contentData) {
  return [
    ...(contentData.indirect_connections
      ? contentData.indirect_connections
          .split(',')
          .filter((id) => id)
          .map((id) => ({ id: +id }))
      : []),
    ...(content.children
      ? content.children.sort(compareNodesOnY).map((subContent) => ({
          id: subContent.id,
        }))
      : []),
  ];
}

export default parseContentsToNodes;
