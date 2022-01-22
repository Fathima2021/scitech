import { IClaim, IElement } from '../../store/store.interface';
import React, { ReactElement, useEffect, useState } from 'react';
import { Button, FormCheck, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export interface AssertClaimsProps {
  show?: boolean;
  handleClose?: any;
}

const AssertClaims = (props: AssertClaimsProps): ReactElement => {
  const { show, handleClose } = props;
  const state = useSelector((state) => (state as any).claims);
  const [claimsState, setClaimsState] = useState([] as IClaim[]);
  useEffect(() => {
    setClaimsState(state.claims);
  }, [state.claims]);
  return (
    <Modal show={show} onHide={handleClose} fullscreen="lg-down" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <p>Set Asserted Claims</p>
          <p style={{ fontSize: 16, margin: 0 }}>Deselecting a claim will not remove any evidence</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '65vh', overflow: 'auto' }}>
        {(claimsState || []).map((claim: any) => (
          <FormCheck style={{ display: 'flex', gap: 10 }} key={claim.ClaimId?.toString()}>
            <div style={{ minWidth: 30 }}>
              <FormCheck.Input
                type="checkbox"
                checked={claim.Asserted}
                onChange={() => {
                  console.log('Clicked');
                }}
              />
            </div>
            <FormCheck.Label style={{ display: 'flex', gap: 10, color: !claim.Asserted ? 'var(--grey-50)' : '' }}>
              <p>
                <b>{claim.ClaimId}.</b>
              </p>
              <p>{claim.ClaimText}</p>
            </FormCheck.Label>
          </FormCheck>
        ))}
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

export default AssertClaims;
