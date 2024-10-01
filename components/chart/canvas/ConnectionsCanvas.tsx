import React, { useContext, useMemo } from 'react';
import ModuleConnection from './Connection';
import { BLOCK_HEIGHT, BLOCK_WIDTH } from '../Constants';
import { ChartType } from '../types';
import colorContext from '../../common/context/colorContext';

export type ConnectionsCanvasProps = {
  currentVersion: ChartType;
  selectedModules: number[];
};

function ConnectionsCanvas({
  currentVersion,
  selectedModules,
}: ConnectionsCanvasProps) {
  const selectedModule = selectedModules[0];
  const { colorValues } = useContext(colorContext);
  const childActiveColor = colorValues.find(item => item.Key === "child_active_connection_color");
  const parentctiveColor = colorValues.find(item => item.Key === "parent_active_connection_color");

  const connectionList = useMemo(() => {
    const connectionList = [];
    for (const fromID in currentVersion.nodes) {
      const fromNode = currentVersion.nodes[fromID];
      if (!fromNode) {
        continue;
      }
      const connections = fromNode.connections;
      if (!connections) {
        continue;
      }
      const numberOfFromConn = connections.length;
      for (let i = 0; i < connections.length; i++) {
        const toID = connections[i].id;
        const toNode = currentVersion.nodes[toID];
        if (!toNode) {
          continue;
        }
        connectionList.push({
          fromID: fromID,
          toID: toID,
          fromX: fromNode.x + BLOCK_WIDTH - 8, // x coordinate of origin of arrow
          fromY: fromNode.y + (i + 1) * (BLOCK_HEIGHT * 0.6 / (numberOfFromConn + 1)) + 20, // y coordinate of origin of arrow
          toX: toNode.x, // x coordinate of target of arrow
          toY: toNode.y + BLOCK_HEIGHT / 2, // y coordinate of target of arrow
          // fromColor: ModuleInfo.getColor(fromNode.type),
          // toColor: ModuleInfo.getColor(toNode.type),
          fromColor: childActiveColor.Value,
          toColor: '#00589C',
          parentColor: parentctiveColor.Value,
        });
      }
    }

    return connectionList;
  }, [currentVersion]);
  if (!currentVersion || !currentVersion.nodes) return null;
  return (
    <svg height="100%" width="100%" className="SVG_SPACE">
      {connectionList.map((conn) => (
        <ModuleConnection
          {...conn}
          isSelected={
            selectedModule + '' === conn.fromID ||
            selectedModule + '' === conn.toID
          }
          hasChildrenSelected={selectedModule === conn.toID}
          key={conn.fromID + '-' + conn.toID + '-' + conn.fromX + conn.fromY}
        />
      ))}
    </svg>
  );
}

export default ConnectionsCanvas;
