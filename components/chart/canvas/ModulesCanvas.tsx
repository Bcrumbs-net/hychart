import React from 'react';
import Module from './Module';
import { ChartType, NodeInformationType, SelectModuleFunc } from '../types';

export type ModulesCanvasProps = {
  currentVersion: ChartType;
  selectedModules: any[];
  selectModule: SelectModuleFunc;
  editMode: boolean;
  setInfoToCreateChild: React.Dispatch<React.SetStateAction<NodeInformationType>>;
  highlightedNodes: number[]

};

function ModulesCanvas({
  currentVersion,
  editMode,
  selectedModules,
  selectModule,
  setInfoToCreateChild,
  highlightedNodes
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
            setInfoToCreateChild={setInfoToCreateChild}
            highlighted={highlightedNodes?.length == 0 || highlightedNodes?.includes(m.id)}
          />
        );
      })}
    </>
  );
}

export default ModulesCanvas;
