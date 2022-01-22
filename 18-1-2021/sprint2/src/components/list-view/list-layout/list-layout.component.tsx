import React, { ReactElement } from 'react';
import ClaimPane from '../claim-pane/claim-pane.component';
import EvidencePane from '../evidence-pane/evidence-pane.component';

import styles from './list-layout.module.css';

const ListLayout = (): ReactElement => {
  return (
    <div className={styles.claim_screen}>
      <section className={styles.claim_pane}>
        <ClaimPane />
      </section>
      <section className={styles.evidence_pane}>
        <EvidencePane />
      </section>
    </div>
  );
};

export default ListLayout;
