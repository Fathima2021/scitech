import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CustomToggle } from '../../components';
import { fetchFigures } from '../../store/actions/cases.actions';
import { fetchPatents } from '../../store/actions/claims.actions';
import { EventsEnum } from '../../store/events';
import { IFigure, IPatent } from '../../store/store.interface';
import styles from './figures.module.css';

const toBase64 = (img: any) => {
  const arr = new Uint8Array(img.data);
  const _data = btoa(arr.reduce((data: any, byte: any) => data + String.fromCharCode(byte), ''));
  return `data:image/png;base64,${_data}`;
};

const FigureScreen = (): JSX.Element => {
  const { claims } = useSelector((state) => state as any);
  const dispatch = useDispatch();
  const [active, setactive] = useState({ patent: {} as IPatent });
  useEffect(() => {
    dispatch(fetchPatents());
  }, [claims?.caseInfo?.CaseId]);
  useEffect(() => {
    if (claims?.active?.patentId) {
      const _act = (claims.patents || []).find((pat: IPatent) => pat.PatentId === claims?.active?.patentId);
      setactive({
        ...active,
        patent: _act,
      });
      dispatch(fetchFigures());
    }
  }, [claims?.active?.patentId]);
  const onPatentSelected = (patent: IPatent): void => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_PATENT, data: { patentId: patent.PatentId } });
  };
  return (
    <div className={styles.fig_screen}>
      <div className={styles.case_section}>
        <Dropdown>
          <div className={styles.button_group} style={{ gap: 10 }}>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
              <div className={styles.case_select}>
                <FontAwesomeIcon icon={faSortDown} style={{ fontSize: 25, verticalAlign: 'middle' }} />
                <span style={{ padding: '5px 0px' }}>{active?.patent?.PatentNumber || 'NA'}</span>
              </div>
            </Dropdown.Toggle>
          </div>
          <Dropdown.Menu style={{ width: '18vw' }}>
            {(claims?.patents || []).map((pat: IPatent) => (
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
      </div>
      <div className={styles.figure_list}>
        {(claims?.figures || []).map((fig: IFigure) => (
          <FigureItem {...fig} key={fig?.FigureId?.toString()} />
        ))}
      </div>
    </div>
  );
};

const FigureItem = (props: IFigure): JSX.Element => {
  return (
    <div className={styles.figure_item}>
      <div className={styles.image_section}>
        <img className={styles.image} src={toBase64(props.Figure)} />
      </div>
      <div className={styles.data_section}>
        <h6>
          <b>{props.FigureHeading}</b>
        </h6>
        <p>{props.FigureText}</p>
      </div>
    </div>
  );
};

export default FigureScreen;
