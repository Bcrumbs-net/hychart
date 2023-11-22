import { element } from "prop-types";
import { useState } from "react";
import styled from "styled-components";

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
    margin-top: 55px;
    border-bottom: 3px solid #8d8d8d;
    li {
      color: #000;
      font-size: 13px;
      background-color: #F3EDED;
      width: 448px;
      padding: 14px;
      display: block;
      cursor: pointer;
      height: 35px;
      font-weight: 400;
    }
    li:first-of-type {
      border-radius: 5px 20px 0 0;
      border-top-right-radius: $radius;
      border-top-left-radius: $radius;
    }
    li:last-child {
      border-radius: 0 0 5px 20px;
      border-bottom-right-radius: $radius;
      border-bottom-left-radius: $radius;
    }
    li:first-child:last-child {     
       border-radius: 5px 15px 5px 15px;
    }
    li:hover {
      background-color: #C8C1C1;
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
  onListItemClick
}: BCTextboxProps) => {
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const autoCompleteListNames = autoCompleteList.map(el => {
    return {"id":el.split(" ")[1],"name":el.split(" ")[3]}
  })

  return (
    <div className={containerClassName}>
      <input
        className={"form-control " + className}
        onBlur={onBlur}
        name={name}
        onChange={(e) => {
          e.persist();
          const targetVal = e.target.value;
          let lastWord: string | null = null;
          if (targetVal && targetVal.length > 2) {
            const wordArrays = targetVal.split(" ");
            lastWord = wordArrays[wordArrays.length - 1];

          }
          let valueExistsInAutoComplete = false;
          if (targetVal === "#") {
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
            {autoCompleteListNames
              .filter(
                (val) =>
                  val.name
                    .toUpperCase()
                    .indexOf(
                      value
                        .split(" ")
                      [value.split(" ").length - 1].toUpperCase()
                    ) >= 0
              )
              .map((val, index) => (
                <li
                  key={`AutoCompleteItem${index}`}
                  onClick={() => {
                    setShowAutoComplete(false);
                    onListItemClick(val.id)
                    onChange && onChange(val.name, undefined); // Substring for removing the begining space resulted from join
                  }}
                >
                  <span>{' > ' + " "+ val.name}</span>
                </li>
              ))}
          </ul>
        </AutoComplete>
      ) : null}
    </div>
  );
};

Textbox.defaultProps = {
  className: "",
  value: "",
  disabled: false,
  placeholder: undefined,
  maxLength: undefined,
};

export default Textbox;
