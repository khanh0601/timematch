import React from 'react';

function TooltipFormat({ dataFormat }) {
  return (
    <div className="tooltipFormat">
      {dataFormat.map((item, index) => {
        if (item) {
          return <p key={index}>{item}</p>;
        }
        if (!item) {
          return <br />;
        }
      })}
    </div>
  );
}
export default TooltipFormat;
