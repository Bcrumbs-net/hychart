import { Offcanvas } from 'react-bootstrap';
import { BsX } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { stringify, parse } from 'query-string';
import { NodeType } from '../types';
import { SuccessToast, ToastMessage, ErrorToast } from '../../common/toasts';
import { StyledDrawer } from '../../common/drawer';

type DrawerProps = {
  module: NodeType;
  open: boolean;
  onClose: () => void;
  lang: string;
};

const Drawer: React.FC<PropsWithChildren<DrawerProps>> = ({ open, lang, onClose, module, children }) => {
  const tags = module?.tags?.split(",");
  const drawerRef = useRef(null);
  const descriptionPanelRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
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
          <StyledDrawer lang={lang} className={open ? 'show' : ''}>
            <div className='header'>
              <div className='title'>
                <h1 >{module?.title}</h1>
                <FaLink className="linkIcon" onClick={(e) => {
                  copyURLWithNodeID(module?.id);
                }} />
                <BsX onClick={onClose} className='closeIcon' />

              </div>
            </div>
            <h2 className='sub_title'>{module?.city} {module?.sub_title}</h2>
            <div className='tags'>
              {tags?.map((item) => {
                return (
                  <h3 className='tagsItem' key={item}>{item}</h3>
                )
              })}
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
export default Drawer;
