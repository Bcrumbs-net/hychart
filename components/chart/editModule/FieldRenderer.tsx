import React from 'react';
import {
    ModelFieldsTypes,
    ModelField,
} from '@bcrumbs.net/bc-api';
import dynamic from 'next/dynamic';
import { Label, CheckboxInput, CheckboxContainer, CheckboxColumn, CheckboxLabel, Input, Select } from '../../common/formInputs';

interface FieldRendererProps {
    field: ModelField;
    enumValues?: { value: string; label: string }[];
    register?: any;
    getValues?: any;
    setValue?: any;
    onChange: (value: any) => void;
}
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, enumValues, onChange, register, getValues, setValue }) => {
    switch (field.Type) {
        case ModelFieldsTypes.Boolean:
            const booleanInitialValue = getValues(`${field.Id}`);
            return (
                <>
                    <Label>{field.Name}</Label>
                    <CheckboxInput
                        type="checkbox"
                        {...register(`${field.Id}`)}
                        defaultChecked={booleanInitialValue}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                </>
            );
        case ModelFieldsTypes.PredefinedListCheckboxes:
            const initialValue = getValues(`${field.Id}`)
            return (
                <>
                    <Label>{field.Name}</Label>
                    <CheckboxContainer>
                        {enumValues?.map((option, index) => (
                            <CheckboxColumn key={index}>
                                <CheckboxLabel >
                                    <CheckboxInput
                                        key={option.value}
                                        type="checkbox"
                                        {...register(`${field.Id}`)}
                                        value={option.value}
                                        defaultChecked={initialValue ? initialValue?.includes(option.value) ? true : false : false}
                                        onChange={(e) => {
                                            const newValues = e.target.checked
                                                ? [...(initialValue || []), option.value]
                                                : (initialValue || []).filter((val) => val !== option.value);
                                            onChange(newValues);
                                        }}
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
                    <Label>{field.Name}</Label>
                    <Input
                        {...register(`${field.Id}`)}
                        type="text"
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.Name}
                    />
                </>
            );
        case ModelFieldsTypes.Image:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <Input
                        {...register(`${field.Id}`)}
                        type="text"
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.Name} />
                </>
            );
        case ModelFieldsTypes.Number:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <Input
                        type="number"
                        {...register(`${field.Id}`)}
                        onChange={(e) => onChange(Number(e.target.value))}
                        placeholder={field.Name} />
                </>
            );
        case ModelFieldsTypes.PredefinedList:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <Select  {...register(`${field.Id}`)} onChange={(e) => onChange(e.target.value)}>
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
            const descriptionInitialValue: string = getValues(`${field.Id}`)
            return (
                <>
                    <Label>{field.Name}</Label>
                    <JoditEditor
                        value={descriptionInitialValue}
                        onChange={(newValue) => setValue(`${field.Id}`, newValue || '')}
                        className="w-full h-[70%] mt-10 bg-white"
                    />
                    <style>
                        {`.jodit-wysiwyg{height:300px !important}`}
                    </style>
                </>
            );
        default:
            return (
                <>
                    <Label>{field.Name}</Label>
                    <Input
                        type={field.Type}
                        onChange={(e) => onChange(e.target.value)}
                        {...register(`${field.Id}`)}
                        placeholder={field.Name} />
                </>
            );

    }
    return null;
};

export default FieldRenderer;