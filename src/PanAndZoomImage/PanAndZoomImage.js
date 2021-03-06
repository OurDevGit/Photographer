import React, { useEffect, useRef, useState } from 'react';
import './PanAndZoomImage.less';
import { Heart_Icon, Plus_Icon, Zoom_Icon, CloseIcon} from '../assets/icons'
const PanAndZoomImage = ({ src }) => {
  const [isPanning, setPanning] = useState(false);
  const [isKey, setKey] = useState(false);
  const [image, setImage] = useState();
  const [position, setPosition] = useState({
    oldX: 0,
    oldY: 0,
    x: 0,
    y: 0,
    z: 1,
  });

  const containerRef = useRef();

  const onLoad = (e) => {
    setImage({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
    setPosition({
      oldX: 0,
      oldY: 0,
      x: 0,
      y: 0,
      z: 1,
    })
  };

   const onMouseDown = (e) => {
    e.preventDefault();
    setPanning(true);
    setPosition({
      ...position,
      oldX: e.clientX,
      oldY: e.clientY
    });
  };

  const onWheel = (e) => {
    if (e.deltaY && isKey) {
      const sign = Math.sign(e.deltaY) / 10;
      const scale = 1 - sign;
      const rect = containerRef.current.getBoundingClientRect();

      setPosition({
        ...position,
        x: position.x * scale - (rect.width / 2 - e.clientX + rect.x) * sign,
        y: position.y * scale - (image.height * rect.width / image.width / 2 - e.clientY + rect.y) * sign,
        z: position.z * scale,
      });
    }
  };

  useEffect(() => {
    const mouseup = () => {
      setPanning(false);
    };

    const keydown = (e) => {
      if(e.keyCode === 16){
        setKey(true);
      }
    }

    const keyup = (e) => {
      if(e.keyCode === 16){
        setKey(false);
      }
    }
  

    const mousemove = (event) => {
      if (isPanning) {
        setPosition({
          ...position,
          x: position.x + event.clientX - position.oldX,
          y: position.y + event.clientY - position.oldY,
          oldX: event.clientX,
          oldY: event.clientY,
        });
      }
    };
    window.addEventListener('mouseup', mouseup);
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);

    return () => {
      window.removeEventListener('mouseup', mouseup);
      window.removeEventListener('mousemove', mousemove);
    };
  });
  return (
    <div
      className="PanAndZoomImage-container"
      ref={containerRef}
      tabIndex= "1"
      onMouseDown={onMouseDown}
      onWheel={onWheel}
      
    >
      <div
        
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${position.z})`,
        }}
      >
          <img
            className="PanAndZoomImage-image"
            alt="floorplan"
            src={src}
            onLoad={onLoad}
          />
        </div>
      </div>
  );
};

export default PanAndZoomImage;
