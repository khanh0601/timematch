import { DeleteOutlined, NodeExpandOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Spin } from 'antd';
import styles from './styles.less';
import { useIntl } from 'umi';
import { useState } from 'react';
import { useDispatch } from 'umi';
import { Button, Form, Input } from 'antd';
import HeaderMobile from '@/components/Mobile/Header';
import iconBack from '@/assets/images/i-back-white.png';
import { ROUTER } from '@/constant';
import useIsMobile from '../../hooks/useIsMobile';
import PCHeader from '../../components/PC/Header';
import FooterMobile from '../../components/Mobile/Footer';
import destroy from '@/assets/images/delete.svg';
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
      <div style={{ paddingBottom: 30 }} className={styles.pageSentEmail}>
        {isMobile ? (
          <HeaderMobile
            title={formatMessage({ id: 'i18n_contact_management_title' })}
            isShowLeft={true}
            itemLeft={{
              event: 'back',
              url: ROUTER.menu,
              icon: iconBack,
              bgColor: 'bgPrimaryBlue',
              textColor: 'textLightGray',
            }}
          />
        ) : (
          <PCHeader />
        )}
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
          {isMobile ? null : (
            <p className={styles.titlePage}>
              {formatMessage({ id: 'i18n_email_invite_pc' })}
            </p>
          )}
          <Form
            className={styles.formSentEmail}
            layout="vertical"
            name="dynamic_form_item"
            onFinish={onFinish}
            style={{ maxWidth: 100 % 0 }}
            form={form}
          >
            <div className={styles.FormBodyPartner}>
              <div className={styles.FormBodyPartnerTitle}>
                <p
                  style={{
                    fontWeight: isMobile ? 700 : 500,
                    lineHeight: '100%',
                    paddingBottom: isMobile ? 14 : 24,
                    marginBottom: 0,
                    textAlign: isMobile ? 'center' : 'left',
                    fontSize: isMobile ? '14px' : '20px',
                  }}
                >
                  {formatMessage({ id: 'i18n_email' })}
                </p>
                <p
                  style={{
                    fontWeight: isMobile ? 700 : 500,
                    lineHeight: '100%',
                    marginBottom: 0,
                    paddingBottom: isMobile ? 14 : 24,
                    textAlign: isMobile ? 'center' : 'left',
                    fontSize: isMobile ? '14px' : '20px',
                  }}
                >
                  名前
                </p>
              </div>
              <Form.List name="names">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {console.log('errors', errors)}
                    {fields.map((field, index) => (
                      <Form.Item
                        className={styles.FormItemPartner}
                        required={false}
                        style={{ marginBottom: 16 }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: isMobile ? 10 : 32,
                            width: '100%',
                          }}
                        >
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
                              if (historyInvitation.data[index]) {
                                deleteInvitationHistory(
                                  historyInvitation.data[index]?.id,
                                );
                              } else {
                                remove(field.name);
                              }
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
                        onClick={() => add()}
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
                  style={{
                    width: isMobile ? '50%' : '200px',
                  }}
                  className={`${styles.FormFooterPartnerBtn} `}
                  htmlType="submit"
                  loading={loading}
                >
                  保存{' '}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>

        {isMobile ? null : <FooterMobile />}
      </div>
    </Spin>
  );
};

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(
  SentEmailManagement,
);
