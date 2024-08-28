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
import { HYCHART_VIEW_TYPE_ID, TEMPLATE_CONTEXT_ID } from '../Constants';
import useTagsEnumValuesQuery from '../../../bootstrapers/hychart/utils/useTagsEnumValuesQuery';
import FieldRenderer from './FieldRenderer';
type DrawerProps = {
  module: NodeType;
  open: boolean;
  onClose: () => void;
  lang: string;
};
const StyledDrawer = styled.div`
  position: fixed;
  padding-left: 20px;
  padding-right: 20px;
  top: 38px;
  bottom: 0;
  right: 0;
  max-width: 50vw;
  width: 25vw;
  background-color: #eee6dbf7;
  border-left: 1px solid rgb(100, 57, 0);
  box-shadow: 0px 0px 25px 0px rgb(100, 57, 0);
  transition: transform 0.3s ease-in-out, overflow-y 0.3s ease-in-out,
    max-height 0.3s ease-in-out, padding-bottom 0.3s ease-in-out;
  z-index: 1050;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    direction: ${({ lang }) =>
    lang === null || lang === 'en' ? 'ltr' : 'rtl'};
    .title {
      margin-top: 10px;
      display: flex;
      font-weight: bold;
      align-items: center;

      .linkIcon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        margin-right: 10px;
      }
    }

    .closeIcon {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  &.show {
    transform: translateX(0);
    overflow-y: auto;
    max-height: 100%;
    padding-bottom: 10px;
  }
`;
const SuccessToast = styled.div`
  position: fixed;
  bottom: 20px;
  left: 64%;
  transform: translateX(-50%);
  background-color: #4caf50; 
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const ErrorToast = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff6347;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

const ToastMessage = styled.span`
  font-size: 14px;
  font-weight: bold;
`;
const Button = styled.button`
  display: block;
  width: 85%;
  height: 40px;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0;
  background-color: #699041;
  border: solid 1px var(--bc-secondary-light-hover);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  
  &:hover {
    background-color: #5a7736; /* Brown hover color */
  }
`;
const EditDrawer: React.FC<PropsWithChildren<DrawerProps>> = ({ open, lang, onClose, module, children }) => {
  const drawerRef = useRef(null);
  const editPanelRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldId, setFieldId] = useState<number>();
  const { data, loading } = useContentInstancesQuery(module?.id);
  const { data: modelsResult, loading: modelsLoading } =
    useModelsQuery(TEMPLATE_CONTEXT_ID);
  const [
    updateContentInstanceFieldValues,
    {
      data: updateContentInstanceFieldValuesCallData,
      error: updateContentInstanceFieldValuesCallError,
      loading: updateContentInstanceFieldValuesLoading,
    },
  ] = useUpdateContentInstanceFieldValuesMutation();

  const targetModel = useMemo(() => {
    if (modelsResult?.viewTypes) {
      return modelsResult.viewTypes.find(viewType => viewType.Id === HYCHART_VIEW_TYPE_ID);
    }
    return undefined;
  }, [modelsResult, module?.id]);

  const { control, handleSubmit, formState: { errors }, register, setValue, getValues } = useForm<any>();
  useEffect(() => {
    if (targetModel && data?.contentInstances.length > 0) {
      targetModel?.ViewFields.reduce(
        (obj, field) => {
          const fieldData = data.contentInstances[0].FieldsValues.find(
            (f) => (f.FieldId === field.Id),
          );
          if (field.Type === ModelFieldsTypes.PredefinedListCheckboxes) {
            const fieldDataForCheckboex = data.contentInstances[0].FieldsValues.filter(
              (f) => f.FieldId === field.Id,
              setFieldId(field.Id),
            );
            const finishedCheckedBox = fieldDataForCheckboex.map((checkBoxValue) => checkBoxValue.Value.split(','))
            setValue(`${field.Id}`, finishedCheckedBox.flat() || '')
          } else if (field.Type === ModelFieldsTypes.Boolean) {
            data.contentInstances[0].FieldsValues.filter(
              (f) => f.FieldId === field.Id,
            ).map((item) => {
              setValue(`${field.Id}`, item.Value === 'True' ? true : false)
            });
          } else {
            setValue(`${field.Id}`, fieldData?.Value || '')
          }

          return {
            ...obj,
            [`${field.Id}`]: fieldData?.Value || '',
          };
        },
        {}
      );
    }
  }, [data, targetModel]);

  const onSubmit = (formData: FieldValues) => {
    const updatedFormData: FieldValues = { ...formData };
    let ci: number;
    if (targetModel && data?.contentInstances.length > 0) {
      targetModel?.ViewFields.reduce(
        (obj, field) => {
          if (field.Type === ModelFieldsTypes.PredefinedListCheckboxes) {
            updatedFormData[field.Id] = formData[fieldId].join(',')
          } else if (field.Type === ModelFieldsTypes.Boolean) {
            updatedFormData[field.Id] = formData[fieldId] === true ? 'True' : 'False'
          }
          data.contentInstances[0].FieldsValues.map((details, index) => {
            ci = details.ContentId;
          });
          return {
            ...obj,
          };
        },
        {}
      );
    }

    updateContentInstanceFieldValues({
      variables: {
        body: {
          Id: ci,
          FieldsValues: Object.keys(formData).map((key) => ({
            FieldId: parseInt(key.replace(ci + '-', '')),
            Value: updatedFormData[key],
            ContentId: ci,
          })),
        },
      },
    })
      .then(() => {
        setSuccessMessage('Content instance updated successfully');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch((error) => {
        setErrorMessage(`${error}: Error updating content instance`);
        setSuccessMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      });

  };
  const { enumValues } = useTagsEnumValuesQuery(403027);

  return (
    <>
      <Offcanvas show={open} placement="end">
        <div ref={drawerRef}>
          <StyledDrawer className={open ? 'show' : ''}>
            <div className='header'>
              <BsX onClick={onClose} className='closeIcon' />
              <div className='title'>
                <h1>{data?.contentInstances[0]?.Name}</h1>
              </div>
            </div>

            <Offcanvas.Body ref={editPanelRef}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {targetModel?.ViewFields.map((field) => (
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
                          />
                        );
                      }}
                    />
                  </div>
                ))}
                <Button type="submit">تعديل</Button>
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
