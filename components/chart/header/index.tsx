import 'react-tagsinput/react-tagsinput.css';
import React from 'react';
import Switch from "react-switch";
import { auth } from '@bcrumbs.net/bc-shared';
import styled from 'styled-components';
import TagsInput from './tagsInput';

import { useTokenChecker } from '../../../bootstrapers/hychart/utils';
import { useThemeContext } from '../../common/context/themeContext';

const HeaderWapper = styled.div<{ headerColor: string, rtl: boolean }>`
  width: 100%;
  height: 50px;
  z-index: 9999;
  position: relative;
  background-color: ${({ headerColor }) => headerColor};
  ${({ rtl }) => (rtl ? 'direction:rtl;' : 'direction:ltr;')};

  .chartName {
    font-weight: 600;
    width: 260px;
    display: inline-block;
    margin: 12px;
    position: relative;
    ${({ rtl }) => (rtl ? 'text-align: right;' : 'text-align: left;')};
    color: #fff;
    height: 25px;
    font-size: 20px;
  }

  .search-btn {
    button {
      background-color: #fff;
      border: solid 1px var(--bc-secondary-light-hover);
      border-radius: 20px;
      height: 30px;
      width: 100%;
      color: var(--bc-secondary-light-hover);
      padding-left: 30px;
      cursor: pointer;

      i {
        color: var(--bc-secondary-light-hover);
        position: absolute;
        left: 10px;
        top: 17px;
      }
    }
    position: absolute;
    top: 0px;
    left: 50%;
    width: 120px;
    height: 25px;
  }
`;

const LeftSide = styled.div<{ rtl: boolean }>`
  position: fixed;
  ${({ rtl }) => (rtl ? 'left:10px;' : 'right:10px;')};
  top: 0px;
  width: 450px;
  max-width: 500px;
  height: 50px;
  max-height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tagsInput-container {
    flex-grow: 1;
    margin-right:3px;
    ${({ rtl }) => (rtl ? 'left:10px;' : 'right:10px;')};
  }

  .login-logout-container {
    display: flex;
    align-items: center;
  }

  .AuthButton {
    background-color: #699041;
    border: solid 1px var(--bc-secondary-light-hover);
    border-radius: 20px;
    height: 32px;
    width: 100px;
    color: #fff;
    cursor: pointer;
    font-weight: bold;
    font-size: 13px;
  }

  .AuthButton:hover {
    background-color: #5a7736; /* Brown hover color */
  }

  .switch {
    margin-left: 6px;
    margin-right: 6px;
    border: solid 1px var(--bc-secondary-light-hover);
  }

}
`;
export default function Header({
  showModulesSearch,
  chartName,
  setEditMode,
  editMode,
  setSelectedTags,
  selectedTags
}: {
  showModulesSearch: (state: boolean) => void;
  chartName: string;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<[]>>;
  editMode: boolean;
  selectedTags: any;
}) {
  const { setHasToken, hasToken } = useTokenChecker();
  const { lang, themeColors, translations } = useThemeContext();
  const { headers_color } = themeColors;
  const rtl = lang.rtl;

  const headerTranslations = translations['header'] as Record<string, string>;
  const login = headerTranslations.login;
  const logout = headerTranslations.logout;
  const searchNodes = headerTranslations.SearchNodes;

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      const loginUrl = {
        pathname: process.env.LOGIN_URL,
        search: `?source=${window.location.origin}`,
      };
      window.location.href = `${loginUrl.pathname}${loginUrl.search}`;
    }
  };
  const handleEditModeChange = () => {
    if (!auth.isAuthenticated()) {
      handleLogin();
    }
    setEditMode(() => !editMode);
  };

  const handleLogout = () => {
    try {
      auth.clearAllAppStorage();
      setHasToken(false);
      setEditMode(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <HeaderWapper headerColor={headers_color} rtl={rtl}>
      <div className="chartName">{chartName}</div>
      <div className="search-btn">
        <button type="button" onClick={() => showModulesSearch(true)}>
          <i className="flaticon-magnifying-glass"></i>{' '}
          <span>{searchNodes}</span>
        </button>
      </div>
      <LeftSide rtl={rtl}>
        <div className="tagsInput-container">
          <TagsInput
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
          />
        </div>
        <div className="login-logout-container">
          {hasToken ? (
            <>
              <Switch
                className="switch"
                onChange={handleEditModeChange}
                checked={editMode}
                onColor="#699041"
                offColor="#ccc"
                onHandleColor="#fff"
                offHandleColor="#fff"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 3px rgba(0, 0, 0, 0.2)"
                height={20}
                width={40}
              />
              <button className='AuthButton' onClick={handleLogout}>
                {logout}
              </button>
            </>
          ) : (
            <button className='AuthButton' onClick={handleLogin}>
              {login}
            </button>
          )}
        </div>
      </LeftSide>
    </HeaderWapper>
  );
}