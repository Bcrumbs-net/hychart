import React, { useCallback, useEffect, useMemo, useState } from 'react';
import keydown from 'react-keydown';
import { Config, GraphContent } from '@bcrumbs.net/bc-api';
import { SHORTCUT_KEYS } from './Constants';

import organizeModulesProc from './organizeModules';
import DesignerMenu from './designerMenu/DesignerMenu';
import TABS, { TABS_TYPES } from './designerMenu/DesignerMenuTabs';
import ModuleInfo from './moduleBlocks/ModuleInfo';
import Canvas from './canvas';
import Header from './header';
import Search, { SearchType } from './search';
import { ChartType } from './types';
import parseContentsToNodes from './parseContentsToNodes';

// class ChatbotDesigner extends PopupsComponent<Props, State> {
//   renderRightMenu = () => {
//     const { bot, clientToken, status } = this.props;
//     const {
//       currentVersion,
//       visible,
//       selectedModules,
//       tabName,
//       departments,
//       conversationTags,
//     } = this.state;
//     if (
//       selectedModules &&
//       selectedModules.length > 0 &&
//       currentVersion.nodes[selectedModules[0]]
//     ) {
//       const currentModule = currentVersion.nodes[selectedModules[0]];
//       return ModuleInfo.getMenu({
//         visible: visible,
//         key: selectedModules[0],
//         currentModule: currentModule,
//         currentVersion: currentVersion,
//         currentVersionObj: this.props.currentVersion,
//         selectModule: this.selectModule,
//         showDesDesignerMenu: this.showDesDesignerMenu,
//         updateVersion: this.updateVersion,
//         bot: bot,
//         history: this.props.history,
//         status: status,
//         notifyUser: this.props.notifyUser,
//         duplicateModule: this.duplicateModule,
//         showConfirmPopup: this.showConfirmPopup,
//         registerConfirmPopup: this.registerConfirmPopup,
//         registerUploadPopup: this.registerUploadPopup,
//         registerPopup: this.registerPopup,
//         showPopup: this.showPopup,
//         showUploadPopup: this.showUploadPopup,
//         unRegisterPopup: this.unRegisterPopup,
//         hidePopups: this.hidePopups,
//         userName: this.props.name,
//         departments: departments,
//         conversationTags: conversationTags,
//       });
//     } else {
//       return (
//         <DesignerMenu
//           key={'DesignerMenu'}
//           bot={bot}
//           clientToken={clientToken}
//           visible={visible}
//           currentVersion={currentVersion}
//           currentVersionObj={this.props.currentVersion}
//           history={this.props.history}
//           registerConfirmPopup={this.registerConfirmPopup}
//           showConfirmPopup={this.showConfirmPopup}
//           registerPopup={this.registerPopup}
//           showPopup={this.showPopup}
//           forceUpdate={this.forceUpdate}
//           hidePopups={this.hidePopups}
//           unRegisterPopup={this.unRegisterPopup}
//           updateVersion={this.updateVersion}
//           refetchBot={this.props.refetchBot}
//           versions={this.props.versions}
//           notifyUser={this.props.notifyUser}
//           tabName={tabName}
//           saveVersion={this.saveVersion}
//           closeDesignerMenu={this.closeDesignerMenu}
//         />
//       );
//     }
//   };

//   closeDesignerMenu = () => {
//     this.toggleDesignerMenu(false);
//   };

//   showDesDesignerMenu = () => {
//     this.setState({ visible: true });
//   };

// }

function Chart({
  data,
  keydown,
}: {
  config: Config;
  data: GraphContent[];
  keydown: any;
}) {
  const rootContent = data[0];
  const [visible, setVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedModules, setSelectedModules] = useState([]);
  const [currentVersion, setCurentVersion] = useState<ChartType>(
    parseContentsToNodes(data)
  );
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState<SearchType>({
    value: null,
    isValid: true,
    message: '',
  });

  const selectModule = useCallback(
    (id: number, groupSelect?: boolean) => {
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

      setVisible(
        newSelectedModules.length === 1 && newSelectedModules[0] === id
          ? true
          : false
      );
      setSelectedModules(newSelectedModules);
    },
    [selectedModules, setVisible, setSelectedModules]
  );

  const focusModule = useCallback(
    (name: string) => {
      if (currentVersion && currentVersion.nodes) {
        const moduleNumberTrimmed = name.substring(0, name.indexOf('>'));

        const moduleId = parseInt(moduleNumberTrimmed);

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
            setSearch({ value: '', isValid: true, message: '' });
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
      setVisible(false);
      callback?.();
    },
    [setSelectedModules, setVisible]
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
    const newVersion = organizeModulesProc(currentVersion);
    setCurentVersion(newVersion);
  }, [currentVersion, setCurentVersion]);

  useEffect(() => {
    if (keydown && keydown.event && keydown.event.which) {
      const canvas = document.getElementById('canvas');
      switch (keydown.event.which) {
        case 70: // F
          setShowSearch(true);
          setSearch({ value: '', isValid: true, message: '' });
          break;
        case 88: // X
          changeZoomLevel(-10);
          break;
        case 90: // Z
          changeZoomLevel(10);
          break;
        case 39: // Left
          canvas.scrollLeft = canvas.scrollLeft + 30;
          break;
        case 37: // right
          canvas.scrollLeft = canvas.scrollLeft - 30;
          break;
        case 38: // up
          canvas.scrollTop = canvas.scrollTop - 30;
          break;
        case 40: // down
          canvas.scrollTop = canvas.scrollTop + 30;
          break;
        default:
          break;
      }
    }
  }, [keydown, changeZoomLevel, setShowSearch, setSearch]);

  return (
    <div>
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
        {/* {this.renderRightMenu()} */}
        {showSearch ? (
          <Search
            currentVersion={currentVersion}
            search={search}
            focusModule={focusModule}
            setSearch={setSearch}
          />
        ) : null}
      </div>
    </div>
  );
}

export default keydown(SHORTCUT_KEYS)(Chart);
