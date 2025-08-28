import React from 'react';
import styles from './styles.less';
import { Modal } from 'antd';

function ConfirmModal({
  visible,
  handleOk,
  handleCancel,
  title,
  description,
  action,
}) {
  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      closable={false}
      footer={null}
    >
      <div className={styles.modalDelete}>
        <div className={styles.modalDescription}>
          <p>{description}</p>
          <p>{title}</p>
        </div>

        <div className={styles.btnGroup}>{action}</div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
