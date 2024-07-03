import 'react-tagsinput/react-tagsinput.css';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TagsInput from './tagsInput';

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

  .leftSide {
    position: fixed;
    right: 10px;
    top: 0px;
    width: 450px;
    max-width: 500px;
    height: 50px;
    max-height: 300px;
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
  return (
    <HeaderWapper>
      <div className="chartName">{chartName}</div>
      <div className="search-btn">
        <button type="button" onClick={() => showModulesSearch(true)}>
          <i className="flaticon-magnifying-glass"></i>{' '}
          <span className="translate">Search Nodes</span>
        </button>
      </div>
      <div className="leftSide">
        <TagsInput
          setEditMode={setEditMode}
          editMode={editMode}
        />
      </div>
    </HeaderWapper>
  );
}