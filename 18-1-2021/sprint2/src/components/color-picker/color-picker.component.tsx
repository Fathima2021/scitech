import styles from './color-picker.module.css';
import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faEyeSlash, faMagic, faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ColorPickerProps {
  onColorSelected?: any;
  onColorClear?: any;
  onColorHide?: any;
  onClose?: any;
  onToolbarClicked?: any;
  isToolbarActive?: boolean;
}

const ColorPicker = (props: ColorPickerProps): ReactElement => {
  const { onColorSelected, onColorClear, onColorHide, onClose, onToolbarClicked, isToolbarActive } = props;
  const colors = [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
  ];

  return (
    <div className={styles.picker_component}>
      <div className={styles.colors_options}>
        <FontAwesomeIcon
          className={`${styles.option_icon} ${isToolbarActive ? styles.isActive : ''}`}
          icon={faMagic}
          onClick={onToolbarClicked}
        />
        <div className={styles.colors_grid}>
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => onColorSelected(color)}
              className={styles.color_item}
              style={{ background: color }}
            ></div>
          ))}
        </div>
        <FontAwesomeIcon onClick={onColorClear} className={styles.option_icon} icon={faEraser} />
        <FontAwesomeIcon onClick={onColorHide} className={styles.option_icon} icon={faEyeSlash} />
      </div>
      <div className={styles.close_icon}>
        <FontAwesomeIcon onClick={onClose} className={styles.option_icon} icon={faTimes} />
      </div>
    </div>
  );
};

export default ColorPicker;
