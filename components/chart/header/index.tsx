import 'react-tagsinput/react-tagsinput.css';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TagsInput from './tagsInput';
import Switch from "react-switch";
import { auth } from '@bcrumbs.net/bc-api';
import { useTokenChecker } from '../../../bootstrapers/hychart/utils';

const HeaderWapper = styled.div`
  width: 100%;
  height: 50px;
  z-index: 9999;
  position: relative;
  background-color: #76665b;

  .chartName {
    font-weight: 600;
    width: 260px;
    display: inline-block;
    margin: 12px;
    position: relative;
    text-align: left;
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
        top: 5px;
      }
    }
    position: absolute;
    top: 0px;
    left: 50%;
    margin-left: -60px;
    width: 120px;
    height: 25px;
  }
`;

const LeftSide = styled.div`
  position: fixed;
  right: 10px;
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
    margin-right: 10px;
  }

  .login-logout-container {
    display: flex;
    align-items: center;
  }

  .login {
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

  .login:hover {
    background-color: #5a7736; /* Brown hover color */
  }

  .switch {
    margin-left: 8px;
    margin-right: 6px;
    border: solid 1px var(--bc-secondary-light-hover);
  }

  .profile-nav {
    border-bottom: none;
    display: inline-block;

    li {
      margin-left: 20px;
      text-align: center;
      color: var(--mb-primary-darker);

      a {
        color: var(--mb-primary-darker);
        padding: 0 4px 6px;
        margin: 0;
        color: var(--mb-primary-darker);
      }
    }
  }
`;
export default function Header({
  showModulesSearch,
  chartName,
  setEditMode,
  editMode
}: {
  showModulesSearch: (state: boolean) => void;
  chartName: string;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
}) {
  const { setHasToken, hasToken } = useTokenChecker();
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
    <HeaderWapper>
      <div className="chartName">{chartName}</div>
      <div className="search-btn">
        <button type="button" onClick={() => showModulesSearch(true)}>
          <i className="flaticon-magnifying-glass"></i>{' '}
          <span className="translate">Search Nodes</span>
        </button>
      </div>
      <LeftSide>
        <div className="tagsInput-container">
          <TagsInput />
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
              <button className='login' onClick={handleLogout}>logout</button>
            </>
          ) : (
            <button className='login' onClick={handleLogin}>login</button>
          )}
        </div>
      </LeftSide>
    </HeaderWapper>
  );
}