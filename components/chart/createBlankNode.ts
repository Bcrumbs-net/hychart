import { NodeInformationType, NodeType, NodeVariant } from "./types";
import { DEFAULT_X_PADDING, DEFAULT_Y_PADDING } from "./Constants";

function createBlankNode(
  contentInstanceId: number,
  contentId: number,
  infoToCreateChild: NodeInformationType
): NodeType {
  const node: NodeType = {
    id: contentId,
    iId: contentInstanceId,
    type: NodeVariant.Person,
    x: infoToCreateChild.parentX + DEFAULT_X_PADDING,
    y: infoToCreateChild.parentY + DEFAULT_Y_PADDING,
    connections: [],
    title: "",
    sub_title: "",
    description: "",
    city: "",
    tags: "",
    icon: "",
    main: Boolean(""),
    parentIds: [infoToCreateChild.parentId],
  };

  return node;
}

export default createBlankNode;
