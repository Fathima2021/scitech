import styles from './evidence-items.module.css';
import React, { ReactElement, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsAlt,
  faBrush,
  faChevronDown,
  faPencilAlt,
  faTag,
  faTimes,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { CommentItem } from '..';
import { convertTelerikToHTML } from '../../utils/telerik-formatter.util';

export interface EvidenceItemProps {
  displayComments?: boolean;
  displayTags?: boolean;
  displayOptions?: boolean;
  fontSize?: number;
  handleDrag?: any;
  handleDrop?: any;
  id?: string;
  text?: string;
  reference?: string;
  onDelete?: any;
  onEdit?: any;
}

const EvidenceItem = (props: EvidenceItemProps): ReactElement => {
  const [itemState, setItemState] = useState({
    showCard: true,
  });
  const onSeeAlsoChange = () => {
    setItemState({ ...itemState, showCard: !itemState.showCard });
  };
  return (
    <div className={styles.evidence_item} draggable="true">
      <div className={styles.evidence_card}>
        <div className={styles.container} style={{ fontSize: props.fontSize }}>
          {props.displayOptions ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'space-between' }}>
              <p>
                <FontAwesomeIcon icon={faTrashAlt} className={styles.opt_icon} onClick={props?.onDelete} />
              </p>
              <p
                draggable="true"
                id={props?.id}
                onDragOver={(ev) => ev.preventDefault()}
                onDragStart={props?.handleDrag}
                onDrop={props?.handleDrop}
              >
                <FontAwesomeIcon icon={faArrowsAlt} className={styles.opt_icon} />
              </p>
            </div>
          ) : null}
          <div style={{ flex: 1 }}>
            <div className={styles.content}>
              {itemState.showCard ? (
                <div dangerouslySetInnerHTML={{ __html: convertTelerikToHTML(props?.text) }}></div>
              ) : (
                <span>
                  See alse <a className={styles.link}>{props?.reference}</a>
                </span>
              )}
            </div>
            {itemState.showCard ? <p className={styles.link}>{props.reference}</p> : ''}
          </div>
          {props.displayOptions ? (
            <div className={styles.options_rows}>
              <div>
                <FontAwesomeIcon icon={faBrush} className={styles.opt_icon} />
              </div>
              <div onClick={props?.onEdit}>
                <FontAwesomeIcon icon={faPencilAlt} className={styles.opt_icon} />
              </div>
              <div className={styles.form_field}>
                <input
                  type="checkbox"
                  name="showDetails"
                  checked={!itemState.showCard}
                  onChange={() => onSeeAlsoChange()}
                />
                <label style={{ marginLeft: 10 }} htmlFor="showDetails">
                  See also
                </label>
              </div>
            </div>
          ) : null}
        </div>
        {/* <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          {props.displayOptions ? (
            <div style={{ display: 'flex', gap: 20, flex: 1, alignItems: 'center', paddingLeft: 10 }}>
              <FontAwesomeIcon icon={faTrashAlt} className={styles.opt_icon} />
              <FontAwesomeIcon icon={faPencilAlt} className={styles.opt_icon} />
              <FontAwesomeIcon icon={faBrush} className={styles.opt_icon} />
              <div className={styles.form_field}>
                <input
                  type="checkbox"
                  name="showDetails"
                  checked={!itemState.showCard}
                  onClick={() => onSeeAlsoChange()}
                />
                <label style={{ marginLeft: 10 }} htmlFor="showDetails">
                  See also...
                </label>
              </div>
            </div>
          ) : null}
          <p className={styles.link}>{props?.reference}</p>
        </div> */}
      </div>
      {props.displayComments || props.displayTags ? (
        <>
          <div className={styles.evidence_details}>
            {props.displayTags ? (
              <div className={styles.tag_container}>
                <div className={styles.tags_list_container}>
                  <FontAwesomeIcon icon={faTag} />
                  <div>
                    <div className={styles.tags_list}>
                      {[1, 2, 3, 4, 5, 6].map((tag, idx) => (
                        <span key={idx.toString()} className={styles.tag_item}>
                          MSJ <FontAwesomeIcon icon={faTimes} />
                        </span>
                      ))}
                    </div>
                    <p className={styles.tag_note}>
                      <FontAwesomeIcon icon={faChevronDown} style={{ marginRight: 5 }} />
                      Add a tag and press <b>Enter</b> or select existing from dropdown
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {props.displayComments ? (
              <div className={styles.comments_container}>
                <CommentItem />
                <CommentItem comment="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, aliquam!" />
                <CommentItem comment="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, aliquam!" />
                <CommentItem comment="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem, aliquam!" />
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default EvidenceItem;
