import { Button, Spin, Form, Select } from 'antd';
import { useIntl, history, useDispatch } from 'umi';
import HeaderMobile from '@/components/Mobile/Header';
import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { connect } from 'dva';
import { CloseOutlined } from '@ant-design/icons';

function InviteParticipant(props) {
  const { masterStore } = props;
  const dispatch = useDispatch();
  const intl = useIntl();
  const { formatMessage } = intl;
  const { historyInvitation } = masterStore;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [historyInvitationData, setHistoryInvitationData] = useState([
    { value: '', label: '', disabled: false },
  ]);
  const [selectFields, setSelectFields] = useState([{ key: 0, value: '' }]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'MASTER/getHistoryInvitation',
      payload: {
        pageSize: 200,
        page: 1,
      },
    });
  }, []);

  useEffect(() => {
    if (historyInvitation?.data?.length > 0) {
      const data = historyInvitation.data.map(item => {
        return { value: item.email, label: item.email, disabled: false };
      });
      setHistoryInvitationData(data);
    }
  }, [historyInvitation]);

  const handleAddEmailForm = () => {
    setSelectFields([...selectFields, { key: selectFields.length, value: '' }]);
  };

  const handleSelectChange = (value, key) => {
    if (value.length > 1) {
      value.pop();
    }
    const updatedFields = selectFields.map(field =>
      field.key === key ? { ...field, value } : field,
    );
    setSelectFields(updatedFields);
  };

  const handleRemoveSelect = key => {
    setSelectFields(selectFields.filter(field => field.key !== key));
  };

  const validateUnique = (rule, value, callback) => {
    if (!value || value.length === 0) {
      callback(formatMessage({ id: 'i18n_email_placeholder' }));
      return;
    }
    const allValues = selectFields.map(field => field.value).flat();
    const isDuplicate = allValues.filter(v => v === value[0]).length > 1;

    if (isDuplicate) {
      callback(formatMessage({ id: 'i18n_email_already_existed' }));
    } else {
      callback();
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        const emails = selectFields.map(field => field.value).flat();

        if (emails.length === 0) {
          message.error('Please enter at least one email.');
          return;
        }

        const payload = {
          event_code: history.location.query.event_code,
          emails: emails,
        };

        setLoading(true);
        dispatch({
          type: 'EVENT/inviteParticipant',
          payload,
        });
        setLoading(false);
      })
      .catch(errorInfo => {
        console.log('Failed: ', errorInfo);
      });
  };

  return (
    <Spin spinning={loading}>
      <HeaderMobile
        hideHeader={false}
        headerGuest={false}
        typeHeader={'calendar'}
        isCalendarCreation={true}
        isRight={false}
        title={''}
      />
      <div className={styles.container}>
        <p>{formatMessage({ id: 'i18n_email' })}</p>
        <div className={styles.addPartner}>
          <Button className={styles.addPartnerBtn} onClick={handleAddEmailForm}>
            +
          </Button>
        </div>
        <Form form={form} onFinish={handleSubmit}>
          {selectFields.map(field => (
            <div className={styles.selectField} key={field.key}>
              <Form.Item
                name={`email_${field.key}`}
                className={styles.formField}
                rules={[{ validator: validateUnique }]}
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  options={historyInvitationData}
                  maxTagCount={1}
                  onChange={value => handleSelectChange(value, field.key)}
                  value={field.value}
                  tagRender={props => {
                    const { value, onClose } = props;
                    return (
                      <span className="ant-select-selection-item">{value}</span>
                    );
                  }}
                />
              </Form.Item>
              {field.key !== 0 && (
                <Button
                  className={styles.removeSelectBtn}
                  onClick={() => handleRemoveSelect(field.key)}
                >
                  <CloseOutlined />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="primary"
            htmlType="submit"
            className={styles.savePartnerBtn}
          >
            {formatMessage({ id: 'i18n_add_partner' })}
          </Button>
        </Form>
      </div>
    </Spin>
  );
}

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(
  InviteParticipant,
);
