import { Offcanvas } from 'react-bootstrap';
import { BsX } from "react-icons/bs";
import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { NodeType } from '../types';
import {
  useUpdateContentInstanceFieldValuesMutation,
  useContentInstancesQuery,
  useModelsQuery,
  ModelFieldsTypes,
} from '@bcrumbs.net/bc-api';
import { Controller, useForm, FieldValues } from "react-hook-form";
import { HYCHART_VIEW_TYPE_ID, TAGS_ENUM_ID, TEMPLATE_CONTEXT_ID } from '../Constants';
import useTagsEnumValuesQuery from '../../../bootstrapers/hychart/utils/useTagsEnumValuesQuery';
import FieldRenderer from './FieldRenderer';
import { ErrorToast, SuccessToast, ToastMessage } from '../../common/toasts';
import { StyledDrawer } from '../../common/drawer';
import { useThemeContext } from '../../common/context/themeContext';

type DrawerProps = {
  module: NodeType;
  open: boolean;
  onClose: () => void;
  onNodeUpdate: (id: number, fieldName: string, value: number | string | []) => void;
};
const Button = styled.button`
  display: block;
  width: 85%;
  height: 40px;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  margin: 10px 20px;
  background-color: #699041;
  border: solid 1px var(--bc-secondary-light-hover);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  
  &:hover {
    background-color: #5a7736; 
  }
`;
const EditDrawer: React.FC<PropsWithChildren<DrawerProps>> = ({ open, onNodeUpdate, onClose, module, children }) => {
  const drawerRef = useRef(null);
  const editPanelRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { data, loading } = useContentInstancesQuery(module?.id);
  const { data: modelsResult, loading: modelsLoading } =
    useModelsQuery(TEMPLATE_CONTEXT_ID);
  const { enumValues } = useTagsEnumValuesQuery(TAGS_ENUM_ID);
  const [
    updateContentInstanceFieldValues,
    {
      data: updateContentInstanceFieldValuesCallData,
      error: updateContentInstanceFieldValuesCallError,
      loading: updateContentInstanceFieldValuesLoading,
    },
  ] = useUpdateContentInstanceFieldValuesMutation();
  const { control, handleSubmit, formState: { errors }, register, setValue, getValues } = useForm<any>();
  const { lang, translations } = useThemeContext();
  const rtl = lang.rtl;


  const targetModel = useMemo(() => {
    if (modelsResult?.viewTypes) {
      return modelsResult.viewTypes.find(viewType => viewType.Id === HYCHART_VIEW_TYPE_ID);
    }
    return undefined;
  }, [modelsResult, module?.id]);

  const targetContentInstance = useMemo(() => {
    if (data?.contentInstances.length > 0) {
      return data.contentInstances[0];
    }
    return undefined;
  }, [data]);

  useEffect(() => {
    if (targetModel && data?.contentInstances.length > 0) {
      targetModel.ViewFields.forEach((field) => {
        const fieldData = targetContentInstance.FieldsValues.find(
          (f) => f.FieldId === field.Id,
        );

        if (field.Type === ModelFieldsTypes.PredefinedListCheckboxes && fieldData !== undefined) {
          setValue(`${field.Id}`, fieldData.Value.split(',').flat());
        } else if (field.Type === ModelFieldsTypes.Boolean && fieldData !== undefined) {
          setValue(`${field.Id}`, fieldData.Value === 'True' ? true : false)
        } else {
          setValue(`${field.Id}`, fieldData?.Value || '');
        }
      });
    }
  }, [data, targetModel]);
  const editTranslations = translations['editForm'] as Record<string, string>;
  const edit = editTranslations.edit;

  const handleFieldChange = (fieldName: string, value: number | string | []) => {
    onNodeUpdate(module.id, fieldName, value);
  };

  const onSubmit = (formData: FieldValues) => {
    const updatedFormData: FieldValues = { ...formData };
    if (targetModel && data?.contentInstances.length > 0) {
      targetModel.ViewFields.forEach((field) => {
        if (field.Type === ModelFieldsTypes.PredefinedListCheckboxes && formData[field.Id]) {
          updatedFormData[field.Id] = formData[field.Id]?.join(',')
        } else if (field.Type === ModelFieldsTypes.Boolean) {
          updatedFormData[field.Id] = formData[field.Id] === true ? 'True' : 'False'
        }
      });
    }
    updateContentInstanceFieldValues({
      variables: {
        body: {
          Id: targetContentInstance?.Id,
          FieldsValues: Object.keys(formData).map((key) => ({
            FieldId: parseInt(key.replace(targetContentInstance?.Id + '-', '')),
            Value: updatedFormData[key],
            ContentId: targetContentInstance?.Id,
          })),
        },
      },
    })
      .then((response) => {
        setSuccessMessage('Node updated successfully');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch((error) => {
        setErrorMessage(`${error}: Error updating node`);
        setSuccessMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      });

  };
  return (
    <>
      <Offcanvas show={open} placement="end">
        <div ref={drawerRef}>
          <StyledDrawer rtl={rtl} className={open ? 'show' : ''}>
            <div className='header'>
              <div className='title'>
                <h1>{targetContentInstance?.Name}</h1>
              </div>
              <BsX onClick={onClose} className='closeIcon' />
            </div>

            <Offcanvas.Body ref={editPanelRef}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {targetModel?.ViewFields.map((field) => {
                  const privateFields = field.Name.startsWith('_');
                  if (!privateFields) {
                    return (
                      <div key={field.Id}>
                        <Controller
                          control={control}
                          name={`${field.Id}`}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <FieldRenderer
                                field={field}
                                enumValues={enumValues}
                                register={register}
                                getValues={getValues}
                                setValue={setValue}
                                onChange={(newValue) => {
                                  onChange(newValue);
                                  handleFieldChange(`${field.Name}`, newValue);
                                }}
                              />
                            );
                          }}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
                <Button type="submit">{edit}</Button>
              </form>
            </Offcanvas.Body>
          </StyledDrawer>
        </div>
        {successMessage && (
          <SuccessToast>
            <ToastMessage>{successMessage}</ToastMessage>
          </SuccessToast>
        )}
        {errorMessage && (
          <ErrorToast>
            <ToastMessage>{errorMessage}</ToastMessage>
          </ErrorToast>
        )}
      </Offcanvas>
    </>
  );
};
export default EditDrawer;
