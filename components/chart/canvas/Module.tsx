import React, { useCallback, useContext, useEffect, useState } from 'react';
import ModuleInfo from '../moduleBlocks/ModuleInfo';
import { NodeInformationType, NodeType, SelectModuleFunc } from '../types';
import styled, { css } from 'styled-components';
import { FaPlusCircle } from 'react-icons/fa';
import { auth } from '@bcrumbs.net/bc-api';
import themeContext from '../../common/context/themeContext';

interface ModuleProps {
  module: NodeType;
  selectModule: SelectModuleFunc;
  isSelected: boolean;
  editMode: boolean
  setInfoToCreateChild: React.Dispatch<React.SetStateAction<NodeInformationType>>;
  highlighted: boolean;
}

interface ModuleContainerProps {
  isIconModule: boolean;
  nodeColor: string;
  textColor: string;
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

  .moduleNameCon{
    padding: 4px;
    color: ${({ textColor }) => textColor};
    position: relative;
    font-size: 15px;
    font-weight: 700;
    background-color: ${({ nodeColor }) => nodeColor};
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
const IconContainer = styled.button`
  border-radius: 100%;
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-size: contain;
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding:0px;
`
function Module({ editMode, module, highlighted, selectModule, setInfoToCreateChild, isSelected }: ModuleProps) 
  const moduleName = module.title || ModuleInfo.getModuleName(module.type);
  const onDragStart = useCallback((id, ev) => {
    ev.dataTransfer.setData('dragType', 'moveModule');
    ev.dataTransfer.setData('id', id);
    ev.dataTransfer.setData('clientX', ev.clientX);
    ev.dataTransfer.setData('clientY', ev.clientY);
  }, []);
  const colorValues = useContext(themeContext);
  const { node_color } = colorValues;
  const { text_color } = colorValues;

  const handleAddChild = () => {
    setInfoToCreateChild({
      parentId: module.id,
      parentX: module.x,
      parentY: module.y,
    })
  };
  const opacityStyle = highlighted ? 1 : 0.2;
  return (
    <>
      {typeof window !== 'undefined' && auth?.isAuthenticated() && editMode ? (
        <IconContainer
          className="custom-icon-class"
          style={{ top: module.y + 50, left: module.x + 75, zIndex: module.id }}
          onDragStart={(ev) => onDragStart(module.id, ev)}
          onClick={handleAddChild}>
          <FaPlusCircle color="#699041" />
        </IconContainer>
      ) : null}
      <ModuleContainer
        textColor={text_color}
        nodeColor={node_color}
        isIconModule={!!module.icon}
        style={{ top: module.y, left: module.x, zIndex: module.id, opacity: opacityStyle }}
        onDragStart={(ev) => onDragStart(module.id, ev)}
        onClick={(e) => {
          e.stopPropagation();
          if (e.shiftKey) selectModule(module, true);
          else selectModule(module, false);
        }}
      >
        {module.icon ? (
          <>
            <p className="city">{module.city}</p>
            <img src={module.icon} alt="Module Icon" className={`IconImg ${isSelected ? 'active' : ''} `} />
            <p className='subTitle'>{module.sub_title}</p>
          </>
        ) : (
          <>
            <p className="city">{module.city}</p>
            <div className={`moduleNameCon ${isSelected ? 'active' : ''}`} draggable>
              {moduleName.length >= 34
                ? moduleName.substring(0, 34) + '...'
                : moduleName}
            </div>
            <p className='subTitle'>{module.sub_title}</p>
          </>
        )}
      </ModuleContainer >
    </>
  );
}

export default Module;
