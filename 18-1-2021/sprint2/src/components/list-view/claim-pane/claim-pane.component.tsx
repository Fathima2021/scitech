/* eslint-disable @typescript-eslint/no-unused-vars */
import { faBars, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AssertClaims, ClaimItem, ColorPicker, CustomToggle, FontSizer } from '../..';
import { fetchClaimsElements } from '../../../store/actions/claims.actions';
import { EventsEnum } from '../../../store/events';
import { IClaim, IElement } from '../../../store/store.interface';
import EditClaims from '../../edit-claims/edit-claims.component';
import styles from './claim-pane.module.css';

const ClaimPane = (): ReactElement => {
  const [paneState, setPaneState] = useState({
    color: '',
    isHidden: false,
    isCleared: false,
    showToolbar: false,
    isToolbarActive: false,
    fontSize: 16,
  });
  const [claimOption, setclaimOption] = useState({
    displayEdit: false,
    displayAsserted: false,
  });
  const [selectedClaim, setselectedClaim] = useState({} as IClaim);
  const state = useSelector((state) => (state as any).claims);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state?.active?.claimId) {
      setselectedClaim((state.claims || []).find((el: IClaim) => el.ClaimId === state?.active?.claimId));
      dispatch(fetchClaimsElements());
    }
  }, [state?.active?.claimId]);

  const colorPickerHandler = (action: string, color = '') => {
    switch (action) {
      case 'ACTIVATE':
        // eslint-disable-next-line no-case-declarations
        const _state = !paneState.isToolbarActive;
        setPaneState({ ...paneState, isToolbarActive: _state, color: _state ? color : '' });
        break;
      case 'SELECTED':
        if (paneState.isToolbarActive) {
          setPaneState({ ...paneState, color });
        }
        break;
      case 'HIDDEN':
        break;
      case 'CLEARED':
        setPaneState({ ...paneState, isCleared: true });
        break;
      default:
        break;
    }
  };

  const onClaimUpdated = (claim: IClaim) => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_CLAIM, data: { claimId: claim.ClaimId } });
  };
  const onElementSelected = (element: IElement) => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_ELEMENTS, data: { elementId: element.ElementId } });
  };

  return (
    <div className={styles.claim_pane}>
      <div className={styles.title_section}>
        <div className={styles.claim_name_section}>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" data-toggle="dropdown">
              <FontAwesomeIcon icon={faBars} style={{ color: 'var(--blue-100' }} />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '40vw', height: '40vw' }}>
              {(state.claims || []).map((claim: IClaim) => (
                <Dropdown.Item key={claim.ClaimId} onClick={() => onClaimUpdated(claim)} style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0 }} className={claim.ClaimId === state?.active?.claimId ? 'selected' : ''}>
                    <span className={styles.claim_list_item}>{claim.ClaimId}.</span> {claim.ClaimText}
                  </p>
                  <div className="line"></div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
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
        </div>
        {paneState.showToolbar ? (
          <div>
            <ColorPicker
              onColorSelected={(color: string) => colorPickerHandler('SELECTED', color)}
              onColorClear={() => colorPickerHandler('CLEARED')}
              onColorHide={() => colorPickerHandler('HIDDEN')}
              onClose={() => setPaneState({ ...paneState, showToolbar: false })}
              onToolbarClicked={() => colorPickerHandler('ACTIVATE')}
              isToolbarActive={paneState.isToolbarActive}
            />
          </div>
        ) : null}
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" data-toggle="dropdown">
            <FontAwesomeIcon icon={faEllipsisH} style={{ color: 'var(--blue-100' }} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setPaneState({ ...paneState, showToolbar: true })}>Show Tools</Dropdown.Item>
            <Dropdown.Item onClick={(e) => e.stopPropagation()}>
              <FontSizer
                fontSize={paneState.fontSize}
                onFontSizeUpdate={(fontSize: number) => {
                  setPaneState({ ...paneState, fontSize });
                }}
              />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setclaimOption({ ...claimOption, displayAsserted: true })}>
              Set Asserted Claim
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setclaimOption({ ...claimOption, displayEdit: true })}>
              Edit Claim Elements
            </Dropdown.Item>
            <Dropdown.Item>Edit Matrix</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <section className={styles.list_section} style={{ fontSize: paneState.fontSize }}>
        <ol type="1">
          <li>{selectedClaim?.ClaimText}</li>
          <ol type="a" className={styles.claim_pointers}>
            {(state.elements || []).map((el: IElement, idx: number) => (
              <ClaimItem
                key={el.ElementId.toString()}
                color={paneState.color}
                isCleared={paneState.isCleared}
                isSelected={el.ElementId === state?.active?.elementId}
                onClaimClick={() => onElementSelected(el)}
              >
                {el.ElementText}
              </ClaimItem>
            ))}
          </ol>
        </ol>
      </section>
      <AssertClaims
        show={claimOption.displayAsserted}
        handleClose={() => {
          setclaimOption({ ...claimOption, displayAsserted: false });
        }}
      />
      <EditClaims
        show={claimOption.displayEdit}
        handleClose={() => {
          setclaimOption({ ...claimOption, displayEdit: false });
        }}
      />
    </div>
  );
};

export default ClaimPane;
