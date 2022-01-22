import styles from './placeholder-image.module.css';
import NODATA from '../../assets/images/nodata.svg';
import React, { ReactElement } from 'react';

export interface IPlaceholderImageProps {
  image?: any;
  text?: string;
}

const PlaceHolderImage = (props: IPlaceholderImageProps): ReactElement => {
  return (
    <div className={styles.placeholder_container}>
      <img src={props.image || NODATA} className={styles.placeholderImg} />
      <p className={styles.placeholderText}>{props.text || 'No Data Available'}</p>
    </div>
  );
};

export default PlaceHolderImage;
