import { DeleteOutlined, NodeExpandOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Spin, Modal, Button, Form, Input } from 'antd';
import styles from './styles.less';
import { useIntl } from 'umi';
import { useState } from 'react';
import { useDispatch } from 'umi';
import HeaderMobile from '@/components/Mobile/Header';
import iconBack from '@/assets/images/i-back-white.png';
import { ROUTER } from '@/constant';
import useIsMobile from '../../hooks/useIsMobile';
import useIsPc from '../../hooks/useIsPc';
import PCHeader from '../../components/PC/Header';
import FooterMobile from '../../components/Mobile/Footer';
import destroy from '@/assets/images/delete.svg';
import deleteIcon from '@/assets/images/exclamation.png';

import iconClose from '@/assets/images/pc/icon_Menu.png';
import { history } from 'umi';
const SentEmailManagement = props => {
  const { masterStore } = props;
  const dispatch = useDispatch();
  const intl = useIntl();
  const { formatMessage } = intl;
  const { historyInvitation } = masterStore;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const isPc = useIsPc();
  const [selectFields, setSelectFields] = useState([{ key: 0, value: '' }]);

  const onFinish = values => {
    console.log('values', values);
    dispatch({
      type: 'EVENT/addEmailInvites',
      payload: {
        emails: values.names.map(item => {
          return {
            id: item?.id || null,
            email: item.email,
            name: item.name,
          };
        }),
      },
    });
  };

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

  const deleteInvitationHistory = id => {
    dispatch({
      type: 'MASTER/deleteHistoryInvitation',
      payload: {
        id: id,
      },
    });
  };

  useEffect(() => {
    if (historyInvitation?.data?.length > 0) {
      console.log('historyInvitation', historyInvitation);
      form.setFieldsValue({
        names: historyInvitation.data,
      });
    }
  }, [historyInvitation]);

  return (
    <Spin spinning={loading}>
      <div className={styles.pageSentEmail}>
        <PCHeader />
        <div className={styles.container}>
          {isMobile ? null : (
            <div className={styles.formTab}>
              <div
                className={[styles.formTabButton, styles.active].join(' ')}
                onClick={() => {
                  history.push('/contact-management');
                }}
              >
                メール送信先管理
              </div>
              <div
                className={styles.formTabButton}
                onClick={() => {
                  history.push('/mail-template');
                }}
              >
                定例文の作成
              </div>
            </div>
          )}
          <p className={styles.titlePage}>
            {formatMessage({ id: 'i18n_email_invite_pc' })}
          </p>
          <Form
            className={styles.formSentEmail}
            layout="vertical"
            name="dynamic_form_item"
            onFinish={onFinish}
            style={{ maxWidth: 100 % 0 }}
            form={form}
          >
            <div className={styles.FormBodyPartner}>
              {isMobile ? null : (
                <div className={styles.FormBodyPartnerTitle}>
                  <p>
                    {formatMessage({ id: 'i18n_email' })}
                    <span className={styles.requier}>必須</span>
                  </p>
                  <p>名前</p>
                </div>
              )}
              <Form.List name="names">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        className={styles.FormItemPartner}
                        required={false}
                        style={{ marginBottom: 12 }}
                      >
                        <div className={styles.FormItemPartnerInner}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'email']}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: formatMessage({
                                  id: 'i18n_email_address_is_required',
                                }),
                              },
                              {
                                type: 'email',
                                message: formatMessage({
                                  id: 'i18n_invalid_email',
                                }),
                              },
                              ({ getFieldValue }) => ({
                                validator(rule, value) {
                                  console.log('value', value);
                                  if (
                                    !value ||
                                    getFieldValue('names')
                                      .map(item => item?.email)
                                      .filter(v => v === value).length === 1
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    formatMessage({
                                      id: 'i18n_email_existed',
                                    }),
                                  );
                                },
                              }),
                            ]}
                            noStyle
                          >
                            <Input
                              placeholder="例）evergreen1129@timematch.jp"
                              className={`${styles.inputField} ${styles.borderMediumGray}`}
                            />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, 'name']}
                            rules={[
                              {
                                whitespace: true,
                              },
                            ]}
                            noStyle
                          >
                            <Input
                              placeholder="例）時間 太郎"
                              className={`${styles.inputField} ${styles.borderMediumGray}`}
                            />
                          </Form.Item>
                          <div
                            className={`${styles.itemBtnDelete}  ${styles.rounded}`}
                            style={{
                              padding: 10,
                              width: 44,
                              height: 44,
                              flex: 'none',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: 'white',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              Modal.confirm({
                                title: '削除確認',
                                content:
                                  'この連絡先を削除してもよろしいですか？',
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
                                  if (historyInvitation.data[index]) {
                                    deleteInvitationHistory(
                                      historyInvitation.data[index]?.id,
                                    );
                                  } else {
                                    remove(field.name);
                                  }
                                },
                              });
                            }}
                          >
                            {/*<DeleteOutlined />*/}
                            <img src={destroy} />
                          </div>
                        </div>
                      </Form.Item>
                    ))}
                    <Form.Item className={styles.FormItemPartner}>
                      <Button
                        style={{
                          width: '43px',
                          height: '44px',
                          float: 'right',
                          padding: '0 0 3px 0',
                          fontSize: 32,
                          lineHeight: 1,
                          border: 'none',
                        }}
                        className={`${styles.addPartnerBtn} ${styles.bgDarkBlue} ${styles.rounded}`}
                        onClick={() => {
                          add();
                        }}
                        type="primary"
                        size="large"
                      >
                        +
                      </Button>

                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
            <div className={styles.FormFooterPartner}>
              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  className={`${styles.FormFooterPartnerBtn} `}
                  htmlType="submit"
                  loading={loading}
                >
                  保存{' '}
                </Button>
              </Form.Item>
              {/* {isPc ? null : (
                <div className={styles.formTab}>
                  <div
                    className={[styles.formTabButton, styles.active].join(' ')}
                    onClick={() => {
                      history.push('/contact-management');
                    }}
                  >
                    調整メールを送信
                  </div>
                  <div
                    className={styles.formTabButton}
                    onClick={() => {
                      history.push('/mail-template');
                    }}
                  >
                    調整一覧に戻る
                  </div>
                </div>
              )} */}
            </div>
          </Form>
        </div>
        <FooterMobile />
      </div>
    </Spin>
  );
};

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(
  SentEmailManagement,
);
