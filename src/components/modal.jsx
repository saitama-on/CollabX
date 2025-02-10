import { useState } from 'react';
import '../styles/modal.css';  

function InfoModal({ show, setShow, info }) {
  const handleClose = () => setShow(false);

  return (
    <>
 
      {show && (
        <div className="custom-modal-overlay" onClick={handleClose}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <button className="close-button" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className="custom-modal-body">
              <div  className="inside-modal-div">
                <span  className="span-text">Title of Project -- </span>{info['title of project']}
              </div>
              <div className="inside-modal-div">
                <span className="span-text">Area of Research -- </span>{info['Area of Research']}
              </div>
              <div className="inside-modal-div">
                <span className="span-text">Faculty -- </span>{info['Faculty']}
              </div>
              <div className="inside-modal-div">
                <span className="span-text">Group Members -- </span>{info['Group Members']}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InfoModal;
