import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { Layout, Row, Col, Form, Input, Button, Collapse } from 'antd';
import { useIntl, withRouter, history } from 'umi';
import Footer from '@/components/Footer';
import { connect } from 'dva';
import moment from 'moment';
import NoticeModal from '@/pages/NoticeModal';
import { HOUR_FORMAT, FULL_DATE_HOUR, DATE_TIME_TYPE } from '@/constant';
import {
  meetingMethod,
  getJPFullDate,
  getStep,
  tz,
} from '@/commons/function.js';
import zone from 'moment-timezone';

function ConfirmVote(props) {
  const {
    location,
    onCancel,
    choices,
    eventStore,
    dispatch,
    eventInfo,
    nextStep,
    masterStore,
  } = props;
  const { userByCode } = eventStore;
  const { profile } = masterStore;

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
  const [showNotice, setShowNotice] = useState(false);
  const [currentNotice, setCurrentNotice] = useState('');
  const onSubmit = async e => {
    setLoadingSubmit(true);
    let finalListInvitee = [];
    for (const key in form.getFieldsValue(listInvitee)) {
      if (form.getFieldsValue(listInvitee)[key]) {
        finalListInvitee.push(form.getFieldsValue(listInvitee)[key]);
      }
    }
    let temChoices = choices.filter(item => item.option);
    temChoices = JSON.parse(JSON.stringify(temChoices));
    temChoices.forEach(item => {
      delete item.start_time;
      delete item.end_time;
    });

    await form
      .validateFields(['email', 'name'])
      .then(async value => {
        const info = {
          name: form.getFieldsValue(['name']).name,
          confirm_email: form.getFieldsValue(['email']).email,
          company: form.getFieldsValue(['company_name']).company_name,
          contact: form.getFieldsValue(['contact_infor']).contact_infor,
          comment: form.getFieldsValue(['comment']).comment,
          guests: finalListInvitee,
        };

        const payload = {
          id: location.query.id,
          name: location.query.name || null,
          invitee: location.query.invitee || null,
          code: location.query.code || null,
          choices: temChoices,
          information: info,
          time_zone: tz(),
          user_code: profile ? profile.code : null,
        };
        const res = await dispatch({
          type: 'VOTE/postVoteGuestConfirm',
          payload,
        });
        nextStep(info);
        return;
      })
      .catch(err => {});
    setLoadingSubmit(false);
  };
  const onCancelNoticeModal = () => {
    setShowNotice(false);
    setTimeout(() => onCancel(), 300);
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
                            message: intl.formatMessage({
                              id: 'i18n_required_text',
                            }),
                          },
                        ]}
                        name={'name'}
                      >
                        <Input
                          className={styles.inputSchedule}
                          placeholder="例）田中太郎"
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
                            message: intl.formatMessage({
                              id: 'i18n_required_text',
                            }),
                          },
                          {
                            type: 'email',
                            message: intl.formatMessage({
                              id: 'i18n_email_error_notice',
                            }),
                          },
                        ]}
                        name={'email'}
                      >
                        <Input
                          placeholder="例）taro.tanaka@timematch.jp"
                          className={styles.inputSchedule}
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
                                message: intl.formatMessage({
                                  id: 'i18n_email_error_notice',
                                }),
                              },
                            ]}
                            name={item}
                            key={index}
                          >
                            <Input
                              placeholder="例）taro.tanaka@timematch.jp"
                              className={styles.inputSchedule}
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
                                placeholder="例）タイムマッチ株式会社"
                                className={styles.inputSchedule}
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
                                placeholder="例）090-1234-5678"
                                className={styles.inputSchedule}
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
                                  placeholder="例）当日はよろしくお願いいたします。"
                                  className={styles.textArea}
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
                  <Button className={`${styles.btnWhite}`} onClick={onCancel}>
                    {formatMessage({ id: 'i18n_back' })}
                  </Button>
                  <Button
                    className={`${styles.btnGreen}`}
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
      <NoticeModal
        visible={showNotice}
        onCancel={() => onCancelNoticeModal()}
        content={currentNotice}
        title={formatMessage({ id: 'i18n_notice_modal_title' })}
      />
    </div>
  );
}

export default connect(({ EVENT, MASTER }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
}))(withRouter(ConfirmVote));
