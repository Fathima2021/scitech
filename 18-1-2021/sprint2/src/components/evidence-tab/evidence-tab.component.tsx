import styles from './evidence-tab.module.css';
import React, { ReactElement, useEffect, useState } from 'react';
import EvidenceItem from '../evidence-items/evidence-items.component';
import { ConfirmationPopup, EditEvidence, PlaceHolderImage } from '..';
import { useDispatch } from 'react-redux';
import { deleteEvidence } from '../../store/actions/evidences.actions';
import { IEvidence, IInfringement } from '../../store/store.interface';
export interface EvidenceTabProps {
  data?: any;
  displayComments?: boolean;
  displayOptions?: boolean;
  displayTags?: boolean;
  fontSize?: number;
  type?: string;
}
const EvidenceTab = (props: EvidenceTabProps): ReactElement => {
  const [dragId, setDragId] = useState('evi_1');
  const dispatch = useDispatch();
  const [isEditing, setisEditing] = useState({ state: false, evidence: {} as any, action: 'edit' });
  const [evidenceList, setEvidenceList] = useState(JSON.parse(JSON.stringify(props.data)));
  const handleDrag = (ev: any) => {
    setDragId(ev.currentTarget.id);
  };

  useEffect(() => {
    setEvidenceList(() => {
      if (props.data.length) {
        setDragId(props.data[0].EvidenceId);
      }
      return JSON.parse(JSON.stringify(props.data));
    });
  }, [props.data]);

  const handleDrop = (ev: any) => {
    const dragBox = evidenceList.find((evidence: any) => evidence.EvidenceId === +dragId);
    const dropBox = evidenceList.find((evidence: any) => evidence.EvidenceId === +ev.currentTarget.id);
    const dragBoxOrder = dragBox.EvidenceOrder;
    const dropBoxOrder = dropBox.EvidenceOrder;

    const newEvidenceState = evidenceList.map((evidence: any) => {
      if (evidence.EvidenceId === +dragId) {
        evidence.EvidenceOrder = dropBoxOrder;
      }
      if (evidence.EvidenceId === +ev.currentTarget.id) {
        evidence.EvidenceOrder = dragBoxOrder;
      }
      return evidence;
    });
    setEvidenceList(newEvidenceState);
  };

  const onDeleteHandler = (flag: boolean) => {
    if (flag) {
      dispatch(deleteEvidence({ type: props.type, id: isEditing.evidence.InfringementId }));
    }
    setisEditing({ state: false, evidence: {} as any, action: '' });
  };

  const onEditHandler = () => {
    //
  };

  return (
    <>
      {evidenceList.length ? (
        <>
          <div>
            {evidenceList
              .sort((a: any, b: any) => a.EvidenceOrder - b.EvidenceOrder)
              .map((entry: IInfringement, idx: number) => (
                <div key={idx.toString()}>
                  <EvidenceItem
                    displayComments={props.displayComments}
                    displayOptions={props.displayOptions}
                    displayTags={props.displayTags}
                    fontSize={props.fontSize}
                    handleDrag={handleDrag}
                    handleDrop={handleDrop}
                    id={entry.EvidenceId.toString()}
                    reference={entry?.Evidence?.EvidenceReference}
                    text={entry?.Evidence?.Evidence}
                    onDelete={() => setisEditing({ evidence: entry, state: true, action: 'delete' })}
                    onEdit={() => setisEditing({ evidence: entry.Evidence, state: true, action: 'edit' })}
                  ></EvidenceItem>
                </div>
              ))}
          </div>
        </>
      ) : (
        <PlaceHolderImage />
      )}
      <ConfirmationPopup
        show={isEditing.state && isEditing.action === 'delete'}
        title="Alert"
        message="Click confirm to proceed with deletion"
        onClick={(flag: boolean) => onDeleteHandler(flag)}
      />
      <EditEvidence
        evidence={isEditing.evidence}
        show={isEditing.state && isEditing.action === 'edit'}
        onClose={() => setisEditing({ evidence: {} as any, state: false, action: '' })}
        onChange={() => onEditHandler()}
      />
    </>
  );
};

export default EvidenceTab;
