import React from 'react';
import styles from '../basic_styles.less';
import { useIntl } from 'umi';
import { Button } from 'antd';

function ButtonGroup(props) {
  const intl = useIntl();
  const { formatMessage } = intl;

  const {
    created,
    disabledSubmit,
    onSave,
    onCancel,
    showPreview,
    showAdvancedSetting,
    refBtn,
  } = props;

  return (
    <div className={styles.createEventButtonGroup}>
      <div className={styles.editDetail}>
        <Button
          className={styles.editDetailButton}
          onClick={showAdvancedSetting}
        >
          + {formatMessage({ id: 'i18n_advanced_setting' })}
        </Button>
      </div>

      <div className={styles.buttonZone} ref={refBtn}>
        <div className={styles.previewBtnZone}>
          <Button className={styles.previewButton} onClick={showPreview}>
            {formatMessage({ id: 'i18n_preview' })}
          </Button>
        </div>
        <div className={styles.btnGroup}>
          <Button onClick={onCancel}>
            {formatMessage({ id: 'i18n_return' })}
          </Button>
          <Button
            className={`${!disabledSubmit && styles.disabledBtnSave}`}
            onClick={onSave}
          >
            {formatMessage({ id: created ? 'i18n_update' : 'i18n_create' })}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ButtonGroup;
