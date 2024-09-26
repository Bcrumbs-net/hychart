import { NodeType, NodeVariant } from "./types";
import { DEFAULT_X_PADDING, DEFAULT_Y_PADDING } from "./Constants";
import { NodePositionType } from ".";

function createBlankNode(
  contentInstanceId: number,
  contentId: number,
  nodePosition: NodePositionType
): NodeType {
  const node: NodeType = {
    id: contentId,
    iId: contentInstanceId,
    type: NodeVariant.Person,
    x: nodePosition.X + DEFAULT_X_PADDING,
    y: nodePosition.Y + DEFAULT_Y_PADDING,
    connections: [],
    title: "",
    sub_title: "",
    description: "",
    city: "",
    tags: "",
    icon: "",
    main: Boolean(""),
    parentIds: [],
  };

  return node;
}

export default createBlankNode;
