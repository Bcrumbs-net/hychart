import styled from "styled-components";

export const StyledDrawer = styled.div`
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
  direction: ${({ lang }) =>
        lang === null || lang === 'en' ? 'ltr' : 'rtl'};

  .header {
    display: flex;
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
          margin-left: ${({ lang }) => (lang === null || lang === 'en' ? '20px' : '0')};
          margin-right: ${({ lang }) => (lang === null || lang === 'en' ? '0' : '10px')};
      }
    .closeIcon {
      width: 40px;
      height: 40px;
      cursor: pointer;
     }
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
    direction: ${({ lang }) =>
        lang === null || lang === 'en' ? 'ltr' : 'rtl'};
    transform: translateX(0);
    overflow-y: auto;
    max-height: 100%;
    padding-bottom: 10px;
  }
`;