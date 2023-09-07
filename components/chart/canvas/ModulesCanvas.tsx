import React, { useCallback } from 'react';
import Module from './Module';
import { CanvasEvents } from '../Constants';
import { SelectModuleFunc } from '../types';

export type ModulesCanvasProps = {
  currentVersion: any;
  selectedModules: any[];
  currentEvent: CanvasEvents;
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
