import React, { useEffect } from 'react';
import Module from './Module';
import { ChartType, SelectModuleFunc } from '../types';
import { DEFAULT_X_PADDING, DEFAULT_Y_PADDING } from '../Constants';

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
        useEffect(() => {
          module.x += DEFAULT_X_PADDING;
          module.y += DEFAULT_Y_PADDING;
          console.log(module.x, module.y);
        }, []);
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
