import { getJPFullDate, profileFromStorage, tz } from '@/commons/function.js';
import { DATE_TIME_TYPE, FULL_DATE_HOUR, HOUR_FORMAT } from '@/constant';
import { Button, Col, Collapse, Form, Input, Layout, Row } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from './styles.less';

function BookingFinalStep(props) {
  const {
    onCancel,
    event_code,
    user_code,
    start_time,
    end_time,
    dispatch,
    onCreateSchedule,
    nextStep,
    custom_type,
    once,
  } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { Panel } = Collapse;
  const { TextArea } = Input;
  const state = {
    expandIconPosition: 'right',
  };
  const { expandIconPosition } = state;
  const [form] = Form.useForm();
  const [listInvitee, setListInvitee] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const onSubmit = async () => {
    const profile = profileFromStorage();

    const res = await onCreateSchedule();
    if (res.body.data && res.body.data.status) {
      setLoadingSubmit(true);
      let finalListInvitee = [];
      for (const key in form.getFieldsValue(listInvitee)) {
        if (form.getFieldsValue(listInvitee)[key]) {
          finalListInvitee.push(form.getFieldsValue(listInvitee)[key]);
        }
      }
      await form
        .validateFields(['email', 'name'])
        .then(async value => {
          const payload = {
            name: form.getFieldsValue(['name']).name,
            start_time: moment(start_time).format(FULL_DATE_HOUR),
            end_time: moment(end_time).format(FULL_DATE_HOUR),
            description: form.getFieldsValue(['comment']).comment,
            email: form.getFieldsValue(['email']).email,
            company: form.getFieldsValue(['company_name']).company_name,
            contact_infor: form.getFieldsValue(['contact_infor']).contact_infor,
            event_code: event_code,
            guest_invites: finalListInvitee,
            nextStep: nextStep,
            onCancel: () => onCancel(true),
            formatMessage: formatMessage,
            time_zone: tz(),
            custom_type: custom_type ? custom_type : DATE_TIME_TYPE.default,
            guest_code: profile ? profile.code : '',
          };
          if (!once) {
            payload.user_code = user_code;
          }
          await dispatch({ type: 'EVENT/createSchedule', payload });
        })
        .catch(err => {})
        .finally(() => setLoadingSubmit(false));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.mainContent}>
      <div className={styles.step3}>
        <Layout className={styles.mainLayout}>
          <div className={styles.mainContent}>
            <div className={styles.scheduleAdjustment}>
              <div className={styles.inforTimeSelect}>
                <div className={styles.titleTime}>
                  <div className={styles.boldLeft} />
                  <label>選択日時</label>
                </div>

                <div className={styles.rightTime}>
                  <span className={styles.dateTime}>
                    {getJPFullDate(start_time)}
                    {moment(start_time).format('(dd)')}
                  </span>{' '}
                  {moment(start_time).format(HOUR_FORMAT)} -{' '}
                  {moment(end_time).format(HOUR_FORMAT)}
                </div>
              </div>

              <div className={styles.thirdStepDetail}>
                <Row>
                  <Col sm={24} xs={24}>
                    <Form
                      layout="vertical"
                      form={form}
                      className={styles.formScheduleAdjust}
                    >
                      <Form.Item
                        label={
                          <div className={styles.formInputItem}>
                            <div />
                            <div>
                              <span className={styles.formLabel}>
                                {formatMessage({ id: 'i18n_label_name' })}
                                <span className={styles.required}>
                                  {formatMessage({ id: 'i18n_required' })}
                                </span>
                              </span>
                            </div>
                          </div>
                        }
                        className={styles.scheduleLabelCustom}
                        rules={[
                          {
                            required: true,
                            message: formatMessage({
                              id: 'i18n_required_text',
                            }),
                          },
                        ]}
                        name={'name'}
                      >
                        <Input
                          className={styles.inputSchedule}
                          placeholder="例）田中　太郎"
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <div className={styles.formInputItem}>
                            <div />
                            <div>
                              <span className={styles.formLabel}>
                                {formatMessage({ id: 'i18n_email' })}
                                <span className={styles.required}>
                                  {formatMessage({ id: 'i18n_required' })}
                                </span>
                              </span>
                            </div>
                          </div>
                        }
                        className={`${styles.scheduleLabelCustom} ${styles.scheduleLabelCustomMobileEmail}`}
                        rules={[
                          {
                            required: true,
                            message: formatMessage({
                              id: 'i18n_required_text',
                            }),
                          },
                          {
                            type: 'email',
                            message: formatMessage({
                              id: 'i18n_email_error_notice',
                            }),
                          },
                        ]}
                        name={'email'}
                      >
                        <Input
                          className={styles.inputSchedule}
                          placeholder="例）taro.tanaka@timematch.jp"
                        />
                      </Form.Item>

                      {listInvitee.map((item, index) => {
                        return (
                          <Form.Item
                            label={
                              index === 0 ? (
                                <div className={styles.formInputItem}>
                                  <div />
                                  <div>
                                    <span className={styles.formLabel}>
                                      {formatMessage({
                                        id: 'i18n_email_guest',
                                      })}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                ''
                              )
                            }
                            className={styles.scheduleLabelCustom}
                            rules={[
                              {
                                type: 'email',
                                message: formatMessage({
                                  id: 'i18n_email_error_notice',
                                }),
                              },
                            ]}
                            name={item}
                          >
                            <Input
                              className={styles.inputSchedule}
                              placeholder="例）taro.tanaka@timematch.jp"
                            />
                          </Form.Item>
                        );
                      })}
                      <button
                        className={styles.addContact}
                        onClick={() => {
                          form
                            .validateFields(listInvitee)
                            .then(value => {
                              setListInvitee([
                                ...listInvitee,
                                `invitee${listInvitee.length + 1}`,
                              ]);
                            })
                            .catch(err => {});
                        }}
                      >
                        {formatMessage({ id: 'i18n_add_contact' })}
                      </button>
                      <Collapse
                        expandIconPosition={expandIconPosition}
                        className={styles.scheduleCollapse}
                      >
                        <Panel
                          header={
                            <label>
                              <div className={styles.formInputItem}>
                                <div />
                                <div>
                                  <span className={styles.guestFormLabel}>
                                    {formatMessage({
                                      id: 'i18n_advance_setting',
                                    })}
                                    <span className={styles.random}>
                                      {formatMessage({ id: 'i18n_random' })}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </label>
                          }
                          key="1"
                        >
                          <div className={styles.addContactForm}>
                            <Form.Item
                              label={
                                <div className={styles.formInputItem}>
                                  <div className={styles.itemPlus} />
                                  <div>
                                    <span className={styles.formLabel}>
                                      {formatMessage({
                                        id: 'i18n_company_name',
                                      })}
                                    </span>
                                  </div>
                                </div>
                              }
                              name={'company_name'}
                            >
                              <Input
                                className={styles.inputSchedule}
                                placeholder="例）Smoothly株式会社"
                              />
                            </Form.Item>
                            <Form.Item
                              label={
                                <div className={styles.formInputItem}>
                                  <div className={styles.itemPlus} />
                                  <div>
                                    <span className={styles.formLabel}>
                                      {formatMessage({
                                        id: 'i18n_contact_information',
                                      })}
                                    </span>
                                  </div>
                                </div>
                              }
                              name={'contact_infor'}
                              rules={[
                                {
                                  pattern: '^[a-z0-9-_]*$',
                                  message: formatMessage({
                                    id: 'i18n_validate_text_half_size',
                                  }),
                                },
                              ]}
                            >
                              <Input
                                className={styles.inputSchedule}
                                placeholder="例）090-1234-5678"
                              />
                            </Form.Item>
                            <Form.Item
                              label={
                                <div className={styles.formInputItem}>
                                  <div className={styles.itemPlus} />
                                  <div>
                                    <span className={styles.formLabel}>
                                      {formatMessage({ id: 'i18n_comment' })}
                                    </span>
                                  </div>
                                </div>
                              }
                              className={styles.mb15}
                              name={'comment'}
                            >
                              <div>
                                <div className={styles.addContactDescription}>
                                  {formatMessage({
                                    id: 'i18n_comment_description',
                                  })}
                                </div>
                                <TextArea
                                  className={styles.textArea}
                                  placeholder="例）当日はよろしくお願いいたします。"
                                />
                              </div>
                            </Form.Item>
                          </div>
                        </Panel>
                      </Collapse>
                    </Form>
                  </Col>
                </Row>
                <div className={styles.scheduleBtnGroup}>
                  <Button
                    className={styles.btnWhite}
                    onClick={() => onCancel(false)}
                  >
                    {formatMessage({ id: 'i18n_back' })}
                  </Button>
                  <Button
                    className={styles.btnGreen}
                    htmlType="submit"
                    onClick={onSubmit}
                    loading={loadingSubmit}
                  >
                    {formatMessage({ id: 'i18n_complete' })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
}

export default connect(({ EVENT }) => ({
  eventStore: EVENT,
}))(BookingFinalStep);
