import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { BCTooltip } from '@bcrumbs.net/bc-ui';
import ModulesCanvas from './ModulesCanvas';
import ConnectionsCanvas from './ConnectionsCanvas';
import { DeselectModuleFunc, SelectModuleFunc } from '../types';
//import './styles.scss';

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
  moveModule: (id: number, x: number, y: number) => void;
};

function Canvas({
  zoomLevel,
  currentVersion,
  selectedModules,
  selectModule,
  changeZoomLevel,
  organizeModules,
  moveModule,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>();
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollState, setScrollState] = useState<ScrollPositionType>();

  const onMouseUp = useCallback(() => {
    setIsScrolling(false);
    setScrollState({
      clientX: 0,
      clientY: 0,
      scrollLeft: 0,
      scrollTop: 0,
    });
  }, [setIsScrolling, setScrollState]);

  const onMouseDown = useCallback(
    (event) => {
      if (canvasRef?.current) {
        const { scrollLeft, scrollTop } = canvasRef.current;
        if (event.target.className.baseVal === 'SVG_SPACE') {
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
      moveModule(
        ev.dataTransfer.getData('id'),
        (ev.clientX - ev.dataTransfer.getData('clientX')) / (zoomLevel / 100),
        (ev.clientY - ev.dataTransfer.getData('clientY')) / (zoomLevel / 100)
      );
    },
    [zoomLevel, moveModule]
  );

  const onMouseMove = useCallback(
    (event) => {
      const { clientX, scrollLeft, scrollTop, clientY } = scrollState;
      if (canvasRef && canvasRef.current) {
        canvasRef.current.scrollLeft = scrollLeft + clientX - event.clientX;
        canvasRef.current.scrollTop = scrollTop + clientY - event.clientY;
      }
    },
    [scrollState, canvasRef]
  );

  const toggleScrolling = useCallback(
    (isEnable) => {
      if (isEnable) {
        window.addEventListener('mousemove', onMouseMove);
      } else {
        window.removeEventListener('mousemove', onMouseMove);
      }
    },
    [onMouseMove]
  );

  useEffect(() => {
    toggleScrolling(isScrolling);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isScrolling, onMouseMove, toggleScrolling]);

  return (
    <>
      <div className="designAreadHeader">
        <div className="zoomLevelSelector">
          <i className="flaticon-atom" onClick={organizeModules} />
          |
          <i className="flaticon-minus-symbol" onClick={() => changeZoomLevel(-10)} />
          {zoomLevel + '%'}
          <i className="flaticon-plus-symbol" onClick={() => changeZoomLevel(10)} />
        </div>
      </div>
      <div
        id="canvas"
        className="designArea"
        ref={canvasRef}
        style={{ zoom: zoomLevel + '%' }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div
          id="designAreaInner"
          className="designAreaInner"
          onDragOver={(ev) => {
            ev.preventDefault();
          }}
          onDrop={onDrop}
        >
          <ModulesCanvas
            currentVersion={currentVersion}
            selectedModules={selectedModules}
            selectModule={selectModule}
          />
          <ConnectionsCanvas
            currentVersion={currentVersion}
            selectedModules={selectedModules}
          />
        </div>
      </div>
    </>
  );
}

export default Canvas;
