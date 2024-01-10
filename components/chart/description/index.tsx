import { Offcanvas } from 'react-bootstrap';
import { BsX } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { stringify, parse } from 'query-string';
import styled from 'styled-components';
import { NodeType } from '../types';

type DrawerProps = {
    module: NodeType;
    open: boolean;
    onClose: () => void;
    children: any;
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

const Drawer: React.FC<PropsWithChildren<DrawerProps>> = ({ open, onClose, module, children }: DrawerProps) => {
    const drawerRef = useRef(null);
    const descriptionPanelRef = useRef(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
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

    const copyURLWithNodeID = (nodeID: number | null) => {
        const queryParams = parse(window.location.search);
        queryParams['n'] = nodeID !== null ? String(nodeID) : '';
        const newQueryString = stringify(queryParams);
        const newURL = `${window.location.origin}${window.location.pathname}?${newQueryString}`;
        navigator.clipboard.writeText(newURL)
            .then(() => {
                setSuccessMessage('URL copied successfully!');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            })
            .catch((error) => {
                console.error('Fai,errorled to save the share URL in clipboard:', error);
                setErrorMessage('Failed to save the share URL in clipboard:' + '<' + error + '>');
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
            });
    };

    return (
        <>
            <Offcanvas show={open} placement="end">
                <div ref={drawerRef}>
                    <StyledDrawer className={open ? 'show' : ''}>
                        <div className='header'>
                            <BsX onClick={onClose} className='closeIcon' />
                            <div className='title'>
                                <FaLink className="linkIcon" onClick={(e) => {
                                    copyURLWithNodeID(module?.id);
                                }} />
                                <h2 >{module?.title}</h2>
                            </div>
                        </div>
                        <h5 className='sub_title'>{module?.sub_title}</h5>
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
export default Drawer;
