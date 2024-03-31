import { ReactNode } from 'react';
import RTagsInput from 'react-tagsinput';

export interface BCTagsInputProps {
  className?: string,
  value: string[],
  placeholder?: string,
  onChange: (newTags: string[]) => void,
  renderInput: () => ReactNode,
}

export const BCTagsInput = (props: BCTagsInputProps) => {
  return (
    <RTagsInput value={props.value || []} className={"react-tagsinput-ta33 " + props.className} onChange={props.onChange} renderInput={props.renderInput}
      inputProps={{ placeholder: props.placeholder }} />
  );
};

export default BCTagsInput;
