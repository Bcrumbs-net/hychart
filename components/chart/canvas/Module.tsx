import React, { useCallback } from 'react';
import ModuleInfo from '../moduleBlocks/ModuleInfo';
import { NodeType, SelectModuleFunc } from '../types';

export type ModuleProps = {
  module: NodeType;
  selectModule: SelectModuleFunc;
  isSelected: boolean;
};

function Module({ module, selectModule, isSelected }: ModuleProps) {
  const moduleName = module.title || ModuleInfo.getModuleName(module.type);

  const onDragStart = useCallback((id, ev) => {
    ev.dataTransfer.setData('dragType', 'moveModule');
    ev.dataTransfer.setData('id', id);
    ev.dataTransfer.setData('clientX', ev.clientX);
    ev.dataTransfer.setData('clientY', ev.clientY);
  }, []);

  return (
    <div
      className={`module ${
        isSelected ? 'active' : ''
      } ${module.type.toLowerCase()}`}
      key={module.id}
      draggable="true"
      style={{ top: module.y, left: module.x, zIndex: module.id }}
      onDragStart={(ev) => onDragStart(module.id, ev)}
      onClick={(e) => {
        if (e.shiftKey) selectModule(module.id, true);
        else selectModule(module.id, false);
      }}
    >
      <div className="moduleIcon">
        <i className={ModuleInfo.getIcon(module.type) + ' moduleIcon '}></i>
      </div>
      <div className="moduleNameCon">
        {moduleName.length >= 34
          ? moduleName.substring(0, 34) + '...'
          : moduleName}
      </div>
    </div>
  );
}

export default Module;
