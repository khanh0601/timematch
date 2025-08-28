import circleFourIcon from '@/assets/images/circle-four.png';
import circleTwoIcon from '@/assets/images/circle-two.png';
import circleOneIcon from '@/assets/images/circle-one.png';
import downTBIcon from '@/assets/images/down-tb.svg';
import comment from '@/assets/images/i-comment.svg';
import pinned from '@/assets/images/i-pinned.svg';
import user from '@/assets/images/i-user.png';
import helper from '@/assets/images/imgQuestion.png';
import logoImage from '@/assets/images/logo-black.svg';
import multiUserIcon from '@/assets/images/multi-users.svg';
import triangleOneIcon from '@/assets/images/triangle-one.png';
import triangleTwoIcon from '@/assets/images/triangle-two.png';
import userBoldIcon from '@/assets/images/user-bold.png';
import xOneIcon from '@/assets/images/x-one.png';
import xThreeIcon from '@/assets/images/x-three.png';
import xTwoIcon from '@/assets/images/x-two.png';
import {
  getCookie,
  getJPMonthAndDay,
  getStep,
  meetingMethod,
  profileFromStorage,
} from '@/commons/function.js';
import useWindowDimensions from '@/commons/useWindowDimensions';
import Footer from '@/components/Footer';
import HeaderPreview from '@/components/HeaderPreview';
import { HOUR_FORMAT } from '@/constant';
import {
  Button,
  Col,
  Collapse,
  Dropdown,
  Layout,
  Menu,
  message,
  Modal,
  Row,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { history, useIntl, withRouter } from 'umi';
import ConfirmVote from './ConfirmVote';
import styles from './styles.less';
import SuccessVote from './SuccessVote';
import { createTimeAsync, meetingCategory, tz } from '../../commons/function';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TooltipFormat from '../../components/TooltipFormat';

const { confirm } = Modal;

const listDataTooltipOverviewVote = [
  'すでに投票したユーザーの投票内容を確認できます。',
  '※投票日時で〇が一番多い日時の背景が「緑色」になっています。',
];

function Vote({
  location,
  dispatch,
  voteStore,
  preview,
  dataPreview,
  dataCreateTeam,
  onBackPrevious,
  eventStore,
  calendarStore,
}) {
  const {
    voteLoading,
    informationVote,
    eventDateTimeGuest,
    voteGuest,
  } = voteStore;
  const { Panel } = Collapse;
  const { width } = useWindowDimensions();
  const [userByCode, setUserByCode] = useState({});
  const intl = useIntl();
  const { formatMessage } = intl;
  const [eventInfo, setEventInfo] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const bookingState = true;
  const isLogin = getCookie('token');
  const [loadingVote, setLoadingVote] = useState(false);
  const [choices, setChoices] = useState([]);
  const [listIndexMost, setListIndexMost] = useState([]);
  const [noticeWrong, setNoticeWrong] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [heightPX, setHeightPX] = useState(91);
  const [heightPXVoted, setHeightPXVoted] = useState(57);
  const [modalInforSm, setModalInforSm] = useState(false);
  const [isPreview, setPreview] = useState(false);
  const [widthVoteTime, setWidthVoteTime] = useState(165);
  const [widthVoteAmount, setWidthVoteAmount] = useState(150);
  const [widthVoter, setWidthVoter] = useState(125);
  const [arrDataBooking, setArrDataBooking] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const { pathname } = location;
    setPreview(pathname === '/preview-vote' || preview);
    if (!preview) {
      getData();
    }
    if (preview) {
      window.scrollTo(0, 0);
    }
  }, []);

  const loadVoteGuestSummary = async id => {
    const profile = profileFromStorage();
    const payload = {
      vote: id,
      user_code: profile ? profile.code : '',
      type: 2, // screen B
    };
    await dispatch({ type: 'VOTE/getVoteGuestSummary', payload });
  };

  // useEffect(async () => {
  //   const {idEvent, id} = location.query
  //   if (id) {
  //     await loadVoteGuestSummary(idEvent)
  //   }
  //   if (idEvent) {
  //     await loadVoteGuestSummary(dataPreview.name)
  //   }
  // }, [location.query])
  /**
   * Listen websocket
   */
  // useEffect(() => {
  //   connectChannelUpdateVote(informationVote?.id);
  // }, []);

  useEffect(() => {
    if (preview) {
      return;
    }
    !eventDateTimeGuest &&
      history.push({ pathname: '/', search: '?tab=2&team_all=true' });
  }, [eventDateTimeGuest]);

  useEffect(() => {
    if (informationVote) {
      const {
        user,
        real_category,
        block_number,
        location_name,
        m_location_id,
        calendar_create_comment,
        event_datetimes,
      } = informationVote;
      setUserByCode({
        avatar: user.avatar || '',
        company: user.company || '',
        name: user.name,
      });
      setEventInfo({
        real_category: real_category,
        block_number: block_number,
        m_location_id: m_location_id,
        location_name: location_name,
        calendar_create_comment: calendar_create_comment || '',
      });
      const temChoices = event_datetimes.map(item => ({
        event_datetime_id: item.id,
        start_time: item.start_time,
        end_time: item.end_time,
        option: null,
      }));
      setChoices(temChoices);
      const temHeightPX = event_datetimes.length * 92;
      if (temHeightPX > 910) {
        setHeightPX(910);
      } else {
        setHeightPX(temHeightPX);
      }
      const temHeightPXVoted = event_datetimes.length * 60;
      if (temHeightPX > 570) {
        setHeightPXVoted(570);
      } else {
        setHeightPXVoted(temHeightPXVoted);
      }
    }
  }, [informationVote]);

  useEffect(() => {
    if (dataPreview) {
      const {
        block_number,
        m_location_id,
        location_name,
        event_datetimes,
        profile,
        dataCreateTeam,
      } = dataPreview;
      const temChoices = event_datetimes.map(item => ({
        event_datetime_id: item.id,
        start_time: item.start_time,
        end_time: item.end_time,
        option: null,
      }));
      setChoices(temChoices);

      setUserByCode(
        dataCreateTeam ? { ...profile } : { ...calendarStore.userEdit },
      );

      setEventInfo({
        block_number: block_number,
        m_location_id: m_location_id,
        location_name: location_name,
      });
      setArrDataBooking(
        event_datetimes
          .filter(item => !item.isBooked)
          .map(item => ({
            ...item,
            start_time: moment(item.start_time).format('YYYY-MM-DD HH:mm:ss'),
            end_time: moment(item.end_time).format('YYYY-MM-DD HH:mm:ss'),
          })),
      );

      const temHeightPX = event_datetimes.length * 92;
      if (temHeightPX > 910) {
        setHeightPX(910);
      } else {
        setHeightPX(temHeightPX);
      }
      const temHeightPXVoted = event_datetimes.length * 60;
      if (temHeightPX > 570) {
        setHeightPXVoted(570);
      } else {
        setHeightPXVoted(temHeightPXVoted);
      }

      const listCountVote = event_datetimes.map((item, indexTime) => ({
        ...item,
        key: indexTime,
        choices: item.choices || [],
        choices_count: item.choices_count || 0,
      }));
      setDataSource(listCountVote);
    }
  }, [dataPreview]);
  /**
   * Render most vote
   */
  useEffect(() => {
    if (!eventDateTimeGuest.length || preview) {
      return;
    }

    setArrDataBooking(eventDateTimeGuest);

    let keyMost = 0;
    let arrKeySelect = [];

    eventDateTimeGuest.forEach((item, index) => {
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

    const listCountVote = eventDateTimeGuest.map((item, indexTime) => ({
      ...item,
      key: indexTime,
    }));
    setDataSource(listCountVote);
  }, [eventDateTimeGuest]);

  /**
   * connectChannelUpdateVote
   * @param eventId
   */
  const connectChannelUpdateVote = eventId => {
    if (!eventId) {
      return;
    }
    window.Echo.channel('voting_channel.' + eventId).listen(
      '.update_vote',
      e => {
        console.log(e.payload);
        console.log(e.payload.choices);
      },
    );
  };

  const getData = async () => {
    const profile = profileFromStorage();
    const payload = {
      vote: location.query.id,
      user_code: profile ? profile.code : '',
      type: 2, // screen B
    };
    const payloadShow = {
      id: location.query.id,
    };
    if (location.query.name) {
      payloadShow.name = location.query.name;
    } else if (location.query.invitee) {
      payloadShow.invitee = location.query.invitee;
    } else if (location.query.code) {
      payloadShow.code = location.query.code;
    }
    await dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
    const { startTime, endTime } = createTimeAsync();
    await dispatch({
      type: 'VOTE/getVoteGuestSummary',
      payload: {
        ...payload,
        start: startTime,
        end: endTime,
        timeZone: tz(),
      },
    });
  };

  const timeSetting = (
    <div className={styles.numberAccountContent} style={{ margin: 0 }}>
      <div className={styles.numberAccountBorder} />
      <div className={styles.numberAccountTitle}>
        {formatMessage({ id: 'i18n_page_vote' })}
      </div>
      <div className={styles.noteVote}>
        {formatMessage({ id: 'i18n_note_vote' })}
      </div>
      <Tooltip
        title={<TooltipFormat dataFormat={listDataTooltipOverviewVote} />}
      >
        <img src={helper} style={{ margin: '10px' }} className="helper" />
      </Tooltip>
    </div>
  );

  const menuSort = (
    <Menu className={styles.eventTypeOption}>
      <Menu.Item key="0">
        <div
          onClick={() =>
            dispatch({
              type: 'VOTE/setEventDateTimeGuestDESC',
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

  const handleScroll = ref => {
    if (ref && location.query.chooseSchedule) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChoose = (value, index) => {
    const temChoices = [...choices];
    temChoices[index].option = value;
    setChoices(temChoices);
  };

  const backToFirstStep = async () => {
    setCurrentStep(1);
  };

  const checkEventCode = () => {
    const callback = {
      func: handleAfterCheckEventCode,
    };
    return dispatch({ type: 'EVENT/checkEventCode', payload, callback });
  };

  const handleSubmit = nameCreaterEvent => {
    if (isPreview) {
      return;
    }
    if (
      choices[0] &&
      informationVote.min_vote_number &&
      choices.filter(item => item.option).length <
        informationVote.min_vote_number &&
      !noticeWrong
    ) {
      const { min_vote_number } = informationVote;
      confirm({
        title: (
          <div>
            <p className="mb-0">
              {nameCreaterEvent}様は{min_vote_number}
              個以上の候補日程の選択をご希望されていますが、ご希望の選択数に足りておりません。
            </p>
            <p className="mb-0">このまま進めてよろしいでしょうか？</p>
          </div>
        ),
        icon: <ExclamationCircleOutlined />,
        okText: 'はい',
        cancelText: 'いいえ',
        onOk: () => {
          setCurrentStep(2);
        },
      });

      // setNoticeWrong(true);
    }
    if (
      noticeWrong ||
      !informationVote.min_vote_number ||
      (informationVote.min_vote_number &&
        choices.filter(item => item.option).length >=
          informationVote.min_vote_number)
    ) {
      setCurrentStep(2);
    }
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

  useEffect(() => {
    if (width <= 767) {
      setWidthVoteTime(130);
      setWidthVoteAmount(89);
      setWidthVoter(100);
    } else {
      setWidthVoteTime(165);
      setWidthVoteAmount(150);
      setWidthVoter(125);
    }
  }, [width]);

  const columns = [
    {
      title: formatMessage({ id: 'i18n_vote_time' }),
      width: widthVoteTime,
      key: 'vote_time',
      align: 'center',
      // fixed: 'left',
      render: item => {
        const { choices_count } = item;
        return (
          <div>
            {getJPMonthAndDay(item.start_time)}
            &nbsp;&nbsp;&nbsp;&nbsp;
            {moment(item.start_time).format('(dd)')}
            <br />
            {moment(item.start_time).format(HOUR_FORMAT)}
            &nbsp; ～ &nbsp;
            {moment(item.end_time).format(HOUR_FORMAT)}
          </div>
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
      render: item => {
        const { choices_count } = item;
        return (
          <div>
            <img
              src={userBoldIcon}
              height="25"
              style={{ marginRight: '10px' }}
            />
            {choices_count} 人
          </div>
        );
      },
    },
  ];

  if (!preview) {
    for (let i = 0; i < voteGuest.length; i++) {
      const vote = voteGuest[i];

      columns.push({
        title: vote.name + ' 様',
        key: i,
        align: 'center',
        width: widthVoter,
        render: item => {
          const { choices, choices_count } = item;
          const temVote =
            choices[0] && choices.find(choose => choose.voter_id === vote.id);

          return (
            // <div className={styles.dFlexCenter}>
            <div>
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
  }
  // for (let i = 0; i < eventDateTimeGuest.length; i++) {
  //   const item = eventDateTimeGuest[i];
  //
  //   const newObject = {
  //     key: i,
  //     ...item,
  //   };
  //
  //   dataSource.push(newObject);
  // }

  const showInforBooking = value => {
    setModalInforSm(value);
  };

  const onBack = () => {
    if (preview) {
      onBackPrevious();
      return;
    }
    history.goBack();
  };

  const onRow = ({ key }) =>
    listIndexMost.includes(key) && { className: `${styles.mostVote}` };

  const formatCategory = categoryId => {
    const { listEventCategories } = eventStore;
    if (!categoryId || !listEventCategories) {
      return;
    }
    return listEventCategories
      .filter(item => item.id === categoryId)
      .map(item => item.name);
  };

  return (
    <Layout
      className={styles.mainLayout}
      style={{
        paddingBottom: width <= 767 && isLogin ? '0' : isLogin ? '0' : '0',
      }}
    >
      <HeaderPreview
        userByCode={userByCode}
        bookingState={bookingState}
        togetherModalInfor={() => showInforBooking(true)}
        isVote
        currentStep={currentStep}
        previewCalendar={preview}
      />

      {voteLoading ? (
        <Spin className="loading-page" size="large" />
      ) : (
        <div className={styles.bookingBottom}>
          <div
            className={`${styles.scheduleAdjustment} ${styles.bookingStep1}`}
          >
            {isPreview && (
              <div className={styles.mainContent}>
                <div className={styles.backToList}>
                  <div className={`${styles.noticeText}`}>
                    <p>
                      こちらが、調整相手に表示するプレビュー画面です。
                      <br className={styles.desktop} />
                      ご確認ください。
                    </p>
                  </div>
                  <div className={styles.btnZone}>
                    <Button onClick={onBack}>戻る</Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep !== 4 && (
              <div className={styles.mainContent}>
                <div className={styles.numberAccountContent}>
                  <div className={styles.numberAccountBorder} />

                  {currentStep === 1 && (
                    <div>
                      <div className={styles.numberAccountTitle}>
                        <span>日程調整するため、</span>
                        <br />
                        <span>下記候補日時のご都合を</span> <br />
                        <div className={styles.iconVoteGroup}>
                          <div className={styles.bgCircle} />
                        </div>
                        <div className={styles.iconVoteGroup}>
                          <div className={styles.bgTriangle} />
                        </div>
                        <div className={styles.iconVoteGroup}>
                          <div className={styles.bgXOne} />
                        </div>
                        <span>より選択ください。</span>
                      </div>

                      <p
                        className={`${styles.pinnedText} ${styles.pinnedTextVoteTop}`}
                      >
                        <img src={multiUserIcon} />3{' '}
                        {formatMessage({
                          id: 'i18n_coordination_between_companies_design',
                        })}
                      </p>

                      <span className={styles.numberAccountDescription}>
                        ※選択後、「次へ」のボタンをクリックください。
                      </span>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div>
                      <div className={styles.numberAccountTitle}>
                        お名前・メールアドレスをご入力の上
                        <br />
                        「完了する」をクリックしてください。
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={`${styles.firstStep} ${
                      currentStep === 1 ? styles.activeStep : ''
                    }`}
                  >
                    <span>1</span>
                    <p>ご都合の良い日時を選択</p>
                  </div>
                  <div
                    className={`${styles.endStep} ${
                      currentStep === 2 ? styles.activeStep : ''
                    }`}
                  >
                    <span>2</span>
                    <p>{formatMessage({ id: 'i18n_step_2_in_vote' })}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep !== 4 && (
              <div className={styles.mainContent}>
                <div
                  className={`${styles.firstStepDetail} ${
                    currentStep === 2 ? styles.secondStepDetail : ''
                  }`}
                >
                  <Row>
                    <Col
                      xs={0}
                      sm={0}
                      md={8}
                      xl={6}
                      xxl={6}
                      className={styles.boxInforUser}
                    >
                      <p
                        className={`${styles.pinnedText} ${styles.pinnedTextVoteTop}`}
                      >
                        <img
                          className={styles.imagePinned}
                          src={multiUserIcon}
                        />
                        3{' '}
                        {formatMessage({
                          id: 'i18n_coordination_between_companies_design',
                        })}
                      </p>

                      <p className={styles.pinnedText}>
                        <img className={styles.imagePinned} src={user} />
                        {formatMessage({ id: 'i18n_user_info_booking' })}
                      </p>
                      {userByCode?.company && (
                        <div className={styles.userInfo}>
                          <p>
                            <span className={styles.infoCompany}>
                              {userByCode?.company}
                            </span>
                          </p>
                        </div>
                      )}

                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                          <img
                            src={
                              userByCode?.avatar
                                ? userByCode?.avatar
                                : logoImage
                            }
                          />
                        </div>
                        <p>
                          <span className={styles.infoName}>
                            {userByCode?.name}
                          </span>
                        </p>
                      </div>
                      <div className={styles.meetingInfo}>
                        <p
                          className={`${styles.pinnedText} ${styles.pinnedTextSecond}`}
                        >
                          <img src={pinned} />
                          {formatMessage({ id: 'i18n_meeting' })}
                        </p>
                      </div>
                      <div className={styles.meetingDetail}>
                        {formatMessage({ id: 'i18n_required_time' })}：
                        {getStep(eventInfo)}
                        {formatMessage({ id: 'i18n_minute' })}
                        <br />
                        <div className={styles.mt15} />
                        {formatMessage({ id: 'i18n_meeting_formality' })}：
                        {dataPreview
                          ? meetingCategory(dataPreview.m_category_id)
                          : eventInfo.real_category}
                        <br />
                        <div className={styles.mt15} />
                        {formatMessage({ id: 'i18n_meeting_method' })}：
                        <span className={styles.meetingMethod}>
                          {meetingMethod(eventInfo)}
                        </span>
                        {/*<pre>{eventInfo.calendar_create_comment}</pre>*/}
                      </div>
                      <div className={styles.meetingComment}>
                        <p className={styles.pinnedText}>
                          <img src={comment} />
                          {userByCode?.name}
                          {formatMessage({ id: 'i18n_comment_from' })}
                        </p>
                        {/*<pre>{eventInfo.calendar_create_comment}</pre>*/}
                      </div>
                      <div className={styles.secondStepHeader}>
                        <div className={styles.searchKeyword}>
                          <textarea
                            value={
                              eventInfo.calendar_create_comment || undefined
                            }
                            disabled
                          />
                        </div>
                        {!isLogin && (
                          <div className={styles.suggestLogin}>
                            {currentStep === 1 && (
                              // <p>
                              //   新規登録（無料）・ログイン <br /> いただくと、
                              //   あなたの予定が
                              //   <br /> 入っている箇所が表示され便利です。
                              // </p>
                              <>
                                <p>
                                  {formatMessage({
                                    id: 'i18n_suggest_login_line_1',
                                  })}
                                </p>
                                <p>
                                  {formatMessage({
                                    id: 'i18n_suggest_login_line_2',
                                  })}
                                </p>
                                <p>
                                  {formatMessage({
                                    id: 'i18n_suggest_login_line_3',
                                  })}
                                </p>
                              </>
                            )}

                            {currentStep === 2 && (
                              <>
                                <p>新規登録・ログインいただくと、</p>
                                <p>「〇」「△」を選択された予定が「仮予約」</p>
                                <p>として自動登録され便利です。</p>
                              </>
                            )}

                            <div className={styles.btnZone}>
                              <Button
                                className={styles.signUpBtn}
                                onClick={() => history.push('/registration')}
                              >
                                {formatMessage({
                                  id: 'i18n_register_new_free_acc',
                                })}
                              </Button>
                              <Button
                                className={styles.signInBtn}
                                onClick={() => history.push('/login')}
                              >
                                {formatMessage({ id: 'i18n_btn_login' })}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={16}
                      xl={18}
                      xxl={18}
                      className={styles.boxBooking}
                    >
                      <div className={styles.calendar}>
                        {currentStep === 1 && (
                          <>
                            <div
                              className={styles.tbScroll}
                              style={{ height: `${heightPX}px` }}
                            >
                              <table className={styles.tableActionVote}>
                                {arrDataBooking &&
                                  arrDataBooking.map((item, index) => (
                                    <Row
                                      key={index}
                                      className={`${styles.row} ${
                                        item.is_busy ? styles.bgGrey : ''
                                      }`}
                                      align="middle"
                                    >
                                      <Col
                                        xs={8}
                                        sm={10}
                                        md={14}
                                        className={styles.column}
                                      >
                                        <div className={styles.datePC}>
                                          {getJPMonthAndDay(item.start_time)}{' '}
                                          &nbsp;
                                          {moment(item.start_time).format(
                                            '(dd)',
                                          )}{' '}
                                          &nbsp;
                                          {moment(item.start_time).format(
                                            HOUR_FORMAT,
                                          )}
                                          &nbsp; ～ &nbsp;
                                          {moment(item.end_time).format(
                                            HOUR_FORMAT,
                                          )}
                                        </div>
                                        <div className={styles.dateMobile}>
                                          <p>
                                            {getJPMonthAndDay(item.start_time)}{' '}
                                            &nbsp;{' '}
                                            {moment(item.start_time).format(
                                              '(dd)',
                                            )}
                                          </p>
                                          <p>
                                            {moment(item.start_time).format(
                                              HOUR_FORMAT,
                                            )}{' '}
                                            &nbsp; ～ &nbsp;{' '}
                                            {moment(item.end_time).format(
                                              HOUR_FORMAT,
                                            )}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col
                                        xs={16}
                                        sm={14}
                                        md={10}
                                        className={styles.column}
                                      >
                                        <div className={styles.dFlexCenter}>
                                          {choices &&
                                          choices[0] &&
                                          choices[index]?.option === 1 ? (
                                            <div
                                              className={`${styles.iconChoose} ${styles.active}`}
                                              onClick={() =>
                                                handleChoose(0, index)
                                              }
                                            >
                                              <img src={circleTwoIcon} />
                                            </div>
                                          ) : (
                                            <div
                                              className={`${styles.iconChoose}`}
                                              onClick={() =>
                                                handleChoose(1, index)
                                              }
                                            >
                                              <img src={circleOneIcon} />
                                            </div>
                                          )}

                                          {choices &&
                                          choices[0] &&
                                          choices[index]?.option === 2 ? (
                                            <div
                                              className={`${styles.iconChoose} ${styles.active}`}
                                              onClick={() =>
                                                handleChoose(0, index)
                                              }
                                            >
                                              <img
                                                src={triangleTwoIcon}
                                                alt="triangle Two Icon"
                                              />
                                            </div>
                                          ) : (
                                            <div
                                              className={`${styles.iconChoose}`}
                                              onClick={() =>
                                                handleChoose(2, index)
                                              }
                                            >
                                              <img
                                                src={triangleOneIcon}
                                                alt="triangle One Icon"
                                              />
                                            </div>
                                          )}

                                          {choices &&
                                          choices[0] &&
                                          choices[index]?.option === 3 ? (
                                            <div
                                              className={`${styles.iconChoose} ${styles.active}`}
                                              onClick={() =>
                                                handleChoose(0, index)
                                              }
                                            >
                                              <img src={xTwoIcon} />
                                            </div>
                                          ) : (
                                            <div
                                              className={`${styles.iconChoose}`}
                                              onClick={() =>
                                                handleChoose(3, index)
                                              }
                                            >
                                              <img src={xOneIcon} />
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  ))}
                              </table>
                            </div>
                            <div style={{ display: 'block' }}>
                              <div className={styles.noteStyle}>
                                {/*{formatMessage({ id: 'i18n_vote_note' })}*/}※
                                ログインいただくと、あなたのカレンダーに予定が入っている日時が「グレー色」になります。
                              </div>
                            </div>
                            <div className={styles.dFlex}>
                              <Button
                                htmlType="button"
                                loading={loadingVote}
                                className={`btn btnGreen btn-custom-height`}
                                style={{
                                  width: '10rem',
                                  padding: '0 !important',
                                }}
                                onClick={() => handleSubmit(userByCode?.name)}
                                disabled={
                                  !(
                                    choices &&
                                    choices[0] &&
                                    choices.find(item => item.option)
                                  )
                                }
                              >
                                {formatMessage({ id: 'i18n_btn_next' })}
                              </Button>
                            </div>
                            <div
                              className={`${styles.advancedSettingContainer} ${styles.templateContent}`}
                            >
                              <Collapse
                                expandIconPosition="right"
                                defaultActiveKey={['1']}
                              >
                                <Panel
                                  header={timeSetting}
                                  key="1"
                                  className={styles.collapseSettingContainer}
                                >
                                  <Table
                                    className={styles.tableVoted}
                                    dataSource={dataSource}
                                    columns={columns}
                                    pagination={false}
                                    onRow={onRow}
                                    scroll={{ y: 940 }} // if(block > 10) => scroll
                                    bordered
                                    summary={pageData => {
                                      const ScrollContext = voteGuest.map(
                                        (vote, index) => (
                                          <Table.Summary.Cell
                                            key={index}
                                            index={2 + index}
                                            align="center"
                                          >
                                            {vote.comment}
                                          </Table.Summary.Cell>
                                        ),
                                      );
                                      return (
                                        <Table.Summary fixed>
                                          <Table.Summary.Row
                                            className={styles.sumaryRow}
                                          >
                                            <Table.Summary.Cell
                                              index={0}
                                              colSpan={2}
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
                                </Panel>
                              </Collapse>
                            </div>
                          </>
                        )}

                        {currentStep === 2 && (
                          <ConfirmVote
                            onCancel={() => backToFirstStep()}
                            event_code={history.location.query.event_code}
                            user_code={history.location.query.user_code}
                            choices={choices}
                            custom_type={Number(
                              history.location.query.custom_type,
                            )}
                            eventInfo={eventInfo}
                            nextStep={user => {
                              setCurrentStep(4);
                              setUserInfo(user);
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <SuccessVote
                userInfo={userInfo}
                eventInfo={informationVote}
                choices={choices}
                type={2}
              />
            )}
          </div>

          <Modal
            title=""
            maxWidth={350}
            visible={modalInforSm}
            footer={null}
            onCancel={() => showInforBooking(false)}
          >
            <div
              className={`${styles.scheduleAdjustment} ${styles.scheduleAdjustmentModal}`}
            >
              <div className={styles.mainContent}>
                <div className={styles.firstStepDetail}>
                  <p
                    className={`${styles.pinnedText} ${styles.pinnedTextVoteTop}`}
                  >
                    <img className={styles.imagePinned} src={multiUserIcon} />3{' '}
                    {formatMessage({
                      id: 'i18n_coordination_between_companies_design',
                    })}
                  </p>
                  <p className={styles.pinnedText}>
                    <img className={styles.imagePinned} src={user} />
                    {formatMessage({ id: 'i18n_user_info_booking' })}
                  </p>
                  <div className={styles.userInfo}>
                    {userByCode?.avatar ? (
                      <div className={styles.avatar}>
                        <img src={userByCode?.avatar} />
                      </div>
                    ) : (
                      <div className={styles.avatar}>
                        <img src={logoImage} />
                      </div>
                    )}
                    <p>
                      <span className={styles.infoCompany}>
                        {userByCode?.company}
                      </span>
                      {userByCode?.company ? <br /> : null}
                      <span className={styles.infoName}>
                        {userByCode?.name}
                      </span>
                    </p>
                  </div>

                  <div className={styles.dottedBar}>
                    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . . . .
                  </div>

                  <div className={styles.meetingInfo}>
                    <p
                      className={`${styles.pinnedText} ${styles.pinnedTextSecond}`}
                    >
                      <img src={pinned} />
                      {formatMessage({ id: 'i18n_meeting' })}
                    </p>
                    <div className={styles.meetingDetail}>
                      {formatMessage({ id: 'i18n_required_time' })}：
                      {getStep(eventInfo)}
                      {formatMessage({ id: 'i18n_minute' })}
                      <br />
                      <div className={styles.mt15} />
                      {formatMessage({ id: 'i18n_meeting_formality' })}：
                      {dataPreview
                        ? meetingCategory(dataPreview.m_category_id)
                        : eventInfo.real_category}
                      <br />
                      <div className={styles.mt15} />
                      {formatMessage({ id: 'i18n_meeting_method' })}：
                      <span className={styles.meetingMethod}>
                        {meetingMethod(eventInfo)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.dottedBar}>
                    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . . . .
                  </div>

                  <div className={styles.meetingComment}>
                    <p className={styles.pinnedText}>
                      <img src={comment} />
                      {userByCode?.name}
                      {formatMessage({ id: 'i18n_comment_from' })}
                    </p>
                    {/*<pre>{eventInfo.calendar_create_comment}</pre>*/}
                  </div>
                  {/*<div className={styles.secondStepHeader}>*/}
                  {/*  {formatMessage({ id: 'i18n_comment_from' })}*/}
                  {/*</div>*/}
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}

      <Footer footerSuccessVote={currentStep === 4} />

      {!isLogin && (
        <>
          <div
            className={`${styles.footerNotLogin} ${
              currentStep === 4 ? styles.footerNotLoginSuccessVote : ''
            }`}
          >
            {currentStep === 1 && (
              <div>
                <p>新規会員登録・ログインいただくと、</p>
                <p>あなたの予定が入っている箇所が表示され便利です。</p>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <p>新規登録・ログインいただくと、「〇」「△」を選択</p>
                <p>された予定が「仮予約」として自動登録され便利です。</p>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <p>
                  新規登録・ログインいただくと、「〇」「△」を選択
                  された予定が「仮予約」として自動登録され便利です。
                </p>
              </div>
            )}

            <div className={styles.buttonLoginFooter}>
              <Button onClick={() => history.push('/registration')}>
                {formatMessage({
                  id: 'i18n_register_new_free_acc',
                })}
              </Button>
              <Button onClick={() => history.push('/login')}>
                {formatMessage({ id: 'i18n_btn_login' })}
              </Button>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default connect(({ VOTE, EVENT, CALENDAR_CREATION }) => ({
  voteStore: VOTE,
  eventStore: EVENT,
  calendarStore: CALENDAR_CREATION,
}))(withRouter(Vote));
