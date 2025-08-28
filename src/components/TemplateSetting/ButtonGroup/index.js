import React from 'react';
import styles from '../basic_styles.less';
import { useIntl } from 'umi';
import { Button, Row, Col } from 'antd';

function ButtonGroup(props) {
  const intl = useIntl();
  const { formatMessage } = intl;

  const {
    setAdvancedStatus,
    updateEventType,
    createEventType,
    loadingSubmit,
    editStatus,
    cancelUpdateEventType,
  } = props;

  return (
    <div className={styles.createEventButtonGroup}>
      <div className={styles.editDetail}>
        <Button
          className={styles.editDetailButton}
          onClick={() => setAdvancedStatus(true)}
        >
          + {formatMessage({ id: 'i18n_advanced_setting' })}
        </Button>
      </div>
      <div className={styles.buttonZone}>
        <Row>
          <Col span={8} className={styles.previewBtnZone}>
            <Button className={styles.previewButton}>
              {formatMessage({ id: 'i18n_preview' })}
            </Button>
          </Col>
          <Col span={16}>
            <Button
              className={styles.cancelButton}
              onClick={() => cancelUpdateEventType()}
            >
              {formatMessage({ id: 'i18n_return' })}
            </Button>
            {editStatus ? (
              <Button
                className={styles.submitButton}
                onClick={() => updateEventType()}
                loading={loadingSubmit}
              >
                {formatMessage({ id: 'i18n_update' })}
              </Button>
            ) : (
              <Button
                className={styles.submitButton}
                onClick={() => createEventType()}
                loading={loadingSubmit}
              >
                {formatMessage({ id: 'i18n_create' })}
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ButtonGroup;
