import 'react-tagsinput/react-tagsinput.css';
import React, { useState } from 'react';
import TagsInput from 'react-tagsinput'
import BCTagsInput from './bctags-input';
import Textbox from '../search/textbox';
import Inputtext from './inputText';

export default function Header({
  showModulesSearch,
  chartName,
  predefinedTags,
}: {
  showModulesSearch: (state: boolean) => void;
  chartName: string;
  predefinedTags: string[];
}) {
  const [tags, setTags] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  predefinedTags = [
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
    'أصول الدين'
  ];
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleSelectorChange = (selectedOption) => {
    if (selectedOption && !tags.includes(selectedOption)) {
      setTags([selectedOption,...tags]);
      handleCopyURL();
    }
    setSelectedOption(null);
    console.log(selectedOption);
  };

  const handleCopyURL = () => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tags', tags.join(', '));
    const currentURL = window.location.href;
    const updatedURL = `${currentURL.split('?')[0]}?${queryParams.toString()}`;
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


  const renderCustomInput = () => {
    return (
      <Inputtext
        type="text"
        autoCompleteList={predefinedTags}
        maxLength={20}
        onChange={(val, event) => {
          setSelectedOption(val);
        }}
        placeholder="Write tags name"
        value={selectedOption}
        onListItemClick={(value) => handleSelectorChange(value)}
      />
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
      <div className="leftSide">
        <BCTagsInput
          value={tags}
          onChange={handleTagsChange}
          renderInput={renderCustomInput}
        />
      </div>
    </div>
  );
}