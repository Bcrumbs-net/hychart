import { auth, useCreateContentInstanceMutation, useCreateContentMutation } from '@bcrumbs.net/bc-api';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsX } from 'react-icons/bs';
import styled from 'styled-components';
import { HYCHART_VIEW_TYPE_ID } from '../Constants';
import { SuccessToast, ToastMessage, ErrorToast } from '../../common/toasts';
import { ChartType, NodeInformationType, NodeType, SelectModuleFunc } from '../types';
import createBlankNode from '../createBlankNode';

interface AddNewModuleProps {
  onClick?: () => void;
  setInfoToCreateChild?: React.Dispatch<React.SetStateAction<NodeInformationType | undefined>>;
  selectModule?: SelectModuleFunc;
  currentVersion?: any;
  setCurrentVersion?: React.Dispatch<React.SetStateAction<ChartType>>;
  infoToCreateChild?: NodeInformationType;
}

const StyledAddNewModule = styled.div<AddNewModuleProps>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #699041;
  color: white;
  padding: 7px 14px;
  border: none;
  border-radius: 100%;
  cursor: pointer;
  z-index: 999;

  span {
    font-size: 24px;
  }
`;

const BackgroundStyle = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 9999;
`;

const CreateFormStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: auto; /* Allow height to adjust based on content */
  margin-left: -200px;
  margin-top: -200px; /* Center vertically */
  z-index: 10000;
  background-color: #eee6dbf7;
  border: 1px solid var(--bc-primary-color);
  border-radius: var(--bc-radius);
  box-shadow: 2px 2px 2px 2px rgb(100, 57, 0);
  padding: 20px; /* Added padding for better spacing */
  color: #699041;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .closeIcon {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: black;
  margin: 20px 0 15px 5px;
`;

const InputStyle = styled.input`
  height: 50px;
  width: 80%;
  max-width: 100%;
  background-color: white;
  border: 1px solid var(--bc-primary-color);
  border-radius: var(--bc-radius);
  margin: 10px 0;
  display: block;
  font-size: 13px;
`;

const Button = styled.button`
  display: block;
  width: 85%;
  max-width: 100%;
  height: 50px;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  margin: 30px auto; /* Center the button */
  background-color: #699041;
  border: solid 1px var(--bc-secondary-light-hover);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #5a7736; 
  }
`;

const AddNewModule: React.FC<AddNewModuleProps> = ({ onClick, infoToCreateChild, setCurrentVersion, currentVersion, selectModule, setInfoToCreateChild }) => {
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [
    createContentMutation,
    { data: createContentData, error: createContentError, loading: creatingContentLoading },
  ] = useCreateContentMutation();

  const [
    createContentInstanceMutation,
    { data: createContentInstanceData, error: createContentInstanceError, loading: creatingContentInsLoading },
  ] = useCreateContentInstanceMutation();
  const { control, handleSubmit, register, setValue } = useForm<any>();
  const onSubmit = (formData: any) => {
    createContentMutation({
      variables: {
        body: {
          Id: 0,
          Name: formData.name,
          ViewTypeId: HYCHART_VIEW_TYPE_ID,
          Online: true,
          PlentyChildren: false,
          ContentType: 4,
          ContentInstances: [],
          StageId: null,
          ParentId: infoToCreateChild.parentId,
        },
      },
    }).then(
      ({
        data: {
          createContent: { result, obj: content },
        },
      }) => {
        if (result === 'true' && content) {
          createContentInstanceMutation({
            variables: {
              body: {
                Id: 0,
                ContentId: content.Id,
                Name: formData.name,
                Title: '',
                MetaDescription: '',
                MetaKeywords: '',
                Version: 0,
                DownloadPath: '',
                DownloadName: '',
                Online: true,
                ViewTemplateId: '',
                FieldsValues: [],
                StageId: null,
                DueDate: null,
              },
            },
          }).then(
            ({
              data: {
                createContent: { result, obj: contentInstance },
              },
            }) => {
              if (result === 'true' && contentInstance) {
                const node = createBlankNode(contentInstance.Id, content.Id, infoToCreateChild);
                setCurrentVersion({
                  ...currentVersion,
                  nodes: {
                    ...currentVersion.nodes,
                    [node.id]: node,
                  },
                });
                selectModule(node);
              }
            }
          );
        }
      }
    ).then(() => {
      setInfoToCreateChild(undefined);
      setSuccessMessage('Node is created successfully');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    })
      .catch((error) => {
        setInfoToCreateChild(undefined);
        setErrorMessage(`${error}: Error creating node, please try again`);
        setSuccessMessage('');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }
  return (
    <>
      <StyledAddNewModule onClick={onClick}>
        <span>+</span>
      </StyledAddNewModule>
      {infoToCreateChild?.parentId && (
        <BackgroundStyle>
          <CreateFormStyle>
            <div className='header'>
              <h1>Create New Node</h1>
              <BsX onClick={() => setInfoToCreateChild(undefined)} className='closeIcon' />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='form-input-style'>
              <Label>Name</Label>
              <InputStyle
                type='text'
                required
                {...register('name')}
                placeholder='Name of node'
              />
              <Button type="submit">Create</Button>
            </form>
          </CreateFormStyle>
        </BackgroundStyle>
      )}
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
    </>
  );
};

export default AddNewModule;