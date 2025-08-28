import React from 'react';
import styles from './styles.less';
import { Modal, Button } from 'antd';
import { useIntl } from 'umi';

function Dialog({ visible, message, handleOk, handleCancel }) {
  const intl = useIntl();
  const { formatMessage } = intl;
  return (
    <Modal
      visible={visible} // Status: true - open; false - close
      closable={false} // Remove button x close at top-right position
      footer={null} // Remove footer
    >
      <div className={styles.dialogContainer}>
        <div className={styles.dialogDescription}>
          {/* Message of Dialog */}
          <p>{message}</p>
        </div>

        <div className={styles.btnGroup}>
          <Button
            onClick={() => handleCancel()} // Function When click Cancel Button
            className="btn btnWhite"
          >
            {formatMessage({ id: 'i18n_dialog_cancel_button' })}
          </Button>

          <Button
            onClick={() => handleOk()} // Function When click Ok Button
            className="btn btnGreen"
          >
            {formatMessage({ id: 'i18n_dialog_ok_button' })}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default Dialog;
