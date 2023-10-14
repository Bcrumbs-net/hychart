import { useState } from 'react';
import styled from 'styled-components';

export interface BCTextboxProps {
  containerClassName?: string;
  className?: string;
  name?: string;
  onChange?: (val: string, event: any) => void;
  onKeyPress?: () => void;
  onKeyDown?: () => void;
  value: string;
  type: string;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  autoCompleteList?: string[];
  onListItemClick?: (value: string) => void;
  onBlur?: () => void;
}

export interface BCTextboxState {
  showAutoComplete: boolean;
}

const AutoComplete = styled.div`
  position: absolute;
  top: 30px;
  z-index: 1000;
  ul {
    border-radius: 10px;
    li {
      color: #fff;
      font-size: 13px;
      background-color: #9b9b9b;
      border-bottom: 1px solid #8d8d8d;
      width: 233px;
      padding: 14px;
      display: block;
      cursor: pointer;
      height: 40px;
      font-weight: 300;
    }
    li:first-of-type {
      border-top-right-radius: $radius;
      border-top-left-radius: $radius;
    }
    li:last-child {
      border-bottom-right-radius: $radius;
      border-bottom-left-radius: $radius;
    }
    li:hover {
      background-color: #8d8d8d;
    }
  }
`;

export const Textbox = ({
  className,
  name,
  onChange,
  onKeyPress,
  onKeyDown,
  value,
  type,
  disabled,
  placeholder,
  maxLength,
  autoCompleteList,
  onBlur,
  containerClassName,
}: BCTextboxProps) => {
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  return (
    <div className={containerClassName}>
      <input
        className={'form-control ' + className}
        onBlur={onBlur}
        name={name}
        onChange={(e) => {
          e.persist();
          const targetVal = e.target.value;
          let lastWord: string | null = null;
          if (targetVal && targetVal.length > 1) {
            const wordArrays = targetVal.split(' ');
            lastWord = wordArrays[wordArrays.length - 1];
          }
          let valueExistsInAutoComplete = false;
          if (targetVal === '#') {
            valueExistsInAutoComplete = true;
          }
          if (autoCompleteList && lastWord && lastWord.length >= 1) {
            autoCompleteList.forEach((val) => {
              if (
                val &&
                lastWord &&
                val.toUpperCase().indexOf(lastWord.toUpperCase()) >= 0
              ) {
                valueExistsInAutoComplete = true;
              }
            });
          }
          if (valueExistsInAutoComplete) {
            setShowAutoComplete(true);
            onChange && onChange(targetVal, e);
          } else {
            setShowAutoComplete(false);
            onChange && onChange(targetVal, e);
          }
        }}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        type={type}
      />
      {autoCompleteList && autoCompleteList.length && showAutoComplete ? (
        <AutoComplete>
          <ul>
            {autoCompleteList
              .filter(
                (val) =>
                  val
                    .toUpperCase()
                    .indexOf(
                      value
                        .split(' ')
                        [value.split(' ').length - 1].toUpperCase()
                    ) >= 0
              )
              .map((val, index) => (
                <li
                  key={`AutoCompleteItem${index}`}
                  onClick={() => {
                    setShowAutoComplete(false);
                    const words = value.split(' ');
                    words.pop();
                    const result = words.join(' ') + ' ' + val;
                    onChange && onChange(result.substring(1), undefined); // Substring for removing the begining space resulted from join
                  }}
                >
                  <span>{val}</span>
                </li>
              ))}
          </ul>
        </AutoComplete>
      ) : null}
    </div>
  );
};

Textbox.defaultProps = {
  className: '',
  value: '',
  disabled: false,
  placeholder: undefined,
  maxLength: undefined,
};

export default Textbox;
