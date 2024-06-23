import React from 'react';
import Module from './Module';
import { ChartType, SelectModuleFunc } from '../types';

export type ModulesCanvasProps = {
  currentVersion: ChartType;
  selectedModules: any[];
  selectModule: SelectModuleFunc;
};

function ModulesCanvas({
  currentVersion,
  selectedModules,
  selectModule,
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
            key={m.id}
            isSelected={selected}
            module={m}
            selectModule={selectModule}
          />
        );
      })}
    </>
  );
}

export default ModulesCanvas;
