import React, { useCallback } from 'react';
import ModuleInfo from '../moduleBlocks/ModuleInfo';
import { SelectModuleFunc } from '../types';

export type ModuleProps = {
  module: any;
  selectModule: SelectModuleFunc;
  isSelected: boolean;
};

const ModuleTypeToClassName = {
  "PERSON": "person"
};

function Module({ module, selectModule, isSelected }: ModuleProps) {
  const moduleName = module.name || ModuleInfo.getModuleName(module.type);

  const onDragStart = useCallback((id, ev) => {
    ev.dataTransfer.setData('dragType', 'moveModule');
    ev.dataTransfer.setData('id', id);
    ev.dataTransfer.setData('clientX', ev.clientX);
    ev.dataTransfer.setData('clientY', ev.clientY);
  }, []);

  return (
    <div
      className={`module ${isSelected ? ' active' : ''} ${ModuleTypeToClassName[module.type]}`}
      key={module.id}
      draggable="true"
      style={{ top: module.y, left: module.x, zIndex: module.id }}
      onDragStart={(ev) => onDragStart(module.id, ev)}
      onClick={(e) => {
        if (e.shiftKey) selectModule(module.id, true);
        else selectModule(module.id, false);
      }}
    >
      <div className="moduleID">{module.id}</div>
      <div className="moduleType">{ModuleInfo.getName(module.type)}</div>
      <div className="moduleIcon">
        <i className={ModuleInfo.getIcon(module.type) + ' moduleIcon '}></i>
      </div>
      <div className="moduleNameCon">
        {moduleName.length >= 18
          ? moduleName.substring(0, 18) + '...'
          : moduleName}
      </div>
    </div>
  );
}

export default Module;
