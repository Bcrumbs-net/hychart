import { GraphContent } from '@bcrumbs.net/bc-api';
import { ChartType, NodeType, NodeVariant } from './types';

function parseContentsToNodes(contents: GraphContent[]): ChartType {
  const root = contents[0];
  console.log(root);
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
      type: contentData.type as NodeVariant,
      x: Number(contentData.x_position),
      y: Number(contentData.y_position),
      connections: content.children
        ? content.children.map((subContent) => ({
            id: subContent.id,
          }))
        : [],
      title: contentData.title,
      description: contentData.description,
      main: Boolean(contentData.main),
    };

    return content.children
      ? convertContentsToNodes(content.children, nodes)
      : nodes;
  }, finalObj);
}

export default parseContentsToNodes;
