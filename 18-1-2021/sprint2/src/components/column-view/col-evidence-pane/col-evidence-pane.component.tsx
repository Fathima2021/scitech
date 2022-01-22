import { ReactElement, useEffect, useState } from 'react';
import { ButtonGroup, Tab, Tabs, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { EvidenceTab, ProductParty } from '../..';
import styles from './col-evidence-pane.module.css';
import { fetchEvidences } from '../../../store/actions/evidences.actions';

export interface IColEvidencePaneProps {
  type?: string;
  displayComments?: boolean;
  displayOptions?: boolean;
  displayTags?: boolean;
  fontSize?: number;
}

const ColEvidencePane = (props: IColEvidencePaneProps): ReactElement => {
  const [currentState, setCurrentState] = useState({
    activeTab: '',
    type: 'INFRINGMENTS',
  });
  const state: any = useSelector((state) => state);
  const dispatch = useDispatch();
  const [tabdata, setTabdata] = useState([]);

  useEffect(() => {
    if ((state?.claims?.categories || []).length) {
      const _data = state?.claims?.categories.map((el: any) => ({
        label: el.SectionName,
        code: el.ProductSubHeadId,
        evidences: [],
      }));
      setTabdata(() => {
        setCurrentState({ ...currentState, activeTab: _data[0].code });
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
      dispatch(fetchEvidences({ type: currentState.type, categoryId: currentState.activeTab }));
    }
  }, [
    currentState.activeTab,
    state?.claims?.active?.elementId,
    state?.claims?.active?.accusedProductId,
    currentState.type,
  ]);

  return (
    <div className={styles.evidence_pane}>
      <div className={styles.top_section}>
        <ProductParty />
        <hr style={{ margin: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ButtonGroup style={{ gap: 20 }}>
            <Button
              className={styles.evidence_btn}
              onClick={() => setCurrentState({ ...currentState, type: (props.type || '')?.toUpperCase() })}
            >
              {props.type}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className={styles.tab_section}>
        <Tabs
          defaultActiveKey={state.claims?.active?.categoryId}
          activeKey={currentState.activeTab}
          onSelect={(k) => setCurrentState({ ...currentState, activeTab: k || state.claims?.active?.categoryId })}
          transition={false}
          className={styles.evidence_tabs}
          style={{ fontSize: props.fontSize }}
        >
          {tabdata.map((tab: any) => (
            <Tab key={tab.code} eventKey={tab.code} title={tab.label}>
              <section className={styles.tab_pane}>
                <div className={styles.evidence_listing}>
                  <EvidenceTab
                    data={state?.claims?.infringments || []}
                    displayComments={props.displayComments}
                    displayOptions={props.displayOptions}
                    displayTags={props.displayTags}
                    fontSize={props.fontSize}
                  />
                </div>
              </section>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ColEvidencePane;
