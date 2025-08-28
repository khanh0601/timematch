import React from 'react';
import styles from '../index.less';
import TrashIcon from '@/assets/images/trash.png';

function DeleteButton() {
  return (
    <div className={styles.circleRed}>
      <img src={TrashIcon} />
    </div>
  );
}

export default DeleteButton;
