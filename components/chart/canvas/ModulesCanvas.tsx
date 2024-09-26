import React from 'react';
import Module from './Module';
import { ChartType, SelectModuleFunc } from '../types';
import { NodePositionType } from '..';

export type ModulesCanvasProps = {
  currentVersion: ChartType;
  selectedModules: any[];
  selectModule: SelectModuleFunc;
  editMode: boolean;
  setParentIdToCreateChild: React.Dispatch<React.SetStateAction<number>>;
  setNodePosition: React.Dispatch<React.SetStateAction<NodePositionType>>;

};

function ModulesCanvas({
  currentVersion,
  editMode,
  selectedModules,
  selectModule,
  setParentIdToCreateChild,
  setNodePosition
}: ModulesCanvasProps) {
  if (currentVersion === undefined || currentVersion.nodes === undefined)
    return null;

  return (
    <>
      {Object.keys(currentVersion.nodes).map((moduleKey) => {
        const m = currentVersion.nodes[moduleKey];
        const selected = selectedModules.includes(+moduleKey);
        return (
          <Module
            editMode={editMode}
            key={m.id}
            isSelected={selected}
            module={m}
            selectModule={selectModule}
            setParentIdToCreateChild={setParentIdToCreateChild}
            setNodePosition={setNodePosition}
          />
        );
      })}
    </>
  );
}

export default ModulesCanvas;
