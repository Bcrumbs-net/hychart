import React, { useCallback } from 'react';
import ModuleInfo from '../moduleBlocks/ModuleInfo';
import { NodeType, SelectModuleFunc } from '../types';
import styled from 'styled-components';

export type ModuleProps = {
  module: NodeType;
  selectModule: SelectModuleFunc;
  isSelected: boolean;
};

const ModuleIconImg = styled.div`
  border-radius: 100%;
  padding:7px;
  position: absolute;
  overflow: hidden;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-size: contain;

  .IconImg {
    width: 85px; 
    height: auto; 
    display: block; 
    border-radius: 100%;
    &.active {
      border: 2px solid #00599f;
      -webkit-box-shadow: 0px 0px 7px 0px #00599f;
      -moz-box-shadow: 0px 0px 7px 0px #00599f;
      box-shadow: 0px 0px 7px 0px #00599f;
    }
  }

  .subTitle {
    font-size: 12px;
    margin-top: -3px;
    font-weight: 700;
  }
`;
function Module({ module, selectModule, isSelected }: ModuleProps) {
  const moduleName = module.title +' '+ module.sub_title  || ModuleInfo.getModuleName(module.type);
  const onDragStart = useCallback((id, ev) => {
    ev.dataTransfer.setData('dragType', 'moveModule');
    ev.dataTransfer.setData('id', id);
    ev.dataTransfer.setData('clientX', ev.clientX);
    ev.dataTransfer.setData('clientY', ev.clientY);
  }, []);

  return (
    <>
      {module.icon ? (
          <ModuleIconImg
            style={{ top: module.y, left: module.x, zIndex: module.id }}
            onDragStart={(ev) => onDragStart(module.id, ev)}
            onClick={(e) => {
              if (e.shiftKey) selectModule(module, true);
              else selectModule(module, false);
            }}
          >
            {module.icon && (
              <>
                <img src={module.icon} alt="Module Icon" className={`IconImg ${isSelected ? 'active' : ''} `} />
                <p className='subTitle'>{module.sub_title}</p>
              </>
            )}
          </ModuleIconImg>
      ) : (
        <div
          className={`module ${isSelected ? 'active' : ''
            } ${module.type.toLowerCase()}`}
          key={module.id}
          draggable="true"
          style={{ top: module.y, left: module.x, zIndex: module.id }}
          onDragStart={(ev) => onDragStart(module.id, ev)}
          onClick={(e) => {
            if (e.shiftKey) selectModule(module, true);
            else selectModule(module, false);
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

      )}
    </>
  );
}

export default Module;
