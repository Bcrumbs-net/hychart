import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
// import { BCTooltip } from '@bcrumbs.net/bc-ui';
import ModulesCanvas from './ModulesCanvas';
import ConnectionsCanvas from './ConnectionsCanvas';
import { NodeInformationType, NodeType, SelectModuleFunc } from '../types';
//import './styles.scss';
import Scrollbars from 'react-scrollbars-custom';
import themeContext from '../../common/context/themeContext';

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
};

function Canvas({
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
  setInfoToCreateChild
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollState, setScrollState] = useState<ScrollPositionType>({
    scrollLeft: 0,
    scrollTop: 0,
    clientX: 0,
    clientY: 0,
  });
  const colorValues = useContext(themeContext);
  const { background_color } = colorValues;
  // const canvasColor = colorValues.find(item => item.Key === "background_color");

  const onMouseUp = useCallback(() => {
    const canvas = canvasRef.current;
    if (
      Math.abs(canvas.scrollLeft - scrollState.scrollLeft) +
      Math.abs(canvas.scrollTop - scrollState.scrollTop) <
      10
    ) {
      deselectModules();
    }
    setIsScrolling(false);
    setScrollState({
      scrollLeft: 0,
      scrollTop: 0,
      clientX: 0,
      clientY: 0,
    });
  }, [setIsScrolling, setScrollState, deselectModules, scrollState]);

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (canvasRef.current) {
        const { scrollLeft, scrollTop } = canvasRef.current;
        if (
          event.target instanceof SVGElement &&
          event.target.className.baseVal === 'SVG_SPACE'
        ) {
          setIsScrolling(true);
          setScrollState({
            scrollLeft,
            scrollTop,
            clientX: event.clientX,
            clientY: event.clientY,
          });
        }
      }
    },
    [setIsScrolling, setScrollState]
  );

  const onDrop = useCallback(
    (ev) => {
      if (
        ev.dataTransfer.getData('clientX') +
        ev.dataTransfer.getData('clientY') >
        0
      ) {
        moveModule(
          Number(ev.dataTransfer.getData('id')),
          (ev.clientX - Number(ev.dataTransfer.getData('clientX'))) /
          (zoomLevel / 100),
          (ev.clientY - Number(ev.dataTransfer.getData('clientY'))) /
          (zoomLevel / 100)
        );
      }
    },
    [zoomLevel, moveModule]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const { clientX, scrollLeft, scrollTop, clientY } = scrollState;
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.scrollLeft = scrollLeft + clientX - event.clientX;
        canvas.scrollTop = scrollTop + clientY - event.clientY;
      }
    },
    [scrollState, canvasRef]
  );

  const toggleScrolling = useCallback(
    (isEnable: boolean) => {
      if (isEnable) {
        window.addEventListener('mousemove', onMouseMove);
      } else {
        window.removeEventListener('mousemove', onMouseMove);
      }
    },
    [onMouseMove, deselectModules]
  );

  useEffect(() => {
    toggleScrolling(isScrolling);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isScrolling, onMouseMove, toggleScrolling]);

  useEffect(() => {
    if (focusNode && canvasRef.current) {
      const { clientHeight, clientWidth } = canvasRef.current;
      const newScrollTop = Math.max(0, focusNode.y - clientHeight / 2);
      const newScrollLeft = Math.max(0, focusNode.x - clientWidth / 2);
      canvasRef.current.scrollTop = newScrollTop;
      canvasRef.current.scrollLeft = newScrollLeft;
    }
  }, [focusNode, canvasRef]);

  return (
    <>
      <div className="designAreadHeader">
        <div className="zoomLevelSelector">
          <i className="flaticon-atom" onClick={organizeModules} />
          |
          <i
            className="flaticon-minus-symbol"
            onClick={() => changeZoomLevel(-10)}
          />
          {zoomLevel + '%'}
          <i
            className="flaticon-plus-symbol"
            onClick={() => changeZoomLevel(10)}
          />
        </div>
      </div>
      <Scrollbars
        style={{ width: '100%', height: '100%' }}
        className="designArea"
        id="canvas"
        ref={canvasRef as any}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div
          ref={wrapperRef}
          id="designAreaInner"
          style={{ zoom: `${zoomLevel}%`, background: `${background_color}` }}
          className="designAreaInner"
          onDragOver={(ev) => {
            ev.preventDefault();
          }}
          onDrop={onDrop}
        >
          <ModulesCanvas
            editMode={editMode}
            currentVersion={currentVersion}
            selectedModules={selectedModules}
            selectModule={selectModule}
            setInfoToCreateChild={setInfoToCreateChild}
          />
          <ConnectionsCanvas
            currentVersion={currentVersion}
            selectedModules={selectedModules}
          />
        </div>
      </Scrollbars>
    </>
  );
}

export default Canvas;
