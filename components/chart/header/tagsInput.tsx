import React, { useState, useEffect } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import styled from 'styled-components';

const BCTagsInputWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  justify-content: flex-end; 
  .selectedClass {
    display: flex;
    align-items: center;
    height: 20px;
    padding: 9px 4px 9px 40px;
    border: none !important;
  }
  .tagInputClass {
    margin-left: 50px;
  }
  .tagInputFieldClass {
    background-color: #fff;
    border: solid 1px var(--bc-secondary-light-hover);
    border-radius: 20px;
    height: 20px;
    width: 120px;
    color: var(--bc-secondary-light-hover);
  }
  .tagClass {
    display: flex;
    align-items: center;
    padding-left: 8px;
    font-size: 15px;
    font-weight: bold;
    border: 1px solid #bfa37cf7;
    box-shadow: 0px 0px 2px 0px rgb(100, 57, 0);
    border-radius: 20px;
    margin: 2px;
    height: 25px;
    font-size: 10px;
    background-color: #eee6dbf7;
  }
  .removeClass {
    display: flex;
    align-items: center;
    height: 15px;
    border: none !important;
    background-color: transparent !important;
    color: #444 !important;
    cursor: pointer;
  }
  .suggestionsClass {
    position: fixed;
    z-index: 1000;
    ul {
      border-radius: 10px;
      margin-top: -10px;
      height: 500px; 
      width: 160px; 
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
    }
  }
`;


const TagsInput = ({ predefinedTags }) => {
    const [tags, setTags] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
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
    const handleDelete = (index) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
        if (newTags.length === 0) {
            removeTagsFromURL();
        } else {
            handleUpdateURL(newTags);
        }
    };

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
    const handleAddition = (tag) => {
        const lowerCaseTag = typeof tag.text === 'string' ? tag.text.toLowerCase() : '';
        const tagExists = predefinedTags.some(
            (predefinedTag) => predefinedTag.toLowerCase() === lowerCaseTag
        );
        if (tagExists && tags.length < 3) {
            const newTags = [...tags, tag];
            setTags(newTags);
            handleUpdateURL(newTags);
        }
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = [...tags];
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
        handleUpdateURL(newTags);
    };

    const handleTagClick = (index) => {
        console.log('Tag clicked:', tags[index]);
    };

    const handleUpdateURL = (tags) => {
        const tagNames = tags.map((tag) => tag.text);
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set('tags', tagNames.join(', '));
        const currentURL = window.location.href;
        const updatedURL = `${currentURL.split('?')[0]}?${queryParams.toString()}`;
        window.history.pushState({ path: updatedURL }, '', updatedURL);
    };

    const [autoCompleteList, setAutoCompleteList] = useState([]);
    const [showAutoComplete, setShowAutoComplete] = useState(false);

    const handleAutocompleteSelect = (value) => {
        setCurrentInput(value);
        setShowAutoComplete(false);
    };

    useEffect(() => {
        const fetchAutoCompleteList = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setAutoCompleteList(predefinedTags);
        };

        fetchAutoCompleteList();
    }, [predefinedTags]);

    return (
        <>
            <BCTagsInputWrapper>
                <ReactTags
                    suggestions={predefinedTags.map((tag) => ({ id: tag, text: tag }))}
                    tags={tags}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    handleTagClick={handleTagClick}
                    autofocus={false}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleAddition({ id: currentInput, text: currentInput });
                            setCurrentInput('');
                        }
                    }}
                    placeholder='Press to add tag'
                    classNames={{
                        tags: 'tagsClass',
                        tagInput: 'tagInputClass',
                        tagInputField: 'tagInputFieldClass',
                        selected: 'selectedClass',
                        tag: 'tagClass',
                        remove: 'removeClass',
                        suggestions: 'suggestionsClass',
                    }}
                />
            </BCTagsInputWrapper>
            {showAutoComplete && autoCompleteList && autoCompleteList.length ? (
                <ul>
                    {autoCompleteList.map((val, index) => (
                        <li
                            key={`AutoCompleteItem${index}`}
                            onClick={() => handleAutocompleteSelect(val)}
                        >
                            <span>{val}</span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </>
    );
};

export default TagsInput;