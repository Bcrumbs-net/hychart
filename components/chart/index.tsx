import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { Config, GraphContent } from '@bcrumbs.net/bc-api';
import { SHORTCUT_KEYS } from './Constants';
import Canvas from './canvas';
import Header from './header';
import Search, { SearchType } from './search';
import { ChartType } from './types';
import parseContentsToNodes from './parseContentsToNodes';
import Drawer from './description';

function Chart({
  config,
  data,
  keydown,
}: {
  config: Config;
  data: GraphContent[];
  keydown: any;
}) {
  const rootContent = data[0];
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedModules, setSelectedModules] = useState([]);
  const [Description, setDescription] = useState([]);
  const [name, setName] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentVersion, setCurentVersion] = useState<ChartType>(
    parseContentsToNodes(data)
  );
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState<SearchType>({
    value: "",
    isValid: true,
    message: '',
  });

  const shortcutHandlers = {
    SEARCH: () => {
      setShowSearch(true);
      setSearch({ value: "", isValid: true, message: '' });
    },
    UP: () => {
      const canvas = document.getElementById('canvas');
      canvas.scrollTop = canvas.scrollTop - 30;
    },
    DOWN: () => {
      const canvas = document.getElementById('canvas');
      canvas.scrollTop = canvas.scrollTop + 30;
    },
    RIGHT: () => {
      const canvas = document.getElementById('canvas');
      canvas.scrollLeft = canvas.scrollLeft + 30;
    },
    LEFT: () => {
      const canvas = document.getElementById('canvas');
      canvas.scrollLeft = canvas.scrollLeft - 30;
    },
    ZOOM_IN: () => changeZoomLevel(-10),
    ZOOM_OUT: () => changeZoomLevel(10),
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };
  const drawerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && drawerOpen) {
        toggleDrawer();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
  const findModuleById = (id: number): string | undefined => {
    const arrayOfNodes = Object.keys(currentVersion.nodes).map((key) => currentVersion.nodes[key]);
    const module = arrayOfNodes.find((module) => module.id === id);
    const indexOfOpeningParentheses = module.title.indexOf('(');
    const cutName = module.title.substring(0, indexOfOpeningParentheses).trim();
    setName(cutName);
    setDescription(module.description);
    return module ? module.description : undefined;
  };

  const selectModule = useCallback(
    (id: number, groupSelect?: boolean) => {
      setDrawerOpen(true);
      findModuleById(id);
      let newSelectedModules = selectedModules;
      if (groupSelect) {
        if (
          newSelectedModules &&
          newSelectedModules.filter((m) => m === id).length <= 0
        )
          newSelectedModules.push(id);
        else newSelectedModules = selectedModules.filter((m) => m !== id);
      } else if (
        newSelectedModules &&
        newSelectedModules.length === 1 &&
        newSelectedModules[0] === id
      )
        newSelectedModules = [];
      else newSelectedModules = [id];

      setSelectedModules(newSelectedModules);
    },
    [selectedModules, setSelectedModules]
  );

  const focusModule = useCallback(
    (id: string) => {
      if (currentVersion && currentVersion.nodes) {
        // const moduleNumberTrimmed = name.substring(0, name.indexOf('>')).substring(5);
        const moduleId = parseInt(id);

        Object.keys(currentVersion.nodes).forEach((key) => {
          const node = currentVersion.nodes[key];
          if (node.id === moduleId) {
            const toX = node.x;
            const toy = node.y;
            const canvas = document.getElementById('canvas');
            canvas.scrollLeft = toX - 500 > 0 ? toX - 500 : 0;
            canvas.scrollTop = toy - 250 > 0 ? toy - 250 : 0;
            selectModule(moduleId);
            setShowSearch(false);
            setSearch({ value: "", isValid: true, message: '' });
          }
        });
      }
    },
    [currentVersion, selectModule, setShowSearch, setSearch]
  );

  const changeZoomLevel = useCallback(
    (delta: number) => {
      setZoomLevel(Math.min(Math.max(20, zoomLevel + delta), 300));
    },
    [zoomLevel, setZoomLevel]
  );

  const deselectModule = useCallback(
    (callback: () => void) => {
      setSelectedModules([]);
      callback?.();
    },
    [setSelectedModules]
  );
  const moveModule = useCallback(
    (id: number, x: number, y: number) => {
      const newVersion = currentVersion;
      if (
        selectedModules &&
        selectedModules.length > 0 &&
        selectedModules.filter((m) => m === id).length > 0
      ) {
        selectedModules.forEach((selectedModule) => {
          if (newVersion.nodes[selectedModule]) {
            newVersion.nodes[selectedModule].x += x;
            newVersion.nodes[selectedModule].y += y;
          }
        });
        setCurentVersion({
          ...newVersion,
        });
      } else {
        const targetNode = currentVersion.nodes[id];
        if (targetNode) {
          newVersion.nodes[id].x += x;
          newVersion.nodes[id].y += y;
          setCurentVersion({
            ...newVersion,
          });
        } else {
          return {};
        }
      }
    },
    [selectedModules, setCurentVersion, currentVersion]
  );
  //TODO: Not working fine
  const organizeModules = useCallback(() => {
    const originVersion = parseContentsToNodes(data);
    setCurentVersion(originVersion);
  }, [currentVersion, setCurentVersion]);
  return (
    //@ts-ignore
    <HotKeys keyMap={SHORTCUT_KEYS} handlers={shortcutHandlers}>
      <div className="chart" id="chart">
        <Header
          showModulesSearch={setShowSearch}
          chartName={rootContent.title}
        />
        <div className="designer">
          <Canvas
            zoomLevel={zoomLevel}
            moveModule={moveModule}
            selectModule={selectModule}
            currentVersion={currentVersion}
            selectedModules={selectedModules}
            organizeModules={organizeModules}
            changeZoomLevel={changeZoomLevel}
          />
        </div>
        <div ref={drawerRef}>
          <Drawer title={name} open={drawerOpen} onClose={toggleDrawer} >
            <div dangerouslySetInnerHTML={{ __html: Description }} />
          </Drawer>
        </div>
        {showSearch ? (
          <Search
            currentVersion={currentVersion}
            search={search}
            focusModule={focusModule}
            setSearch={setSearch}
            setShowSearch={setShowSearch}
          />
        ) : null}
      </div>
    </HotKeys>
  );
}

export default Chart;
