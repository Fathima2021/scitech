import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement, useCallback, useRef, useState } from 'react';

interface ResizeableProps {
  children: any;
}

const Resizeable = (props: ResizeableProps): ReactElement => {
  const [size, setSize] = useState({ x: 400, y: 300 });
  const ref = useRef(null);

  const handler = useCallback(() => {
    function onMouseMove(e: any) {
      setSize((currentSize) => ({
        x: currentSize.x + e.movementX,
        y: currentSize.y + e.movementY,
      }));
    }
    function onMouseUp() {
      (ref as any).current.removeEventListener('mousemove', onMouseMove);
      (ref as any).current.removeEventListener('mouseup', onMouseUp);
    }
    (ref as any).current.addEventListener('mousemove', onMouseMove);
    (ref as any).current.addEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <div
      style={{
        background: 'red',
        height: size.y,
        width: size.x,
        position: 'relative',
      }}
    >
      <div ref={ref} onMouseDown={handler} style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
      {props.children}
    </div>
  );
};

export default Resizeable;
