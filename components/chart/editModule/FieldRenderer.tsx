import React from 'react';
import styled from 'styled-components';
import {
    ModelFieldsTypes,
    ModelField,
} from '@bcrumbs.net/bc-api';

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin: 10px 0px;
  padding: 9px 4px 0px 5px;

`;
const Input = styled.input`
  display: block;
  width: 85%;
  height:30px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid var(--bc-primary-color);
  border-radius: var(--bc-radius);
  color: var(--bc-secondary-color);
  margin: 10px 0;
  display: block;
`;
const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const CheckboxColumn = styled.div`
  flex-basis: 100%;
  @media (min-width: 992px) {
    flex-basis: 25%;
  }
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 10px;
  justify-content: space-evenly;
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 10px;
  height: 10px;
  border: 1px solid var(--bc-primary-color);
  border-radius: 8px;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;

  &:checked {
    background-color: var(--bc-primary-color);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' fill='%23fff'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
`;
const Select = styled.select`
  display: block;
  width: 90%;
  height: 45px;
  padding: 10px;
  font-size: 15px;
  border: 1px solid var(--bc-primary-color);
  border-radius: var(--bc-radius);
  color: var(--bc-secondary-color);
  margin: 10px 0;
`;
const TextArea = styled.textarea`
  display: block;
  width: 85%;
  height: 150px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid var(--bc-primary-color);
  border-radius: var(--bc-radius);
  color: var(--bc-secondary-color);
  margin: 10px 0;
  resize: vertical;
`;
interface FieldRendererProps {
    field: ModelField;
    // value?: string;
    onChange: (value: any) => void;
    enumValues?: { value: string; label: string }[];
    register?: any;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, onChange, enumValues, register }) => {
    switch (field.Type) {
        case ModelFieldsTypes.Boolean:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <CheckboxInput
                        type="checkbox"
                        {...register(`${field.Id}`)}

                    // checked={value === "True" ? true : false}
                    // onChange={(e) => onChange(e.target.checked)}
                    />
                </>
            );
        case ModelFieldsTypes.PredefinedListCheckboxes:
            // const fieldValues = enumValues ? enumValues.split(',').map((val) => val.trim()) : [];
            // console.log(fieldValues);
            return (
                <>
                    <Label>{field.Name}</Label>
                    <CheckboxContainer>
                        {enumValues?.map((option) => (
                            <CheckboxColumn key={option.value}>
                                <CheckboxLabel key={option.value}>
                                    <CheckboxInput
                                        type="checkbox"
                                        {...register(`${field.Name}[]`, { value: option.value })}
                                    // defaultChecked={value?.includes(option.value)}
                                    />
                                    {option.value}
                                </CheckboxLabel>
                            </CheckboxColumn>
                        ))}
                    </CheckboxContainer>
                </>
            );
        case ModelFieldsTypes.String:
            return (
                <>
                    {field.Id}
                    <Label>{field.Name}</Label>
                    <Input {...register(`${field.Id}`)} type="text" placeholder={field.Name} />
                </>
            );
        case ModelFieldsTypes.ContentUrl:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <Input type="url"  {...register(`${field.Id}`)} placeholder={field.Name} />
                </>
            );
        case ModelFieldsTypes.Number:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <Input type="number"  {...register(`${field.Id}`)} placeholder={field.Name} />
                </>
            );
        case ModelFieldsTypes.PredefinedList:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <Select  {...register(`${field.Id}`)}>
                        <option key="Person" value="Person">
                            Person
                        </option>
                        <option key="Book" value="Book">
                            Book
                        </option>
                        <option key="Idea" value="Idea">
                            Idea
                        </option>
                    </Select>
                </>
            );
        case ModelFieldsTypes.RichTextBox:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <TextArea  {...register(`${field.Id}`)} />
                </>
            );
        default:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <Input type={field.Type}  {...register(`${field.Id}`)} placeholder={field.Name} />
                </>
            );
    }
};

export default FieldRenderer;