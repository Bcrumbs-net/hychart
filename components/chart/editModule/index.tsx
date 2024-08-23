import { Offcanvas } from 'react-bootstrap';
import { BsX } from "react-icons/bs";
import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { NodeType } from '../types';
import {
  useUpdateContentInstanceFieldValuesMutation,
  useContentInstancesQuery,
  useModelsQuery,
} from '@bcrumbs.net/bc-api';
import { Controller, useForm } from "react-hook-form";
import { TEMPLATE_CONTEXT_ID } from '../Constants';
import useTagsEnumValuesQuery from '../../../bootstrapers/hychart/utils/useTagsEnumValuesQuery';
import FieldRenderer from './FieldRenderer';
type DrawerProps = {
  module: NodeType;
  open: boolean;
  onClose: () => void;
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
    direction: ltr;
    justify-content: space-between;
    align-items: center;
    
    .title {
      margin-top:10px;
      display: flex; 
      font-weight: bold;
      align-items: center;
      .linkIcon{
          width: 20px;
          height: 20px;
          cursor: pointer;
          margin-right:10px;
      }
    }
    .closeIcon {
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }
  
 
  .sub_title {
    margin-top:-5px;
    font-size: 18px;
    font-weight: bold; 
  }
  .tags{
    display: flex; 

  }
  .tagsItem {
    padding-left:10px;
    padding-right:10px;
    margin-left:10px;
    margin-top:-5px;
    font-size: 15px;
    font-weight: bold; 
    border: 1px solid var(--bc-primary-color);
    box-shadow: 0px 0px 2px 0px rgb(100, 57, 0);
    border-radius: 20px;
  }
  &.show {
    direction: rtl;
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
const EditDrawer: React.FC<PropsWithChildren<DrawerProps>> = ({ open, onClose, module, children }) => {
  interface FormData {
    value: string;
    isValid: boolean;
    message: string;
  }
  const [formData, setFormData] = useState<{ [key: string]: FormData }>();
  const drawerRef = useRef(null);
  const descriptionPanelRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
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
      return modelsResult.viewTypes.find(viewType => viewType.Id === 403537);
    }
    return undefined;
  }, [modelsResult, module?.id]);

  const { control, handleSubmit, formState: { errors }, register, setValue } = useForm<any>();
  useEffect(() => {
    if (targetModel && data?.contentInstances.length > 0) {
      targetModel?.ViewFields.reduce(
        (obj, field) => {
          const fieldData = data.contentInstances[0].FieldsValues.find(
            (f) => f.FieldId === field.Id
          );
          setValue(`${field.Id}`, fieldData?.Value || '')
          return {
            ...obj,
            [`${field.Id}`]: fieldData?.Value || '',
          };
        },
        {}
      );
    }
  }, [data, targetModel]);
  console.log(data.contentInstances[0]);
  const onSubmit = (formData) => {
    // Handle form submission logic here
    // console.log(formData);
    data.contentInstances[0].FieldsValues.map((details, index) => {
      const ci = details.ContentId
    });

    // updateContentInstanceFieldValues({
    //   variables: {
    //     body: {
    //       Id: '117112',
    //       FieldsValues: Object.keys(formData).map((key) => ({
    //         FieldId: parseInt(key.replace('117112' + '-', '')),
    //         Value: formData[key].value,
    //         ContentId: '117112',
    //       })),
    //     },
    //   },
    // }).then(() => {
    //   console.log('done');
    // });

    // Update content instance field values
    // updateContentInstanceFieldValues({
    //   variables: {
    //     input: {
    //       FieldsValues: Object.entries(formData).map(([fieldId, value]) => ({
    //         FieldId: parseInt(fieldId),
    //         Value: value,
    //       })),
    //     },
    //   },
    // })
    //   .then((result) => {
    //     setSuccessMessage('Content instance updated successfully');
    //     setErrorMessage('');
    //   })
    //   .catch((error) => {
    //     setErrorMessage('Error updating content instance');
    //     setSuccessMessage('');
    //   });
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

            <Offcanvas.Body ref={descriptionPanelRef}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {targetModel?.ViewFields.map((field) => (
                  <div key={field.Id}>
                    <Controller
                      control={control}
                      name={`${field.Id}`}
                      render={({ field: { onChange, value } }) => {
                        // const fieldData = initialValues[`${field.Id}`];
                        return (
                          <FieldRenderer
                            field={field}
                            // value={fieldData}
                            onChange={onChange}
                            enumValues={enumValues}
                            register={register}
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
