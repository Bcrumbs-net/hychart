import React, { useCallback } from 'react';
import ModuleInfo from '../moduleBlocks/ModuleInfo';
import { NodeType, SelectModuleFunc } from '../types';
import styled, { css } from 'styled-components';

interface ModuleProps {
  module: NodeType;
  selectModule: SelectModuleFunc;
  isSelected: boolean;
}

interface ModuleContainerProps {
  isIconModule: boolean;
}

const ModuleContainer = styled.div<ModuleContainerProps>`
  border-radius: 50%;
  padding: 11px 5px 20px 5px;
  position: absolute;
  overflow: hidden;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-size: contain;

  ${({ isIconModule }) =>
    isIconModule &&
    css`
      .IconImg {
        width: 76px; 
        height: auto; 
        display: block; 
        border-radius: 100%;
        box-sizing: border-box;
        &.active {
          border: 2px solid #00599f;
          -webkit-box-shadow: 0px 0px 7px 0px #00599f;
          -moz-box-shadow: 0px 0px 7px 0px #00599f;
          box-shadow: 0px 0px 7px 0px #00599f;
        }
      }
    `}

  .moduleIcon {
    text-align: center;
    position: absolute;
    top: 3px;
    left: 3px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .moduleNameCon{
    padding: 4px;
    color: #fff;
    position: relative;
    font-size: 15px;
    font-weight: 700;
    background-color: #699041;
    height: 76px;
    width: 76px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    box-sizing: border-box;
    &.active {
      border: 2px solid #00599f;
      -webkit-box-shadow: 0px 0px 7px 0px #00599f;
      -moz-box-shadow: 0px 0px 7px 0px #00599f;
      box-shadow: 0px 0px 7px 0px #00599f;
    }
  }
  .city {
    position: absolute;
    top: -18px; 
    font-size: 12px;
    font-weight: 700;
  }
  .subTitle {
    position: absolute;
    bottom: -8px; 
    font-size: 11px;
    font-weight: 700;
    -ms-transform: translateX(7%);
    transform: translateX(7%);
  }
`;

function Module({ module, selectModule, isSelected }: ModuleProps) {
  const moduleName = module.title || ModuleInfo.getModuleName(module.type);
  const onDragStart = useCallback((id, ev) => {
    ev.dataTransfer.setData('dragType', 'moveModule');
    ev.dataTransfer.setData('id', id);
    ev.dataTransfer.setData('clientX', ev.clientX);
    ev.dataTransfer.setData('clientY', ev.clientY);
  }, []);

  return (
    <ModuleContainer
      isIconModule={!!module.icon}
      style={{ top: module.y, left: module.x, zIndex: module.id }}
      onDragStart={(ev) => onDragStart(module.id, ev)}
      onClick={(e) => {
        e.stopPropagation();
        if (e.shiftKey) selectModule(module, true);
        else selectModule(module, false);
      }}
    >
      {module.icon ? (
        <>
          <p className='city'>{module.city}</p>
          <img src={module.icon} alt="Module Icon" className={`IconImg ${isSelected ? 'active' : ''} `} />
          <p className='subTitle'>{module.sub_title}</p>
        </>
      ) : (
        <>
          <p className='city'>{module.city}</p>
          <div className="moduleIcon">
            <i className={ModuleInfo.getIcon(module.type) + ' moduleIcon '}></i>
          </div>
          <div className={`moduleNameCon ${isSelected ? 'active' : ''} `}>
            {moduleName.length >= 34
              ? moduleName.substring(0, 34) + '...'
              : moduleName}
          </div>
          <p className='subTitle'>{module.sub_title}</p>
        </>
      )}
    </ModuleContainer>
  );
}

export default Module;
