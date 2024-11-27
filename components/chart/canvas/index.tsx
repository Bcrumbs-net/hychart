import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ModulesCanvas from './ModulesCanvas';
import ConnectionsCanvas from './ConnectionsCanvas';
import { NodeInformationType, NodeType, SelectModuleFunc } from '../types';
import Scrollbars from 'react-scrollbars-custom';
import { useThemeContext } from '../../common/context/themeContext';
import styled from 'styled-components';

const DesignAreaHeader = styled.div<{ rtl: boolean }>`
  background-color: var(--mb-module-background);
  height: 50px;
  position: absolute;
  z-index: 500000;
  top: 0;
  left: 0;
  width: 97%;

  .zoomLevelSelector {
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px 10px 8px;
    background-color: #fff;
    position: absolute;
    ${({ rtl }) => (rtl ? 'left:10px;' : 'right:10px;')};
    bottom: 10px;
    font-weight: 500;
    line-height: 10px;
    font-size: 14px;

    i {
      margin: 0 5px;
      cursor: pointer;
      margin-bottom: -10px;
      font-size: 14px;
    }
  }
`;

export type ScrollPositionType = {
  scrollLeft?: number;
  scrollTop?: number;
  clientX?: number;
  clientY?: number;
};
export type CanvasProps = {
  zoomLevel: number;
  currentVersion: any;
  selectedModules: any[];
  selectModule: SelectModuleFunc;
  changeZoomLevel: (value: number) => void;
  organizeModules: () => void;
  deselectModules: () => void;
  moveModule: (id: number, x: number, y: number) => void;
  editMode: boolean;
  focusNode: NodeType;
  setInfoToCreateChild: React.Dispatch<React.SetStateAction<NodeInformationType>>;
  highlightedNodes: number[];
};

const Canvas = ({
  editMode,
  zoomLevel,
  currentVersion,
  selectedModules,
  focusNode,
  selectModule,
  deselectModules,
  changeZoomLevel,
  organizeModules,
  moveModule,
  setInfoToCreateChild,
  highlightedNodes
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollState, setScrollState] = useState<ScrollPositionType>({
    scrollLeft: 0,
    scrollTop: 0,
    clientX: 0,
    clientY: 0,
  });

  const { lang, themeColors } = useThemeContext();
  const { background_color } = themeColors;
  const { rtl } = lang;

  const onMouseUp = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && Math.abs(canvas.scrollLeft - scrollState.scrollLeft) + Math.abs(canvas.scrollTop - scrollState.scrollTop) < 10) {
      deselectModules();
    }
    setIsScrolling(false);
    setScrollState({ scrollLeft: 0, scrollTop: 0, clientX: 0, clientY: 0 });
  }, [scrollState, deselectModules]);

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current) {
      const { scrollLeft, scrollTop } = canvasRef.current;
      if (event.target instanceof SVGElement && event.target.className.baseVal === 'SVG_SPACE') {
        setIsScrolling(true);
        setScrollState({ scrollLeft, scrollTop, clientX: event.clientX, clientY: event.clientY });
      }
    }
  }, []);

  const onDrop = useCallback((ev: DragEvent) => {
    const clientX = Number(ev.dataTransfer.getData('clientX'));
    const clientY = Number(ev.dataTransfer.getData('clientY'));
    const id = Number(ev.dataTransfer.getData('id'));
    if (clientX + clientY > 0) {
      moveModule(id, (ev.clientX - clientX) / (zoomLevel / 100), (ev.clientY - clientY) / (zoomLevel / 100));
    }
  }, [zoomLevel, moveModule]);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.scrollLeft = scrollState.scrollLeft + scrollState.clientX - event.clientX;
      canvas.scrollTop = scrollState.scrollTop + scrollState.clientY - event.clientY;
    }
  }, [scrollState]);

  useEffect(() => {
    const toggleScrolling = (isEnable: boolean) => {
      if (isEnable) {
        window.addEventListener('mousemove', onMouseMove);
      } else {
        window.removeEventListener('mousemove', onMouseMove);
      }
    };

    toggleScrolling(isScrolling);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isScrolling, onMouseMove]);

  useEffect(() => {
    if (focusNode && canvasRef.current) {
      const { clientHeight, clientWidth } = canvasRef.current;
      canvasRef.current.scrollTop = Math.max(0, focusNode.y - clientHeight / 2);
      canvasRef.current.scrollLeft = Math.max(0, focusNode.x - clientWidth / 2);
    }
  }, [focusNode]);

  return (
    <>
      <DesignAreaHeader rtl={rtl}>
        <div className="zoomLevelSelector">
          <i className="flaticon-atom" onClick={organizeModules} />
          |
          <i className="flaticon-minus-symbol" onClick={() => changeZoomLevel(-10)} />
          {zoomLevel + '%'}
          <i className="flaticon-plus-symbol" onClick={() => changeZoomLevel(10)} />
        </div>
      </DesignAreaHeader>
      <Scrollbars
        style={{ width: '100%', height: '100%' }}
        className="designArea"
        id="canvas"
        // @ts-ignore
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div
          id="designAreaInner"
          style={{ zoom: `${zoomLevel}%`, background: background_color }}
          className="designAreaInner"
          onDragOver={(ev) => ev.preventDefault()}
          // @ts-ignore
          onDrop={onDrop}
        >
          <ModulesCanvas
            editMode={editMode}
            currentVersion={currentVersion}
            selectedModules={selectedModules}
            selectModule={selectModule}
            setInfoToCreateChild={setInfoToCreateChild}
            highlightedNodes={highlightedNodes}
          />
          <ConnectionsCanvas
            currentVersion={currentVersion}
            selectedModules={selectedModules}
          />
        </div>
      </Scrollbars>
    </>
  );
};

export default Canvas;