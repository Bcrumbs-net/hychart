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
  .city {
    margin-bottom:-4px;
    margin-top:0px;
    font-size: 12px;
    font-weight: 700;
  }
`;

const ModuleStyle = styled.div`
  border-radius: 40%;
  padding:7px;
  position: absolute;
  overflow: hidden;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-size: contain;
  .city {
    margin-bottom:-4px;
    margin-top:0px;
    font-size: 12px;
    font-weight: 700;

  }
  .moduleIcon {
    text-align: center;
    position: absolute;
    top: 3px;
    left: 3px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .moduleNameCon{
    padding: 3px;
    color: #fff;
    position: relative;
    font-size: 15px;
    font-weight: 700;
    background-color: #699041;
    height: 80px;
    width: 80px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    &.active {
      border: 2px solid #00599f;
      -webkit-box-shadow: 0px 0px 7px 0px #00599f;
      -moz-box-shadow: 0px 0px 7px 0px #00599f;
      box-shadow: 0px 0px 7px 0px #00599f;
    }
  }
  .subTitle {
    font-size: 12px;
    font-weight: 700;
    margin-top:-3px;
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
    <>
      {module.icon ? (
        <ModuleIconImg
          style={{ top: module.y, left: module.x, zIndex: module.id }}
          onDragStart={(ev) => onDragStart(module.id, ev)}
          onClick={(e) => {
            e.stopPropagation();
            if (e.shiftKey) selectModule(module, true);
            else selectModule(module, false);
          }}
        >
          {module.icon && (
            <>
              <p className='city'>{module.city}</p>
              <img src={module.icon} alt="Module Icon" className={`IconImg ${isSelected ? 'active' : ''} `} />
              <p className='subTitle'>{module.sub_title}</p>
            </>
          )}
        </ModuleIconImg>
      ) : (
        <ModuleStyle
          className={`${module.type.toLowerCase()}`}
          key={module.id}
          draggable="true"
          style={{ top: module.y, left: module.x - 7, zIndex: module.id }}
          onDragStart={(ev) => onDragStart(module.id, ev)}
          onClick={(e) => {
            e.stopPropagation();
            if (e.shiftKey) selectModule(module, true);
            else selectModule(module, false);
          }}
        >
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
        </ModuleStyle>
      )}
    </>
  );
}

export default Module;
