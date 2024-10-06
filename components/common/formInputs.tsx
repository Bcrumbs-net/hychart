import styled from "styled-components";

export const Label = styled.label`
  display: block;
  font-weight: bold;
  margin: 10px 0px;
  padding: 9px 4px 0px 5px;

`;
export const Input = styled.input`
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
export const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const CheckboxColumn = styled.div`
  flex-basis: 100%;
  @media (min-width: 992px) {
    flex-basis: 25%;
  }
`;

export const CheckboxLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 10px;
  justify-content: space-evenly;
`;

export const CheckboxInput = styled.input`
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
export const Select = styled.select`
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
export const TextArea = styled.textarea`
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