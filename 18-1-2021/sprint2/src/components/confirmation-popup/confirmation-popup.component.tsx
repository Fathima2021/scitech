import React from 'react';
import { Button, Modal } from 'react-bootstrap';
export interface ConfirmationPopupProps {
  message: string;
  title: string;
  onClick: any;
  show: boolean;
}
const ConfirmationPopup = (props: ConfirmationPopupProps): JSX.Element => {
  const { message, title, onClick, show } = props;
  return (
    <Modal show={show} onHide={() => onClick(false)} enforceFocus={false} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onClick(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onClick(true)}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationPopup;
