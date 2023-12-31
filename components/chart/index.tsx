import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { Config, GraphContent } from '@bcrumbs.net/bc-api';
import { SHORTCUT_KEYS } from './Constants';
import Canvas from './canvas';
import Header from './header';
import Search, { SearchType } from './search';
import { ChartType, NodeType } from './types';
import parseContentsToNodes from './parseContentsToNodes';
import DescriptionDrawer from './description';
import { stringify, parse } from 'query-string';

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
  const [selectedModule, setSelectedModule] = useState<NodeType>();
  const [currentVersion, setCurentVersion] = useState<ChartType>(
    parseContentsToNodes(data)
  );
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState<SearchType>({
    value: "",
    isValid: true,
    message: '',
  });
  const [selectedNodeID, setSelectedNodeID] = useState<number | null>(null);
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
  useEffect(() => {
    const queryParams = parse(window.location.search);
    const nValue = queryParams['n'];
    if (nValue) {
      const nodeId = parseInt(nValue as string);
      setSelectedNodeID(nodeId);
    } else {
      setSelectedNodeID(null);
    }
  }, []);
  useEffect(() => {
    if (selectedNodeID !== null) {
      const node = findModuleById(selectedNodeID);
      selectModule(node);
    }
  }, [selectedNodeID]);

  const updateURLWithNodeID = (nodeID: number | null) => {
    const queryParams = parse(window.location.search);
    queryParams['n'] = nodeID !== null ? String(nodeID) : '';
    const newQueryString = stringify(queryParams);
    const newURL = `${window.location.pathname}?${newQueryString}`;
    window.history.replaceState({}, '', newURL);
    localStorage.setItem('selectedNodeID', nodeID !== null ? String(nodeID) : '');
  };

  const findModuleById = (id: number): NodeType | undefined => {
    const arrayOfNodes = Object.keys(currentVersion.nodes).map((key) => currentVersion.nodes[key]);
    const module: NodeType = arrayOfNodes.find((module) => module.id === id);
    return module ? module : undefined;
  };

  const selectModule = useCallback(
    (module: NodeType, groupSelect?: boolean) => {
      setSelectedModule(module);
      let newSelectedModules = selectedModules;
      if (groupSelect) {
        if (
          newSelectedModules &&
          newSelectedModules.filter((m) => m === module.id).length <= 0
        )
          newSelectedModules.push(module.id);
        else newSelectedModules = selectedModules.filter((m) => m !== module.id);
      } else if (
        newSelectedModules &&
        newSelectedModules.length === 1 &&
        newSelectedModules[0] === module.id
      )
        newSelectedModules = [];
      else newSelectedModules = [module.id];
      setSelectedModules(newSelectedModules);
      updateURLWithNodeID(module.id);
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
            selectModule(node);
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
  const deselectModule = useCallback(() => {
    setSelectedModules([]); 
  }, [setSelectedModules]);
  
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
            deselectModule={deselectModule}
            organizeModules={organizeModules}
            changeZoomLevel={changeZoomLevel}
          />
        </div>
        < DescriptionDrawer module={selectedModule} open={!!selectedModule} onClose={() => setSelectedModule(undefined)}>
          <div dangerouslySetInnerHTML={{ __html: selectedModule?.description }} />
        </ DescriptionDrawer>
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
