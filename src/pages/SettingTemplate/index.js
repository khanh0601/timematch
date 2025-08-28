import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import MenuListSetting from './components/MenuListSetting';
import BtnGroupNextPre from './components/BtnGroupNextPre';
import {
  CALENDAR_TEMPLATE_ITEM,
  FORMAT_DATE,
  INPUT_TYPE,
  MESSAGE_ERROR_BUTTON_EMBED_EMPTY,
  SETTING_TEMPLATE,
  STEP_NEXT_SETTING_TEMPLATE,
  TITLE_SETTING_TEMPLATE,
  YYYYMMDD,
  YYYYMMDDTHHmm,
} from '../../constant';
import ButtonEmbedTemplate from './components/ButtonEmbedTemplate';
import CalendarTemplate from './components/CalendarTemplate';
import ConfirmTemplate from './components/ConfirmTemplate';
import { useDispatch, useHistory, useLocation, useSelector } from 'umi';
import { Modal, Spin } from 'antd';
import Footer from './components/Footer';
import {
  canStartAt,
  checkEventBooked,
  createTimeAsync,
  filterReceptionTime,
  generaDateBookingEmbed,
  groupBy,
  isExpired,
  isOverlap,
  notify,
  objValid,
  personalExpiredModal,
  profileFromStorage,
  splitRange,
} from '../../commons/function';
import moment from 'moment';

const listTemplateActive = [
  SETTING_TEMPLATE.confirmTemplate,
  SETTING_TEMPLATE.calendarTemplate,
];
const SettingTemplate = () => {
  // store account team
  const { tabLoading, paginateEvents } = useSelector(
    store => store.ACCOUNT_TEAM,
  );
  // store event
  const {
    isLoading,
    listFreeDay,
    guestEventClients,
    firstSetupFreeTime,
    eventCustomizeDates,
  } = useSelector(store => store.EVENT);
  // store setting template
  const {
    isLoadingTemplate,
    templateActive,
    dataCalendarTemplate,
    dataButtonEmbedTemplate,
    listQuestion,
    policyDelete,
    questionDelete,
    policies,
    idEdit,
    userId,
    addInputQuestion,
  } = useSelector(store => store.SETTING_TEMPLATE);

  const { calendar } = dataCalendarTemplate;

  const dispatch = useDispatch();
  let history = useHistory();
  const refSetting = useRef();
  let { query } = useLocation();
  const [resetDataStore, setResetDataStore] = useState(false);
  const [titleSettingTemplate, setTitleSetting] = useState(
    TITLE_SETTING_TEMPLATE[templateActive],
  );
  const profile = profileFromStorage();
  const [listDateBooking, setDateBooking] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment().format(YYYYMMDD));
  const [showMessageExpirted, setShowExpirted] = useState(false);
  // store setting template
  const { optionSelected } = useSelector(store => store.SETTING_TEMPLATE);
  // load data
  useEffect(() => {
    if (!query?.type) {
      history.push('/');
      return;
    }

    if (query?.type === '3') {
      dispatch({
        type: 'SETTING_TEMPLATE/onActiveTemplate',
        payload: SETTING_TEMPLATE.calendarTemplate,
      });
    }

    loadDataInit();
    return () => {
      dispatch({
        type: 'ACCOUNT_TEAM/resetAccountTeam',
      });
      if (!resetDataStore) {
        dispatch({
          type: 'SETTING_TEMPLATE/reset',
        });
      }
    };
  }, []);

  // listen template change active
  useEffect(() => {
    if (
      templateActive === SETTING_TEMPLATE.buttonEmbedTemplate &&
      query?.type === '2'
    ) {
      setTitleSetting('予約ページ ＞ テキスト編集');
      return;
    }
    setTitleSetting(TITLE_SETTING_TEMPLATE[templateActive]);
  }, [templateActive]);

  // set event default selected
  useEffect(() => {
    if (paginateEvents?.data && paginateEvents?.data.length) {
      // check have member expired, not selected
      const { has_member_expired } = paginateEvents;
      if (has_member_expired) {
        setShowExpirted(true);
        return;
      }
      const eventSelected = paginateEvents.data[0];
      // if not calendar set default paginate first
      if (!objValid(calendar)) {
        updatedDataSettingTemplate('calendar', eventSelected);
      }

      // if calendar valid check
      // if not calendar select set calendar first
      if (objValid(calendar)) {
        const isValid = paginateEvents.data.find(
          item => item.id === calendar.id,
        );
        if (!isValid) {
          updatedDataSettingTemplate('calendar', eventSelected);
        }
      }
    } else {
      updatedDataSettingTemplate('calendar', {});
    }
  }, [paginateEvents]);

  // calendar change
  useEffect(() => {
    if (objValid(calendar)) {
      onLoadEventClient();
    } else {
      const listDateInit = generaDateBookingEmbed();
      setDateBooking(listDateInit);
    }
  }, [calendar]);

  // set event default selected
  useEffect(() => {
    if (!fetchedData) {
      return;
    }
    generateCurrentWeekValidTime(currentDate);
    setFetchedData(false);
  }, [fetchedData]);

  // show message error
  useEffect(() => {
    if (showMessageExpirted) {
      personalExpiredModal();
      setShowExpirted(false);
    }
  }, [showMessageExpirted]);

  useEffect(() => {
    if (optionSelected === CALENDAR_TEMPLATE_ITEM.c) {
      refSetting.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [optionSelected]);

  useEffect(() => {
    if (addInputQuestion) {
      refSetting.current.scrollIntoView({ behavior: 'smooth' });
      dispatch({
        type: 'SETTING_TEMPLATE/clearAddQuestion',
      });
    }
  }, [addInputQuestion]);

  const generateCurrentWeekValidTime = currentStartWeekDate => {
    if (!fetchedData) {
      return;
    }
    moment.locale('ja');
    let results = [];
    // group by date
    let freeDayGroupByDate = [];
    if (listFreeDay.length) {
      freeDayGroupByDate = groupBy('dateStr')(listFreeDay);
    }
    let members = [];
    let eventBooked = [];
    if (guestEventClients && guestEventClients.length) {
      members = guestEventClients.map(e => {
        if (e.events) {
          eventBooked.push(...e.events);
        }

        return {
          option: e.option,
          checked: true,
          id: e.email,
        };
      });
    }
    let maxDate = null;
    if (calendar.period) {
      maxDate = moment(currentDate).add(calendar.period, 'weeks');
    }

    for (let i = 0; i < 7; i++) {
      const validDate = moment(currentStartWeekDate)
        .add(i, 'd')
        .format(FORMAT_DATE);

      // no need generate if is max date
      if (maxDate && maxDate.isSameOrBefore(moment(validDate))) {
        break;
      }

      let validBlocks = freeDayGroupByDate[validDate];
      if (validBlocks) {
        // filter disable event_datetime
        validBlocks = validBlocks.filter(item => {
          return (
            item.status &&
            moment()
              .add(0)
              .isBefore(moment(item.start_time), 'minutes')
          );
        });

        validBlocks.map(item => {
          item.start = moment(item.start_time).format(YYYYMMDDTHHmm);
          item.end = moment(item.end_time).format(YYYYMMDDTHHmm);
          return item;
        });

        // filter reception_start_time
        validBlocks = filterReceptionTime(
          validBlocks,
          calendar.reception_start_time + calendar.move_number || 0,
        );

        results = [
          ...results,
          {
            date: moment(validDate, FORMAT_DATE).format('YYYY年M月D日 (ddd)'),
            listBlockTime: validBlocks,
          },
        ];
        continue;
      }

      // not auto generate if is manual setting
      if (calendar.is_manual_setting) {
        continue;
      }
      // generate by default setting
      let defaultValidBlocks = generateDefaultSettingForDate(validDate);

      // filter checked user
      if (guestEventClients && guestEventClients.length) {
        const dateEventBook = eventBooked.filter(e => {
          return moment(e.start_time).isSame(moment(validDate), 'day');
        });

        defaultValidBlocks = defaultValidBlocks.filter(e => {
          const { move_number } = calendar;
          let startTime = e.start_time;
          let endTime = e.end_time;
          if (move_number) {
            startTime = moment(startTime)
              .subtract(move_number, 'm')
              .format(YYYYMMDDTHHmm);
            endTime = moment(endTime)
              .add(move_number, 'm')
              .format(YYYYMMDDTHHmm);
          }

          return !checkEventBooked(startTime, endTime, dateEventBook, members);
        });
      }
      results = [
        ...results,
        {
          date: moment(validDate, FORMAT_DATE).format('YYYY年M月D日 (ddd)'),
          listBlockTime: defaultValidBlocks,
        },
      ];
    }
    setDateBooking(results);
  };

  const generateDefaultSettingForDate = date => {
    const { move_number } = calendar;
    const dayOfWeek = moment(date).isoWeekday();
    const settingOfDayOfWeek = firstSetupFreeTime.find(item => {
      return item.day_of_week === dayOfWeek;
    });
    // handle customize day
    const haveCustomize = eventCustomizeDates.find(item => {
      return moment(item.date).isSame(moment(date), 'day');
    });
    let settings = {};
    if (haveCustomize) {
      if (!haveCustomize.status) {
        return [];
      }

      if (settingOfDayOfWeek) {
        settings = settingOfDayOfWeek;
      } else {
        settings.start_time = '09:00';
        settings.end_time = '18:00';
      }
    } else {
      if (!settingOfDayOfWeek || !settingOfDayOfWeek?.status) {
        return [];
      }
      settings = settingOfDayOfWeek;
    }
    // default_start_time
    // default_end_time
    let startTime = moment(`${date} ${settings.start_time}`);
    let endTime = moment(`${date} ${settings.end_time}`);

    if (calendar.default_start_time && calendar.default_end_time) {
      startTime = moment(`${date} ${calendar.default_start_time}`);
      endTime = moment(`${date} ${calendar.default_end_time}`);
    }

    let validBlocks = [];
    if (calendar.priority_times && calendar.priority_times.length) {
      calendar.priority_times.forEach(item => {
        let priority_start_time = moment(`${date}T${item.priority_start_time}`);
        let priority_end_time = moment(`${date}T${item.priority_end_time}`);

        let tempBlocks = splitRange(
          priority_start_time,
          priority_end_time,
          calendar.block_number,
          calendar.relax_time,
        );
        validBlocks = [...validBlocks, ...tempBlocks];
      });
    } else {
      validBlocks = splitRange(
        startTime,
        endTime,
        calendar.block_number,
        calendar.relax_time,
      );
    }
    // filter by advance
    validBlocks = validBlocks.filter((item, index) => {
      let start = moment(item.start);
      let end = moment(item.end);
      // is past time
      if (
        moment()
          .add(move_number || 0)
          .isAfter(start, 'minutes')
      ) {
        return false;
      }

      // reception_start_time
      if (
        !canStartAt(
          item,
          calendar.reception_start_time + calendar.move_number || 0,
        )
      ) {
        return false;
      }

      // lunch_break_start_time
      // lunch_break_end_time
      if (calendar.lunch_break_start_time && calendar.lunch_break_end_time) {
        let breakStartTime = moment(
          `${date} ${calendar.lunch_break_start_time}`,
        );
        let breakEndTime = moment(`${date} ${calendar.lunch_break_end_time}`);

        // check is duplicate with break lunch time
        const duplicate = isOverlap(breakStartTime, breakEndTime, start, end);

        return !duplicate;
      }

      return true;
    });
    return validBlocks;
  };

  const onLoadListEventById = () => {
    const payload = {
      relationship_type: 1,
      has_pagination: false,
      user_id_of_member: profile?.id,
    };
    dispatch({
      type: 'ACCOUNT_TEAM/getOnePaginateEvents',
      payload,
    });
  };

  const onLoadEventClient = async () => {
    const { event_code, user_code, user } = calendar;
    const { startTime, endTime } = createTimeAsync();
    const payload = {
      event_code,
      user_code: user_code ? user_code : user.code,
      need_sync: true,
      start: startTime,
      end: endTime,
    };
    // get all A schedule calendar
    // getGuestEventClient
    await dispatch({
      type: 'EVENT/getGuestEventClient',
      payload,
    });
    await dispatch({
      type: 'EVENT/getListFreeDay',
      payload: {
        user_code: user_code ? user_code : user.code,
        event_code,
      },
    });
    await dispatch({
      type: 'EVENT/getEventCustomizeDates',
      payload: {
        event_code,
      },
    });
    await dispatch({
      type: 'EVENT/getFreeTimeByGuest',
      payload: {
        event_code,
      },
    });
    setFetchedData(true);
  };

  const loadDataInit = async () => {
    if (isExpired()) {
      setShowExpirted(true);
      return;
    }
    const res = await dispatch({
      type: 'SETTING_TEMPLATE/loadDataByUser',
      payload: {
        typeButtonEmbed: query?.type,
      },
    });
    if (!res) {
      // khi k có data lần đầu vào tạo mới thì sẽ gọi, còn k thì thôi
      onLoadListEventById();
    }
  };

  // valid calendar template, confirm template
  const validDataForm = () => {
    let isValid = false;

    if (templateActive === SETTING_TEMPLATE.calendarTemplate) {
      let dataValid = {};
      const {
        descriptionCalendar,
        backgroundImage,
        nameCalendar,
        calendar,
      } = dataCalendarTemplate;

      if (!backgroundImage?.files) {
        dataValid = {
          ...dataValid,
          backgroundImage: {
            isValid: true,
            message: '必須項目を入力してください。',
          },
        };
        isValid = true;
      }
      if (!calendar?.id) {
        dataValid = {
          ...dataValid,
          calendar: {
            isValid: true,
            message: '必須項目を入力してください。',
          },
        };
        isValid = true;
      }
      if (!nameCalendar?.text) {
        dataValid = {
          ...dataValid,
          nameCalendar: {
            isValid: true,
            message: '必須項目を入力してください。',
          },
        };
        isValid = true;
      }
      if (!descriptionCalendar.title.text) {
        dataValid = {
          ...dataValid,
          descriptionCalendar: {
            isValid: true,
            message: '必須項目を入力してください。',
          },
        };
        isValid = true;
      }
      if (!descriptionCalendar.content.text) {
        dataValid = {
          ...dataValid,
          descriptionCalendar: {
            isValid: true,
            message: '必須項目を入力してください。',
          },
        };
        isValid = true;
      }
      if (objValid(dataValid)) {
        dispatch({
          type: 'SETTING_TEMPLATE/setKeyValid',
          payload: dataValid,
        });
      }
    }

    return isValid;
  };

  const handlePreparePolicesDelete = list =>
    list.map(({ key_id, type, ...rest }) => ({
      ...rest,
    }));

  const handleQuestionDelete = list => {
    if (!list || !list.length) {
      return [];
    }
    const listID = list.map(item => item.id);
    if (listID.length) {
      return listID.filter(item => {
        if (item) {
          return item;
        }
      });
    }
    return listID;
  };

  const handleFilterPolicies = list => {
    const data = [];
    list.forEach(({ key_id, ...rest }, index) => {
      if (rest.type === INPUT_TYPE.policy) {
        const { type, ...restPolicy } = rest;
        data.push({
          ...restPolicy,
          index: index + 1,
        });
      }
    });

    return data;
  };

  const handleFilterListQuestion = list => {
    const data = [];
    list.forEach(({ key_id, contents, id, ...rest }, index) => {
      if (rest.type !== INPUT_TYPE.policy) {
        if (contents?.length > 0) {
          rest.contents = contents.map(
            ({ form_question_id, key_id, id, ...restContent }) => {
              if (idEdit) {
                return { ...restContent, id };
              }
              if (!idEdit) {
                return restContent;
              }
            },
          );
        }
        if (idEdit) {
          rest.id = id;
        }
        rest.index = index + 1;
        data.push(rest);
      }
    });

    return data;
  };

  const onSubmit = async () => {
    if (validDataForm()) {
      notify(MESSAGE_ERROR_BUTTON_EMBED_EMPTY);
      return;
    }
    if (tabLoading || isLoading) {
      return;
    }
    // if template === SETTING_TEMPLATE.confirmTemplate => save data
    if (templateActive === SETTING_TEMPLATE.confirmTemplate) {
      const { backgroundImage, calendar } = dataCalendarTemplate;
      const { id, event_code, user, user_code } = calendar;
      const status = Number(query?.type);
      let data = {
        calendar: {
          ...dataCalendarTemplate,
          backgroundImage: {
            files:
              idEdit && !backgroundImage.urlImage
                ? backgroundImage.files
                : backgroundImage.urlImage,
          },
          calendar: {
            id,
            event_code,
            user_code: user_code || user.code,
          },
        },
        confirm: {
          policies: handleFilterPolicies(listQuestion || []),
          policy_delete: handlePreparePolicesDelete(policyDelete || []),
          listInput: handleFilterListQuestion(listQuestion || []),
          question_delete: handleQuestionDelete(questionDelete),
        },
        status,
      };
      if ([1, 2].includes(status)) {
        data.buttonEmbed = dataButtonEmbedTemplate;
      }
      if (idEdit) {
        data.id = idEdit;
        data.user_id = userId;
      }
      dispatch({
        type: 'SETTING_TEMPLATE/onSubmitData',
        payload: {
          data,
          callback: id => {
            dispatch({
              type: 'SETTING_TEMPLATE/reset',
              payload: {
                dataViewTemplate: {
                  id,
                  buttonEmbed: dataButtonEmbedTemplate,
                  calendar: {
                    calendar: {
                      event_code,
                      user_code: user_code || user.code,
                    },
                  },
                  status,
                },
              },
            });
            setTimeout(() => {
              history.push('/view-template');
            }, 300);
          },
        },
      });
      setResetDataStore(true);
      return;
    }
    dispatch({
      type: 'SETTING_TEMPLATE/onActiveTemplate',
      payload: STEP_NEXT_SETTING_TEMPLATE[templateActive],
    });
  };

  const showTemplate = () => {
    if (templateActive === SETTING_TEMPLATE.buttonEmbedTemplate) {
      return (
        <>
          <ButtonEmbedTemplate />
        </>
      );
    }

    if (templateActive === SETTING_TEMPLATE.calendarTemplate) {
      return (
        <>
          <CalendarTemplate listTimeBooking={listDateBooking} />
        </>
      );
    }

    if (templateActive === SETTING_TEMPLATE.confirmTemplate) {
      return (
        <>
          <ConfirmTemplate />
        </>
      );
    }
    return null;
  };

  // update to store setting template
  const updatedDataSettingTemplate = (key, data) => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateDataCalendarTemplate',
      payload: {
        key,
        value: data,
      },
    });
  };

  return (
    <Spin spinning={isLoadingTemplate}>
      <div className={styles.settingTemplate}>
        <div className={styles.navigate} id="submenu">
          <div className={styles.title}>
            <h3>{titleSettingTemplate}</h3>
          </div>
          <div className={styles.menu}>
            <MenuListSetting />
            {listTemplateActive.includes(templateActive) && (
              <BtnGroupNextPre eventStepNext={onSubmit} />
            )}
          </div>
        </div>
        <div className={styles.contentTemplate}>{showTemplate()}</div>
        <div ref={refSetting} />
        <Footer />
      </div>
    </Spin>
  );
};

export default SettingTemplate;
