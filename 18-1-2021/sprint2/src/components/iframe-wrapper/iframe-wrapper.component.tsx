import React, { PropsWithoutRef } from 'react';

const IframeWrapper = (props: PropsWithoutRef<any>): JSX.Element => {
  return <iframe src={props.src} style={{ height: '100%', width: '100%', margin: 0, padding: 0 }} />;
};

export default IframeWrapper;
