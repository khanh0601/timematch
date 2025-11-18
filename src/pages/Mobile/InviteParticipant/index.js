import { Modal, Button, Spin, Form, Select, Input } from 'antd';
import { useIntl, history, useDispatch } from 'umi';
import HeaderMobile from '@/components/Mobile/Header';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styles from './styles.less';
import './stylesPc.less';
import { connect } from 'dva';
import { CloseOutlined } from '@ant-design/icons';
import iconBack from '@/assets/images/i-back-white.png';
import { ROUTER } from '@/constant';
import PCHeader from '@/components/PC/Header';
import FooterMobile from '@/components/Mobile/Footer';
import useIsPc from '@/hooks/useIsPc';
import deleteIcon from '@/assets/images/exclamation.png';
import iconClose from '@/assets/images/pc/icon_Menu.png';
function InviteParticipant(props) {
  const { masterStore, eventStore } = props;
  const dispatch = useDispatch();
  const intl = useIntl();
  const { formatMessage } = intl;
  const { isLoading } = eventStore;
  const { historyInvitation } = masterStore;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [historyInvitationData, setHistoryInvitationData] = useState([
    { value: '', label: '', disabled: false, id: null },
  ]);
  const [selectFields, setSelectFields] = useState([
    { key: 0, value: '', id: null },
  ]);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);
  const [editingKeys, setEditingKeys] = useState({});
  const [duplicateErrors, setDuplicateErrors] = useState({});
  const [originalEmails, setOriginalEmails] = useState({});

  const isPc = useIsPc();

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
      const data = historyInvitation.data.map(item => ({
        value: item.email,
        label: item.email,
        disabled: false,
        id: item.id,
      }));
      setHistoryInvitationData(data);

      // Store original emails with their IDs
      const emailMap = {};
      data.forEach(item => {
        emailMap[item.value] = item.id;
      });
      setOriginalEmails(emailMap);
    }
  }, [historyInvitation]);

  const handleAddEmailForm = () => {
    const newKey =
      selectFields.length > 0
        ? Math.max(...selectFields.map(f => f.key)) + 1
        : 0;
    setSelectFields([...selectFields, { key: newKey, value: '', id: null }]);
  };

  const updateHistoryInvitationData = fields => {
    const selectedEmails = fields.flatMap(field => field.value);
    const updatedHistoryData = historyInvitationData.map(item => ({
      ...item,
      disabled: selectedEmails.includes(item.value),
    }));
    setHistoryInvitationData(updatedHistoryData);
  };

  const handleRemoveSelect = key => {
    const updatedFields = selectFields.filter(field => field.key !== key);
    setSelectFields(updatedFields);

    updateHistoryInvitationData(updatedFields);

    // Remove the corresponding form field
    form.setFieldsValue({
      [`email_${key}`]: undefined,
    });
  };

  const handleRemoveTag = (removedTag, key) => {
    const updatedFields = selectFields.map(field => {
      if (field.key === key) {
        return {
          ...field,
          value: field.value.filter(tag => tag !== removedTag),
        };
      }
      return field;
    });
    setSelectFields(updatedFields);

    // Update historyInvitationData
    const selectedEmails = updatedFields.flatMap(field => field.value);
    const updatedHistoryData = historyInvitationData.map(item => ({
      ...item,
      disabled: selectedEmails.includes(item.value),
    }));
    setHistoryInvitationData(updatedHistoryData);
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      message.error('アカウントが存在しています。');
      return;
    }

    form
      .validateFields()
      .then(values => {
        const emails = selectFields
          .map(field => ({
            email: field.value[0],
            id: field.id ?? null,
          }))
          .filter(email => email.email); // Remove empty emails

        if (emails.length === 0) {
          message.error('メールアドレスを入力してください。');
          return;
        }

        const payload = {
          event_code: history.location.query.event_code,
          emails: emails,
          isPc: isPc,
        };

        setLoading(true);
        setIsLoadingInvite(true);
        dispatch({
          type: 'EVENT/inviteParticipant',
          payload,
        });
        setLoading(false);
        setIsLoadingInvite(false);
      })
      .catch(errorInfo => {
        console.log('Failed: ', errorInfo);
      });
  };

  const isSubmitDisabled = useMemo(() => {
    return (
      Object.values(duplicateErrors).some(error => error) ||
      selectFields.every(field => !field.value[0])
    );
  }, [duplicateErrors, selectFields]);

  const validateUnique = useCallback(allValues => {
    const errors = {};
    const valueCount = {};

    allValues.forEach((value, index) => {
      if (value) {
        if (valueCount[value]) {
          errors[index] = true;
          errors[valueCount[value] - 1] = true;
        } else {
          valueCount[value] = index + 1;
        }
      }
    });

    setDuplicateErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const handleSelectChange = useCallback(
    (value, key, options) => {
      const updatedFields = selectFields.map(field => {
        if (field.key === key) {
          const newValue = value.length > 0 ? value[value.length - 1] : '';
          const newId = originalEmails[newValue] || null;
          return { ...field, value: [newValue], id: newId };
        }
        return field;
      });
      setSelectFields(updatedFields);
      updateHistoryInvitationData(updatedFields);
      validateUnique(updatedFields.map(field => field.value[0]));
    },
    [selectFields, updateHistoryInvitationData, validateUnique, originalEmails],
  );

  const handleEditEmail = useCallback(
    (key, value) => {
      if (value) {
        setEditingKeys(prev => ({ ...prev, [key]: true }));
        form.setFieldsValue({ [`email_${key}`]: value });
      }
    },
    [form],
  );

  const handleEmailInputChange = useCallback(
    (e, key) => {
      const { value } = e.target;
      const updatedFields = selectFields.map(field => {
        if (field.key === key) {
          const newId = originalEmails[value] || null;
          return { ...field, value: [value], id: newId };
        }
        return field;
      });
      setSelectFields(updatedFields);
      updateHistoryInvitationData(updatedFields);
      validateUnique(updatedFields.map(field => field.value[0]));
    },
    [selectFields, updateHistoryInvitationData, validateUnique, originalEmails],
  );

  const handleEmailInputBlur = useCallback(key => {
    setEditingKeys(prev => ({ ...prev, [key]: false }));
  }, []);

  const handleEmailInputKeyDown = useCallback(
    (e, key) => {
      if (e.key === 'Enter') {
        handleEmailInputBlur(key);
      }
    },
    [handleEmailInputBlur],
  );

  return (
    <Spin spinning={loading}>
      {isPc ? (
        <PCHeader />
      ) : (
        <HeaderMobile
          title={formatMessage({ id: 'i18n_share_via_email' })}
          isShowLeft={true}
          itemLeft={{
            event: 'back',
            url: ROUTER.calendar,
            icon: iconBack,
            bgColor: 'bgPrimaryBlue',
          }}
        />
      )}
      <div className={`${styles.container} invite-participant-page`}>
        {isPc ? (
          <h1 className={styles.emailTitle}>
            {formatMessage({ id: 'i18n_email_invite_pc' })}
          </h1>
        ) : (
          <p>{formatMessage({ id: 'i18n_email' })}</p>
        )}

        <Form form={form} onFinish={handleSubmit} className={styles.formItem}>
          <div className={styles.addPartnerWrap}>
            <div
              className={styles.addPartnerHead}
              style={{ paddingRight: selectFields.length > 1 ? '76px' : '0' }}
            >
              <div className={styles.addPartner}>
                {isPc && (
                  <p className={styles.emailLabel}>
                    メールアドレス<span className={styles.requier}>必須</span>
                  </p>
                )}
              </div>
              <div className={styles.addPartner}>
                {isPc && <p className={styles.emailLabel}>名前</p>}
              </div>
            </div>
            {selectFields.map((field, index) => (
              <div className={styles.selectField} key={field.key}>
                <Form.Item
                  name={`email_${field.key}`}
                  className={styles.formField}
                  validateStatus={duplicateErrors[index] ? 'error' : ''}
                  help={
                    duplicateErrors[index] ? 'アカウントが存在しています。' : ''
                  }
                >
                  {editingKeys[field.key] && field.value[0] ? (
                    <Input
                      value={field.value[0]}
                      onChange={e => handleEmailInputChange(e, field.key)}
                      onBlur={() => handleEmailInputBlur(field.key)}
                      onKeyDown={e => handleEmailInputKeyDown(e, field.key)}
                      autoFocus
                    />
                  ) : (
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="メールアドレスを入力してください。"
                      options={historyInvitationData.filter(
                        item => !item.disabled,
                      )}
                      maxTagCount={1}
                      onChange={(value, options) =>
                        handleSelectChange(value, field.key, options)
                      }
                      onSelect={value => handleEditEmail(field.key, value)}
                      onClick={() => handleEditEmail(field.key, field.value[0])}
                      value={field.value}
                      tagRender={props => {
                        const { label, value, onClose } = props;
                        return (
                          <span className="ant-select-selection-item">
                            {label}
                            <span style={{ paddingLeft: 5 }}>
                              <CloseOutlined
                                onClick={() => {
                                  onClose();
                                  handleRemoveTag(value, field.key);
                                }}
                              />
                            </span>
                          </span>
                        );
                      }}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  name={`email_${field.key}`}
                  className={styles.formField}
                  validateStatus={duplicateErrors[index] ? 'error' : ''}
                  help={
                    duplicateErrors[index] ? 'アカウントが存在しています。' : ''
                  }
                >
                  {editingKeys[field.key] && field.value[0] ? (
                    <Input
                      value={field.value[0]}
                      onChange={e => handleEmailInputChange(e, field.key)}
                      onBlur={() => handleEmailInputBlur(field.key)}
                      onKeyDown={e => handleEmailInputKeyDown(e, field.key)}
                      autoFocus
                    />
                  ) : (
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="例）時間　太郎"
                      options={historyInvitationData.filter(
                        item => !item.disabled,
                      )}
                      maxTagCount={1}
                      onChange={(value, options) =>
                        handleSelectChange(value, field.key, options)
                      }
                      onSelect={value => handleEditEmail(field.key, value)}
                      onClick={() => handleEditEmail(field.key, field.value[0])}
                      value={field.value}
                      tagRender={props => {
                        const { label, value, onClose } = props;
                        return (
                          <span className="ant-select-selection-item">
                            {label}
                            <span style={{ paddingLeft: 5 }}>
                              <CloseOutlined
                                onClick={() => {
                                  onClose();
                                  handleRemoveTag(value, field.key);
                                }}
                              />
                            </span>
                          </span>
                        );
                      }}
                    />
                  )}
                </Form.Item>

                {selectFields.length > 1 && (
                  <img
                    className={styles.removeSelectBtn}
                    src={require('@/assets/images/delete.svg')}
                    onClick={() => {
                      Modal.confirm({
                        title: '削除確認',
                        content: 'この連絡先を削除してもよろしいですか？',
                        icon: (
                          <img
                            src={deleteIcon}
                            className={styles.customModalImg}
                          />
                        ),
                        okText: '確認',
                        cancelText: '',
                        centered: true,
                        className: styles.customModal,
                        closable: true,
                        closeIcon: (
                          <span style={{ fontSize: '20px' }}>
                            <img src={iconClose} />
                          </span>
                        ),
                        cancelButtonProps: {
                          style: {
                            display: 'none',
                          },
                        },
                        onOk: () => {
                          handleRemoveSelect(field.key);
                        },
                      });
                    }}
                  />
                )}
              </div>
            ))}
            <div className={styles.addPartnerBtnWrap}>
              <Button
                className={styles.addPartnerBtn}
                onClick={handleAddEmailForm}
              >
                +
              </Button>
            </div>
          </div>
          <div className={styles.savePartnerBtnWrap}>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              className={styles.savePartnerBtn}
              disabled={isSubmitDisabled}
            >
              {formatMessage({ id: 'i18n_add_partner' })}
            </Button>
            <Button
              loading={isLoading}
              className={styles.savePartnerBtnReturn}
              disabled={isSubmitDisabled}
            >
              調整一覧に戻る
            </Button>
          </div>
        </Form>
      </div>
      {isPc && <FooterMobile />}
    </Spin>
  );
}

export default connect(({ MASTER, EVENT }) => ({
  masterStore: MASTER,
  eventStore: EVENT,
}))(InviteParticipant);
