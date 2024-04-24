import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
// import { BCTooltip } from '@bcrumbs.net/bc-ui';
import ModulesCanvas from './ModulesCanvas';
import ConnectionsCanvas from './ConnectionsCanvas';
import { SelectModuleFunc } from '../types';
//import './styles.scss';
import Scrollbars from 'react-scrollbars-custom';

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
  setDuration: Dispatch<SetStateAction<number>>;
};

function Canvas({
  zoomLevel,
  currentVersion,
  selectedModules,
  selectModule,
  deselectModules,
  changeZoomLevel,
  organizeModules,
  moveModule,
  setDuration
}: CanvasProps) {
  const canvasRef = useRef();
  const wrapperRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollState, setScrollState] = useState<ScrollPositionType>();
  const startTimeRef = useRef(0);

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
        const canvas = canvasRef.current as HTMLDivElement;
        canvas.scrollLeft = scrollLeft + clientX - event.clientX;
        canvas.scrollTop = scrollTop + clientY - event.clientY;
      }
    },
    [scrollState, canvasRef]
  );


  const toggleScrolling = useCallback(
    (isEnable) => {
      if (isEnable) {
        const newStartTime = Date.now();
        startTimeRef.current = newStartTime;
        window.addEventListener('mousemove', onMouseMove);
      } else {
        window.removeEventListener('mousemove', onMouseMove);
      }
    },
    [onMouseMove]
  );

  const handleClick = useCallback(
    (event) => {
      const endTime = Date.now();
      const duration = endTime - startTimeRef.current;
      setDuration(duration);
      if (event.target.closest('.designArea') && duration < 120) {
        deselectModules();
      }
    },
    [deselectModules]
  );

  useEffect(() => {
    toggleScrolling(isScrolling);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isScrolling, onMouseMove, toggleScrolling]);

  return (
    <>
      <div className="designAreadHeader" >
        <div className="zoomLevelSelector">
          <i className="flaticon-atom" onClick={organizeModules} />
          |
          <i className="flaticon-minus-symbol" onClick={() => changeZoomLevel(-10)} />
          {zoomLevel + '%'}
          <i className="flaticon-plus-symbol" onClick={() => changeZoomLevel(10)} />
        </div>
      </div>
      <Scrollbars
        style={{ width: '100%', height: '100%' }}
        className="designArea"
        id="canvas"
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={handleClick}
      >
        <div ref={wrapperRef}
          id="designAreaInner"
          style={{ zoom: zoomLevel + '%' }}
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
      </Scrollbars>
    </>
  );
}

export default Canvas;
