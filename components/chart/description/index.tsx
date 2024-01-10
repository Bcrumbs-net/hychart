import { Offcanvas } from 'react-bootstrap';
import { BsX } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { NodeType, UpdateURLWithNodeIDFunc } from '../types';

type DrawerProps = {
    module: NodeType;
    open: boolean;
    onClose: () => void;
    children: any;
    updateURLWithNodeID: UpdateURLWithNodeIDFunc;
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
      display: flex; 
      font-size: 30px;
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
    font-size: 18px;
    font-weight: bold; 
  }
  &.show {
    direction: rtl;
    transform: translateX(0);
    overflow-y: auto;
    max-height: 100%;
    padding-bottom: 10px;
  }
`;
const Drawer: React.FC<DrawerProps> = ({ open, onClose, module, children, updateURLWithNodeID }: DrawerProps) => {
    const drawerRef = useRef(null);
    const descriptionPanelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                open &&
                drawerRef.current &&
                !drawerRef.current.contains(event.target) &&
                !descriptionPanelRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, open]);

    return (
        <>
            <Offcanvas show={open} placement="end">
                <div ref={drawerRef}>
                    <StyledDrawer className={open ? 'show' : ''}>
                        <div className='header'>
                            <BsX onClick={onClose} className='closeIcon' />
                            <div className='title'>
                                <FaLink className="linkIcon" onClick={(e) => {
                                    updateURLWithNodeID(module?.id);
                                }} />
                                <h2 >{module?.title}</h2>
                            </div>
                        </div>
                        <h5 className='sub_title'>{module?.sub_title}</h5>
                        <Offcanvas.Body ref={descriptionPanelRef}>{children}</Offcanvas.Body>
                    </StyledDrawer>
                </div>
            </Offcanvas>
        </>
    );
};
export default Drawer;
