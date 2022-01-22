import { faAngleDoubleLeft, faEllipsisH, faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement, useEffect, useState } from 'react';
import { ButtonGroup, Dropdown, Tab, Tabs, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityPane, CustomToggle, EvidenceTab, FontSizer, LayoutOps, ProductParty } from '../..';
import styles from './evidence-pane.module.css';
import CreateEvidence from '../../create-evidence/create-evidence.component';
import { fetchEvidences } from '../../../store/actions/evidences.actions';
import { EventsEnum } from '../../../store/events';
import { createCategory } from '../../../store/actions/cases.actions';

const EvidencePane = (): ReactElement => {
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
    activeTab: 'init_cont',
    type: 'INFRINGMENTS',
  });
  const state: any = useSelector((state) => state);
  const dispatch = useDispatch();
  const [addTab, setAddTab] = useState(false);

  const [tabdata, setTabdata] = useState([]);

  const [isAddEviOpen, setisAddEviOpen] = useState(false);

  useEffect(() => {
    if ((state?.claims?.categories || []).length) {
      const _data = state?.claims?.categories.map((el: any) => ({
        label: el.SectionName,
        code: el.ProductSubHeadId,
      }));
      setTabdata(() => {
        setPaneState({ ...paneState, activeTab: _data[0].code });
        setAddTab(false);
        return _data;
      });
    }
  }, [state?.claims?.categories]);

  useEffect(() => {
    if (
      state?.claims?.active?.categoryId &&
      state?.claims?.active?.elementId &&
      state?.claims?.active?.accusedProductId
    ) {
      dispatch(fetchEvidences({ type: paneState.type }));
    }
  }, [
    state?.claims?.active?.categoryId,
    state?.claims?.active?.elementId,
    state?.claims?.active?.accusedProductId,
    paneState.type,
  ]);

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

  const onCategoryChangeHandler = (categoryId: any) => {
    dispatch({ type: EventsEnum.UPDATE_SELECTED_CATEGORY, data: { categoryId: categoryId } });
    setPaneState({ ...paneState, activeTab: categoryId || state.claims?.active?.categoryId });
  };

  const onAddSectionHandler = (tabInput: string) => {
    if (!tabInput) {
      return;
    }
    dispatch(createCategory(tabInput));
  };
  return (
    <div className={styles.evidence_pane}>
      <div className={styles.top_section}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ButtonGroup style={{ gap: 20 }}>
            <Button
              className={styles.evidence_btn}
              onClick={() => setPaneState({ ...paneState, type: 'INFRINGMENTS' })}
            >
              Infringement
            </Button>
            <Button
              className={styles.evidence_btn}
              variant="outline-warning"
              onClick={() => setPaneState({ ...paneState, type: 'NON_INFRINGMENTS' })}
            >
              Non-Infringement
            </Button>
          </ButtonGroup>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-basic" data-toggle="dropdown">
              <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ cursor: 'pointer', marginRight: 5 }} />
              <span>Activity</span>
            </Dropdown.Toggle>
            <ActivityPane />
          </Dropdown>
        </div>
        <div className={styles.entity_select_container}>
          <ProductParty />
          <Dropdown style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
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
      <div className={styles.tab_section}>
        {/* {tabdata.length ? (
          <p className={styles.add_section} onClick={onAddSectionHandler}>
            <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: 5 }} />
            <span>Add new section</span>
          </p>
        ) : (
          ''
        )} */}
        <Tabs
          defaultActiveKey={state.claims?.active?.categoryId}
          activeKey={paneState.activeTab}
          onSelect={(k) => onCategoryChangeHandler(k)}
          transition={false}
          className={styles.evidence_tabs}
          style={{ fontSize: paneState.fontSize }}
        >
          {!addTab ? <Tab title={<FontAwesomeIcon icon={faPlusCircle} onClick={() => setAddTab(true)} />}></Tab> : ''}
          {tabdata.map((tab: any) => (
            <Tab key={tab.code} eventKey={tab.code} title={tab.label}>
              <section className={styles.tab_pane}>
                <div className={styles.evidence_listing}>
                  <div className={styles.pane_bar}>
                    <FontAwesomeIcon icon={faPlusCircle} onClick={() => setisAddEviOpen(true)} />
                    <LayoutOps />
                  </div>
                  <EvidenceTab
                    data={state?.claims?.infringments || []}
                    displayComments={paneState.displayComments}
                    displayOptions={paneState.displayOptions}
                    displayTags={paneState.displayTags}
                    fontSize={paneState.fontSize}
                    type={paneState.type}
                  />
                </div>
              </section>
            </Tab>
          ))}
          {addTab ? (
            <Tab title={<RenderTabInput onAdd={onAddSectionHandler} onClose={() => setAddTab(false)} />}></Tab>
          ) : (
            ''
          )}
        </Tabs>
        <CreateEvidence
          show={isAddEviOpen}
          handleClose={() => {
            setisAddEviOpen(false);
          }}
        />
      </div>
    </div>
  );
};

const RenderTabInput = (props: any) => {
  const [tabInput, settabInput] = useState('');
  return (
    <div className={styles.tab_input}>
      <input className={styles.input_fld} name="tabInput" onChange={(ev) => settabInput(ev.target.value)} />
      <FontAwesomeIcon className={styles.add_icon} icon={faPlusCircle} onClick={() => props.onAdd(tabInput)} />
      <FontAwesomeIcon className={styles.add_icon} icon={faTimesCircle} onClick={() => props.onClose()} />
    </div>
  );
};

export default EvidencePane;
