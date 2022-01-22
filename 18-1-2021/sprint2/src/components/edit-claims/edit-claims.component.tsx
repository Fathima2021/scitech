import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { IClaim, IElement } from '../../store/store.interface';

export interface EditClaimsProps {
  show?: boolean;
  handleClose?: any;
}

const EditClaims = (props: EditClaimsProps): ReactElement => {
  const { show, handleClose } = props;
  const state = useSelector((state) => (state as any).claims);
  const [elementsState, setElementsState] = useState([] as IElement[]);
  const [selectedClaim, setselectedClaim] = useState({} as IClaim);
  useEffect(() => {
    setElementsState(state.elements);
  }, [state.elements]);

  useEffect(() => {
    if (state?.active?.claimId) {
      setselectedClaim((state.claims || []).find((el: IClaim) => el.ClaimId === state?.active?.claimId));
    }
  }, [state?.active?.claimId]);

  return (
    <Modal show={show} onHide={handleClose} fullscreen="lg-down" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <p>Edit Claims</p>
          <p style={{ fontSize: 16, margin: 0 }}>
            Evidence on split elements can be assigned to either or both newly created elements
          </p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '65vh', overflow: 'auto', padding: 20 }}>
        <ol>
          <li
            style={{
              padding: 10,
              background: 'var(--blue-10)',
              margin: 0,
              border: '2px solid var(--blue-50)',
              marginRight: 20,
              marginBottom: 10,
            }}
          >
            {selectedClaim.ClaimText}
          </li>
          <ol type="a" style={{ padding: 0 }}>
            {(elementsState || []).map((element: any) => (
              <li key={element.ElementId.toString()}>
                {/* <p style={{ margin: 0 }}>
                <b>{element.ElementId})</b>
              </p> */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <p
                    style={{
                      padding: 10,
                      background: 'var(--blue-10)',
                      margin: 0,
                      border: '2px solid var(--blue-50)',
                    }}
                  >
                    {element.ElementText}
                  </p>
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </li>
            ))}
            <li>
              <p
                style={{
                  padding: 10,
                  margin: 0,
                  border: '2px dashed var(--grey-50)',
                  marginRight: 20,
                  textAlign: 'center',
                }}
              >
                <FontAwesomeIcon icon={faPlusSquare} style={{ fontSize: 25 }} />
              </p>
            </li>
          </ol>
        </ol>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleClose}>
          Ok
        </Button>
        <Button variant="outline-primary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditClaims;
