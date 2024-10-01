import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { Config, GraphContent, auth } from '@bcrumbs.net/bc-api';
import { DEFAULT_X_PADDING, DEFAULT_Y_PADDING, SHORTCUT_KEYS } from './Constants';
import Canvas from './canvas';
import Header from './header';
import Search, { SearchType } from './search';
import { ChartType, NodeInformationType, NodeType } from './types';
import parseContentsToNodes from './parseContentsToNodes';
import DescriptionDrawer from './description';
import { parse } from 'querystring';
import AddNewModule from './editMode/AddNewModule';
import EditDrawer from './editModule';
import { useTokenChecker } from '../../bootstrapers/hychart/utils';
import { useRouter } from 'next/router';
import colorContext from '../common/context/colorContext';

function Chart({ data, token, contextId, config }: { config: Config; contextId: string; data: GraphContent[]; token?: string }) {
  const rootContent = data[0];
  const router = useRouter();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState<NodeType>();
  const [currentVersion, setCurrentVersion] = useState<ChartType>(
    parseContentsToNodes(data)
  );
  const [showSearch, setShowSearch] = useState(false);
  const { hasToken } = useTokenChecker();
  const [search, setSearch] = useState<SearchType>({
    value: '',
    isValid: true,
    message: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [focusNode, setFocusNode] = useState<NodeType | undefined>(undefined);
  const [infoToCreateChild, setInfoToCreateChild] = useState<NodeInformationType>({
    parentId: 0,
    parentX: 0,
    parentY: 0,
  });
  const colorValues = rootContent.data;

  const shortcutHandlers = {
    SEARCH: () => {
      setShowSearch(true);
      setSearch({ value: '', isValid: true, message: '' });
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

  const findModuleById = (id: number): NodeType | undefined => {
    const arrayOfNodes = Object.keys(currentVersion.nodes).map(
      (key) => currentVersion.nodes[key]
    );
    const m: NodeType = arrayOfNodes.find((module) => module.id === id);
    return m ? m : undefined;
  };

  const deselectModules = useCallback(() => {
    setSelectedModules([]);
    setSelectedModule(undefined);
  }, [setSelectedModules]);

  const selectModule = useCallback(
    (module: NodeType, groupSelect?: boolean) => {
      if (
        selectedModule &&
        selectedModule.id === module.id &&
        selectedModules.length == 1
      ) {
        deselectModules();
      } else {
        setSelectedModule(module);

        let newSelectedModules = selectedModules;
        if (groupSelect) {
          if (
            newSelectedModules &&
            newSelectedModules.filter((m) => m === module.id).length <= 0
          )
            newSelectedModules.push(module.id);
          else
            newSelectedModules = selectedModules.filter((m) => m !== module.id);
        } else if (
          newSelectedModules &&
          newSelectedModules.length === 1 &&
          newSelectedModules[0] === module.id
        )
          newSelectedModules = [];
        else newSelectedModules = [module.id];
        setSelectedModules(newSelectedModules);
      }
    },
    [selectedModules, setSelectedModules, selectedModule, deselectModules]
  );
  const focusModule = useCallback(
    (id: string) => {
      if (currentVersion && currentVersion.nodes) {
        const moduleId = parseInt(id);
        const node = findModuleById(moduleId);
        if (node) {
          selectModule(node);
          setFocusNode(node);
          setShowSearch(false);
          setSearch({ value: '', isValid: true, message: '' });
        }
      }
    },
    [
      currentVersion,
      setSelectedModule,
      setSelectedModules,
      setShowSearch,
      setSearch,
    ]
  );
  const changeZoomLevel = useCallback(
    (delta: number) => {
      setZoomLevel(Math.min(Math.max(20, zoomLevel + delta), 300));
    },
    [zoomLevel, setZoomLevel]
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
        setCurrentVersion({
          ...newVersion,
        });
      } else {
        const targetNode = currentVersion.nodes[id];
        if (targetNode) {
          newVersion.nodes[id].x += x;
          newVersion.nodes[id].y += y;
          setCurrentVersion({
            ...newVersion,
          });
        } else {
          return {};
        }
      }
    },
    [selectedModules, setCurrentVersion, currentVersion]
  );

  const organizeModules = useCallback(() => {
    const originVersion = parseContentsToNodes(data);
    setCurrentVersion(originVersion);
  }, [data, setCurrentVersion]);

  useEffect(() => {
    auth.setContext(contextId);
  }, []);

  useEffect(() => {
    const { editMode: queryEditMode } = router.query;

    if (queryEditMode) {
      const isEditMode = Array.isArray(queryEditMode)
        ? queryEditMode[0] === 'true'
        : queryEditMode === 'true';

      setEditMode(isEditMode);
      const { pathname, query, ...rest } = router;
      router.replace(
        {
          pathname: router.pathname,
          query: query
            ? Object.fromEntries(
              Object.entries(query).filter(([key]) => key !== "editMode")
            )
            : {},
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query]);

  useEffect(() => {
    const queryParams = parse(window.location.search);
    const nodeIdFromUrl = queryParams['?n']
      ? parseInt(queryParams['?n'] as string)
      : null;
    if (nodeIdFromUrl !== null) {
      focusModule(nodeIdFromUrl.toString());
    }

  }, [focusModule]);

  const addNewModule = () => {
    setInfoToCreateChild({
      parentId: rootContent.id,
    })
  }

  useEffect(() => {
    const queryParams = parse(window.location.search);
    const nodeIdFromUrl = queryParams['?n']
      ? parseInt(queryParams['?n'] as string)
      : null;
    if (nodeIdFromUrl !== null) {
      focusModule(nodeIdFromUrl.toString());
    }
  }, [focusModule]);
  return (
    //@ts-ignore
    <HotKeys keyMap={SHORTCUT_KEYS} handlers={shortcutHandlers}>
      <div className="chart" id="chart">
        <colorContext.Provider value={{ colorValues }}>
          <Header
            showModulesSearch={setShowSearch}
            chartName={rootContent.title}
            editMode={editMode}
            setEditMode={setEditMode}
          />
          <div className="designer">
            <Canvas
              editMode={editMode}
              zoomLevel={zoomLevel}
              moveModule={moveModule}
              selectModule={selectModule}
              currentVersion={currentVersion}
              selectedModules={selectedModules}
              focusNode={focusNode}
              deselectModules={deselectModules}
              organizeModules={organizeModules}
              changeZoomLevel={changeZoomLevel}
              setInfoToCreateChild={setInfoToCreateChild}
            />
          </div>
        </colorContext.Provider>
        {hasToken && editMode ? (
          <EditDrawer
            lang={config.lang}
            module={selectedModule}
            open={!!selectedModule && selectedModules.length === 1}
            onClose={() => setSelectedModule(undefined)}
          />
        ) :
          <DescriptionDrawer
            lang={config.lang}
            module={selectedModule}
            open={!!selectedModule && selectedModules.length === 1}
            onClose={() => setSelectedModule(undefined)}
          >
            <div
              dangerouslySetInnerHTML={{ __html: selectedModule?.description }}
            />
          </DescriptionDrawer>}
        {showSearch ? (
          <Search
            currentVersion={currentVersion}
            search={search}
            focusModule={focusModule}
            setSearch={setSearch}
            setShowSearch={setShowSearch}
          />
        ) : null}
        {typeof window !== 'undefined' && auth?.isAuthenticated() && editMode ? (
          <AddNewModule
            selectModule={selectModule}
            onClick={addNewModule}
            setInfoToCreateChild={setInfoToCreateChild}
            infoToCreateChild={infoToCreateChild}
            currentVersion={currentVersion}
            setCurrentVersion={setCurrentVersion}
          />
        ) : null}
      </div>
    </HotKeys >

  );
}

export default Chart;
