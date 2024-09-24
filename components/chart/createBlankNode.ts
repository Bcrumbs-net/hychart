import { NodeType, NodeVariant } from "./types";
import { DEFAULT_X_PADDING, DEFAULT_Y_PADDING } from "./Constants";

function createBlankNode(
  contentInstanceId: number,
  contentId: number
): NodeType {
  const node: NodeType = {
    id: contentId,
    iId: contentInstanceId,
    type: NodeVariant.Person,
    x: DEFAULT_X_PADDING,
    y: DEFAULT_Y_PADDING,
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
