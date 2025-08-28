import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { Button, Collapse, Spin, Tooltip } from 'antd';
import moment from 'moment';
import { useIntl, history } from 'umi';

import { connect } from 'dva';
import { YYYYMMDD } from '@/constant';
import ScheduleSetting from '@/components/TemplateSetting/ScheduleSetting';
import BasicSetting from '@/components/TemplateSetting/BasicSetting';
import TimeSetting from '@/components/TemplateSetting/TimeSetting';
import MessageSetting from '@/components/TemplateSetting/MessageSetting';
import CustomModal from './CustomModal';

import helperImage from '@/assets/images/imgQuestion.png';
import clockImage from '@/assets/images/i-clock.svg';
import pinionImage from '@/assets/images/i-pinion.svg';
import messageImage from '@/assets/images/message-setting.png';

function CalendarCreation(props) {
  // GENERAL DATA
  const intl = useIntl();
  const { formatMessage } = intl;
  const today = moment().format(YYYYMMDD);
  const { Panel } = Collapse;

  const defaultCalendarPriorityTime = [
    {
      status: 1,
      priority_start_time: null,
      priority_end_time: null,
      id: '',
      is_delete: false,
    },
    {
      status: 2,
      priority_start_time: null,
      priority_end_time: null,
      id: '',
      is_delete: false,
    },
    {
      status: 3,
      priority_start_time: null,
      priority_end_time: null,
      id: '',
      is_delete: false,
    },
    {
      status: 4,
      priority_start_time: null,
      priority_end_time: null,
      id: '',
      is_delete: false,
    },
    {
      status: 5,
      priority_start_time: null,
      priority_end_time: null,
      id: '',
      is_delete: false,
    },
  ];
  const templateStatus = true;

  // STORE DATA
  const {
    dispatch,
    eventStore,
    masterStore,
    active,
    idEventTemp,
    relationshipTemp,
    editTemp,
    cloneTemp,
  } = props;
  const {
    listEventLocation,
    listEventCategories,
    listEventBlockTime,
    listEventMoveTime,
    eventTemplateList,
    isLoading,
  } = eventStore;
  const { profile } = masterStore;

  const [currentTemplate, setCurrentTemplate] = useState({
    type_template: 1,
    default_end_time: null,
    default_start_time: null,
    lunch_break_end_time: null,
    lunch_break_start_time: null,
    period: null,
    reception_end_time: null,
    reception_start_time: null,
    relax_time: null,
    reservation_number: null,
  });

  const [listTemplate, setListTemplate] = useState([
    {
      type_template: 1,
      block_name: null,
      block_number: null,
      calendar_confirm_comment: null,
      calendar_create_comment: null,
      category_name: null,
      default_end_time: null,
      default_start_time: null,
      deleted_at: null,
      location_name: null,
      lunch_break_end_time: null,
      lunch_break_start_time: null,
      m_block_time_id: null,
      m_category_id: null,
      m_location_id: null,
      m_move_time_id: null,
      m_priority_times: [],
      move_name: null,
      move_number: null,
      period: null,
      reception_end_time: null,
      reception_start_time: null,
      relax_time: null,
      reservation_number: null,
    },
    {
      type_template: 2,
      block_name: null,
      block_number: null,
      calendar_confirm_comment: null,
      calendar_create_comment: null,
      category_name: null,
      default_end_time: null,
      default_start_time: null,
      deleted_at: null,
      location_name: null,
      lunch_break_end_time: null,
      lunch_break_start_time: null,
      m_block_time_id: null,
      m_category_id: null,
      m_location_id: null,
      m_move_time_id: null,
      m_priority_times: [],
      move_name: null,
      move_number: null,
      period: null,
      reception_end_time: null,
      reception_start_time: null,
      relax_time: null,
      reservation_number: null,
    },
    {
      type_template: 3,
      block_name: null,
      block_number: null,
      calendar_confirm_comment: null,
      calendar_create_comment: null,
      category_name: null,
      default_end_time: null,
      default_start_time: null,
      deleted_at: null,
      location_name: null,
      lunch_break_end_time: null,
      lunch_break_start_time: null,
      m_block_time_id: null,
      m_category_id: null,
      m_location_id: null,
      m_move_time_id: null,
      m_priority_times: [],
      move_name: null,
      move_number: null,
      period: null,
      reception_end_time: null,
      reception_start_time: null,
      relax_time: null,
      reservation_number: null,
    },
  ]);

  // GENERAL STATE
  const [checkValidate, setCheckValidate] = useState(false);
  const [relationshipType, setRelationshipType] = useState();
  const [urlMeet, setUrlMeet] = useState();
  const [urlZoom, setUrlZoom] = useState();

  // OPTION 1 STATE
  const [meetingFormat, setMeetingFormat] = useState(undefined);
  const [meetingPlace, setMeetingPlace] = useState(undefined);
  const [requiredTime, setRequiredTime] = useState(2);
  const [travelTime, setTravelTime] = useState(null);
  const [eventTypeName, setEventTypeName] = useState('');

  const [showModalCustom, setShowModalCustom] = useState(false);
  const [modalInputType, setModalInputType] = useState('text');

  const [currentModalTitle, setCurrentModalTitle] = useState('');
  const [currentCustomValue, setCurrentCustomValue] = useState('');
  const [currentModalType, setCurrentModalType] = useState('');

  const [customPlaceName, setCustomPlaceName] = useState('');
  const [customPhoneNumber, setCustomPhoneNumber] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customTravelTime, setCustomTravelTime] = useState(null);
  const [customRequiredTime, setCustomRequiredTime] = useState(null);

  // OPTION 2 STATE
  // OPTION 3 STATE

  const [scheduleValue, setScheduleValue] = useState(currentTemplate);
  const [customBreakTime, setCustomBreakTime] = useState(null);
  const [customPeriod, setCustomPeriod] = useState(null);
  const [customReceptionStart, setCustomReceptionStart] = useState(null);
  const [customReceptionEnd, setCustomReceptionEnd] = useState(null);
  const [customReservation, setCustomReservation] = useState(null);

  // OPTION 4 STATE
  const [priorityTime, setPriorityTime] = useState(defaultCalendarPriorityTime);

  // OPTION 5 STATE
  const [calendarCreateComment, setCalendarCreateComment] = useState(null);
  const [calendarConfirmComment, setCalendarConfirmComment] = useState(null);

  //OTHER STATE
  const [errDefaultTime, setErrDefaultTime] = useState(false);
  const [errLunchTime, setErrLunchTime] = useState(false);

  useEffect(() => {
    setCurrentTemplate(
      listTemplate.find(item => item.type_template === active),
    );
  }, [active, listTemplate]);

  useEffect(() => {
    const payload = {
      setUrlMeet: setUrlMeet,
    };
    dispatch({ type: 'EVENT/getGoogleMeetURL', payload });
  }, []);
  useEffect(() => {
    const payload = {
      setUrlZoom: setUrlZoom,
    };
    dispatch({ type: 'EVENT/getZoomURL', payload });
  }, []);

  // LOAD MASTER DATA
  useEffect(() => {
    dispatch({ type: 'EVENT/getListEventLocations', payload: {} });
    dispatch({ type: 'EVENT/getListEventCategories', payload: {} });
    dispatch({ type: 'EVENT/getListEventBlockTime', payload: {} });
    dispatch({ type: 'EVENT/getListEventMoveTime', payload: {} });
    dispatch({ type: 'MASTER/getProfile', payload: {} });
    dispatch({ type: 'EVENT/getEventTemplate', payload: {} });
    resetState();
  }, []);

  useEffect(() => {
    if (eventTemplateList.length) {
      let result = [];
      listTemplate.map(template => {
        let match = eventTemplateList.find(
          item => item.type_template === template.type_template,
        );
        if (match) {
          result.push(match);
        } else {
          result.push(template);
        }
      });
      setListTemplate(result);
    }
  }, [eventTemplateList]);

  // FILL DATA TO FORM
  useEffect(() => {
    //OPTION 1
    setEventTypeName(currentTemplate.name ? currentTemplate.name : undefined);
    setMeetingFormat(
      currentTemplate.m_category_id ? currentTemplate.m_category_id : undefined,
    );
    setMeetingPlace(
      currentTemplate.m_location_id ? currentTemplate.m_location_id : undefined,
    );
    setRequiredTime(
      currentTemplate.m_block_time_id ? currentTemplate.m_block_time_id : null,
    );
    setTravelTime(
      currentTemplate.m_move_time_id ? currentTemplate.m_move_time_id : null,
    );
    if (currentTemplate.m_location_id === 5) {
      setCustomPlaceName(
        currentTemplate.location_name
          ? currentTemplate.location_name
          : undefined,
      );
      setCustomPhoneNumber('');
      setCustomLocation('');
    } else if (currentTemplate.m_location_id === 3) {
      setCustomPlaceName('');
      setCustomPhoneNumber(
        currentTemplate.location_name
          ? currentTemplate.location_name
          : undefined,
      );
      setCustomLocation('');
    } else if (currentTemplate.m_location_id === 4) {
      setCustomPlaceName('');
      setCustomPhoneNumber('');
      setCustomLocation(
        currentTemplate.location_name
          ? currentTemplate.location_name
          : undefined,
      );
    }
    if (currentTemplate.m_move_time_id === 7) {
      setCustomTravelTime(
        currentTemplate.move_number ? currentTemplate.move_number : null,
      );
    }
    if (currentTemplate.m_block_time_id === 6) {
      setCustomRequiredTime(
        currentTemplate.block_number ? currentTemplate.block_number : null,
      );
    }

    // OPTION 3 STATE
    setScheduleValue({
      ...scheduleValue,
      default_start_time: currentTemplate.default_start_time
        ? currentTemplate.default_start_time
        : null,
      default_end_time: currentTemplate.default_end_time
        ? currentTemplate.default_end_time
        : null,
      relax_time:
        currentTemplate.relax_time !== null ? currentTemplate.relax_time : null,
      period: currentTemplate.period ? currentTemplate.period : null,
      reception_start_time:
        currentTemplate.reception_start_time !== null
          ? currentTemplate.reception_start_time
          : null,
      reception_end_time: currentTemplate.reception_end_time
        ? currentTemplate.reception_end_time
        : null,
      lunch_break_start_time: currentTemplate.lunch_break_start_time
        ? currentTemplate.lunch_break_start_time
        : null,
      lunch_break_end_time: currentTemplate.lunch_break_end_time
        ? currentTemplate.lunch_break_end_time
        : null,
      reservation_number: currentTemplate.reservation_number
        ? currentTemplate.reservation_number
        : null,
    });
    setCustomReceptionStart(
      currentTemplate.reception_start_time
        ? currentTemplate.reception_start_time
        : null,
    );
    setCustomReceptionEnd(
      currentTemplate.reception_end_time
        ? currentTemplate.reception_end_time
        : null,
    );
    setCustomBreakTime(
      currentTemplate.relax_time !== null ? currentTemplate.relax_time : null,
    );
    setCustomPeriod(currentTemplate.period ? currentTemplate.period : null);
    setCustomReservation(
      currentTemplate.reservation_number
        ? currentTemplate.reservation_number
        : null,
    );

    // OPTION 4 STATE
    if (
      currentTemplate.m_priority_times &&
      currentTemplate.m_priority_times.length > 0
    ) {
      let result = [];
      for (let i = 0; i < 5; i++) {
        const temp = currentTemplate.m_priority_times.find(
          item => item.status === i + 1,
        );
        if (temp) {
          result.push({ ...temp, is_delete: false });
        } else {
          result.push({
            status: i + 1,
            priority_start_time: null,
            priority_end_time: null,
            id: '',
            is_delete: false,
          });
        }
      }
      setPriorityTime(result);
    } else {
      setPriorityTime(defaultCalendarPriorityTime);
    }

    // OPTION 5 STATE
    setCalendarCreateComment(
      currentTemplate.calendar_create_comment
        ? currentTemplate.calendar_create_comment
        : null,
    );
    setCalendarConfirmComment(
      currentTemplate.calendar_confirm_comment
        ? currentTemplate.calendar_confirm_comment
        : null,
    );
  }, [currentTemplate]);

  const resetState = () => {
    //OPTION 1 STATE
    setEventTypeName('');
    setMeetingFormat(undefined);
    setMeetingPlace(undefined);
    setRequiredTime(2);
    setTravelTime(null);
    setCustomPlaceName('');
    setCustomPhoneNumber('');
    setCustomRequiredTime(null);
    setCustomTravelTime(null);
    setCustomLocation('');
    setShowModalCustom(false);
    setModalInputType('text');
    setCurrentModalTitle('');
    setCurrentCustomValue('');
    setCurrentModalType('');

    // OPTION 2 STATE

    // OPTION 3 STATE
    setScheduleValue({
      type_template: active,
      default_end_time: null,
      default_start_time: null,
      lunch_break_end_time: null,
      lunch_break_start_time: null,
      period: null,
      reception_end_time: null,
      reception_start_time: null,
      relax_time: null,
      reservation_number: null,
    });
    setCustomBreakTime(null);
    setCustomPeriod(null);
    setCustomReceptionStart(null);
    setCustomReceptionEnd(null);
    setCustomReservation(null);

    // OPTION 4 STATE
    const newPriority = [...priorityTime].map(item => {
      item.is_delete = false;
      item.priority_start_time = null;
      item.priority_end_time = null;
      return item;
    });
    setPriorityTime(newPriority);

    // OPTION 5 STATE
    setCalendarCreateComment(null);
    setCalendarConfirmComment(null);
  };

  const onCloseModal = type => {
    setShowModalCustom(false);
    setCurrentCustomValue('');
    switch (type) {
      case 'place':
        setCustomPlaceName('');
        setMeetingPlace(undefined);
        break;
      case 'travel_time':
        setCustomTravelTime(null);
        setTravelTime(null);
        break;
      case 'required_time':
        setCustomRequiredTime(null);
        setRequiredTime(2);
        break;
      case 'phone':
        setCustomPhoneNumber('');
        setMeetingPlace(undefined);
        break;
      case 'location':
        setCustomLocation('');
        setMeetingPlace(undefined);
        break;
      case 'reception_start':
        setCustomReceptionStart(null);
      case 'reception_end':
        setCustomReceptionEnd(null);
      case 'relax_time':
        setCustomBreakTime(null);
      case 'period':
        setCustomPeriod(null);
      case 'reservation':
        setCustomReservation(null);
      default:
        break;
    }
  };

  const onUpdateModal = async (value, type) => {
    switch (type) {
      case 'place':
        setCustomPlaceName(value);
        break;
      case 'travel_time':
        setCustomTravelTime(value);
        break;
      case 'required_time':
        setCustomRequiredTime(value);
        break;
      case 'phone':
        setCustomPhoneNumber(value);
        break;
      case 'location':
        setCustomLocation(value);
        break;
      case 'reception_start':
        await setCustomReceptionStart(value);
        break;
      case 'reception_end':
        await setCustomReceptionEnd(value);
        break;
      case 'relax_time':
        await setCustomBreakTime(value);
        break;
      case 'period':
        await setCustomPeriod(value);
        break;
      case 'reservation':
        await setCustomReservation(value);
        break;
      default:
        break;
    }
    setCurrentCustomValue('');
    setShowModalCustom(false);
  };

  function compareDefaultTime() {
    if (
      moment(scheduleValue.default_start_time, 'HH:mm').isBefore(
        moment(scheduleValue.default_start_time, 'HH:mm'),
      ) ||
      moment(scheduleValue.default_start_time, 'HH:mm').isAfter(
        moment('23:30', 'HH:mm'),
      ) ||
      moment(scheduleValue.default_start_time, 'HH:mm').isAfter(
        moment(scheduleValue.default_end_time, 'HH:mm'),
      ) ||
      moment(scheduleValue.default_end_time, 'HH:mm').isBefore(
        moment('00:15', 'HH:mm'),
      ) ||
      moment(scheduleValue.default_start_time, 'HH:mm').isSame(
        moment(scheduleValue.default_end_time, 'HH:mm'),
      ) ||
      (scheduleValue.default_start_time === null &&
        scheduleValue.default_end_time !== null) ||
      (scheduleValue.default_start_time !== null &&
        scheduleValue.default_end_time === null)
    ) {
      const newScheduleValue = {
        ...scheduleValue,
      };
      setErrDefaultTime(true);
      setScheduleValue(newScheduleValue);
      return true;
    }
    setErrDefaultTime(false);
    return false;
  }

  function compareLunchTime() {
    if (
      moment(scheduleValue.lunch_break_end_time, 'HH:mm').isBefore(
        moment(scheduleValue.lunch_break_start_time, 'HH:mm'),
      ) ||
      moment(scheduleValue.lunch_break_start_time, 'HH:mm').isAfter(
        moment('23:30', 'HH:mm'),
      ) ||
      moment(scheduleValue.lunch_break_start_time, 'HH:mm').isAfter(
        moment(scheduleValue.lunch_break_end_time, 'HH:mm'),
      ) ||
      moment(scheduleValue.lunch_break_end_time, 'HH:mm').isBefore(
        moment('00:15', 'HH:mm'),
      ) ||
      (scheduleValue.lunch_break_start_time === null &&
        scheduleValue.lunch_break_end_time !== null) ||
      (scheduleValue.lunch_break_start_time !== null &&
        scheduleValue.lunch_break_end_time === null)
    ) {
      const newScheduleValue = {
        ...scheduleValue,
      };
      setErrLunchTime(true);
      setScheduleValue(newScheduleValue);
      return true;
    }
    if (
      scheduleValue.lunch_break_start_time &&
      !scheduleValue.lunch_break_end_time
    ) {
      const newScheduleValue = {
        ...scheduleValue,
      };
      setErrLunchTime(true);
      setScheduleValue(newScheduleValue);
      return true;
    }
    setErrLunchTime(false);
    return false;
  }

  function comparePriorityTime() {
    let listPriority = JSON.parse(JSON.stringify(priorityTime));
    let state = false;
    let tempListPriority = [...listPriority];
    //Check start time after end time and start time null or end time null
    tempListPriority = [...listPriority].map(item => {
      let tempPriority = { ...item, hasError: false };
      if (
        item.priority_start_time !== null &&
        item.priority_end_time !== null
      ) {
        if (item.priority_start_time >= item.priority_end_time) {
          state = true;
          tempPriority = { ...item, hasError: true };
        }
      }
      if (
        (item.priority_start_time !== null &&
          item.priority_end_time === null) ||
        (item.priority_start_time === null && item.priority_end_time !== null)
      ) {
        state = true;
        tempPriority = { ...item, hasError: true };
      }
      return tempPriority;
    });
    //Check priority inside each other
    for (let i = 0; i < 5; i++) {
      for (let j = i + 1; j < 5; j++) {
        if (
          tempListPriority[i].priority_start_time !== null &&
          tempListPriority[i].priority_end_time !== null &&
          tempListPriority[j].priority_start_time !== null &&
          tempListPriority[j].priority_end_time !== null
        ) {
          if (
            !(
              tempListPriority[i].priority_start_time >=
                tempListPriority[j].priority_end_time ||
              tempListPriority[i].priority_end_time <=
                tempListPriority[j].priority_start_time
            )
          ) {
            state = true;
            tempListPriority[j] = { ...tempListPriority[j], hasError: true };
          }
        }
      }
    }
    setPriorityTime(tempListPriority);
    return state;
  }

  const updateScheduleSetting = () => {
    let checkDefault = compareDefaultTime();
    let checkLunch = compareLunchTime();
    if (!(checkDefault || checkLunch)) {
      const payload = {
        ...scheduleValue,
        type_template: active,
      };
      dispatch({
        type: 'EVENT/setEventTemplate',
        payload: { requestBody: payload },
      });
    }
  };

  const updateMessageSetting = () => {
    const payload = {
      type_template: active,
      calendar_create_comment: calendarCreateComment,
      calendar_confirm_comment: calendarConfirmComment,
    };
    dispatch({
      type: 'EVENT/setEventTemplate',
      payload: { requestBody: payload },
    });
  };
  const getList = async () => {
    await dispatch({ type: 'EVENT/getEventTemplate', payload: {} });
  };

  useEffect(() => {
    let newTemp = [...eventTemplateList].find(
      item => item.type_template === currentTemplate.type_template,
    );
    setCurrentTemplate({ ...newTemp });
  }, [eventTemplateList]);

  useEffect(() => {
    if (currentTemplate.m_priority_times) {
      let newPriority = [];
      let newPriorityTemp = { ...currentTemplate }.m_priority_times;
      let newCurrentPriority = [...priorityTime];
      for (let i = 1; i <= 5; i++) {
        let a = newPriorityTemp.find(item => item.status === i);
        let b = newCurrentPriority.find(item => item.status === i);
        if (a) {
          if (a.priority_start_time !== null && a.priority_end_time !== null) {
            newPriority.push({
              ...b,
              id: a.id,
              priority_start_time: a.priority_start_time,
              priority_end_time: a.priority_end_time,
              status: a.status,
              is_delete: false,
            });
          } else {
            newPriority.push({
              ...b,
              id: a.id,
              is_delete: true,
            });
          }
        } else {
          newPriority.push({
            ...b,
            is_delete: false,
            id: '',
            priority_start_time: null,
            priority_end_time: null,
            status: b.status,
          });
        }
      }
      setPriorityTime(newPriority);
    }
  }, [currentTemplate]);

  const updateTimeSetting = () => {
    if (!comparePriorityTime()) {
      const newPriority = priorityTime.map(item => {
        if (
          item.priority_start_time === null &&
          item.priority_end_time === null
        ) {
          item.is_delete = true;
          delete item.hasError;
        }
        return item;
      });
      let lastPriorityTime = newPriority.filter(priority => {
        return (
          (priority.priority_start_time !== null &&
            priority.priority_end_time !== null) ||
          (priority.is_delete && priority.id !== '')
        );
      });
      const payload = {
        m_priority_times: lastPriorityTime,
        type_template: active,
      };
      dispatch({
        type: 'EVENT/setEventTemplate',
        payload: { requestBody: payload },
      });
    }
  };
  const saveAll = () => {
    setCheckValidate(true);

    const getRequiredTime = () => {
      if (requiredTime) {
        return requiredTime === 6
          ? customRequiredTime
          : listEventBlockTime.find(item => item.id === requiredTime)
              .block_number;
      }
      return 30;
    };

    const getMoveTime = () => {
      if (travelTime) {
        return travelTime === 7
          ? customTravelTime
          : listEventMoveTime.find(item => item.id === travelTime).move_number;
      }
      return 0;
    };
    const isValid =
      requiredTime &&
      ((meetingFormat === 2 && travelTime) ||
        (meetingFormat && meetingFormat !== 2)) &&
      meetingPlace;
    if (isValid) {
      if (
        !(comparePriorityTime() || compareDefaultTime() || compareLunchTime())
      ) {
        const newPriority = priorityTime.map(item => {
          if (
            item.priority_start_time === null &&
            item.priority_end_time === null
          ) {
            item.is_delete = true;
            delete item.hasError;
          }
          return item;
        });
        let lastPriorityTime = newPriority.filter(priority => {
          return (
            (priority.priority_start_time !== null &&
              priority.priority_end_time !== null) ||
            (priority.is_delete && priority.id !== '')
          );
        });
        const payload = {
          ...scheduleValue,
          m_category_id: meetingFormat,
          m_location_id: meetingPlace,
          m_block_time_id: requiredTime,
          m_move_time_id: travelTime,
          block_number: getRequiredTime(),
          move_number: getMoveTime(),
          type_template: active,
          m_priority_times: lastPriorityTime,
          calendar_create_comment: calendarCreateComment,
          calendar_confirm_comment: calendarConfirmComment,
        };
        if (meetingPlace === 3) {
          payload.location_name = customPhoneNumber;
        }
        if (meetingPlace === 4) {
          payload.location_name = customLocation;
        }
        if (meetingPlace === 5) {
          payload.location_name = customPlaceName;
        }
        if (customTravelTime && payload.m_move_time_id === 7) {
          payload.move_number = customTravelTime;
        }
        if (!customTravelTime && !payload.m_move_time_id) {
          payload.m_move_time_id = null;
          payload.move_number = 0;
        }
        if (customPlaceName) {
          payload.block_number = customRequiredTime;
        }
        dispatch({
          type: 'EVENT/setEventTemplate',
          payload: { requestBody: payload, name: 'saveAll' },
        });
      }
    }
  };

  const basicSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={pinionImage} />
        <div
          className={`${styles.dropdownHeaderTitle} ${styles.dropdownHeaderTitleOther}`}
        >
          {formatMessage({ id: 'i18n_set_schedule' })}
        </div>
      </div>
    </div>
  );

  const scheduleSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={pinionImage} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_set_schedule' })}
        </div>
      </div>
    </div>
  );

  const timeSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={clockImage} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_time_setting' })}
        </div>
        <Tooltip
          title={formatMessage({ id: 'i18n_time_setting_tooltip' })}
          overlayClassName={styles.tooltipAdvanced}
        >
          <div className={styles.helperDropdown}>
            <img src={helperImage} className="helper" />
          </div>
        </Tooltip>
      </div>
    </div>
  );

  const messageSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={messageImage} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_message_setting' })}
        </div>
      </div>
    </div>
  );

  const updateBasicSetting = () => {
    const getRequiredTime = () => {
      if (requiredTime) {
        return requiredTime === 6
          ? customRequiredTime
          : listEventBlockTime.find(item => item.id === requiredTime)
              .block_number;
      }
      return 30;
    };

    const getMoveTime = () => {
      if (travelTime) {
        return travelTime === 7
          ? customTravelTime
          : listEventMoveTime.find(item => item.id === travelTime).move_number;
      }
      return 0;
    };

    setCheckValidate(true);
    const isValid =
      requiredTime &&
      ((meetingFormat === 2 && travelTime) ||
        (meetingFormat && meetingFormat !== 2)) &&
      meetingPlace;
    if (isValid) {
      const payload = {
        type_template: active,
        m_category_id: meetingFormat,
        m_location_id: meetingPlace,
        m_block_time_id: requiredTime,
        m_move_time_id: travelTime,
        block_number: getRequiredTime(),
        move_number: getMoveTime(),
      };

      if (meetingPlace === 3) {
        payload.location_name = customPhoneNumber;
      }
      if (meetingPlace === 4) {
        payload.location_name = customLocation;
      }
      if (meetingPlace === 5) {
        payload.location_name = customPlaceName;
      }
      if (customTravelTime && payload.m_move_time_id === 7) {
        payload.move_number = customTravelTime;
      }
      if (!customTravelTime && !payload.m_move_time_id) {
        payload.m_move_time_id = null;
        payload.move_number = 0;
      }
      if (customPlaceName) {
        payload.block_number = customRequiredTime;
      }
      dispatch({
        type: 'EVENT/setEventTemplate',
        payload: { requestBody: payload },
      });
    }
  };
  const onCancel = () => {
    let relationship_type = Number(history.location.query.relationship);
    if (relationshipTemp && !idEventTemp) {
      history.push(
        `/calendar-creation?relationship_type=${
          relationship_type ? relationship_type : 3
        }`,
      );
    }
    if (editTemp) {
      history.push(
        `/calendar-creation?idEvent=${idEventTemp}&edit=true&relationship_type=${
          relationship_type ? relationship_type : 3
        }`,
      );
    }
    if (cloneTemp) {
      history.push(
        `/calendar-creation?idEvent=${idEventTemp}&clone=true&relationship_type=${
          relationship_type ? relationship_type : 3
        }`,
      );
    }
    if (!relationshipTemp && !idEventTemp) {
      history.push('/');
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div
        className={`${styles.advancedSettingContainer} ${styles.templateContent}`}
      >
        <Collapse expandIconPosition="right" defaultActiveKey={['1', '2', '3']}>
          <Panel
            header={basicSetting}
            key="1"
            className={styles.collapseSettingContainer}
          >
            <div className={styles.calendarCreation}>
              <BasicSetting
                listEventLocation={listEventLocation}
                listEventCategories={listEventCategories}
                listEventBlockTime={listEventBlockTime}
                listEventMoveTime={listEventMoveTime}
                profile={profile}
                eventTypeName={eventTypeName}
                setEventTypeName={setEventTypeName}
                checkValidate={checkValidate}
                meetingFormat={meetingFormat}
                setMeetingFormat={setMeetingFormat}
                meetingPlace={meetingPlace}
                setMeetingPlace={setMeetingPlace}
                setShowModalCustom={setShowModalCustom}
                setModalInputType={setModalInputType}
                setCurrentModalTitle={setCurrentModalTitle}
                setCurrentModalType={setCurrentModalType}
                customPhoneNumber={customPhoneNumber}
                customLocation={customLocation}
                customPlaceName={customPlaceName}
                customRequiredTime={customRequiredTime}
                customTravelTime={customTravelTime}
                requiredTime={requiredTime}
                setRequiredTime={setRequiredTime}
                travelTime={travelTime}
                setTravelTime={setTravelTime}
                updateBasicSetting={updateBasicSetting}
                templateStatus={templateStatus}
                urlMeet={urlMeet}
                urlZoom={urlZoom}
                onCancelTemp={onCancel}
              />
            </div>
          </Panel>
        </Collapse>
        <Collapse expandIconPosition="right" defaultActiveKey={['1', '2', '3']}>
          <Panel
            header={scheduleSetting}
            key="1"
            className={styles.collapseSettingContainer}
          >
            <ScheduleSetting
              updateScheduleSetting={updateScheduleSetting}
              scheduleValue={scheduleValue}
              setScheduleValue={setScheduleValue}
              customReceptionStart={customReceptionStart}
              setCustomReceptionStart={setCustomReceptionStart}
              customReceptionEnd={customReceptionEnd}
              setCustomReceptionEnd={setCustomReceptionEnd}
              customBreakTime={customBreakTime}
              setCustomBreakTime={setCustomBreakTime}
              customPeriod={customPeriod}
              setCustomPeriod={setCustomPeriod}
              customReservation={customReservation}
              setCustomReservation={setCustomReservation}
              setShowModalCustom={setShowModalCustom}
              setModalInputType={setModalInputType}
              setCurrentModalTitle={setCurrentModalTitle}
              setCurrentModalType={setCurrentModalType}
              relationshipType={relationshipType}
              errDefaultTime={errDefaultTime}
              errLunchTime={errLunchTime}
              onCancelTemp={onCancel}
            />
          </Panel>

          <Panel
            header={timeSetting}
            key="2"
            className={styles.collapseSettingContainer}
          >
            <TimeSetting
              priorityTime={priorityTime}
              setPriorityTime={value => {
                setPriorityTime(value);
              }}
              setAdvancedStatus={() => {}}
              updateTimeSetting={updateTimeSetting}
              onCancelTemp={onCancel}
            />
          </Panel>

          <Panel
            header={messageSetting}
            key="3"
            className={`${styles.messageSettingContainer} ${styles.collapseSettingContainer}`}
          >
            <MessageSetting
              setCalendarCreateComment={setCalendarCreateComment}
              setCalendarConfirmComment={setCalendarConfirmComment}
              setAdvancedStatus={() => {}}
              updateMessageSetting={updateMessageSetting}
              calendarCreateComment={calendarCreateComment}
              calendarConfirmComment={calendarConfirmComment}
              onCancelTemp={onCancel}
            />
          </Panel>
        </Collapse>

        <div className={styles.buttonZoneContainer}>
          <Button className={styles.cancelButton} onClick={() => onCancel()}>
            もどる
          </Button>
          <Button className={styles.submitButton} onClick={() => resetState()}>
            リセット
          </Button>
          <Button className={styles.submitButton} onClick={() => saveAll()}>
            編集完了
          </Button>
        </div>
      </div>

      <CustomModal
        isShow={showModalCustom}
        customValue={currentCustomValue}
        onClose={() => onCloseModal(currentModalType)}
        onUpdate={value => onUpdateModal(value, currentModalType)}
        modalTitle={currentModalTitle}
        inputType={modalInputType}
        setShowModalCustom={setShowModalCustom}
      />
    </Spin>
  );
}

export default connect(({ EVENT, MASTER }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
}))(CalendarCreation);
