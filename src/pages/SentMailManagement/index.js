import { DeleteOutlined } from '@ant-design/icons';
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
      form.setFieldsValue({
        names: historyInvitation.data,
      });
    }
  }, [historyInvitation]);

  return (
    <Spin spinning={loading}>
      <div style={{ paddingBottom: 30 }}>
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
            <p
              style={{
                fontWeight: 700,
                fontSize: 24,
                lineHeight: '100%',
                textAlign: 'center',
                paddingTop: 20,
                marginBottom: 40,
              }}
            >
              {formatMessage({ id: 'i18n_email_invite_pc' })}
            </p>
          )}
          <Form
            layout="vertical"
            name="dynamic_form_item"
            onFinish={onFinish}
            style={{ maxWidth: 100 % 0 }}
            form={form}
          >
            <div className={styles.FormBodyPartner}>
              <div style={{ width: '60%', margin: 'auto' }}>
                <p
                  style={{
                    fontWeight: isMobile ? 700 : 400,
                    lineHeight: '100%',
                    paddingBottom: isMobile ? 14 : 0,
                    textAlign: isMobile ? 'center' : 'left',
                    fontSize: isMobile ? '14px' : '18px',
                  }}
                >
                  {formatMessage({ id: 'i18n_email' })}
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
                            gap: isMobile ? 10 : 24,
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
                              placeholder={formatMessage({ id: 'i18n_email' })}
                              className={`${styles.inputField} ${styles.borderMediumGray}`}
                            />
                          </Form.Item>
                          <div
                            className={`${styles.bgPrimaryBlue} ${styles.borderPrimaryBlue} ${styles.rounded}`}
                            style={{
                              padding: 10,
                              width: 44,
                              height: 44,
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
            <div>
              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  style={{
                    width: isMobile ? '50%' : '359px',
                    marginTop: 40,
                    border: 'none',
                    marginBottom: isMobile ? '0' : '40px',
                  }}
                  className={`${styles.bgDarkBlue} ${styles.rounded} ${styles.shadowPrimary} btn-pc-primary`}
                  type="primary"
                  size="large"
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
