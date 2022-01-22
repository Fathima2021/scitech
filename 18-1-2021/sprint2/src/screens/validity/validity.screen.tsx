import { faFilePdf, faLandmark, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useEffect, useState } from 'react';
import { Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CardLayout, ColumnLayout, CustomToggle, ListLayout } from '../../components';
import { fetchClaims, fetchParties, fetchPatents } from '../../store/actions/claims.actions';
import { EventsEnum } from '../../store/events';
import { IPatent } from '../../store/store.interface';
import styles from './validity.module.css';

const ValidityScreen = (): ReactElement => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state as any);
  const [active, setactive] = useState({ patent: {} as IPatent });
  useEffect(() => {
    dispatch(fetchPatents());
    dispatch(fetchParties());
  }, [state.claims?.caseInfo?.CaseId]);
  useEffect(() => {
    if (state?.claims?.active?.patentId) {
      const _act = (state.claims.patents || []).find(
        (pat: IPatent) => pat.PatentId === state?.claims?.active?.patentId,
      );
      setactive({
        ...active,
        patent: _act,
      });
      dispatch(fetchClaims());
    }
  }, [state?.claims?.active?.patentId]);

  const onPatentSelected = (patent: IPatent): void => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_PATENT, data: { patentId: patent.PatentId } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <section className={styles.case_section}>
        <Dropdown>
          <div className={styles.button_group} style={{ gap: 10 }}>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
              <div className={styles.case_select}>
                <FontAwesomeIcon icon={faSortDown} style={{ fontSize: 25, verticalAlign: 'middle' }} />
                <span style={{ padding: '5px 0px' }}>{active?.patent?.PatentNumber || 'NA'}</span>
              </div>
            </Dropdown.Toggle>
            <FontAwesomeIcon icon={faFilePdf} style={{ color: 'var(--blue-100' }} />
          </div>
          <Dropdown.Menu style={{ width: '18vw' }}>
            {(state?.claims?.patents || []).map((pat: IPatent) => (
              <Dropdown.Item
                key={pat?.PatentNumber}
                className={pat.PatentNumber === active?.patent?.PatentNumber ? 'selected' : ''}
                onClick={() => onPatentSelected(pat)}
              >
                {pat?.PatentNumber}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <ButtonGroup className={styles.button_group}>
          <Button>Build Docs</Button>
          <Button>
            <FontAwesomeIcon icon={faLandmark} style={{ marginRight: 5 }} />
            Library
          </Button>
        </ButtonGroup>
      </section>
      <section>
        {state?.ui?.layout === 'card' ? (
          <CardLayout />
        ) : state?.ui?.layout === 'column' ? (
          <ColumnLayout />
        ) : (
          <ListLayout />
        )}
      </section>
    </div>
  );
};

export default ValidityScreen;
