import React, { useState } from 'react';
import styles from './styles.less';
import { Layout, Row, Col, Form, Input, Button, message, Modal } from 'antd';
import { useIntl } from 'umi';
import { connect } from 'dva';
import moment from 'moment';

function NoticeModal(props) {
  const { visible, content, title, onCancel } = props;
  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      onCancel={() => onCancel()}
    >
      <span>{content}</span>
    </Modal>
  );
}

export default connect(({ EVENT }) => ({
  eventStore: EVENT,
}))(NoticeModal);
