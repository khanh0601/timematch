import Footer from '@/components/Footer';
import { Collapse } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { history, useIntl } from 'umi';
import CalendarCreation from './CalendarCreation';
import styles from './styles.less';

function EventTemplate(props) {
  const { dispatch, eventStore, masterStore } = props;
  const {
    listEventLocation,
    listEventCategories,
    listEventBlockTime,
    listEventMoveTime,
    detailEventType,
  } = eventStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { Panel } = Collapse;
  const [activeSelection, setActiveSelection] = useState(1);
  const onSelectTemplte = value => {
    setActiveSelection(value);
  };
  const idEvent = parseInt(history.location.query.id);
  const relationshipType = Number(history.location.query.relationship_type);
  const edit = !!history.location.query.edit;
  const clone = !!history.location.query.clone;

  return (
    <div>
      <div className={styles.eventTemplate}>
        <div className={styles.templateIndex}>
          <div className={styles.headTitle}>
            <div className={styles.bolderIcon}></div>
            <div className={styles.titleIcon}></div>
            <span>１： 編集したい番号を選択してください。</span>
          </div>
          <div className={styles.listTemplate}>
            <div
              className={`${styles.selections} ${
                activeSelection === 1 ? styles.currentSelection : ''
              }`}
              onClick={() => onSelectTemplte(1)}
            >
              1
            </div>
            <div
              className={`${styles.selections} ${
                activeSelection === 2 ? styles.currentSelection : ''
              }`}
              onClick={() => onSelectTemplte(2)}
            >
              2
            </div>
            <div
              className={`${styles.selections} ${
                activeSelection === 3 ? styles.currentSelection : ''
              }`}
              onClick={() => onSelectTemplte(3)}
            >
              3
            </div>
          </div>
        </div>
        <div className={styles.templateContent}>
          <div className={styles.headTitle}>
            <div className={styles.bolderIcon}></div>
            <div className={styles.titleIcon}></div>
            <span>２：詳細設定の編集・リセットを下記よりお願い致します。</span>
          </div>
          <CalendarCreation
            onlyTemplate={true}
            active={activeSelection}
            idEventTemp={idEvent}
            relationshipTemp={relationshipType}
            editTemp={edit}
            cloneTemp={clone}
          />
        </div>
      </div>
      <div className={styles.wrapperFooter}>
        <Footer />
      </div>
    </div>
  );
}

export default connect(({ EVENT, MASTER }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
}))(EventTemplate);
