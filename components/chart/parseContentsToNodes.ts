import { GraphContent } from "@bcrumbs.net/bc-api";
import { ChartType, NodeType, NodeVariant } from "./types";
import { DEFAULT_X_PADDING, DEFAULT_Y_PADDING } from "./Constants";

function parseContentsToNodes(contents: GraphContent[]): ChartType {
  const root = contents[0];
  const childToParentMap = getChildToParentMap([root]);
  return {
    init: root.id,
    nodes: convertContentsToNodes(root.children, {}, childToParentMap, root.id),
  };
}

function convertContentsToNodes(
  contents: GraphContent[],
  finalObj: { [key: number]: NodeType },
  childToParentMap: Map<number, number[]>,
  parentId?: number | null
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
    const connectionList = getNodeConnectionList(content, contentData);
    nodes[content.id] = {
      id: content.id,
      type: contentData.type as NodeVariant,
      x: Number(contentData.x_position) + DEFAULT_X_PADDING,
      y: Number(contentData.y_position) + DEFAULT_Y_PADDING,
      connections: connectionList,
      title: contentData.title,
      sub_title: contentData.sub_title,
      description: contentData.description,
      city: contentData.city,
      icon: contentData.icon,
      main: Boolean(contentData.main),
      parentIds: [parentId, ...(childToParentMap.get(content.id) || [])],
    };
    return content.children
      ? convertContentsToNodes(
          content.children,
          nodes,
          childToParentMap,
          content.id
        )
      : nodes;
  }, finalObj);
}
function compareNodesOnY(a, b) {
  return (
    Number(a.data.find((obj) => obj.Key === "y_position")?.Value) -
    Number(b.data.find((obj) => obj.Key === "y_position")?.Value)
  );
}

function getNodeConnectionList(content, contentData) {
  return [
    ...(contentData.indirect_connections
      ? contentData.indirect_connections
          .split(",")
          .filter((id) => id && id !== " ")
          .map((id) => ({ id: +id }))
      : []),
    ...(content.children
      ? content.children.sort(compareNodesOnY).map((subContent) => ({
          id: subContent.id,
        }))
      : []),
  ];
}
function getChildToParentMap(contents, childToParentMap = new Map()) {
  contents.forEach((content) => {
    const indirectConnectionsData = content.data.find(
      (entry) => entry.Key === "indirect_connections"
    );

    if (indirectConnectionsData?.Value) {
      const indirectConnections = indirectConnectionsData.Value.split(",")
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

      for (const childId of indirectConnections) {
        let childMap = childToParentMap.get(childId) || new Set();
        childMap.add(content.id);
        childToParentMap.set(childId, childMap);
      }
    }

    if (content.children) {
      getChildToParentMap(content.children, childToParentMap);
    }
  });
  return childToParentMap;
}
export default parseContentsToNodes;
