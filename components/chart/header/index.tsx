import 'react-tagsinput/react-tagsinput.css';
import React, { useState } from 'react';
import BCTagsInput from './bctags-input';
import Select from 'react-select';
import styled from 'styled-components';

export default function Header({
  showModulesSearch,
  chartName,
  predefinedTags = ['العقيدة',
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
    'أصول الدين',],
}: {
  showModulesSearch: (state: boolean) => void;
  chartName: string;
  predefinedTags: string[];
}) {
  const [tags, setTags] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleSelectorChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleAddTag = () => {
    if (selectedOption && !tags.includes(selectedOption.value)) {
      setTags([...tags, selectedOption.value]);
    }
  };

  const handleCopyURL = () => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tags', tags.join(', '));
    const currentURL = window.location.href;
    const updatedURL = `${currentURL.split('?')[0]}?${queryParams.toString()}`;
    console.log(updatedURL);
    const decodedURL = decodeURIComponent(updatedURL);
    navigator.clipboard
      .writeText(decodedURL)
      .then(() => {
        alert('URL with tags copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to save the URL with tags in clipboard:', error);
      });
  };

  const tagOptions = predefinedTags.map((tag) => ({ value: tag, label: tag }));

  const renderCustomInput = () => {
    return (
      <>
        <Select
          options={tagOptions}
          value={selectedOption}
          onChange={handleSelectorChange}
          isClearable
        />
        <button onClick={handleAddTag}>Add Tag</button>
        <button onClick={handleCopyURL}>Copy URL with Tags</button>
      </>
    );
  };

  return (
    <div className="header">
      <div className="chartName">{chartName}</div>
      <div className="search-btn">
        <button type="button" onClick={() => showModulesSearch(true)}>
          <i className="flaticon-magnifying-glass"></i>{' '}
          <span className="translate">Search Nodes</span>
        </button>
      </div>
      {/* <div className="leftSide">
        <BCTagsInput
          value={tags}
          onChange={handleTagsChange}
          renderInput={renderCustomInput}
        />
      </div> */}
    </div>
  );
}