import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EvidenceTab, ProductParty } from '../..';
import { fetchEvidences } from '../../../store/actions/evidences.actions';
import styles from './card-evidence-pane.module.css';

export interface IColCardEvidencePaneProps {
  type?: string;
  displayComments?: boolean;
  displayOptions?: boolean;
  displayTags?: boolean;
  fontSize?: number;
}

const CardEvidencePane = (props: IColCardEvidencePaneProps): ReactElement => {
  const state: any = useSelector((state) => state);
  const dispatch = useDispatch();
  const [tabdata, setTabdata] = useState([] as any);

  useEffect(() => {
    if ((state?.claims?.categories || []).length) {
      const _data = state?.claims?.categories.map((el: any) => ({
        label: el.SectionName,
        code: el.ProductSubHeadId,
        evidences: [],
      }));
      setTabdata(_data);
    }
  }, [state?.claims?.categories]);

  useEffect(() => {
    if (state?.claims?.active?.elementId && state?.claims?.active?.accusedProductId) {
      dispatch(fetchEvidences({ type: 'INFRINGMENTS', categoryId: -1 }));
    }
  }, [state?.claims?.active?.elementId, state?.claims?.active?.accusedProductId]);

  useEffect(() => {
    if ((state?.claims?.infringments || []).length) {
      const result = state?.claims?.infringments.reduce(function (r: any, a: any) {
        r[a.EvidenceHead] = r[a.EvidenceHead] || [];
        r[a.EvidenceHead].push(a);
        return r;
      }, Object.create(null));
      const _data = JSON.parse(JSON.stringify(tabdata));
      for (const iterator of _data) {
        iterator.evidences = result[iterator.code];
      }
      setTabdata(_data);
    }
  }, [state?.claims?.infringments]);

  return (
    <div className={styles.evidence_pane}>
      <ProductParty />
      <hr style={{ margin: 5 }} />
      <div className={styles.evidence_list}>
        {tabdata.map((tab: any) => (
          <div key={tab?.code?.toString()}>
            <h6>{tab.label}</h6>
            <section className={styles.tab_pane}>
              <div className={styles.evidence_listing}>
                <EvidenceTab
                  data={tab.evidences || []}
                  displayComments={props.displayComments}
                  displayOptions={props.displayOptions}
                  displayTags={props.displayTags}
                  fontSize={props.fontSize}
                />
              </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardEvidencePane;
