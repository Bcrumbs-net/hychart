import { Offcanvas } from 'react-bootstrap';
import { BsX } from "react-icons/bs";
import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { NodeType } from '../types';
import {
  useContentInstancesQuery,
  useModelsQuery,
  useUpdateContentInstanceFieldValuesMutation,
} from '@bcrumbs.net/bc-api';
import { useBCForm } from '@bcrumbs.net/bc-ui';
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
const EditDrawer: React.FC<PropsWithChildren<DrawerProps>> = ({ open, onClose, module, children }) => {
  console.log(module);
  const drawerRef = useRef(null);
  const descriptionPanelRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { data, loading } = useContentInstancesQuery(module?.id);
  console.log(data);
  // const { data: modelsResult, loading: modelsLoading } =
  //   useModelsQuery(1170); // Fixed: use module.templateContextId instead of templateContextId
  // console.log({ data: modelsResult, loading: modelsLoading }, 'da2');
  // const [
  //   updateContentInstanceFieldValues,
  //   {
  //     data: updateContentInstanceFieldValuesCallData,
  //     error: updateContentInstanceFieldValuesCallError,
  //     loading: updateContentInstanceFieldValuesLoading,
  //   },
  // ] = useUpdateContentInstanceFieldValuesMutation();

  // const targetModel = useMemo(() => {
  //   if (modelsResult?.viewTypes) {
  //     console.log(modelsResult, 'model');
  //     return modelsResult.viewTypes.find(viewType => viewType.Id === 403537); // Fixed: use find() instead of assignment
  //   }
  //   return undefined;
  // }, [modelsResult, module?.id]);

  // const formInitialValue = useMemo(
  //     () =>
  //         targetModel && data?.contentInstances.length > 0 // Fixed: check if data.contentInstances is not empty
  //             ? targetModel?.ViewFields.reduce(
  //                 (obj, m) => ({
  //                     ...obj,
  //                     [m.Id]: {
  //                         value: data.contentInstances[0].FieldsValues.find(
  //                             (f) => f.FieldId === m.Id
  //                         )?.Value,
  //                         validations: [],
  //                     },
  //                 }),
  //                 {}
  //             )
  //             : undefined,
  //     [data, targetModel]
  // );

  // const [
  //     formData,
  //     { validateField, setFieldValue, renderDroplistField, renderField },
  // ] = useBCForm(formInitialValue);

  return (
    <>
      <Offcanvas show={open} placement="end">
        <div ref={drawerRef}>
          <StyledDrawer className={open ? 'show' : ''}>
            <div className='header'>
              <BsX onClick={onClose} className='closeIcon' />
              <div className='title'>
                <h1 >edit</h1>
              </div>
            </div>

            <Offcanvas.Body ref={descriptionPanelRef}>{children}</Offcanvas.Body>
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
