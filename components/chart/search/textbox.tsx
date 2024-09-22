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
  autoCompleteList?: { name: string, id: string }[];
  onListItemClick?: (value: string) => void;
  onBlur?: () => void;
}

export interface BCTextboxState {
  showAutoComplete: boolean;
}

const AutoComplete = styled.div`
  position: absolute;
  top: 17px;
  z-index: 1000;
  ul {
    border-radius: 10px;
    margin-top: 54px;
    border-bottom: 3px solid #8d8d8d;
    li {
      color: #000;
      font-size: 13px;
      background-color: #F3EDED;
      width: 400px;
      padding: 9px 4px 9px 40px;
      display: block;
      cursor: pointer;
      height: 45px;
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
       border-radius: 8px 15px 8px 18px;
    }
    li:hover {
      background-color: #C8C1C1;
    }
  }
  

`;
const InputStyle = styled.div`
input.form-control {
  width: 400px;
  border: 1px solid var(--bc-primary-color);
  border-radius: var(--bc-radius);
  color: var(--bc-secondary-color);
  margin: 10px 0;
  display: block;
  padding: 9px 4px 9px 40px;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat 13px center;
}
`


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

  return (
    <div className={containerClassName}>
      <InputStyle>
        <input
          className={"form-control" + className}
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
                  val.name.toUpperCase().indexOf(lastWord.toUpperCase()) >= 0
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
      </InputStyle>
      {autoCompleteList && autoCompleteList.length && showAutoComplete ? (
        <AutoComplete>
          <ul>
            {autoCompleteList
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
                  }}
                >
                  <span>{val.name}</span>
                </li>
              ))}
          </ul>
        </AutoComplete>
      ) : null}
    </div>
  );
};

export default Textbox;
