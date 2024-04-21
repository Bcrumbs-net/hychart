import React, { useCallback, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import styled from 'styled-components';

const BCTagsInputWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  justify-content: flex-end;

  input {
    height: 20px;
    width: auto;
    padding: 0;
    margin: 0;
    ::placeholder {
      color: #000;
      opacity: 1; /* Firefox */
    }
  }
  .searchWrapper {
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 20px;
    min-height: auto;
    padding: 4px;
    chip {
      margin-bottom: 0;
      padding: 2px 8px;
    }
  }
`;

const SystemTags = [
  'العقيدة',
  'الفقه',
  'التفسير',
  'الحديث',
  'القراءات',
  'أصول التفسير',
  'أصول الفقه',
  'النحو والصرف',
  'البلاغة',
  'المنطق',
  'مصطلح الحديث',
  'القواعد الفقهية',
  'التاريخ',
  'التراجم',
  'أصول الدين',
];

const removeTagsFromURL = () => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.delete('tags');
  const currentURL = window.location.href;
  let updatedURL = currentURL.split('?')[0];

  if (queryParams.toString()) {
    updatedURL += `?${queryParams.toString()}`;
  }

  window.history.pushState({ path: updatedURL }, '', updatedURL);
};

const handleUpdateURL = (tags) => {
  const tagNames = tags.map((tag) => tag.name);
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set('tags', tagNames.join(', '));
  const currentURL = window.location.href;
  const updatedURL = `${currentURL.split('?')[0]}?${queryParams.toString()}`;
  window.history.pushState({ path: updatedURL }, '', updatedURL);
};

const TagsInput = ({ predefinedTags }) => {
  const [tags, setTags] = useState([]);

  const onAdd = useCallback(
    (selectedList: any, selectedItem: any) => {
      const newTags = [...tags, selectedItem];
      setTags(newTags);
      handleUpdateURL(newTags);
    },
    [tags]
  );

  const onRemove = useCallback(
    (selectedList: any, selectedItem: string) => {
      const newTags = tags.filter((m) => m !== selectedItem);
      setTags(newTags);
      if (newTags.length === 0) {
        removeTagsFromURL();
      } else {
        handleUpdateURL(newTags);
      }
    },
    [tags]
  );

  return (
    <BCTagsInputWrapper>
      <Multiselect
        options={SystemTags.map((m) => ({ name: m }))}
        displayValue="name"
        isObject={true}
        selectedValues={tags}
        onSelect={onAdd}
        onRemove={onRemove}
        placeholder="Select tags"
      />
    </BCTagsInputWrapper>
  );
};

export default TagsInput;
