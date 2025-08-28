import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, DatePicker, message } from 'antd';
import { useDispatch, useIntl } from 'umi';
import { connect } from 'dva';
import moment from 'moment';

const { RangePicker } = DatePicker;

function UpdateFormModal({ visible, onCancel, record }) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { formatMessage } = intl;

  useEffect(() => {
    form.setFieldsValue({
      ...record,
      form_period:
        record.form_start_time && record.form_end_time
          ? [moment(record.form_start_time), moment(record.form_end_time)]
          : [undefined, undefined],
    });
  }, [record, visible]);

  const dispatch = useDispatch();
  const handleSubmitForm = values => {
    const reqBody = {
      contract_id: record.contract_id,
      form_start_time: values.form_period
        ? values.form_period[0].format('YYYY-MM-DD')
        : '',
      form_end_time: values.form_period
        ? values.form_period[1].format('YYYY-MM-DD')
        : '',
    };
    onCancel();
    return dispatch({
      type: 'ADMIN/updateExpireForm',
      payload: {
        reqBody,
      },
    });
  };

  return (
    <Modal
      forceRender={true}
      destroyOnClose={false}
      closable={false}
      maskClosable={false}
      wrapClassName="updateFormModal"
      visible={visible}
      footer={[
        <div key="groupBtn">
          <Button
            onClick={() => {
              onCancel();
            }}
          >
            {formatMessage({ id: 'i18n_cancel' })}
          </Button>
          <Button htmlType="submit" form="update-data-form" type="primary">
            {formatMessage({ id: 'i18n_ok_button' })}
          </Button>
        </div>,
      ]}
    >
      <Form
        onFinish={handleSubmitForm}
        id="update-data-form"
        colon={false}
        layout="vertical"
        form={form}
      >
        <Form.Item
          name="form_period"
          label={formatMessage({ id: 'i18n_validity_period_form' })}
        >
          <RangePicker
            placeholder={[
              formatMessage({ id: 'i18n_start_time_form' }),
              formatMessage({ id: 'i18n_end_time_form' }),
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(UpdateFormModal);
