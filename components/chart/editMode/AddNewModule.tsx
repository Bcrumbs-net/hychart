import React from 'react';
import styled from 'styled-components';

interface AddNewModuleProps {
  onClick?: () => void;
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

const AddNewModule: React.FC<AddNewModuleProps> = ({ onClick }) => {
  return (
    <StyledAddNewModule onClick={onClick}>
      <span>+</span>
    </StyledAddNewModule>
  );
};

export default AddNewModule;