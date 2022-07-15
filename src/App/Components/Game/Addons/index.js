import React, { useState, useRef } from 'react';
import {Popover, Overlay} from "react-bootstrap";
//import {__, forceSatoshiFormat} from "../../../../Helper";
//import storage from "../../../../Storage";
  
function CreditRange(props) {
  const [show, setShow] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
//  const credit = stroage.getKey('credit');

  const handleClick = (event) => {
    event.preventDefault()
    setShow(!show);
  };

  const style = {
      borderColor: "transparent",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: '2px'
  }

  return (
    <div ref={containerRef} className="w-100">
      <button ref={triggerRef} onClick={handleClick} className={'btn bg-cs btn-lg shadow-none h-100 w-100'}><i className="mdi mdi-unfold-more-vertical"/></button>
      <Overlay
        show={show}
        target={triggerRef}
        placement="top"  
        container={containerRef}
        containerPadding={20}
        rootClose={true}
        onHide={handleClick}
      >
        <Popover id="popover-contained">
          <Popover.Content className="p-0">
            <div className="input-group" style={style}>
              <span className="input-group-prepend">
                <button type="button" className="btn btn-cs btn-xs shadow-none rounded-0" onClick={ e => props.min(e) }>MIN</button>
              </span>
              <span className="input-group-prepend">
                <button type="button" className="btn btn-cs btn-xs shadow-none rounded-0" onClick={ e => props.multi(e) }>X2</button>
              </span>
              <span className="input-group-prepend">
                <button type="button" className="btn btn-cs btn-xs shadow-none rounded-0" onClick={ e => props.devide(e) }>/2</button>
              </span>
              <span className="input-group-append">
                <button type="button" className="btn btn-cs btn-xs shadow-none rounded-0" onClick={ e => props.max(e) }>MAX</button>
              </span>
            </div>
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  );
}

export default CreditRange;