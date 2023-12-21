import { Offcanvas } from 'react-bootstrap';
import { BsX } from "react-icons/bs";
import React, { useEffect, useRef } from 'react';

type DrawerProps = {
    title: React.ReactNode;
    open: boolean;
    onClose: () => void
};

const Drawer: React.FC<DrawerProps> = ({ open, onClose, title, children }) => {
    return (
        <>
            <Offcanvas
                show={open}
                placement="end"
            >
                <div className='header' >
                    <BsX onClick={onClose} className='closeIcon' />
                    <h2 className='title'>{title}</h2>
                </div>
                <Offcanvas.Body>{children}</Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Drawer;
