import React from 'react';
import { Tooltip } from 'antd';
import helperImage from '@/assets/images/imgQuestion.png';
import styles from '../../advanced_styles.less';

export default function Label({ label, tooltip }) {
  return (
    <div className={styles.titleField}>
      <div className={styles.titleFieldIcon}></div>
      <p>{label}</p>
      <Tooltip title={tooltip} overlayClassName={styles.tooltipAdvanced}>
        <div className={styles.helper}>
          <img src={helperImage} className="helper" />
        </div>
      </Tooltip>
    </div>
  );
}
