import React, { ReactElement, useRef } from 'react';
import styles from './claim-item.module.css';

export interface ClaimItemProps {
  color?: string;
  children?: any;
  isCleared?: boolean;
  isHidden?: boolean;
  isSelected?: boolean;
  onClaimClick?: any;
}

const ClaimItem = (props: ClaimItemProps): ReactElement => {
  const { color = 'red', children, isCleared, isHidden, isSelected, onClaimClick } = props;
  const ref = useRef(null as any);
  if (isCleared && ref) {
    ref.current.innerHTML = children;
  } else if (isHidden) {
    ref.current.innerHTML = children;
  }
  const highlightHandler = () => {
    const nodeData = document.getSelection();
    const selected = nodeData?.toString();
    if (ref) {
      const _innerHtmlStr = ref?.current.innerHTML.replace(/(<([^>]+)>)/gi, '');
      ref.current.innerHTML = _innerHtmlStr.replace(selected, `<span style="background:red">${selected}</span>`);
    }
  };
  return (
    <li onClick={onClaimClick} className={`${styles.claim_item} ${isSelected ? styles.active_claim : ''}`}>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: children }} onMouseUp={() => highlightHandler()}></div>
    </li>
  );
};

export default ClaimItem;
