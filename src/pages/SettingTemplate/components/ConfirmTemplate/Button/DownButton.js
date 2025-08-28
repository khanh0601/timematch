import React from 'react';
import styles from '../index.less';
import DownIcon from '@/assets/images/down_btn.svg';

function DownButton() {
  return (
    <div className={styles.circleBlue}>
      <img src={DownIcon} />
      {/*<svg*/}
      {/*  width="5"*/}
      {/*  height="9"*/}
      {/*  viewBox="0 0 5 9"*/}
      {/*  fill="none"*/}
      {/*  xmlns="http://www.w3.org/2000/svg"*/}
      {/*>*/}
      {/*  <path*/}
      {/*    d="M1.90332 0.128906V7.08984L1.20605 6.38086H0.344727L2.28418 8.25H2.30762L4.25293 6.38086H3.3916L2.68262 7.10156V0.128906H1.90332Z"*/}
      {/*    fill="white"*/}
      {/*  />*/}
      {/*</svg>*/}
    </div>
  );
}

export default DownButton;
