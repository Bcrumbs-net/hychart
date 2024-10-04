import React, { useCallback, useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import styled from 'styled-components';
import useTagsEnumValuesQuery from '../../../bootstrapers/hychart/utils/useTagsEnumValuesQuery';

const BCTagsInputWrapper = styled.div`
  display: flex;
  align-items: center;
  max-height: 50px;
  justify-content: flex-end;

  input {
    height: 25px;
    width: auto;
    padding: 2px;
    margin: 0;
    ::placeholder {
      color: #000;
      opacity: 1; /* Firefox */
    }
  }
  .searchWrapper {
    background-color: #fff;
    border: solid 1px var(--bc-secondary-light-hover);
    border-radius: 20px;
    min-height: auto;
    max-height:30px;
    padding: 4px;
    width: auto; 
    max-width:300px;
    color: var(--bc-secondary-light-hover);
    .chip {
      margin-bottom: 0;
      padding: 2px 8px;
      background-color: #699041;
    }
  }
  .optionListContainer {
    position: fixed;
    z-index: 1000;
    width: 180px;
    max-width:auto; 
    ul {
      border-radius: 10px;
      margin-top: -2px;
      height: 500px;  
      max-width:auto;
      overflow-y: auto; /* Add vertical scrollbar when content overflows */
      overflow-x: hidden; /* Hide horizontal scrollbar if any */
      scrollbar-width: thin;
      scrollbar-color: #c8c1c1 transparent;
      li {
        color: #000;
        font-size: 13px;
        background-color: #f3eded;
        width: 400px;
        padding: 9px 4px 9px 40px;
        display: block;
        cursor: pointer;
        height: 45px;
        font-weight: 400;
      }
      li:first-of-type {
        border-radius: 5px 20px 0 0;
      }
      li:last-child {
        border-radius: 0 0 5px 20px;
      }
      li:first-child:last-child {
        border-radius: 8px 15px 8px 18px;
      }
      li:hover {
        background-color: #c8c1c1;
      }
    min-height: auto;
  }
`;

const URLManager = {
  removeTagsFromURL: () => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete('tags');
    const currentURL = window.location.href;
    let updatedURL = currentURL.split('?')[0];

    if (queryParams.toString()) {
      updatedURL += `?${queryParams.toString()}`;
    }

    window.history.pushState({ path: updatedURL }, '', updatedURL);
  },
  handleUpdateURL: (tags) => {
    const tagNames = tags.map((tag) => tag.name);
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tags', tagNames.join(', '));
    const currentURL = window.location.href;
    const updatedURL = `${currentURL.split('?')[0]}?${queryParams.toString()}`;
    window.history.pushState({ path: updatedURL }, '', updatedURL);
  },
};

const TagsInput = ({
  currentVersion,
  setVisibleNodes,
}: {
  currentVersion: any;
  setVisibleNodes: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const [tags, setTags] = useState([]);
  const { enumValues } = useTagsEnumValuesQuery(403027);

  const onAdd = useCallback(
    (selectedList, selectedItem) => {
      if (selectedList.length <= 3) {
        const newTags = [...tags, selectedItem];
        setTags(newTags);
        URLManager.handleUpdateURL(newTags);
      } else {
        console.log('Maximum of 3 tags reached.');
      }
    },
    [tags]
  );
  useEffect(() => {
    if (tags.length > 0) {
      const arrayOfNodes = Object.keys(currentVersion.nodes).map(
        (key) => currentVersion.nodes[key]
      );
      const matchedNodes = arrayOfNodes.filter(node => {
        if (node.tags) {
          const nodeTagsArray = node.tags.split(',').map(tag => tag.trim());
          return tags.every(tag => nodeTagsArray.includes(tag.name));
        }
        return false;
      });
      const matchedNodeIds = matchedNodes.map(node => node.id);
      setVisibleNodes(matchedNodeIds);
    }
  }, [tags, currentVersion.nodes]);

  const onRemove = useCallback(
    (selectedList, selectedItem) => {
      const newTags = tags.filter((m) => m !== selectedItem);
      setTags(newTags);
      if (newTags.length === 0) {
        URLManager.removeTagsFromURL();
      } else {
        URLManager.handleUpdateURL(newTags);
      }
    },
    [tags]
  );

  return (
    <BCTagsInputWrapper>
      <Multiselect
        options={enumValues?.map((enumValue) => ({ name: enumValue.value, id: enumValue.id }))}
        displayValue="name"
        isObject={true}
        onSelect={onAdd}
        selectionLimit={3}
        onRemove={onRemove}
        placeholder="Select tags"
      />
    </BCTagsInputWrapper >
  );
};

export default TagsInput;
