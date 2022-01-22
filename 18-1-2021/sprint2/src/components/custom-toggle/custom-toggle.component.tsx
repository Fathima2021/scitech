import React from 'react';
const CustomToggle = React.forwardRef((props: any, ref: any) => (
  <a
    style={{ cursor: 'pointer' }}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      if (props) {
        props.onClick(e);
      }
    }}
  >
    {props?.children}
  </a>
));

export default CustomToggle;
