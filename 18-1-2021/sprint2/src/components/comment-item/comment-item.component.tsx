import styles from './comment-item.module.css';
import React, { ReactElement, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

export interface CommentItemProps {
  comment?: string;
  user?: any;
  updatedTime?: Date;
}

const CommentItem = (props: CommentItemProps): ReactElement => {
  const [commentState, setCommentState] = useState({
    isEditable: props?.comment ? false : true,
    comment: props?.comment || '',
  });
  const onDeleteHandler = () => {
    //
  };
  const onSaveHandler = () => {
    if (!commentState.comment) {
      return;
    }
    setCommentState({ ...commentState, isEditable: false });
  };
  return (
    <div>
      <div className={styles.comment_user_section}>
        <div className={styles.user_icon}>{'US'}</div>
        <textarea
          className={`${styles.comment_box} ${!commentState.isEditable ? styles.readonly_text : ''}`}
          value={commentState.comment}
          readOnly={!commentState.isEditable}
          onChange={(ev) => setCommentState({ ...commentState, comment: ev.target.value })}
        ></textarea>
      </div>
      <div className={styles.options}>
        {!commentState.isEditable ? (
          <span onClick={() => setCommentState({ ...commentState, isEditable: true })}>Edit</span>
        ) : null}
        {commentState.isEditable ? <span onClick={() => onSaveHandler()}>Save</span> : null}
        {!commentState.isEditable ? (
          <>
            <span className={styles.dot_icon}>
              <FontAwesomeIcon icon={faCircle} />
            </span>
            <span onClick={() => onDeleteHandler()}>Delete</span>
            <span className={styles.dot_icon}>
              <FontAwesomeIcon icon={faCircle} />
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CommentItem;
