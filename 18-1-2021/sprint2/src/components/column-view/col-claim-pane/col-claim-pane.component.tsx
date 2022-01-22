import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ClaimItem } from '../..';
import { fetchClaimsElements } from '../../../store/actions/claims.actions';
import { EventsEnum } from '../../../store/events';
import { IClaim, IElement } from '../../../store/store.interface';
import styles from './col-claim-pane.module.css';

const ColClaimPane = (): ReactElement => {
  const [paneState, setPaneState] = useState({
    color: '',
    isHidden: false,
    isCleared: false,
    showToolbar: false,
    isToolbarActive: false,
    fontSize: 16,
  });
  const [selectedElement, setselectedElement] = useState({} as IElement);
  const state = useSelector((state) => (state as any).claims);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state?.active?.claimId) {
      dispatch(fetchClaimsElements());
    }
  }, [state?.active?.claimId]);

  useEffect(() => {
    if (state?.active?.elementId) {
      const idx = (state.elements || []).findIndex((el: IElement) => el.ElementId === state?.active?.elementId);
      if (idx >= 0) {
        setselectedElement({
          ...state.elements[idx],
          idx,
        });
      }
    }
  }, [state?.active?.elementId]);

  const onClaimUpdated = (claim: IClaim) => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_CLAIM, data: { claimId: claim.ClaimId } });
  };
  const onElementSelected = (element: IElement) => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_ELEMENTS, data: { elementId: element.ElementId } });
  };

  const onNext = () => {
    // const next =
    if (state.elements.length > selectedElement.idx + 1) {
      const idx = (state.elements || []).findIndex((el: IElement) => el.ElementId === state?.active?.elementId);
      if (idx >= 0) {
        setselectedElement({
          ...state.elements[idx + 1],
          idx: idx + 1,
        });
        dispatch({ type: EventsEnum.UPDATE_SELECTED_ELEMENTS, data: { elementId: state.elements[idx + 1].ElementId } });
      }
    }
  };

  const onPrev = () => {
    if (selectedElement.idx > 0) {
      const idx = (state.elements || []).findIndex((el: IElement) => el.ElementId === state?.active?.elementId);
      if (idx >= 0) {
        setselectedElement({
          ...state.elements[idx - 1],
          idx: idx - 1,
        });
        dispatch({ type: EventsEnum.UPDATE_SELECTED_ELEMENTS, data: { elementId: state.elements[idx - 1].ElementId } });
      }
    }
  };

  return (
    <div className={styles.claim_pane}>
      <div className={styles.claim_section}>
        <div className={styles.claim_name_section}>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" data-toggle="dropdown" className={styles.claim_select}>
              <span style={{ padding: '5px 0px' }}>
                {state?.active?.claimId ? 'Claim ' + state?.active?.claimId : 'NA'}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '24vw' }}>
              {(state.claims || []).map((claim: IClaim) => (
                <Dropdown.Item
                  key={claim.ClaimId}
                  onClick={() => onClaimUpdated(claim)}
                  className={claim.ClaimId === state?.active?.claimId ? 'selected' : ''}
                >
                  Claim {claim.ClaimId}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <div style={{ display: 'flex', gap: 5 }}>
            <FontAwesomeIcon icon={faCaretSquareLeft} style={{ fontSize: 24 }} onClick={() => onPrev()} />
            <FontAwesomeIcon icon={faCaretSquareRight} style={{ fontSize: 24 }} onClick={() => onNext()} />
          </div>
        </div>
        <section className={styles.list_section} style={{ fontSize: paneState.fontSize }}>
          <ol type="a">
            <ClaimItem
              key={selectedElement.ElementId?.toString()}
              color={paneState.color}
              isCleared={paneState.isCleared}
              onClaimClick={() => onElementSelected(selectedElement)}
            >
              {selectedElement?.ElementText}
            </ClaimItem>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default ColClaimPane;
