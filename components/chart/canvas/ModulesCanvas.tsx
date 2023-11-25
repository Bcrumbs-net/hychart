import React from 'react';
import Module from './Module';
import { ChartType, SelectModuleFunc } from '../types';
import { MODULE_X } from '../Constants';

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
        const module = currentVersion.nodes[moduleKey];
        const selected =
          selectedModules.filter((m) => m === module.id).length > 0;
        return (
          <Module
            key={module.id}
            isSelected={selected}
            module={module}
            selectModule={selectModule}
          />
        );
      })}
    </>
  );
}

export default ModulesCanvas;
