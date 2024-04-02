import React, { useState } from "react";
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
  position: fixed;
  top: 38px;
  right: 10;
  z-index: 1000;

  ul {
    border-radius: 10px;
    border-bottom: 3px solid #8d8d8d;

    li {
      color: #000;
      font-size: 13px;
      background-color: #f3eded;
      width: 200px;
      padding: 9px 4px 9px 40px;
      display: block;
      cursor: pointer;
      height: 45px;
      font-weight: 400;
    }

    li:first-of-type {
      border-radius: 5px 20px 0 0;
      border-top-right-radius: var(--radius);
      border-top-left-radius: var(--radius);
    }

    li:last-child {
      border-radius: 0 0 5px 20px;
      border-bottom-right-radius: var(--radius);
      border-bottom-left-radius: var(--radius);
    }

    li:first-child:last-child {
      border-radius: 8px 15px 8px 18px;
    }

    li:hover {
      background-color: #c8c1c1;
    }
  }
`;

const InputStyle = styled.div`
  input.form-control {
    width: 200px;
    height: 30px;
    padding: 9px 4px 9px 40px;
  }
`;

export const Inputtext = ({
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
    onListItemClick,
}: BCTextboxProps) => {
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [currentInput, setCurrentInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = e.target.value;
        setCurrentInput(targetValue);

        if (
            targetValue.endsWith("#") ||
            (autoCompleteList &&
                autoCompleteList.some((item) =>
                    item.toLowerCase().startsWith(targetValue.toLowerCase())
                ))
        ) {
            setShowAutoComplete(true);
        } else {
            setShowAutoComplete(false);
        }

        onChange && onChange(targetValue, e);
    };

    const handleAutocompleteSelect = (value: string) => {
        setCurrentInput(value);
        setShowAutoComplete(false);
        onListItemClick && onListItemClick(value);
    };

    return (
        <div className={containerClassName}>
            <InputStyle>
                <input
                    className={"form-control"}
                    name={name}
                    onChange={handleInputChange}
                    onKeyPress={onKeyPress}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    value={currentInput}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    type={type}
                    onBlur={onBlur}
                />
            </InputStyle>
            {showAutoComplete && autoCompleteList && autoCompleteList.length ? (
                <AutoComplete>
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
                </AutoComplete>
            ) : null}
        </div>
    );
};

Inputtext.defaultProps = {
    className: "",
    value: "",
    disabled: false,
    placeholder: undefined,
    maxLength: undefined,
};

export default Inputtext;