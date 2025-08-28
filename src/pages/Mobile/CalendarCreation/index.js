import {
  Form,
  Spin,
  Input,
  Button,
  DatePicker,
  Select,
  Collapse,
  Checkbox,
  Modal,
} from 'antd';
import { connect } from 'dva';
import { useIntl, useDispatch, Link } from 'umi';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './styles.less';
import iconTitle from '@/assets/images/i-title.png';
import iconTime from '@/assets/images/i-clock.png';
import iconTeam from '@/assets/images/i-team.png';
import iconQuestion from '@/assets/images/i-question.png';
import iconMemo from '@/assets/images/i-memo.png';
import HeaderMobile from '@/components/Mobile/Header';
import Navigation from '@/components/Mobile/Navigation';
import moment from 'moment';
import { EVENT_RELATIONSHIP_TYPE } from '@/constant';
import { notify } from '../../../commons/function';
import AvailableTime from '@/components/Mobile/AvailableTime';
import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';
import {
  deleteEvent,
  prevWeek,
  nextWeek,
  setCalendarRef,
} from '@/components/EventTypeSetting/AvailableTimeSetting/actions';

function CalendarCreation(props) {
  const {
    onPrevWeek,
    onNextWeek,
    onSetCalendarRef,
    eventStore,
    availableTime,
  } = props;
  const {
    listEventType,
    totalEventType,
    firstSetupFreeTime,
    createCalendarSuccess,
    dataCalendarSuccess,
    listTextAskCalendar,
  } = eventStore;
  const { calendarHeaders, displayEvents, calendarRef } = availableTime;
  const {
    text_ask_calendar_bottom,
    text_ask_calendar_top,
  } = listTextAskCalendar;
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { Panel } = Collapse;
  const [loading, setLoading] = useState(true);
  const [isAutoExtractCandidate, setIsAutoExtractCandidate] = useState(false);
  const [isShowCandidate, setIsShowCandidate] = useState(false);
  const [isDateTimeStart, setIsDateTimeStart] = useState(moment());
  const [isDateTimeEnd, setIsDateTimeEnd] = useState(
    moment(isDateTimeStart).add(6, 'days'),
  );
  const [isFirstSetupFreeTime, setIsFirstSetupFreeTime] = useState([]);
  const [isCreateCalendarSuccess, setIsCreateCalendarSuccess] = useState(false);

  const dateFormat = 'YYYY/MM/DD';

  const [indeterminate, setIndeterminate] = useState(true);
  const [selectedOption, setSelectedOption] = useState(60);
  const [selectedAdjustType, setSelectedAdjustType] = useState(3);
  const [isDayTime, setIsDayTime] = useState([]);
  const [isDetailCalendar, setIsDetailCalendar] = useState({});
  const [isSelectDetail, setIsSelectDetail] = useState(true);
  const [viewEventCalendar, setViewEventCalendar] = useState(3);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const calendarParentRef = React.createRef();
  const [firstDay, setFirstDay] = useState(moment().isoWeekday());
  const pageSize = 1000000;
  const [pageIndex, setPageIndex] = useState(1);
  const [isURLCopy, setIsURLCopy] = useState(false);
  const [isTemplateCopy, setIsTemplateCopy] = useState(false);
  const [dateIncrement, setDateIncrement] = useState(3);
  const [isKeepAvailableTime, setIsKeepAvailableTime] = useState([]);
  const [isAvailableTimeManual, setIsAvailableTimeManual] = useState([]);
  const [listBlockTime, setListTime] = useState([]);
  const [isMemoEventMobile, setIsMemoEventMobile] = useState({});

  useEffect(() => {
    onSetCalendarRef(React.createRef());
    dispatch({ type: 'EVENT/getFreeTime' });
    dispatch({ type: 'EVENT/getNotifyAskCalendar' });
    setTimeout(() => {
      setLoading(false);
    });
  }, []);

  const getList = useCallback(() => {
    setLoading(true);
    const payload = {
      relationship_type: EVENT_RELATIONSHIP_TYPE.vote,
      pageSize: pageSize,
      page: pageIndex,
    };

    dispatch({ type: 'EVENT/getListEventType', payload });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [pageIndex, pageSize]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if (totalEventType > 0) {
      const data = listEventType.map(event => {
        const eventTitle = event.vote?.is_finished
          ? formatMessage({ id: 'i18n_voted' })
          : formatMessage({ id: 'i18n_voting' });
        if (event.event_datetimes && event.event_datetimes.length > 0) {
          return event.event_datetimes.map(dt => {
            return {
              title: eventTitle,
              start: dt.start_time,
              end: moment(dt.start_time)
                .add(dt.block_number, 'minutes')
                .format('YYYY-MM-DD HH:mm:ss'),
              id: dt.id,
              isDeleted: dt.deleted_at,
              backgroundColor: event.vote?.is_finished ? '#ffffff' : 'none',
              borderColor: event.vote?.is_finished ? '#3368c7' : 'none',
              textColor: event.vote?.is_finished ? '#3368c7' : '#ffffff',
              timeText: `${moment(dt.start_time).format('HH:mm')} ~ ${moment(
                dt.end_time,
              ).format('HH:mm')}`,
              srcId: event.id,
              overlap: true,
              editable: false,
              isBooked: true,
            };
          });
        }
      });
      const combinedArray = data
        .flat()
        .reduce((acc, val) => acc.concat(val), []);
      const filteredArray = combinedArray.filter(function(el) {
        return el != null;
      });
      setIsKeepAvailableTime(combinedArray);
      dispatch({
        type: 'AVAILABLE_TIME/setDisplayEvents',
        payload: filteredArray,
      });
    }
  }, [listEventType]);

  useEffect(() => {
    const firstDay =
      calendarHeaders && calendarHeaders.length
        ? calendarHeaders[0].weekDay
        : moment().isoWeekday();
    setFirstDay(firstDay);
  }, [calendarHeaders]);

  useEffect(() => {
    if (firstSetupFreeTime) {
      setIsFirstSetupFreeTime(firstSetupFreeTime);
    }
  }, [firstSetupFreeTime]);

  useEffect(() => {
    if (createCalendarSuccess?.id) {
      dispatch({
        type: 'EVENT/getDetailEventTypeMobile',
        payload: { eventTypeId: createCalendarSuccess.id },
      });
    }
  }, [createCalendarSuccess]);

  useEffect(() => {
    if (Object.keys(dataCalendarSuccess).length) {
      setIsDetailCalendar(dataCalendarSuccess);
      setIsCreateCalendarSuccess(true);
    }
  }, [dataCalendarSuccess]);

  useEffect(() => {
    handleCalculateCandidate();
  }, [isDateTimeStart, isDateTimeEnd, selectedOption, isFirstSetupFreeTime]);

  const handleCalculateCandidate = () => {
    const dates = [];
    let currentDate = moment(isDateTimeStart);
    while (currentDate <= isDateTimeEnd) {
      dates.push(currentDate);
      currentDate = moment(currentDate).add(1, 'days');
    }

    const updatedDayTime = dates.map(date => {
      const timeSlots = [];
      const dayOfWeek = date.day();
      const dayData = isFirstSetupFreeTime.find(
        item => item.day_of_week === dayOfWeek,
      );

      const startTime = moment(`${date.format('YYYY-MM-DD')} 00:00:00`);
      const endTime = moment(`${date.format('YYYY-MM-DD')} 23:00:00`);
      const startTimeDay = dayData
        ? moment(`${date.format('YYYY-MM-DD')} ${dayData.start_time}`)
        : '';
      const endTimeDay = dayData
        ? moment(`${date.format('YYYY-MM-DD')} ${dayData.end_time}`)
        : '';

      // if (dayData) {
      for (
        let time = startTime;
        time.isBefore(endTime);
        time.add(selectedOption, 'minutes')
      ) {
        timeSlots.push({
          start: time.format('HH:mm:ss'),
          end: moment(time)
            .add(selectedOption, 'minutes')
            .format('HH:mm:ss'),
          checked:
            time.isSameOrAfter(startTimeDay) && time.isBefore(endTimeDay),
          disabled: true,
        });
      }
      // }

      return {
        day: date.format('YYYY-MM-DD'),
        checked: timeSlots.some(time => time.checked),
        time: timeSlots,
      };
    });
    setIsDayTime(updatedDayTime);
    setIndeterminate(false);
  };

  const handleConvertDayTimeToEventDateTime = () => {
    const eventDateTime = [];
    if (isAutoExtractCandidate) {
      isDayTime.forEach(day => {
        day.time.forEach(time => {
          if (time.checked) {
            eventDateTime.push({
              start_time: `${day.day}T${time.start}`,
              end_time: `${day.day}T${time.end}`,
              status: 1,
              custom_type: 1,
              day_of_week: moment(day.day).day(),
            });
          }
        });
      });
    } else {
      isAvailableTimeManual.forEach(time => {
        eventDateTime.push({
          start_time: time.start,
          end_time: time.end,
          status: 1,
          custom_type: 1,
          day_of_week: moment(time.start).day(),
        });
      });
    }
    setListTime(eventDateTime);
    return eventDateTime;
  };

  const handleAutoExtractCandidate = () => {
    return () => {
      setIsShowCandidate(false);
      setIsAutoExtractCandidate(true);
      handleCalculateCandidate();
    };
  };

  const handleOptionChange = value => {
    setSelectedOption(value);
  };

  const handleOptionAdjustTypeChange = value => {
    setSelectedAdjustType(value);
  };

  const handleChangeStartDate = date => {
    const now = moment().format('YYYY-MM-DD');
    if (date.isSameOrAfter(now) && date.isSameOrBefore(isDateTimeEnd)) {
      setIsDateTimeStart(date);
      setIsDateTimeEnd(moment(date).add(6, 'days'));
    } else {
      setIsDateTimeStart(moment());
      notify(formatMessage({ id: 'i18n_start_date_invalid' }));
    }
  };

  const onCheckAllChange = (e, index, day) => {
    const updatedDayTime = isDayTime.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          checked: e.target.checked,
          time: item.time.map(time => ({
            ...time,
            checked: e.target.checked,
          })),
        };
      }
      return item;
    });
    setIsDayTime(updatedDayTime);
  };

  const handleOnChangeTimeOfDay = (e, idx, dayOfWeek) => {
    const updatedDayTime = isDayTime.map(day => {
      if (moment(day.day).day() === dayOfWeek) {
        const updatedTime = day.time.map((time, index) => {
          if (index === idx) {
            return {
              ...time,
              checked: e.target.checked,
            };
          }
          return time;
        });
        return {
          ...day,
          time: updatedTime,
          checked: updatedTime.every(time => time.checked),
        };
      }
      return day;
    });
    setIsDayTime(updatedDayTime);
  };

  const handleChangeEndDate = date => {
    if (date >= isDateTimeStart) {
      setIsDateTimeEnd(date);
      setIndeterminate(false);
    }
  };

  const renderDateRange = () => {
    return isDayTime.map((day, index) => (
      <div key={index} className={styles.collapseExtractCandidate}>
        <div className={`${styles.candidateHeader} ${styles.candidateItem}`}>
          <div className={styles.candidateItemName}>
            {moment(day.day)
              .format(dateFormat)
              .toString()}
            （{formatMessage({ id: 'i18n_month' })}）
          </div>
          <div className={styles.candidateItemCheckbox}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={e => onCheckAllChange(e, index, moment(day.day))}
              checked={day.checked}
            />
          </div>
        </div>
        <div className={styles.calendarTimeContainer}>
          {day.time.map((time, idx) => (
            <div key={idx} className={styles.candidateItem}>
              <div className={styles.candidateItemName}>
                {time.start.toString()}~{time.end.toString()}
              </div>
              <div className={styles.candidateItemCheckbox}>
                <Checkbox
                  onChange={e =>
                    handleOnChangeTimeOfDay(e, idx, moment(day.day).day())
                  }
                  checked={time.checked}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const handleShowCalendar = () => {
    setIsAutoExtractCandidate(false);
    setIsShowCandidate(!isShowCandidate);
  };

  const handleCalendarCreation = () => {
    form
      .validateFields(['calendar_title'])
      .then(async value => {
        if (!isAutoExtractCandidate && !isShowCandidate) {
          notify(formatMessage({ id: 'i18n_choose_candidate_please' }));
          return;
        }
        if (!value.errorFields) {
          const eventDateTime = handleConvertDayTimeToEventDateTime();
          const payload = {
            name: value.calendar_title,
            block_number: Number(selectedOption),
            relationship_type: Number(selectedAdjustType),
            status: 1,
            is_manual_setting: 0,
            event_datetimes: eventDateTime,
            calendar_create_comment: value.memo,
          };
          setLoading(true);
          dispatch({ type: 'EVENT/createCalendarMobile', payload });
          setLoading(false);
        } else {
          notify(formatMessage({ id: 'i18n_please_fill_in_all_fields' }));
        }
      })
      .catch(err => err);
  };

  const handleCloseModal = () => {
    window.location.reload();
    setIsCreateCalendarSuccess(false);
  };

  const handleIsSelectDetail = value => {
    setIsSelectDetail(JSON.parse(value));
  };

  const handleChangeViewEventCalendar = async (key, val) => {
    setLoadingCalendar(true);
    setDateIncrement(val);
    if (key === 'view') {
      setViewEventCalendar(val);
    }
    if (key === 'prev') {
      await onPrevWeek(val);
    }
    if (key === 'next') {
      await onNextWeek(val);
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 1000);
  };

  const handleOnTodayEvent = () => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.today();
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 1000);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const addTimeBlock = info => {
    const startTime = moment(info.date);
    const endTime = moment(info.date).add(selectedOption, 'minutes');
    const convertStartTimeToUnix = moment(startTime).unix();

    const combinedArray = {
      title: '調整中',
      start: startTime.format('YYYY-MM-DD HH:mm:ss'),
      end: endTime.format('YYYY-MM-DD HH:mm:ss'),
      id: null,
      isDeleted: null,
      backgroundColor: 'transparent',
      borderColor: '#1890ff',
      textColor: '#1890ff',
      timeText: `${startTime.format('HH:mm')} ~ ${endTime.format('HH:mm')}`,
      srcId: convertStartTimeToUnix,
      overlap: false,
      editable: true,
      isBooked: false,
    };

    isAvailableTimeManual.push(combinedArray);
    isKeepAvailableTime.push(combinedArray);

    setIsKeepAvailableTime(isKeepAvailableTime);
    setIsAvailableTimeManual(isAvailableTimeManual);

    dispatch({
      type: 'AVAILABLE_TIME/setDisplayEvents',
      payload: isKeepAvailableTime,
    });
  };

  const handleOnResizeAndDropEvent = info => {
    const event = info.event._def.extendedProps;
    const startTime = moment(info.event.start).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(info.event.end).format('YYYY-MM-DD HH:mm:ss');
    const updatedEvent = isKeepAvailableTime.map(item => {
      if (item.srcId === event.srcId) {
        return {
          ...item,
          start: startTime,
          end: endTime,
          timeText: `${moment(startTime).format('HH:mm')} ~ ${moment(
            endTime,
          ).format('HH:mm')}`,
        };
      }
      return item;
    });
    const updatedEventManual = isAvailableTimeManual.map(item => {
      if (item.srcId === event.srcId) {
        return {
          ...item,
          start: startTime,
          end: endTime,
          timeText: `${moment(startTime).format('HH:mm')} ~ ${moment(
            endTime,
          ).format('HH:mm')}`,
        };
      }
      return item;
    });
    setIsAvailableTimeManual(updatedEventManual);
    setIsKeepAvailableTime(updatedEvent);
    dispatch({
      type: 'AVAILABLE_TIME/setDisplayEvents',
      payload: updatedEvent,
    });
  };

  const onDeleteEvent = event => {
    const updatedEventManual = isAvailableTimeManual.filter(
      item => item.srcId !== event.srcId,
    );
    setIsAvailableTimeManual(updatedEventManual);
    const updatedEvent = isKeepAvailableTime.map(item => {
      if (item.srcId === event.srcId) {
        return {
          ...item,
          isDeleted: true,
        };
      }
      return item;
    });
    setIsKeepAvailableTime(updatedEvent);
    dispatch({
      type: 'AVAILABLE_TIME/setDisplayEvents',
      payload: updatedEvent,
    });
  };

  const handleEventClick = info => {
    setIsMemoEventMobile(info.event._def.extendedProps);
  };

  const handleRedirectToURL = url => {
    return () => {
      window.location.href = url;
    };
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

  const handleCopyTemplateToClipboard = () => {
    navigator.clipboard.writeText(
      `
${text_ask_calendar_top}
--------------------------
■候補日時
${listBlockTime.map(time => {
  return `${moment(time.start_time).format(
    'YYYY年MM月DD日(ddd) HH:mm',
  )}~${moment(time.end_time).format('HH:mm')}`;
})}
■ご予約方法
下記URLからご予約いただくか、ご都合の良い日時をご連絡ください。
${
  Object.keys(isDetailCalendar).length > 0 &&
  Object.keys(isDetailCalendar.vote).length > 0
    ? isDetailCalendar.vote.full_url
    : ''
}

※最新もしくはその他の日時も上記URLからご確認いただくことができ、ご予約も可能です。

■お打ち合わせ内容
ミーティング時間：${selectedOption}分
--------------------------
${text_ask_calendar_bottom}`,
    );
    setIsTemplateCopy(true);
  };

  const handleOnSelectMonth = val => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.gotoDate(val);
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 2000);
  };

  const renderListCalendar = () => {
    if (isShowCandidate) {
      return (
        <div>
          <Spin spinning={loading}>
            <HeaderMobile
              hideHeader={false}
              headerGuest={false}
              typeHeader={'calendar'}
              showModal={showModal}
              title={formatMessage({ id: 'i18n_calendar_title' })}
            />
            <Navigation
              viewEventCalendar={viewEventCalendar}
              onChangeViewEventCalendar={handleChangeViewEventCalendar}
              onTodayEvent={handleOnTodayEvent}
              onSelectMonth={handleOnSelectMonth}
            />
            <Spin spinning={loadingCalendar}>
              <div
                ref={calendarParentRef}
                className={styles.bookingCalendarParent}
                style={{ width: width < 767 ? width : '' }}
              >
                <div
                  style={{
                    width:
                      width < 767
                        ? (width / (viewEventCalendar === 7 ? 5 : 10)) * 10
                        : '',
                  }}
                >
                  <AvailableTime
                    calendarRef={calendarRef}
                    displayEvents={displayEvents}
                    viewEventCalendar={viewEventCalendar}
                    addTimeBlock={addTimeBlock}
                    handleOnResizeAndDropEvent={handleOnResizeAndDropEvent}
                    firstDay={firstDay}
                    dateIncrement={dateIncrement}
                    onDeleteEvent={onDeleteEvent}
                    handleEventClick={handleEventClick}
                    showDeleteEvent={true}
                    memoEventMobile={isMemoEventMobile}
                  />
                </div>
              </div>
            </Spin>
          </Spin>
        </div>
      );
    }
  };

  const renderCreateCalendar = () => {
    if (isSelectDetail) {
      return (
        <div>
          <div className={styles.calendarCreationContainer}>
            <Form form={form}>
              <p className={styles.labelName}>
                <img
                  src={iconTitle}
                  alt={'icon'}
                  className={styles.labelIcon}
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
                <Input className={styles.inputField} />
              </Form.Item>
              <p className={styles.labelName} style={{ marginTop: '10px' }}>
                <img src={iconTime} alt={'icon'} className={styles.labelIcon} />
                {formatMessage({ id: 'i18n_label_meet_time' })}
              </p>
              <Form.Item initialValue={selectedOption} name={'meet_time'}>
                <Select
                  className={styles.selectField}
                  onChange={handleOptionChange}
                >
                  <Select.Option value={15}>15</Select.Option>
                  <Select.Option value={30}>30</Select.Option>
                  <Select.Option value={45}>45</Select.Option>
                  <Select.Option value={60}>60</Select.Option>
                  <Select.Option value={90}>90</Select.Option>
                  <Select.Option value={120}>120</Select.Option>
                </Select>
              </Form.Item>
              <hr />
              <p className={styles.labelName}>
                {formatMessage({ id: 'i18n_candidate' })}
              </p>
              <div className={styles.candidateContainer}>
                <Button
                  className={styles.candidateButton}
                  onClick={handleAutoExtractCandidate()}
                >
                  {formatMessage({ id: 'i18n_auto_extract_candidate_btn' })}
                </Button>
                <img
                  src={iconQuestion}
                  alt={'icon'}
                  className={styles.labelIcon}
                />
              </div>
              <div className={styles.calendarTimeGroup}>
                <div className={styles.datePickerContainer}>
                  <div
                    className={styles.datePickerItem}
                    style={{ width: '100%' }}
                  >
                    <DatePicker
                      defaultValue={isDateTimeStart}
                      format={dateFormat}
                      onChange={handleChangeStartDate}
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
                      defaultValue={isDateTimeEnd}
                      format={dateFormat}
                      onChange={handleChangeEndDate}
                    />
                  </div>
                </div>
                <Button
                  className={styles.calendarBtn}
                  onClick={handleShowCalendar}
                >
                  {formatMessage({ id: 'i18n_calendar_title' })}
                </Button>
                {!isAutoExtractCandidate && (
                  <div className={styles.calendarTime}>
                    {formatMessage({ id: 'i18n_no_candidate' })}
                  </div>
                )}
              </div>
              {isAutoExtractCandidate && (
                <Collapse
                  className={styles.collapseContainer}
                  defaultActiveKey={['1']}
                  expandIconPosition="end"
                >
                  <Panel
                    header={`${isDateTimeStart.format(
                      dateFormat,
                    )} ~ ${isDateTimeEnd.format(dateFormat)}`}
                    key="1"
                  >
                    {renderDateRange()}
                  </Panel>
                </Collapse>
              )}
              <hr />
              <div className={styles.otherInfo}>
                <p className={styles.labelName}>
                  {formatMessage({ id: 'i18n_label_other_info' })}
                </p>
                <p className={styles.labelName}>
                  <img
                    src={iconMemo}
                    alt={'icon'}
                    className={styles.labelIcon}
                  />
                  {formatMessage({ id: 'i18n_memo' })}
                </p>
                <Form.Item name={'memo'}>
                  <Input
                    className={styles.inputField}
                    placeholder={formatMessage({ id: 'i18n_memo_placeholder' })}
                  />
                </Form.Item>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button
                  className={styles.saveBtn}
                  loading={loading}
                  htmlType="submit"
                  onClick={handleCalendarCreation}
                >
                  {formatMessage({ id: 'i18n_btn_save' })}
                </Button>
              </div>
            </Form>
          </div>
          <Modal
            title={formatMessage({ id: 'i18n_create_calendar_success_title' })}
            open={isCreateCalendarSuccess}
            onCancel={handleCloseModal}
            footer={null}
          >
            <div className={styles.modalContent}>
              <p>
                {formatMessage({ id: 'i18n_create_calendar_success_content' })}
              </p>
              <div className={styles.shareCalendarFrame}>
                <Link
                  to={`/calendar/${dataCalendarSuccess?.id}`}
                  className={styles.shareCalendarLink}
                >
                  {Object.keys(isDetailCalendar).length > 0 &&
                  Object.keys(isDetailCalendar.vote).length > 0
                    ? isDetailCalendar.vote.full_url
                    : ''}
                </Link>
                <div
                  className={styles.shareCalendarItem}
                  style={{ marginTop: '10px' }}
                >
                  <div className={styles.shareCalendarTitle}>
                    {formatMessage({ id: 'i18n_adjust_url_title' })}
                  </div>
                  <div className={styles.shareCalendarLink}>
                    <Button
                      className={`${styles.shareCalendarBtn} ${styles.bgBlue700}`}
                      onClick={handleCopyURLToClipboard}
                    >
                      {isURLCopy
                        ? formatMessage({ id: 'i18n_copied' })
                        : formatMessage({ id: 'i18n_copy_adjust_url' })}
                    </Button>
                  </div>
                </div>
                <div
                  className={styles.shareCalendarItem}
                  style={{ marginTop: '10px' }}
                >
                  <div className={styles.shareCalendarTitle}>
                    {formatMessage({ id: 'i18n_share_fixed_text_title' })}
                  </div>
                  <div className={styles.shareCalendarLink}>
                    <Button
                      onClick={handleRedirectToURL('/email-template')}
                      className={`${styles.shareCalendarBtn} ${styles.bgBlue500}`}
                    >
                      {formatMessage({ id: 'i18n_share_fixed_btn' })}
                    </Button>
                  </div>
                  <div className={styles.shareCalendarLink}>
                    <Button
                      onClick={handleCopyTemplateToClipboard}
                      className={`${styles.shareCalendarBtn} ${styles.bgBlue700}`}
                    >
                      {isTemplateCopy
                        ? formatMessage({ id: 'i18n_copied' })
                        : formatMessage({ id: 'i18n_copy_standard_text' })}
                    </Button>
                  </div>
                </div>
              </div>
              <div
                className={styles.shareCalendarFrame}
                style={{ marginTop: '10px' }}
              >
                <div className={styles.shareCalendarItem}>
                  <div className={styles.shareCalendarTitle}>
                    {formatMessage({ id: 'i18n_share_via_email' })}
                  </div>
                  <div className={styles.shareCalendarLink}>
                    <Button
                      className={`${styles.shareCalendarBtn} ${styles.bgBlue700}`}
                      onClick={handleRedirectToURL(
                        `/invite-participant?event_code=${dataCalendarSuccess.event_code}`,
                      )}
                    >
                      {formatMessage({ id: 'i18n_copy_via_email' })}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      );
    }
  };

  return (
    <div>
      {renderListCalendar()}
      <Spin spinning={loading}>
        <HeaderMobile
          title={formatMessage({ id: 'i18n_calendar_creation_title' })}
          typeHeader={'calendar'}
          isCalendarCreation={true}
          isSelectDetail={handleIsSelectDetail}
          isRight={true}
        />
        {renderCreateCalendar()}
      </Spin>
      <Modal
        title={formatMessage({ id: 'i18n_calendar_link_other' })}
        open={modalVisible}
        onCancel={closeModal}
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
          <button className={styles.calendarLinkOtherItem}>
            <img src={iconGoogle} alt="Google" />
            {formatMessage({ id: 'i18n_calendar_link_other_google' })}
          </button>
          <button className={styles.calendarLinkOtherItem}>
            <img src={iconOffice} alt="Office" />
            {formatMessage({ id: 'i18n_calendar_link_other_microsoft' })}
          </button>
        </div>
        <div className={styles.calendarLinkOtherFooter}>
          <Link to={'/'}>{formatMessage({ id: 'i18n_footer_service' })}</Link>
          <Link to={'/'}>{formatMessage({ id: 'i18n_footer_privacy' })}</Link>
        </div>
      </Modal>
    </div>
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
    onDeleteEvent: (event, isManualSetting) =>
      dispatch(deleteEvent(event, isManualSetting)),
    onNextWeek: step => dispatch(nextWeek(step)),
    onPrevWeek: step => dispatch(prevWeek(step)),
    onSetCalendarRef: value => dispatch(setCalendarRef(value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarCreation);
