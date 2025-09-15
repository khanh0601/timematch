import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Collapse,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Tooltip,
} from 'antd';
import { Link, useDispatch, useIntl } from 'umi';
import { connect } from 'dva';
import moment from 'moment/moment';
import { jaJP } from 'antd/lib/locale-provider/ja_JP';
import locale from 'antd/es/locale/ja_JP';
import styles from './styles.less';
import {
  EVENT_RELATIONSHIP_TYPE,
  YYYYMMDD,
  YYYYMMDDTHHmm,
  ROUTER,
} from '@/constant';
import { autoGenerateRangeDateToBlock } from '@/commons/functionMobileV2';
// components
import {
  addEventMobile,
  deleteEventMobile,
  memberCheckedMobile,
  nextWeek,
  prevWeek,
  resizeEvent,
  sendAddMemberEmail,
  setCalendarRef,
  setCheckedGenerateBlockCalendar,
  setDataEventMobile,
  setBlockCalendar,
  setViewEventCalendar,
  setCurrentStartDate,
  toggleBlockCalendar,
} from '@/components/Mobile/AvailableTime/actions';
import HeaderMobile from '@/components/Mobile/Header';
import Navigation from '@/components/Mobile/Navigation';
import AvailableTime from '@/components/Mobile/AvailableTime';
import CalendarSidebar from '@/components/Mobile/CalendarSidebar';
import CalendarToolbarFooter from '@/components/Mobile/CalendarToolbarFooter';
import TeamList from '@/components/Mobile/AvailableTime/components/TeamList';
// icons
import iconTitle from '@/assets/images/i-title.png';
import iconTime from '@/assets/images/i-clock.png';
import iconMemo from '@/assets/images/i-memo.png';
import iconQuestion from '@/assets/images/i-question.png';
import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';
import iconDoc from '@/assets/images/document.svg';
import iconUser from '@/assets/images/user2.svg';
import iconCalendarClose from '@/assets/images/i-close-white.png';

import { notify, profileFromStorage } from '../../../commons/function';
import { loadingData, syncCalendar } from './actions';
import { history } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import useIsPc from '@/hooks/useIsPc';
import EventBus, {
  EventBusNames,
  eventCheckedGenerateBlock,
} from '@/util/eventBus';

function CalendarCreation(props) {
  const {
    // state
    onSetCalendarRef,
    calendarStore,
    eventStore,
    availableTime,
    // action
    onSyncCalendar,
    onLoadingData,
    onAddEvent,
    onDeleteEvent,
    onSendAddMemberEmail,
    onMemberChecked,
    onNextWeek,
    onPrevWeek,
    onSetDataEventMobile,
    onSetBlockCalendar,
    onSetViewEventCalendar,
    onSetCurrentStartDate,
  } = props;

  const {
    isLoadingEvent,
    isLoadingSync,
    totalEventType,
    listEventType,
    firstSetupFreeTime,
    createCalendarSuccess,
    dataCalendarSuccess,
    listTextAskCalendar,
    updateCalendarSuccess,
  } = eventStore;
  const {
    loading: loadingCalendarStore,
    calendarRef,
    displayEvents,
    calendarHeaders,
    bookedEvents,
    listCheckedBlockGenerate,
    memberMobile,
    customEvents,
    blockTime,
    viewEventCalendar,
    currentStartDate,
  } = availableTime;
  const { sync, loading } = calendarStore;
  const {
    text_ask_calendar_bottom,
    text_ask_calendar_top,
  } = listTextAskCalendar;

  const intl = useIntl();
  const { formatMessage } = intl;
  const profile = profileFromStorage();
  const { Panel } = Collapse;
  const calendarParentRef = React.createRef();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const pageSize = 1000000;
  const dateFormat = 'YYYY-MM-DD (ddd)';
  const timeFormat = 'HH:mm';
  const dateFormatWithoutDay = 'YYYY-MM-DD';
  const teamId = Number(history.location.query.team_id) || null;
  const eventId = Number(history.location.query.idEvent) || null;
  const isEdit = Boolean(history.location.query.edit) || false;
  const isClone = Number(history.location.query.clone) || 0;

  const [width, setWidth] = useState(window.innerWidth);
  const [pageIndex, setPageIndex] = useState(1);
  const [isBlockNumber, setBlockNumber] = useState(60);
  const [isDateTimeStart, setIsDateTimeStart] = useState(moment());
  const [isDateTimeEnd, setIsDateTimeEnd] = useState(moment().add(6, 'days'));
  const [isAutoCalendar, setIsAutoCalendar] = useState(true);
  const [isAutoExtractCandidate, setIsAutoExtractCandidate] = useState(false);
  // const [viewEventCalendar, setViewEventCalendar] = useState(3);
  const [isSelectMonth, setIsSelectMonth] = useState(false);
  const [isSelectYear, setIsSelectYear] = useState(false);
  const [changeMonth, setChangeMonth] = useState(null);
  const [changeYear, setChangeYear] = useState(null);
  const [isDetailCalendar, setIsDetailCalendar] = useState({});
  const [isURLCopy, setIsURLCopy] = useState(false);
  const [isTemplateCopy, setIsTemplateCopy] = useState(false);
  const [isCalendarTitle, setIsCalendarTitle] = useState('');
  const [isSubmitCalendarCreation, setIsSubmitCalendarCreation] = useState(
    false,
  );
  const [eventCode, setEventCode] = useState('');
  const [isCreation, setIsCreation] = useState(false);
  const [dateGenerateBlockHeader, setDateGenerateBlockHeader] = useState('');
  const [templateMail, setTemplateMail] = useState('');
  // calendar
  const [listBlockTime, setListTime] = useState([]);
  const [dateIncrement, setDateIncrement] = useState(3);
  const [firstDay, setFirstDay] = useState(moment().isoWeekday());
  const [gotoDateCalendar, setGotoDateCalendar] = useState({
    time: moment(),
    clicked: false,
  });
  const [isMemoEventMobile, setIsMemoEventMobile] = useState({});
  // loading state
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  // sidebar
  const [isSidebar, setIsSidebar] = useState(false);
  const [isMyCalendar, setIsMyCalendar] = useState([]);
  const [isOtherCalendar, setIsOtherCalendar] = useState([]);
  const [provider, setProvider] = useState(false);
  const [isInviteEmailTeamPopup, setInviteEmailTeamPopup] = useState(false);
  // popup
  const [isInviteUserEmailPopup, setInviteUserEmailPopup] = useState(false);
  const [isCreateCalendarSuccess, setIsCreateCalendarSuccess] = useState(false);
  const [isTemplateMailPreview, setIsTemplateMailPreview] = useState(false);

  const [isDataEvent, setIsDataEvent] = useState([]);
  const [isDataSync, setIsDataSync] = useState([]);

  const [currentTime, setCurrentTime] = useState(
    moment().format('HH') + ':00:00',
  );

  const isPc = useIsPc();
  const listNewEvents =
    isEdit || isClone
      ? listCheckedBlockGenerate
      : props.listNewEvents || listCheckedBlockGenerate;

  const onCheckedGenerateBlockCalendar =
    isEdit || isClone
      ? props.onCheckedGenerateBlockCalendar
      : props.onChangeListEvent || props.onCheckedGenerateBlockCalendar;

  // Get width and height of the window
  // useEffect(() => {
  //   const handleResize = () => {
  //     setWindowWidth(window.innerWidth);
  //     setWindowHeight(window.innerHeight);
  //   };
  //
  //   window.addEventListener('resize', handleResize);
  //
  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  useEffect(() => {
    EventBus.addEventListener(EventBusNames.NEW_BLOCK_TIME, e => {
      setIsAutoExtractCandidate(true);
      setDateGenerateBlockHeader(
        `${isDateTimeStart.format(dateFormat)} ~ ${(isDateTimeEnd &&
          isDateTimeEnd.format(dateFormat)) ??
          formatMessage({ id: 'i18n_datepicker_not_setting' })}`,
      );

      props.toggleBlockCalendar(e.detail);
    });
  }, []);

  // Get data from the backend for the first time
  useEffect(() => {
    onSetCalendarRef(React.createRef());
    // Get template email from setting the user
    dispatch({ type: 'EVENT/getNotifyAskCalendar' });
    // Get list event
    dispatch({
      type: 'EVENT/getListEventTypeMobile',
      payload: {
        relationship_type: EVENT_RELATIONSHIP_TYPE.vote,
        pageSize: pageSize,
        page: pageIndex,
        has_pagination: false,
      },
    });
    // Reset data calendar creation
    dispatch({ type: 'EVENT/resetDataCalendarCreation' });
    setIsCalendarTitle('');
    setEventCode('');
    form.resetFields(['calendar_title', 'meet_time', 'memo']);
    setIsCreation(false);
    setIsAutoCalendar(true);
    setIsAutoExtractCandidate(false);
    setIsCreateCalendarSuccess(false);
    onCheckedGenerateBlockCalendar({});
    onSetBlockCalendar({ time: moment(), clicked: false });
    setGotoDateCalendar(moment());
    if (profile) {
      // Sync calendar from map dispatch to props
      onSyncCalendar(profile);
      // Set current date end of the day in the generate block
      const time_period = profile?.setting?.time_period;
      let addedDay = time_period == 1 ? 6 : 7;
      let subtractDay = time_period == 1 ? 0 : 1;

      setIsDateTimeEnd(
        moment(isDateTimeStart)
          .add(
            (profile?.setting?.time_period || 1) * addedDay - subtractDay,
            'days',
          )
          .endOf('day'),
      );
    }
  }, [dispatch, props.fromPc]);

  useEffect(() => {
    const dateNow = moment().format(YYYYMMDD);
    const dateNext = moment()
      .add(profile.setting?.time_period ?? 1, 'w')
      .format(YYYYMMDD);

    const timeAsync = {
      startTime: dateNow,
      endTime: dateNext,
    };

    if (sync) {
      onLoadingData(
        teamId,
        profile.id,
        eventId,
        profile,
        isEdit,
        isClone,
        timeAsync,
      );
    }
  }, [sync]);

  useEffect(() => {
    if (!totalEventType <= 0 && !listEventType) {
      return;
    }
    setIsDataEvent(listEventType);
    const namePattern = /[?&]name=([^&]+)/;

    const flatDataEventVoted = listEventType.flatMap(item => {
      const uuidFullURL = item.vote.full_url.match(namePattern);
      return item.calendars.map(calendar => ({
        start_time: calendar.start_time,
        end_time: moment(calendar.start_time)
          .add(calendar.block_number, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        id: item.id,
        srcId: uuidFullURL ? uuidFullURL[1] : null,
        name: calendar.event_name,
      }));
    });

    if (isClone && !isEdit && !isCreation) {
      const customEventsObjFiltered = flatDataEventVoted.reduce(
        (acc, event) => {
          const date = moment(event.start_time).format('YYYY-MM-DD');
          if (
            moment(date, 'YYYY-MM-DD', true).isValid() &&
            event.id == eventId
          ) {
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({
              id: moment(event.start_time).format('YYYYMMDDTHHmm'),
              srcId: uuidv4(),
              title: formatMessage({ id: 'i18n_votes' }),
              event_id: event?.id ?? null,
              start: moment(event.start_time).format(YYYYMMDDTHHmm),
              start_time: moment(event.start_time).format(YYYYMMDDTHHmm),
              end: moment(event.end_time).format(YYYYMMDDTHHmm),
              end_time: moment(event.end_time).format(YYYYMMDDTHHmm),
              thisDay: moment(date).format(YYYYMMDD),
              dayStr: moment(date).format(YYYYMMDD),
              day_of_week: moment(event.start_time).isoWeekday(),
              status: 1,
              custom_type: 1,
              checked: true,
              backgroundColor: 'transparent',
              borderColor: 'none',
              textColor: '#333333',
              overlap: true,
            });
          }
          return acc;
        },
        {},
      );

      handleSetTitleTimeBlock(customEventsObjFiltered);
      onCheckedGenerateBlockCalendar(customEventsObjFiltered);
    }

    const flatDataEventVote = listEventType.flatMap(item =>
      item.event_datetimes.map(calendar => ({
        start_time: calendar.start_time,
        end_time: calendar.end_time,
        id: item.id,
        srcId: calendar.id,
        name: item.name,
        backgroundColor: '#FFFFFF',
        borderColor: '#3368C7',
        textColor: '#3368C7',
      })),
    );

    const mergeDataEvent = flatDataEventVoted.concat(flatDataEventVote);

    const flatDataEvent = mergeDataEvent.map(item => ({
      ...item,
      end: item.end_time,
      start: item.start_time,
      srcId: item.srcId ?? uuidv4(),
      title: item.name ?? '',
      isBooked: true,
      editable: false,
    }));

    onSetDataEventMobile(flatDataEvent);
  }, [listEventType]);

  // Hook ensures that the firstDay state variable always reflects the first day in the calendarHeaders array
  // or the current day of the week if calendarHeaders is not defined or empty.
  useEffect(() => {
    const firstDay =
      calendarHeaders && calendarHeaders.length
        ? calendarHeaders[0]?.weekDay
        : moment().isoWeekday();
    setFirstDay(firstDay);
  }, [calendarHeaders]);

  // Hook handles when data changes when syncing calendars from Google or Microsoft
  useEffect(() => {
    if (bookedEvents) {
      setIsDataSync(bookedEvents);
    }
  }, [bookedEvents]);

  // Get detail event before creating the calendar
  useEffect(() => {
    if (createCalendarSuccess?.id) {
      dispatch({
        type: 'EVENT/getDetailEventTypeMobile',
        payload: { eventTypeId: createCalendarSuccess.id },
      });
    }
  }, [createCalendarSuccess]);

  useEffect(() => {
    if (updateCalendarSuccess) {
      setIsCreateCalendarSuccess(true);
      dispatch({ type: 'EVENT/setUpdateCalendarSuccess', payload: false });
    }
  }, [updateCalendarSuccess]);

  // Before is data get detail event, set data to state and show popup
  useEffect(() => {
    if (Object.keys(dataCalendarSuccess).length) {
      setIsDetailCalendar(dataCalendarSuccess);
      if ((isEdit && isClone) || !isCreation) return;
      setIsCreateCalendarSuccess(true);
    }
  }, [dataCalendarSuccess]);

  useEffect(() => {
    if (Object.keys(isDetailCalendar).length <= 0) return;
    if (isEdit || isClone) {
      setIsCalendarTitle(isDetailCalendar.name);
      setEventCode(isDetailCalendar.event_code);
      form.setFieldsValue({
        calendar_title: isDetailCalendar.name,
        meet_time: isDetailCalendar.block_number,
        memo: isDetailCalendar.calendar_create_comment,
      });
      props.syncBlockNumber?.(isDetailCalendar.block_number);
      setIsAutoExtractCandidate(true);
      setBlockNumber(isDetailCalendar.block_number);
    }
  }, [isDetailCalendar]);

  // Listen to the event of the calendar creation
  useEffect(() => {
    if (isSubmitCalendarCreation) {
      handleCalendarCreation();
    }
  }, [isSubmitCalendarCreation]);

  // Reassign value to calendar_title field when data changes
  useEffect(() => {
    form.setFieldsValue({
      calendar_title: isCalendarTitle,
    });
  }, [isCalendarTitle]);

  // When syncing data from Google & Microsoft, listen for changes and display data on the sidebar
  useEffect(() => {
    if (memberMobile.length > 0) {
      setIsMyCalendar(memberMobile.filter(item => item.provider === null));
      setIsOtherCalendar(memberMobile.filter(item => item.provider !== null));
    }
  }, [memberMobile]);

  // Get all data event_datetime
  useEffect(() => {
    if (customEvents.length > 0 && isEdit) {
      const customEventsObjFiltered = customEvents.reduce((acc, event) => {
        const date = moment(event.start_time).format('YYYY-MM-DD');
        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            id: moment(event.start_time).format('YYYYMMDDTHHmm'),
            srcId: event.event_id || uuidv4(),
            title: formatMessage({ id: 'i18n_votes' }),
            event_id: event?.id ?? null,
            start: moment(event.start_time).format(YYYYMMDDTHHmm),
            start_time: moment(event.start_time).format(YYYYMMDDTHHmm),
            end: moment(event.end_time).format(YYYYMMDDTHHmm),
            end_time: moment(event.end_time).format(YYYYMMDDTHHmm),
            thisDay: moment(date).format(YYYYMMDD),
            dayStr: moment(date).format(YYYYMMDD),
            day_of_week: moment(event.start_time).isoWeekday(),
            status: 1,
            custom_type: 1,
            checked: true,
            backgroundColor: 'transparent',
            borderColor: 'none',
            textColor: '#333333',
            overlap: true,
            fromEdit: true,
            recentAdded: true,
            randomId: uuidv4(),
          });
        }
        return acc;
      }, {});

      handleSetTitleTimeBlock(customEventsObjFiltered);
      props.onCheckedGenerateBlockCalendar(customEventsObjFiltered);
    }
  }, [customEvents]);

  // Listen click block time from the calendar
  useEffect(() => {
    if (blockTime.time && blockTime.clicked) {
      const blockTimeStr = blockTime.time;
      setCurrentTime(moment(blockTimeStr).format('HH:mm:ss'));
      setIsAutoExtractCandidate(true);
      setIsAutoCalendar(false);
      const data = {
        id: `${moment(blockTimeStr).format('YYYYMMDDTHHmm')}`,
        srcId: uuidv4(),
        title: formatMessage({ id: 'i18n_votes' }),
        start: moment(blockTimeStr).format(YYYYMMDDTHHmm),
        start_time: moment(blockTimeStr).format(YYYYMMDDTHHmm),
        end: moment(blockTimeStr)
          .add(isBlockNumber, 'minutes')
          .format(YYYYMMDDTHHmm),
        end_time: moment(blockTimeStr).format(YYYYMMDDTHHmm),
        thisDay: moment(blockTimeStr).format(YYYYMMDD),
        dayStr: moment(blockTimeStr).format(YYYYMMDD),
        day_of_week: moment(blockTimeStr).isoWeekday(),
        status: 1,
        custom_type: 1,
        checked: true,
        backgroundColor: 'transparent',
        borderColor: 'none',
        textColor: '#333333',
        overlap: true,
        recentAdded: true,
      };
      onCheckedGenerateBlockCalendar({
        [moment(blockTimeStr).format(YYYYMMDD)]: [data],
      });
      setGotoDateCalendar(moment(blockTimeStr));
    }
  }, [blockTime]);

  // Listen to the date starting from the calendar screen
  useEffect(() => {
    if (currentStartDate && calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.gotoDate(currentStartDate);
      setChangeMonth(moment(currentStartDate).format('MM'));
      setChangeYear(moment(currentStartDate).format('YYYY'));
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment(calendar.view.currentStart).format(`YYYY-MM-DD`),
          endTime: moment(calendar.view.currentEnd).format(`YYYY-MM-DD`),
        },
      });
    }
  }, [currentStartDate, calendarRef]);

  const handleSortedListCheckedBlockGenerate = data => {
    // Sort the dates first
    const sortedDate = Object.fromEntries(
      Object.entries(data)?.sort(([a], [b]) => moment(a).diff(b)),
    );

    // Sort the events for each date
    for (const key in sortedDate) {
      sortedDate[key]?.sort((a, b) => moment(a.start).diff(b.start));
    }

    return sortedDate;
  };

  // Handling block state
  const handleOptionChange = value => {
    setBlockNumber(value);
    props.syncBlockNumber?.(value);
  };

  // Handle when the generate block into the calendar
  const handleGenerateBlock = () => {
    if (!isDateTimeEnd) {
      notify(formatMessage({ id: 'i18n_end_date_invalid' }));
      return;
    }
    if (!isLoadingEvent && !loading && !isLoadingSync) {
      const flatDataEvent = isDataEvent.map(item => item.calendars).flat();
      const listBlockGenerate = autoGenerateRangeDateToBlock({
        setting: firstSetupFreeTime,
        calendarEvents: flatDataEvent,
        bookedEvents: isDataSync,
        startDate: isDateTimeStart,
        endDate: isDateTimeEnd,
        blockNumber: isBlockNumber,
      });
      setIsAutoExtractCandidate(true);
      onCheckedGenerateBlockCalendar(listBlockGenerate);
      setDateGenerateBlockHeader(
        `${isDateTimeStart.format(dateFormat)} ~ ${(isDateTimeEnd &&
          isDateTimeEnd.format(dateFormat)) ??
          formatMessage({ id: 'i18n_datepicker_not_setting' })}`,
      );

      eventCheckedGenerateBlock(listBlockGenerate);
    }
  };

  // Handling when changing time starts
  const handleChangeStartDate = date => {
    const now = moment().format('YYYY-MM-DD');
    if (
      date.isSameOrAfter(now) ||
      (isDateTimeEnd && date.isSameOrBefore(isDateTimeEnd))
    ) {
      setIsDateTimeStart(date);
      setGotoDateCalendar(date);
      setIsDateTimeEnd();
    } else {
      setIsDateTimeStart(moment());
      notify(formatMessage({ id: 'i18n_start_date_invalid' }));
    }
  };

  // Handling when changing time ends
  const handleChangeEndDate = date => {
    if (date >= isDateTimeStart) {
      setIsDateTimeEnd(date);
    } else {
      setIsDateTimeEnd();
      notify(formatMessage({ id: 'i18n_end_date_invalid' }));
    }
  };

  // The function changes the choice between manual or automatic calendar selection
  const handleChangeCalendarType = () => {
    setIsAutoCalendar(!isAutoCalendar);
    setIsSubmitCalendarCreation(false);
    if (Object.keys(listNewEvents).length <= 0) return;
    setIsAutoExtractCandidate(true);
    handleSetTitleTimeBlock(listNewEvents);
    onCheckedGenerateBlockCalendar(listNewEvents);
  };

  // Processing conversion to an array and taking data checked
  const handleFlatGenerateBlock = data => {
    const flatData = Object.entries(data)
      .map(([key, value]) => {
        return value.filter(item => item.checked);
      })
      .flat();
    return flatData.map(item => {
      return {
        start_time: item.start,
        end_time: item.end,
        status: 1,
        day_of_week: moment(item.start).isoWeekday(),
        custom_type: 1,
      };
    });
  };

  // The function handles the creation of the calendar
  const handleCalendarCreation = () => {
    form
      .validateFields(['calendar_title', 'memo'])
      .then(async value => {
        const convertListCheckedBlock = handleFlatGenerateBlock(listNewEvents);
        if (convertListCheckedBlock.length <= 0) {
          setIsSubmitCalendarCreation(false);
          notify(formatMessage({ id: 'i18n_choose_candidate_please' }));
          return;
        }
        setListTime(convertListCheckedBlock);
        if (!value.errorFields) {
          const payload = {
            name: isCalendarTitle,
            block_number: Number(isBlockNumber),
            relationship_type: EVENT_RELATIONSHIP_TYPE.vote,
            is_manual_setting: 0,
            event_datetimes: convertListCheckedBlock,
            calendar_create_comment: value.memo,
          };
          if (isEdit) {
            payload.id = eventId;
            payload.event_code = eventCode;
            dispatch({ type: 'EVENT/updateCalendarMobile', payload });
          } else {
            setIsCreation(true);
            payload.status = 1;
            dispatch({ type: 'EVENT/createCalendarMobile', payload });
          }
        } else {
          notify(formatMessage({ id: 'i18n_please_fill_in_all_fields' }));
        }
      })
      .catch(err => err);
  };

  const handleCopyURLToClipboard = () => {
    navigator.clipboard.writeText(
      Object.keys(isDetailCalendar).length > 0 &&
        Object.keys(isDetailCalendar.vote).length > 0
        ? isDetailCalendar.vote.full_url
        : '',
    );
    setIsURLCopy(true);
  };

  const renderMailTemplate = () => {
    const templateMail = `
${text_ask_calendar_top}
--------------------------
■候補日時
${listBlockTime
  .map(
    time =>
      `${moment(time.start_time).format('YYYY年MM月DD日(ddd) HH:mm')}~${moment(
        time.end_time,
      ).format('HH:mm')}`,
  )
  .join('\n')}
■ イベント名： ${isCalendarTitle}
■ご予約方法
下記URLからご予約いただくか、ご都合の良い日時をご連絡ください。
${
  Object.keys(isDetailCalendar).length > 0 &&
  Object.keys(isDetailCalendar.vote).length > 0
    ? isDetailCalendar.vote.full_url
    : ''
}

※最新もしくはその他の日時も上記URLからご確認いただくことができ、ご予約も可能です。
--------------------------
${text_ask_calendar_bottom}`;
    setTemplateMail(templateMail);
    navigator.clipboard.writeText(templateMail);
  };

  const handleCopyTemplateToClipboard = async () => {
    await renderMailTemplate();
    setIsTemplateCopy(true);
  };

  // The function handles the preview mail template
  const handleTemplateMailPreview = async () => {
    await renderMailTemplate();
    setIsTemplateMailPreview(true);
  };

  // The function handles the close mail template
  const handleCloseMailTemplate = () => {
    setIsTemplateMailPreview(false);
  };

  // The function handles the change of the calendar view
  const handleChangeViewEventCalendar = async (key, val) => {
    setLoadingCalendar(true);
    setDateIncrement(val);
    if (key === 'view') {
      onSetViewEventCalendar(val);
      // setViewEventCalendar(val);
    }
    if (key === 'prev') {
      await onPrevWeek(val);
    }
    if (key === 'next') {
      await onNextWeek(val);
    }
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.scrollToTime(currentTime);
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment(calendar.view.currentStart).format(`YYYY-MM-DD`),
          endTime: moment(calendar.view.currentEnd).format(`YYYY-MM-DD`),
        },
      });
      setChangeMonth(moment(calendar.view.currentStart).format('MM'));
      setChangeYear(moment(calendar.view.currentStart).format('YYYY'));
      onSetCurrentStartDate(
        moment(calendar.view.currentStart).format('YYYY-MM-DD'),
      );
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 1000);
  };

  // The function handles the redirect today of the event
  const handleOnTodayEvent = () => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.today();
      setIsSelectMonth(!isSelectMonth);
      setIsSelectYear(!isSelectYear);
      calendar.scrollToTime(currentTime);
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 1000);
  };

  // The function handles the event of the month
  const handleOnSelectMonth = (month, year) => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment()
            .month(Number(year) - 1)
            .startOf('months')
            .format(`${year}-${month.toString().padStart(2, '0')}-DD`),
          endTime: moment()
            .month(Number(year) - 1)
            .endOf('months')
            .format(`${year}-${month.toString().padStart(2, '0')}-DD`),
        },
      });
      calendar.gotoDate(
        moment().format(`${year}-${month.toString().padStart(2, '0')}-01`),
      );
      calendar.scrollToTime(currentTime);
      onSetCurrentStartDate(
        moment().format(`${year}-${month.toString().padStart(2, '0')}-01`),
      );
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 2000);
  };

  const handleOnSelectYear = (year, month) => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment()
            .year(Number(year))
            .startOf('year')
            .format(`${year}-${month.toString().padStart(2, '0')}-DD`),
          endTime: moment()
            .year(Number(year))
            .endOf('year')
            .format(`${year}-${month.toString().padStart(2, '0')}-DD`),
        },
      });
      calendar.gotoDate(
        moment().format(`${year}-${month.toString().padStart(2, '0')}-01`),
      );
      calendar.scrollToTime(currentTime);
      onSetCurrentStartDate(
        moment().format(`${year}-${month.toString().padStart(2, '0')}-01`),
      );
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 2000);
  };

  // The function handles the add block of the event
  const addTimeBlock = info => {
    onAddEvent(info, isBlockNumber);
  };

  const isCloseSidebar = () => {
    setIsSidebar(false);
  };

  const closeModalTeam = () => {
    setInviteEmailTeamPopup(false);
  };

  // The function handles the checked member of invite email
  const onChangeCheckedMember = (e, member) => {
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    const timeAsync = {
      startTime,
      endTime,
    };
    const payload = {
      checked: e,
      member,
      timeAsync,
    };

    onMemberChecked(payload);
  };

  const handleInviteEmailUserPopup = () => {
    setIsSidebar(false);
    setInviteUserEmailPopup(true);
  };

  const onCloseInviteUserEmailPopup = () => {
    setInviteUserEmailPopup(false);
  };

  const handleCloseModalSuccess = () => {
    history.push('/');
    setIsCalendarTitle('');
    setEventCode('');
    form.resetFields(['calendar_title', 'meet_time', 'memo']);
    setIsCreation(false);
    setIsAutoCalendar(true);
    setIsAutoExtractCandidate(false);
    setIsCreateCalendarSuccess(false);
    onCheckedGenerateBlockCalendar({});
  };

  const handleRedirectToURL = url => {
    return () => {
      history.push(url);
    };
  };

  const handleSetCalendarTitle = value => {
    setIsCalendarTitle(value);
  };

  const handleSetCalendarCreationFormSubmit = () => {
    setIsSubmitCalendarCreation(true);
  };

  const handleSetProvider = provider => () => {
    setInviteUserEmailPopup(false);
    setProvider(provider);
    setInviteEmailTeamPopup(true);
  };

  const handleOnChangeCheckAll = (e, k) => {
    const arr = listNewEvents[k];
    if (!arr || arr.length <= 0) return;

    arr.forEach(t => {
      t.checked = e.target.checked;
    });
    const blocks = { ...listNewEvents, [k]: arr };
    onCheckedGenerateBlockCalendar(blocks);
    eventCheckedGenerateBlock(blocks);
  };

  // The function handles the change of the time of the day
  const handleOnChangeTimeOfDay = (e, time) => {
    let arr = listNewEvents[time.dayStr];

    if (!arr || arr.length <= 0) return;

    const found = arr.find(t =>
      t.fromEdit ? t.randomId === time.randomId : t.srcId == time.srcId,
    );

    if (!found) return;

    found.checked = e.target.checked;
    const blocks = {
      ...listNewEvents,
      [time.dayStr]: arr,
    };
    onCheckedGenerateBlockCalendar(blocks);
    eventCheckedGenerateBlock(blocks);
  };

  // The function handles the set title of the time block of the event
  const handleSetTitleTimeBlock = data => {
    const convertDataObj = Object.keys(data);
    const sortedData = convertDataObj.sort((a, b) => moment(a).diff(b));

    // get start and end date of the customEventsObjFiltered object to set the date range for the generate block
    const start = moment(sortedData[0]);
    const end = moment(sortedData[sortedData.length - 1]);

    // Set title header for the generate block
    setDateGenerateBlockHeader(
      `${start.format(dateFormat)} ~ ${(end && end.format(dateFormat)) ??
        formatMessage({ id: 'i18n_datepicker_not_setting' })}`,
    );
  };

  const renderDateRange = () => {
    if (Object.keys(listNewEvents).length <= 0) return;
    const sortedDate = handleSortedListCheckedBlockGenerate(listNewEvents);
    const generateBlockArray = Object.entries(sortedDate);

    return generateBlockArray.map(([key, value], index) => (
      <div
        key={key}
        className={`${styles.collapseExtractCandidate} ${styles.bgGreyBlue}`}
      >
        <div className={`${styles.candidateHeader} ${styles.candidateItem}`}>
          <div className={styles.candidateItemName}>
            {moment(key)
              .format(dateFormat)
              .toString()}
          </div>
          <div className={styles.candidateItemCheckbox}>
            <Checkbox
              indeterminate={false}
              onChange={e => handleOnChangeCheckAll(e, key)}
              checked={
                value &&
                value.length > 0 &&
                value.every(time => time.checked) &&
                value.length > 0
              }
            />
          </div>
        </div>
        <div className={styles.calendarTimeContainer}>
          {value && value.length > 0
            ? value.map((time, idx) => (
                <div key={idx} className={styles.candidateItem}>
                  <div className={styles.candidateItemName}>
                    {moment(time.start)
                      .format(timeFormat)
                      .toString()}{' '}
                    ~{' '}
                    {moment(time.end)
                      .format(timeFormat)
                      .toString()}
                  </div>
                  <div className={styles.candidateItemCheckbox}>
                    <Checkbox
                      onChange={e => handleOnChangeTimeOfDay(e, time)}
                      checked={time.checked}
                    />
                  </div>
                </div>
              ))
            : formatMessage({ id: 'i18n_recommend_block' })}
        </div>
      </div>
    ));
  };

  const renderCraftCalendar = () => {
    if (!isAutoCalendar) {
      return (
        <>
          <Spin spinning={loadingPage}>
            <HeaderMobile
              title={formatMessage({ id: 'i18n_choose_calendar' })}
              isShowLeft={true}
              itemLeft={{
                url: ROUTER.profileCollaboration,
                bgColor: 'bgPrimaryBlue',
                textColor: 'textLightGray',
                event: 'back',
                text: profile?.name,
              }}
              customStyleLeft={{ width: '100%' }}
            />
            <Navigation
              viewEventCalendar={viewEventCalendar}
              onChangeViewEventCalendar={handleChangeViewEventCalendar}
              onTodayEvent={handleOnTodayEvent}
              onSelectMonth={handleOnSelectMonth}
              onSelectYear={handleOnSelectYear}
              showSidebar={() => setIsSidebar(true)}
              isSelectMonth={isSelectMonth}
              isSelectYear={isSelectYear}
              changeMonth={changeMonth}
              changeYear={changeYear}
            />
            <CalendarSidebar
              isSidebar={isSidebar}
              isCloseSidebar={isCloseSidebar}
              onChecked={onChangeCheckedMember}
              isMyCalendar={isMyCalendar}
              isOtherCalendar={isOtherCalendar}
              showModal={handleInviteEmailUserPopup}
            />
            <Spin spinning={loadingCalendar || loadingCalendarStore}>
              <div
                ref={calendarParentRef}
                className={styles.bookingCalendarParent}
                style={{ width: width < 767 ? width : '' }}
              >
                <div
                  style={{
                    width:
                      width < 767
                        ? (width / (viewEventCalendar === 7 ? 10 : 10)) * 10
                        : '',
                  }}
                >
                  <AvailableTime
                    calendarRef={calendarRef}
                    displayEvents={displayEvents}
                    viewEventCalendar={viewEventCalendar}
                    addTimeBlock={addTimeBlock}
                    firstDay={firstDay}
                    dateIncrement={viewEventCalendar}
                    onDeleteEvent={onDeleteEvent}
                    showDeleteEvent={true}
                    isHeight={'75dvh'}
                    gotoDateCalendar={gotoDateCalendar}
                    memoEventMobile={isMemoEventMobile}
                    isSelected={true}
                    currentTime={currentTime}
                  />
                </div>
              </div>
            </Spin>
            <CalendarToolbarFooter
              isShowCandidate={handleChangeCalendarType}
              isCalendarTitle={isCalendarTitle}
              setCalendarTitle={handleSetCalendarTitle}
              isSubmitCalendarCreation={handleSetCalendarCreationFormSubmit}
            />
          </Spin>
        </>
      );
    }
  };

  const renderBtnGenerateBlock = () => {
    return (
      <Button
        loading={isLoadingEvent || loading || isLoadingSync}
        className={`${styles.candidateButton} btn-generate-block`}
        onClick={handleGenerateBlock}
      >
        {formatMessage({
          id: 'i18n_auto_extract_candidate_btn',
        })}
      </Button>
    );
  };

  const renderFormCalendarDefault = () => {
    if (isAutoCalendar) {
      return (
        <>
          <Spin spinning={loadingPage}>
            <ConfigProvider locale={locale}>
              <HeaderMobile
                title={formatMessage({ id: 'i18n_calendar_creation_title' })}
                isShowLeft={true}
                isShowRight={true}
                itemLeft={{
                  event: 'back',
                  url: '/calendar',
                  icon: iconCalendarClose,
                  bgColor: 'bgPrimaryBlue',
                }}
                itemRight={{
                  event: 'right',
                  borderColor: 'borderPrimaryBlue',
                  textColor: 'textPrimaryBlue',
                  text: formatMessage({ id: 'i18n_view_detail' }),
                }}
                customStyleRight={{ width: '100%' }}
                handleEventRight={handleChangeCalendarType}
              />
              <div
                className={`${styles.calendarCreationContainer} calendar-create-content`}
              >
                <Form form={form}>
                  <p className={styles.labelName}>
                    <img
                      src={iconTitle}
                      alt={'icon'}
                      className={`${styles.labelIcon} pc-hide`}
                    />
                    {formatMessage({ id: 'i18n_label_title' })}
                  </p>
                  <Form.Item
                    name={'calendar_title'}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: 'i18n_required_text' }),
                      },
                    ]}
                  >
                    <Input
                      className={styles.inputField}
                      onChange={e => setIsCalendarTitle(e.target.value)}
                      value={isCalendarTitle}
                      placeholder={formatMessage({
                        id: 'i18n_title_placeholder',
                      })}
                    />
                  </Form.Item>
                  <p
                    className={styles.labelName}
                    style={{ marginTop: isPc ? 12 : '10px' }}
                  >
                    {!isPc && (
                      <img
                        src={iconTime}
                        alt={'icon'}
                        className={styles.labelIcon}
                      />
                    )}
                    {formatMessage({
                      id: isPc
                        ? 'i18n_label_meet_time_pc'
                        : 'i18n_label_meet_time',
                    })}
                  </p>
                  <Form.Item name={'meet_time'}>
                    <Select
                      className={`${styles.selectField} select-time`}
                      onChange={handleOptionChange}
                      defaultValue={isBlockNumber}
                    >
                      <Select.Option value={15}>15分</Select.Option>
                      <Select.Option value={30}>30分</Select.Option>
                      <Select.Option value={45}>45分</Select.Option>
                      <Select.Option value={60}>60分</Select.Option>
                      <Select.Option value={90}>90分</Select.Option>
                      <Select.Option value={120}>120分</Select.Option>
                    </Select>
                  </Form.Item>
                  {!isPc && (
                    <>
                      <hr />
                      <p className={styles.labelName}>
                        {formatMessage({ id: 'i18n_candidate' })}
                      </p>
                    </>
                  )}
                  <div className={styles.candidateContainer}>
                    {isPc ? (
                      <Tooltip
                        title={formatMessage({
                          id: 'i18n_auto_extract_candidate_tooltip',
                        })}
                        color={'blue'}
                        trigger={'hover'}
                      >
                        {renderBtnGenerateBlock()}
                      </Tooltip>
                    ) : (
                      renderBtnGenerateBlock()
                    )}

                    {!isPc && (
                      <Tooltip
                        title={formatMessage({
                          id: 'i18n_auto_extract_candidate_tooltip',
                        })}
                        color={'blue'}
                        trigger={'click'}
                      >
                        <Button className={styles.candidateBtnTooltip}>
                          <img
                            src={iconQuestion}
                            alt={'icon'}
                            className={styles.labelIcon}
                          />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                  <div
                    className={`${styles.calendarTimeGroup} calendar-time-group`}
                  >
                    <div className={styles.datePickerContainer}>
                      <div
                        className={styles.datePickerItem}
                        style={{ width: '100%' }}
                      >
                        <DatePicker
                          inputReadOnly
                          locale={jaJP}
                          value={isDateTimeStart}
                          format={dateFormatWithoutDay}
                          onChange={handleChangeStartDate}
                          disabledDate={current => {
                            return (
                              current && current < moment().add(-1, 'days')
                            );
                          }}
                        />
                      </div>
                      <div
                        className={styles.datePickerItem}
                        style={{ margin: '0 5px' }}
                      >
                        ~
                      </div>
                      <div
                        className={styles.datePickerItem}
                        style={{ width: '100%' }}
                      >
                        <DatePicker
                          inputReadOnly
                          locale={jaJP}
                          value={isDateTimeEnd}
                          format={dateFormatWithoutDay}
                          onChange={handleChangeEndDate}
                          disabledDate={current => {
                            const startDay = moment(isDateTimeStart).startOf(
                              'day',
                            );
                            const endDay = moment(isDateTimeStart)
                              .add(
                                (profile?.setting?.time_period || 1) * 6,
                                'days',
                              )
                              .endOf('day');
                            return (
                              current &&
                              (current < startDay || current > endDay)
                            );
                          }}
                        />
                      </div>
                    </div>
                    {!isPc && (
                      <Button
                        className={`${styles.calendarBtn} ${styles.borderPrimaryBlue} ${styles.textPrimaryBlue}`}
                        onClick={handleChangeCalendarType}
                      >
                        {formatMessage({ id: 'i18n_choose_calendar' })}
                      </Button>
                    )}
                    {!isAutoExtractCandidate && (
                      <div className={`${styles.calendarTime} calendar-time`}>
                        {formatMessage({ id: 'i18n_no_candidate' })}
                      </div>
                    )}
                  </div>
                  {isAutoExtractCandidate && (
                    <Spin spinning={loadingCalendarStore}>
                      <Collapse
                        className={styles.collapseContainer}
                        defaultActiveKey={['1']}
                        expandIconPosition="end"
                      >
                        <Panel header={dateGenerateBlockHeader} key="1">
                          {renderDateRange()}
                        </Panel>
                      </Collapse>
                    </Spin>
                  )}
                  {!isPc && <hr />}
                  <div className={styles.otherInfo}>
                    {!isPc && (
                      <p className={styles.labelName}>
                        {formatMessage({ id: 'i18n_label_other_info' })}
                      </p>
                    )}

                    <p className={styles.labelName}>
                      {!isPc && (
                        <img
                          src={iconMemo}
                          alt={'icon'}
                          className={styles.labelIcon}
                        />
                      )}

                      {formatMessage({ id: 'i18n_memo' })}
                    </p>
                    <Form.Item
                      name={'memo'}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input
                        className={`${styles.inputField} input-memo`}
                        placeholder={formatMessage({
                          id: 'i18n_memo_placeholder',
                        })}
                      />
                    </Form.Item>
                  </div>
                  <div
                    className={`btn-cal-save ${styles.btnGroup}`}
                    style={{ textAlign: 'center' }}
                  >
                    <Button
                      disabled={isPc ? isCalendarTitle?.trim() == '' : false}
                      className={`${styles.saveBtn} ${styles.bgDarkBlue} ${
                        styles.shadowPrimary
                      } ${isCalendarTitle?.trim() == '' ? 'btn-disable' : ''}`}
                      loading={loadingBtn || loadingCalendarStore}
                      htmlType="submit"
                      onClick={handleCalendarCreation}
                    >
                      {formatMessage({ id: 'i18n_btn_save' })}
                    </Button>
                    {isPc && (
                      <Button
                        className={`button bgLightRed shadowPrimary ${styles.cancelBtn}`}
                        htmlType="button"
                        onClick={() => {
                          history.push('/');
                        }}
                      >
                        キャンセル
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </ConfigProvider>
          </Spin>
        </>
      );
    }
  };

  return (
    <>
      {!props.fromPc && renderCraftCalendar()}
      {renderFormCalendarDefault()}
      <Modal
        title={formatMessage({ id: 'i18n_calendar_link_other' })}
        open={isInviteUserEmailPopup}
        onCancel={onCloseInviteUserEmailPopup}
        footer={null}
      >
        <div className={styles.calendarLinkOtherDesc}>
          <p className={styles.calendarLinkOtherTitle}>
            <svg
              width="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248zM262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z" />
            </svg>
            {formatMessage({ id: 'i18n_calendar_link_other_title' })}
          </p>
          <p>{formatMessage({ id: 'i18n_calendar_link_other_content_1' })}</p>
          <p className={styles.calendarLinkOtherTitle}>
            <svg
              width="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M466.5 83.7l-192-80a48.2 48.2 0 0 0 -36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z" />
            </svg>
            {formatMessage({ id: 'i18n_calendar_link_other_title' })}
          </p>
          <p>{formatMessage({ id: 'i18n_calendar_link_other_content_2' })}</p>
        </div>
        <div className={styles.calendarLinkOtherBtn}>
          <Button
            onClick={handleSetProvider('google')}
            className={styles.calendarLinkOtherItem}
          >
            <img src={iconGoogle} alt="Google" />
            {formatMessage({ id: 'i18n_calendar_link_other_google' })}
          </Button>
          <Button
            onClick={handleSetProvider('microsoft')}
            className={styles.calendarLinkOtherItem}
          >
            <img src={iconOffice} alt="Office" />
            {formatMessage({ id: 'i18n_calendar_link_other_microsoft' })}
          </Button>
        </div>
        <div className={styles.calendarLinkOtherFooter}>
          <Link to={'/term-of-user'}>
            {formatMessage({ id: 'i18n_footer_service' })}
          </Link>
          <Link to={'https://vision-net.co.jp/privacy.html'}>
            {formatMessage({ id: 'i18n_footer_privacy' })}
          </Link>
        </div>
      </Modal>
      <Modal
        className={styles.modalTeam}
        title={formatMessage({ id: 'i18n_add_member_send_email_title' })}
        open={isInviteEmailTeamPopup}
        onCancel={closeModalTeam}
        footer={null}
      >
        <TeamList
          provider={provider}
          onSendEmail={onSendAddMemberEmail}
          modalTeamVisible={setInviteEmailTeamPopup}
        />
      </Modal>
      <Modal
        title={formatMessage({
          id: 'i18n_create_calendar_success_title',
        })}
        open={isCreateCalendarSuccess}
        onCancel={handleCloseModalSuccess}
        footer={null}
      >
        <div className={styles.modalContent}>
          <div className={styles.shareCalendarFrame}>
            <div className={styles.shareCalendarInfo}>
              <div className={styles.shareCalendarInfoIc}>
                <img src={iconDoc} alt="icon document" />
              </div>
              <div className={styles.shareCalendarInfoText}>
                イベント名： {isCalendarTitle}
              </div>
            </div>
            <div className={styles.shareCalendarInfo}>
              <div className={styles.shareCalendarInfoIc}>
                <img src={iconUser} alt="icon user" />
              </div>
              <div className={styles.shareCalendarInfoText}>
                主催者： {profile?.name}
              </div>
            </div>
            <div className={styles.shareCalendarLinkMainWrap}>
              <div>
                調整したい相手に
                <br /> 候補を送って予定を合わせましょう。
              </div>
              <p className={styles.shareCalendarLinkMain}>
                {Object.keys(isDetailCalendar).length > 0 &&
                Object.keys(isDetailCalendar.vote).length > 0
                  ? isDetailCalendar.vote.full_url
                  : ''}
              </p>
            </div>
          </div>
          <div
            onClick={handleTemplateMailPreview}
            className={`${styles.shareCalendarLink}`}
          >
            {formatMessage({ id: 'i18n_share_fixed_btn' })}
          </div>
          <div className={styles.shareCalendarItem}>
            <Button
              className={`${styles.shareCalendarBtn} `}
              onClick={handleCopyURLToClipboard}
            >
              {isURLCopy
                ? formatMessage({ id: 'i18n_copied' })
                : formatMessage({ id: 'i18n_copy_adjust_url' })}
            </Button>

            <Button
              onClick={handleCopyTemplateToClipboard}
              className={`${styles.shareCalendarBtn}`}
            >
              {isTemplateCopy
                ? formatMessage({ id: 'i18n_copied' })
                : formatMessage({ id: 'i18n_copy_standard_text' })}
            </Button>
            <Button
              className={`${styles.shareCalendarBtn} `}
              onClick={handleRedirectToURL(
                `/invite-participant?event_code=${dataCalendarSuccess.event_code}`,
              )}
            >
              {formatMessage({ id: 'i18n_copy_via_email' })}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title={formatMessage({ id: 'i18n_template_mail_modal_title' })}
        open={isTemplateMailPreview}
        onCancel={handleCloseMailTemplate}
        footer={null}
      >
        <div className={styles.modalContent}>
          <TextArea
            value={templateMail}
            autoSize={{ minRows: 10, maxRows: 20 }}
          />
        </div>
      </Modal>
    </>
  );
}

const mapStateToProps = ({
  AVAILABLE_TIME,
  EVENT,
  CALENDAR_CREATION,
  MASTER,
  BASIC_SETTING,
}) => ({
  availableTime: AVAILABLE_TIME,
  eventStore: EVENT,
  calendarStore: CALENDAR_CREATION,
  masterStore: MASTER,
  basicSetting: BASIC_SETTING,
});

function mapDispatchToProps(dispatch) {
  return {
    onSetCalendarRef: value => dispatch(setCalendarRef(value)),
    onSyncCalendar: value => dispatch(syncCalendar(value)),
    onLoadingData: (...props) => dispatch(loadingData(...props)),
    onAddEvent: (info, block_number) =>
      dispatch(addEventMobile(info, block_number)),
    onDeleteEvent: (event, isManualSetting) =>
      dispatch(deleteEventMobile(event, isManualSetting)),
    onResizeEvent: info => dispatch(resizeEvent(info)),
    onMemberChecked: payload => dispatch(memberCheckedMobile(payload)),
    onSendAddMemberEmail: (provider, email) =>
      dispatch(sendAddMemberEmail(provider, email)),
    onNextWeek: step => dispatch(nextWeek(step)),
    onPrevWeek: step => dispatch(prevWeek(step)),
    onCheckedGenerateBlockCalendar: event =>
      dispatch(setCheckedGenerateBlockCalendar(event)),
    toggleBlockCalendar: event => dispatch(toggleBlockCalendar(event)),
    onSetDataEventMobile: event => dispatch(setDataEventMobile(event)),
    onSetBlockCalendar: (block, clicked) =>
      dispatch(setBlockCalendar(block, clicked)),
    onSetViewEventCalendar: view => dispatch(setViewEventCalendar(view)),
    onSetCurrentStartDate: date => dispatch(setCurrentStartDate(date)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarCreation);
