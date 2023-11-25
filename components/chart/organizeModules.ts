const MODULE_WIDTH = 170;
const MODULE_HEIGHT = 150;
const TOP_OFFSET = 100;
const LEFT_OFFSET = 300;
const HORIZONTAL_BORDER = 10000;

function organizeModules(version: any) {
  let pushDown = 0;
  let lastPushedLevel = 0;
  const newVersion = Object.assign({}, version);
  const levels = organizeHelper(newVersion);

  for (let levelID = 0; levelID < levels.length; levelID++) {
    const level = levels[levelID];
    // let pushPerLevel = 0;
    let maxPushPerLevel = 0;
    level.forEach((conn) => {
      const node = getNode(conn.nodeID, version.nodes);
      node.y = MODULE_HEIGHT * levelID + TOP_OFFSET;
      node.x = conn.offset * MODULE_WIDTH + LEFT_OFFSET;

      let pushPerLevel = 0;
      let changed = false;
      while (node.x >= HORIZONTAL_BORDER - MODULE_WIDTH - LEFT_OFFSET) {
        node.x -= HORIZONTAL_BORDER - MODULE_WIDTH;
        changed = true;
        if (node.x >= HORIZONTAL_BORDER - MODULE_WIDTH - LEFT_OFFSET) {
          pushPerLevel++;
        }
        if (lastPushedLevel < levelID) {
          maxPushPerLevel = pushPerLevel;
          pushDown += pushPerLevel;
          pushDown++;
          lastPushedLevel = levelID;
        }
        if (maxPushPerLevel < pushPerLevel) {
          //Used only if x is >= 2 times the width of canvas
          pushDown += pushPerLevel - maxPushPerLevel;
          maxPushPerLevel = pushPerLevel;
        }
      }
      node.y += pushDown * MODULE_HEIGHT;
      if (changed) {
        node.x += LEFT_OFFSET;
      }
    });
  }
  return newVersion;
}

function organizeHelper(version) {
  const levels = [];
  processNode(version.init, version.nodes, 0, 0, levels, {});
  return levels;
}

function processNode(nodeID, nodeMap, currentLevel, offset, levels, isVisited) {
  isVisited[nodeID] = true;
  const node = getNode(nodeID, nodeMap);
  if (node === undefined) {
    return 0;
  }
  let width = 0;
  if (node.connections) {
    node.connections.forEach((childConn) => {
      if (!isVisited[childConn.id]) {
        width += processNode(
          childConn.id,
          nodeMap,
          currentLevel + 1,
          offset + width,
          levels,
          isVisited
        );
      }
    });
  }
  width = Math.max(width, 1);
  if (!levels[currentLevel]) {
    levels[currentLevel] = [];
  }
  levels[currentLevel].push({ width: width, offset: offset, nodeID: nodeID });
  return width;
}

function getNode(nodeID, nodeMap) {
  const node = nodeMap[nodeID];
  return node;
}

export default organizeModules;
