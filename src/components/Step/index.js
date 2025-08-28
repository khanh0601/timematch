import React from 'react';
import styles from './styles.less';
import { useIntl } from 'umi';

function Step(props) {
  const intl = useIntl();
  return (
    <div>
      <div className={styles.step}>
        <div className={styles.stepItem}>
          <div
            className={`${styles.stepNumber} ${props.step == 1 &&
              styles.stepActive}`}
          >
            1
          </div>
          <div className={styles.stepTitle}>
            {intl.formatMessage({ id: 'i18n_url_step_1' })}
          </div>
        </div>
        <div className={styles.stepItem}>
          <div className={styles.stepContent}>
            <div
              className={`${styles.stepNumber} ${props.step == 2 &&
                styles.stepActive}`}
            >
              2
            </div>
          </div>
          <div className={styles.stepTitle}>
            {intl.formatMessage({ id: 'i18n_url_step_2' })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step;
