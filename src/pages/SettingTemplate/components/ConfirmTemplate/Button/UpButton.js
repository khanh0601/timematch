import React from 'react';
import styles from '../index.less';
import UpIcon from '@/assets/images/up_btn.svg';

function UpButton() {
  return (
    <div className={styles.circleBlue}>
      <img src={UpIcon} />
      {/*<svg*/}
      {/*  width="5"*/}
      {/*  height="9"*/}
      {/*  viewBox="0 0 5 9"*/}
      {/*  fill="none"*/}
      {/*  xmlns="http://www.w3.org/2000/svg"*/}
      {/*>*/}
      {/*  <path*/}
      {/*    d="M2.01184 8.75068V1.57743L1.29331 2.30804H0.405713L2.40432 0.381892H2.42847L4.43312 2.30804H3.54552L2.81491 1.56536V8.75068H2.01184Z"*/}
      {/*    fill="white"*/}
      {/*  />*/}
      {/*</svg>*/}
    </div>
  );
}

export default UpButton;
