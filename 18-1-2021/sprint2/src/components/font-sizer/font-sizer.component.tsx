import styles from './font-sizer.module.css';
import React, { ReactElement } from 'react';

interface FontProps {
  fontSize: number;
  onFontSizeUpdate?: any;
}

const FontSizer = (props: FontProps): ReactElement => {
  const { fontSize, onFontSizeUpdate } = props;
  const updateFontHandler = (op: string) => {
    if ((op === 'INC' && fontSize >= 24) || (op === 'DEC' && fontSize <= 14)) {
      return;
    }
    const _size = op === 'INC' ? fontSize + 1 : fontSize - 1;
    onFontSizeUpdate(_size);
  };
  return (
    <div className={styles.font_module}>
      <span onClick={() => updateFontHandler('DEC')}>-</span>
      <span>A</span>
      <span onClick={() => updateFontHandler('INC')}>+</span>
    </div>
  );
};

export default FontSizer;
