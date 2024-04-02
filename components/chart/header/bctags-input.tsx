import { ReactNode } from 'react';
import RTagsInput from 'react-tagsinput';
import styled from 'styled-components';

export interface BCTagsInputProps {
  className?: string,
  value: string[],
  placeholder?: string,
  onChange: (newTags: string[]) => void,
  renderInput: () => ReactNode,
}

const BCTagsInputWrapper = styled.div`
  display: flex;
  align-items: center;
  height:50px;
`;

const StyledTagsInput = styled(RTagsInput)`
  margin-left: 8px;
`;

export const BCTagsInput = (props: BCTagsInputProps) => {
  return (
    <BCTagsInputWrapper className={props.className}>
      <StyledTagsInput
        value={props.value || []}
        onChange={props.onChange}
        inputProps={{ placeholder: props.placeholder }}
      />
      {props.renderInput()}

    </BCTagsInputWrapper>
  );
};

export default BCTagsInput;
