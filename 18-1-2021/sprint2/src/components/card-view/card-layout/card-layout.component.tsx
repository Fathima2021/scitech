import styles from './card-layout.module.css';
import { faAngleDoubleLeft, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ActivityPane, CustomToggle, FontSizer, LayoutOps } from '../..';
import ColClaimPane from '../../column-view/col-claim-pane/col-claim-pane.component';
import CardEvidenceLayout from '../card-evidence-layout/card-evidence-pane.component';

const CardLayout = (): ReactElement => {
  const [paneState, setPaneState] = useState({
    color: '',
    isHidden: false,
    isCleared: false,
    showToolbar: false,
    isToolbarActive: false,
    fontSize: 16,
    displayOptions: false,
    displayComments: false,
    displayTags: false,
    displayAll: false,
    isAddEviOpen: false,
  });

  const onOptionsHandler = (option: string) => {
    let value = false;
    let allValue = false;
    switch (option) {
      case 'set_options':
        value = !paneState.displayOptions;
        if (!value) {
          allValue = false;
        }
        setPaneState({ ...paneState, displayOptions: value, displayAll: allValue });
        break;
      case 'set_comments':
        value = !paneState.displayComments;
        if (!value) {
          allValue = false;
        }
        setPaneState({ ...paneState, displayComments: value, displayAll: allValue });
        break;
      case 'set_tags':
        value = !paneState.displayTags;
        if (!value) {
          allValue = false;
        }
        setPaneState({ ...paneState, displayTags: value, displayAll: allValue });
        break;
      case 'set_all':
        value = !paneState.displayAll;
        setPaneState({
          ...paneState,
          displayTags: value,
          displayComments: value,
          displayOptions: value,
          displayAll: value,
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className={styles.claim_screen}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" data-toggle="dropdown">
            <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ cursor: 'pointer', marginRight: 5 }} />
            <span>Activity</span>
          </Dropdown.Toggle>
          <ActivityPane />
        </Dropdown>
      </div>
      <section className={styles.claim_pane}>
        <ColClaimPane />
      </section>
      <div>
        <div className={styles.layout}>
          <LayoutOps />
          <Dropdown style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" data-toggle="dropdown">
              <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: 16, cursor: 'pointer' }} />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '10vw' }}>
              <Dropdown.Item onClick={() => onOptionsHandler('set_options')}>
                {!paneState.displayOptions ? 'Show' : 'Hide'} Tools
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onOptionsHandler('set_comments')}>
                {!paneState.displayComments ? 'Show' : 'Hide'} Information
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onOptionsHandler('set_tags')}>
                {!paneState.displayTags ? 'Show' : 'Hide'} Tags
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onOptionsHandler('set_all')}>
                {!paneState.displayAll ? 'Show' : 'Hide'} All
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => e.stopPropagation()}>
                <FontSizer
                  fontSize={paneState.fontSize}
                  onFontSizeUpdate={(fontSize: number) => {
                    setPaneState({ ...paneState, fontSize });
                  }}
                />
              </Dropdown.Item>
              <Dropdown.Item>Save Layout</Dropdown.Item>
              <Dropdown.Item>History</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className={styles.evidence_columns}>
        <CardEvidenceLayout
          fontSize={paneState.fontSize}
          displayComments={paneState.displayComments}
          displayOptions={paneState.displayOptions}
          displayTags={paneState.displayTags}
        />
      </div>
    </div>
  );
};

export default CardLayout;
