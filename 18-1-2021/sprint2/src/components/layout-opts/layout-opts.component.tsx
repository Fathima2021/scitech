import styles from './layout-opts.module.css';
import { faColumns, faGripHorizontal, faList, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { EventsEnum } from '../../store/events';

const LayoutOps = (): ReactElement => {
  const dispatch = useDispatch();
  const onClickHandler = (layout: string) => {
    dispatch({ type: EventsEnum.UPDATE_LAYOUT, data: { layout } });
  };
  return (
    <div className={styles.layout}>
      <FontAwesomeIcon icon={faList} onClick={() => onClickHandler('list')} />
      <FontAwesomeIcon icon={faColumns} onClick={() => onClickHandler('column')} />
      <FontAwesomeIcon icon={faGripHorizontal} onClick={() => onClickHandler('card')} />
      <FontAwesomeIcon icon={faSearch} />
    </div>
  );
};

export default LayoutOps;
