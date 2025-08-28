import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import {
  Row,
  Col,
  Spin,
  Layout,
  Button,
  Tooltip,
  Collapse,
  Input,
  Dropdown,
  Menu,
  message,
  Table,
  Modal,
} from 'antd';
import moment from 'moment';
import { useIntl, history, withRouter } from 'umi';
import { connect } from 'dva';
import Footer from '@/components/Footer';
import { getCookie } from '@/commons/function.js';
import MenuSPBottom from '@/components/MenuSPBottom';
import zone from 'moment-timezone';
import circleFourIcon from '@/assets/images/circle-four.png';
import triangleOneIcon from '@/assets/images/triangle-one.png';
import xThreeIcon from '@/assets/images/x-three.png';
import helper from '@/assets/images/imgQuestion.png';
import userBoldIcon from '@/assets/images/user-bold.png';
import copyLinkIcon from '@/assets/images/copy-link.png';
import emailIcon from '@/assets/images/mail.svg';
import downTBIcon from '@/assets/images/down-tb.svg';
import { emailRegex } from '@/constant';
import { getJPMonthAndDay } from '@/commons/function.js';
import { HOUR_FORMAT } from '@/constant';
import voteRequest from '@/services/voteRequest';
import config from '@/config';
import { copyText, copyRichText, tz } from '@/commons/function';
import CloseVote from './CloseVote';

import useWindowDimensions from '@/commons/useWindowDimensions';
import LinkInvite from '@/assets/images/link-invite.png';
import { createTimeAsync, notify } from '../../commons/function';
import TooltipFormat from '../../components/TooltipFormat';

const listDataTooltipInvitedEmailStep1 = [
  '投票ページへのリンクが記載されたメールを送付することができます。',
  '※メールアドレスを正しく入力いメールアドレスの背景が「緑色」に変わります。',
  '※要確認',
];
const listDataTooltipInvitedEmailStep2 = [
  '投票ページのURLをコピーできます。',
  'メールだけでなくチャットツールやSNS等にて',
  ' 日程調整した相手にURLを送付ください。',
];
function InviteMember(props) {
  const { location, dispatch, eventStore, masterStore, voteStore } = props;
  const { Panel } = Collapse;
  const { TextArea } = Input;
  const { width } = useWindowDimensions();

  const {
    voteLoading,
    eventDateTimeUser,
    voteUser,
    informationVote,
    sendEmailLoading,
  } = voteStore;

  const { profile } = masterStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [currentStep, setCurrentStep] = useState(1);
  const [eventChoose, setEventChoose] = useState(null);
  const [step, setStep] = useState(1);
  const [listEmail, setListEmail] = useState([
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
  ]);
  const [listEmailChange, setListEmailChange] = useState([
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
    {
      email: '',
    },
  ]);
  const [listIndexMost, setListIndexMost] = useState([]);
  const [idEventDateTime, setIdEventDateTime] = useState(null);
  const [isScheduleSelection, setIsScheduleSelection] = useState(false);
  const [scrollTopFirst, setScrollTopFirst] = useState(true);

  useEffect(() => {
    if (profile.code) {
      const payload = {
        vote: location.query.id,
        user: profile.code,
      };
      dispatch({ type: 'VOTE/getVoteUserShow', payload });
    }
  }, []);

  useEffect(() => {
    const { startTime, endTime } = createTimeAsync();
    const payload = {
      vote: location.query.id,
      type: 1, // screen A
      start: startTime,
      end: endTime,
      timeZone: tz(),
    };
    dispatch({ type: 'VOTE/getVoteUserSummary', payload });
    getData();
  }, []);

  useEffect(() => {
    if (!eventDateTimeUser.length) {
      return;
    }

    let keyMost = 0;
    let arrKeySelect = [];

    eventDateTimeUser.forEach((item, index) => {
      const { choices_count } = item;
      if (choices_count > keyMost) {
        arrKeySelect = [index];
        keyMost = choices_count;
      }
      if (
        keyMost === choices_count &&
        !arrKeySelect.includes(index) &&
        choices_count > 0
      ) {
        arrKeySelect.push(index);
      }
    });
    setListIndexMost(arrKeySelect);
  }, [eventDateTimeUser]);

  const getData = async () => {
    const payloadShow = {
      id: location.query.id,
    };
    if (location.query.name) {
      payloadShow.name = location.query.name;
    }
    await dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
  };

  const menuSort = (
    <Menu className={styles.eventTypeOption}>
      <Menu.Item key="0">
        <div
          onClick={() =>
            dispatch({
              type: 'VOTE/setEventDateTimeUserDESC',
            })
          }
        >
          {formatMessage({ id: 'i18n_sort_vote' })}
        </div>
      </Menu.Item>
    </Menu>
  );

  const handleVisibleChangeSetting = value => {
    if (!value) {
      dispatch({ type: 'EVENT/updateIsSelectEvent', payload: false });
    }
  };

  const handleChangeInput = (event, index) => {
    let { value } = event.target;
    let temListEmail = [...listEmail];
    temListEmail[index].email = value;
    setListEmail(temListEmail);
  };

  const ValidateEmail = listEmail => {
    let listEmailValidBoolean = [];
    for (let i = 0; i < listEmail.length; i++) {
      const elementEmail = listEmail[i];
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(elementEmail)) {
        listEmailValidBoolean.push(true);
      } else {
        listEmailValidBoolean.push(false);
      }
    }
    if (listEmailValidBoolean.filter(item => item === false).length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const sendEmail = () => {
    let temListEmail = [];
    listEmail.map(item => {
      if (item.email !== '') {
        temListEmail.push(item.email);
      }
    });
    if (!ValidateEmail(temListEmail)) {
      notify(formatMessage({ id: 'i18n_error_email_invite' }));
    } else {
      const payload = {
        vote: location.query.id,
        user: profile.code,
        emails: temListEmail,
      };
      dispatch({ type: 'VOTE/postVoteUserSendEmail', payload });
    }
  };
  const ValidAtLeastOneUserVote = eventDateTimeUser => {
    for (let i = 0; i < eventDateTimeUser.length; i++) {
      const element = eventDateTimeUser[i];
      if (element.choices_count > 0) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async () => {
    const { role, eventTeam } = history.location.query;
    if (role !== 'true' || (role === 'true' && eventTeam === 'true')) {
      if (!ValidAtLeastOneUserVote(eventDateTimeUser)) {
        notify(formatMessage({ id: 'i18n_error_at_least_1_user_vote' }));
        return;
      }

      if (!idEventDateTime) {
        notify(formatMessage({ id: 'i18n_error_vote_event' }));
        return;
      }

      // handle busy vote
      const isBusy = eventDateTimeUser.find(e => {
        return e.id == idEventDateTime && e.is_busy;
      });

      if (!isBusy) {
        return handleSubmitOK();
      }

      // confirm in case busy
      Modal.confirm({
        // title: '',
        content:
          '選択いただいた日時は、すでにカレンダーに予定が入っています。日程を確定してよろしいですか？',
        onOk() {
          return handleSubmitOK(true);
        },
        onCancel() {
          console.log('Cancel');
        },
        cancelText: 'キャンセルする',
        okText: '確定する',
        className: 'handleSubmitVote',
      });
    }
  };

  const handleSubmitOK = async (force = false) => {
    const payload = {
      vote: location.query.id,
      user: profile.code,
      event_datetime: idEventDateTime,
      time_zone: tz(),
      force,
    };
    const res = await dispatch({ type: 'VOTE/postUserVote', payload });
    if (res) setStep(2);
  };

  const handleEventDateTime = event => {
    setIdEventDateTime(event.id);
    setEventChoose(event);
    setIsScheduleSelection(true);
  };

  const copyLink = async () => {
    if (history.location.query.role !== 'true') {
      await dispatch({ type: 'VOTE/setSendEmailLoading', payload: true });
      const code = await voteRequest.getCodeUser({ vote: location.query.id });
      setTimeout(() => {
        copyText(
          `${config.WEB_DOMAIN}/vote?id=${location.query.id}&name=${location.query.name}`,
        );
      }, 0);
      await dispatch({ type: 'VOTE/setSendEmailLoading', payload: false });
    }
  };

  const handleScroll = ref => {
    const { chooseSchedule } = location.query;
    if (ref && chooseSchedule) {
      if (ref.getBoundingClientRect().top < 1 && scrollTopFirst) {
        setScrollTopFirst(false);
        return;
      }
      if (!scrollTopFirst) {
        return;
      }
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollFinished = ref => {
    if (ref && isScheduleSelection) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsScheduleSelection(false);
    }
  };

  const isDisableInputEmail = listEmail => {
    for (let i = 0; i < listEmail.length; i++) {
      const element = listEmail[i];
      if (element.email !== '') {
        return false;
      }
    }
    return true;
  };

  const voteAmount = (
    <div>
      {formatMessage({
        id: 'i18n_vote_amount',
      })}{' '}
      <Dropdown
        overlay={menuSort}
        trigger={['click']}
        onVisibleChange={handleVisibleChangeSetting}
      >
        {width > 767 ? (
          <img src={downTBIcon} width="20" height="20" />
        ) : (
          <img src={downTBIcon} width="16" height="16" />
        )}
      </Dropdown>
    </div>
  );

  const [widthVoteTime, setWidthVoteTime] = useState(190);
  const [widthVoteAmount, setWidthVoteAmount] = useState(140);
  const [widthChooseTitle, setWidthChooseTitle] = useState(170);
  const [widthVoter, setWidthVoter] = useState(125);

  useEffect(() => {
    if (width < 769) {
      setWidthVoteTime(120);
      setWidthVoteAmount(89);
      setWidthChooseTitle(130);
      setWidthVoter(100);
    }
  }, [width]);

  const dataSource = [];
  const columns = [
    {
      title: formatMessage({
        id: 'i18n_vote_time',
      }),
      width: widthVoteTime,
      key: 'vote_time',
      align: 'center',
      // fixed: 'left',
      render: (item, index) => {
        return (
          <>
            {getJPMonthAndDay(item.start_time)}&nbsp;
            {moment(item.start_time).format('(dd)')}
            <br />
            {moment(item.start_time).format(HOUR_FORMAT)}～
            {moment(item.end_time).format(HOUR_FORMAT)}
          </>
        );
      },
    },
    {
      title: voteAmount,
      width: widthVoteAmount,
      key: 'vote_amount',
      align: 'center',
      // sorter: (a, b) => a.choices_count - b.choices_count,
      // fixed: 'left',
      render: (item, index) => {
        return (
          <>
            <img
              src={userBoldIcon}
              height="30"
              width="30"
              style={{ marginRight: '10px' }}
            />
            {item.choices_count} 人
          </>
        );
      },
    },
    {
      title: formatMessage({
        id: 'i18n_choose_title',
      }),
      width: widthChooseTitle,
      key: 'choose_title',
      align: 'center',
      // fixed: 'left',
      render: (item, index) => {
        return (
          <>
            <button
              htmlType="button"
              loading={voteLoading.toString()}
              className={
                idEventDateTime !== item.id
                  ? `${styles.btnVote}`
                  : `${styles.btnVoteActive}`
              }
              onClick={() => handleEventDateTime(item)}
            >
              {formatMessage({
                id: 'i18n_step_2_choose_day',
              })}
            </button>
          </>
        );
      },
    },
  ];

  for (let i = 0; i < voteUser.length; i++) {
    const vote = voteUser[i];

    columns.push({
      title: vote.name + '様',
      key: i,
      align: 'center',
      width: widthVoter,
      render: (item, index) => {
        const temVote =
          item.choices[0] &&
          item.choices.find(choose => choose.voter_id === vote.id);

        return (
          <div className={styles.dFlexCenter}>
            {!temVote ? (
              <></>
            ) : temVote.option === 1 ? (
              <img src={circleFourIcon} />
            ) : temVote.option === 2 ? (
              <img src={triangleOneIcon} />
            ) : (
              <img src={xThreeIcon} />
            )}
          </div>
        );
      },
    });
  }
  for (let i = 0; i < eventDateTimeUser.length; i++) {
    const item = eventDateTimeUser[i];

    const newObject = {
      key: i,
      ...item,
    };

    dataSource.push(newObject);
  }

  const listEmailInvite = responsiveName => {
    if (responsiveName === 'Web') {
      return (
        <>
          {listEmail.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Input
                  className={
                    listEmailChange[index].email !== item.email
                      ? `${styles.tbInput} ${styles.changeInput}`
                      : `${styles.tbInput}`
                  }
                  value={item.email}
                  onChange={e => handleChangeInput(e, index)}
                />
              </td>
            </tr>
          ))}
        </>
      );
    }
    if (responsiveName === 'Mobile') {
      let listEmailMobile = [];

      for (let index = 0; index < listEmail.length; index++) {
        if (index < 6) {
          const element = listEmail[index];
          listEmailMobile.push(element);
        }
      }

      return (
        <>
          {listEmailMobile.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <label>
                  <Input
                    className={
                      listEmailChange[index].email !== item.email
                        ? `${styles.tbInput} ${styles.changeInput}`
                        : `${styles.tbInput}`
                    }
                    value={item.email}
                    onChange={e => handleChangeInput(e, index)}
                  />
                </label>
              </td>
            </tr>
          ))}
        </>
      );
    }
  };

  const onRow = ({ key }) =>
    listIndexMost.includes(key) && { className: `${styles.mostVote}` };

  const disabledConfirmEmail = () => {
    const { eventTeam, role } = history.location.query;
    return !eventTeam && role === 'true';
  };

  const listCssBtnConfirmEmail = () => {
    let listCss = 'btn btnGreen btn-custom-height';
    const { eventTeam, role } = history.location.query;
    if (!eventTeam && role === 'true') {
      listCss += ' ' + styles.stopInviteEmail;
    }
    return listCss;
  };

  return (
    <Layout className={styles.mainLayout}>
      {voteLoading ? (
        <Spin className="loading-page" size="large" />
      ) : (
        <div className={styles.bookingBottom}>
          {step === 1 ? (
            <div
              className={`${styles.inviteMemberScreen} ${styles.bookingStep1}`}
            >
              {currentStep !== 4 && (
                <div className={styles.mainContent}>
                  {' '}
                  <div className={styles.numberAccountContent}>
                    <div className={styles.numberAccountBorder} />
                    <div className={styles.numberAccountTitle}>
                      {formatMessage({ id: 'i18n_page_invite_member' })}
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.firstStep} ${
                        currentStep === 1 ? styles.activeStep : ''
                      }`}
                    >
                      <span>1</span>
                      <p>
                        {formatMessage({ id: 'i18n_step_1_invite_member' })}
                      </p>
                    </div>
                    <div className={`${styles.secondStep}`}>
                      <div
                        className={`${styles.secondStepContent} ${
                          currentStep === 2 ? styles.activeStep : ''
                        }`}
                      >
                        <span>2</span>
                        <p>{formatMessage({ id: 'i18n_step_2_choose_day' })}</p>
                      </div>
                    </div>
                    <div
                      className={`${styles.thirdStep} ${
                        currentStep === 3 ? styles.activeStep : ''
                      }`}
                    >
                      <span>3</span>
                      <p>{formatMessage({ id: 'i18n_step_1_confirm_day' })}</p>
                    </div>
                  </div>
                </div>
              )}

              {(currentStep === 1 ||
                currentStep === 2 ||
                currentStep === 3) && (
                <div className={styles.mainContent}>
                  <div className={styles.firstStepDetail}>
                    <div className={styles.bigTitle}>
                      <div className={styles.bolderIcon} />
                      <div className={styles.titleIcon} />
                      <span>
                        1: {formatMessage({ id: 'i18n_step_1_invite_member' })}
                      </span>
                    </div>

                    <div className={styles.inviteMemberEmail}>
                      <div className={styles.inviteMemberMobile}>
                        <div className={styles.itemInvite}>
                          <div className={styles.title}>
                            <span>
                              {formatMessage({ id: 'i18n_pattern' })} 1:
                            </span>
                            <img src={emailIcon} width="25" height="25" />
                            <span>
                              {formatMessage({
                                id: 'i18n_step_1_invite_email',
                              })}
                            </span>
                            <Tooltip
                              title={
                                <TooltipFormat
                                  dataFormat={listDataTooltipInvitedEmailStep1}
                                />
                              }
                            >
                              <img
                                src={helper}
                                style={{ margin: '10px' }}
                                className="helper"
                              />
                            </Tooltip>
                          </div>
                          <div className={styles.tbScroll}>
                            <table className={styles.tableInvite}>
                              {listEmailInvite('Mobile')}
                            </table>
                          </div>
                          <div className={styles.dFlex}>
                            <Button
                              htmlType="button"
                              loading={sendEmailLoading}
                              className={`btn btnGreen btn-custom-height`}
                              style={{
                                cursor: `${
                                  isDisableInputEmail(listEmail)
                                    ? 'not-allowed'
                                    : 'pointer'
                                }`,
                              }}
                              onClick={sendEmail}
                              disabled={isDisableInputEmail(listEmail)}
                            >
                              {formatMessage({ id: 'i18n_send_email' })}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className={styles.inviteMemberMobile}>
                        <div className={styles.itemInvite}>
                          <div className={styles.title}>
                            <span>
                              {formatMessage({ id: 'i18n_pattern' })} 2:
                            </span>
                            <img src={copyLinkIcon} width="25" height="25" />
                            <span>リンクで招待する</span>
                            <Tooltip
                              title={
                                <TooltipFormat
                                  dataFormat={listDataTooltipInvitedEmailStep2}
                                />
                              }
                              trigger={['hover', 'click']}
                            >
                              <img
                                src={helper}
                                style={{
                                  marginLeft: '10px',
                                  marginTop: '-2px',
                                }}
                                className="helper"
                              />
                            </Tooltip>
                          </div>
                          <div className={styles.dFlex}>
                            <Button
                              htmlType="button"
                              loading={sendEmailLoading}
                              className={`btn btnGreen btn-custom-height`}
                              onClick={copyLink}
                              disabled={history.location.query.role === 'true'}
                              style={{
                                cursor: `${
                                  history.location.query.role === 'true'
                                    ? 'not-allowed'
                                    : 'pointer'
                                }`,
                              }}
                            >
                              {formatMessage({ id: 'i18n_copy_link' })}
                            </Button>
                          </div>
                          <div className={styles.imgContainer}>
                            <img
                              className={styles.linkInviteImg}
                              src={LinkInvite}
                              alt="Link Invite"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.secondStepHeader} ref={handleScroll}>
                      <div>
                        <div className={styles.bigTitle}>
                          <div className={styles.bolderIcon} />
                          <div className={styles.titleIcon} />
                          <span>
                            2: {formatMessage({ id: 'i18n_title_vote_tow' })}
                          </span>
                          <Tooltip
                            title={formatMessage({
                              id: 'i18n_vote_tooltip_confirm',
                            })}
                          >
                            <img
                              src={helper}
                              style={{ margin: '10px' }}
                              className="helper"
                            />
                          </Tooltip>
                        </div>
                        <div className={styles.noteStyle}>
                          {formatMessage({ id: 'i18n_invite_member_note_2' })}
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.templateContent}`}>
                      <Table
                        className={styles.tableVoted}
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        onRow={onRow}
                        scroll={{ y: 940 }} // if(block > 10) => scroll
                        bordered
                        summary={pageData => {
                          const ScrollContext = voteUser.map((vote, index) => (
                            <Table.Summary.Cell
                              key={index}
                              index={3 + index}
                              align="center"
                            >
                              {vote.comment}
                            </Table.Summary.Cell>
                          ));
                          return (
                            <Table.Summary fixed>
                              <Table.Summary.Row className={styles.sumaryRow}>
                                <Table.Summary.Cell
                                  index={0}
                                  colSpan={3}
                                  align="center"
                                >
                                  コメント
                                </Table.Summary.Cell>
                                {ScrollContext}
                              </Table.Summary.Row>
                            </Table.Summary>
                          );
                        }}
                      />
                    </div>
                    <div
                      className={styles.secondStepHeader}
                      ref={handleScrollFinished}
                    >
                      <div>
                        <div className={styles.bigTitle}>
                          <div className={styles.bolderIcon} />
                          <div className={styles.titleIcon} />
                          <span>
                            3:{' '}
                            {formatMessage({ id: 'i18n_step_1_confirm_day' })}
                          </span>
                        </div>
                        <div className={styles.noteStyle}>
                          {formatMessage({ id: 'i18n_invite_member_note_3' })}
                        </div>
                      </div>
                    </div>
                    <div className={styles.buttonSubmit}>
                      <Button
                        htmlType="button"
                        loading={sendEmailLoading}
                        className={listCssBtnConfirmEmail()}
                        onClick={handleSubmit}
                        disabled={disabledConfirmEmail()}
                      >
                        {formatMessage({ id: 'i18n_confirm_invite_member' })}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <CloseVote
              userInfo={profile}
              eventInfo={informationVote}
              choices={eventChoose}
            />
          )}
        </div>
      )}
      <Footer />
      <MenuSPBottom />
    </Layout>
  );
}

export default connect(({ EVENT, MASTER, VOTE }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  voteStore: VOTE,
}))(withRouter(InviteMember));
