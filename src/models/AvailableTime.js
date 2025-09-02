import {
  autoGenerateOneDateEvent,
  checkEventBooked,
  deepCopyData,
  getColor,
  groupBy,
  notify,
} from '@/commons/function';
import {
  DATE_TIME_TYPE,
  MEMBER_REQUIRED_TYPE,
  YYYYMMDD,
  YYYYMMDDTHHmm,
  MIN_AUTO_EVENT_A_DAY,
  ADMIN_FULL_DATE_HOUR,
} from '@/constant';
import { message } from 'antd';
import { formatMessage } from 'umi';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import {
  MAX_AUTOGENERATE_VOTE,
  MAX_BLOCK_VOTE,
  TYPE_EVENT_RELATIONSHIP,
  TYPE_VOTE_RELATIONSHIP,
} from '../constant';
import TeamRequest from '@/services/teamRequest';
import EventRequest from '@/services/eventRequest.js';

const initState = {
  loading: false,
  calendarRef: null,
  members: [],
  calendarHeaders: [],
  bookedEvents: [],
  displayEvents: [],
  customEvents: [], // customize auto
  autoEvents: [],
  manualEvents: [],
  customizeDayOnOff: [],
  autoVoteEvents: [],
  relationshipType: null,
  needGenerate: false,
  generateOption: MEMBER_REQUIRED_TYPE.AND,
  headerSettingAdvance: false,
  // state mobile
  memberMobile: [],
  listCheckedBlockGenerate: [],
  dataEventMobile: [],
  blockTime: '',
  viewEventCalendar: 3,
  currentStartDate: moment().format('YYYY-MM-DD'),
};

export default {
  namespace: 'AVAILABLE_TIME',
  state: deepCopyData(initState),
  reducers: {
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    setMembers(state, { payload }) {
      return {
        ...state,
        members: payload,
      };
    },
    setCalendarRef(state, { payload }) {
      return {
        ...state,
        calendarRef: payload,
      };
    },
    setBookedEvents(state, { payload }) {
      const { members } = state;
      const { listEvents, userId } = payload;

      const index = members.findIndex(member => member.id === userId);

      // dot not thing if member not exits
      if (index == -1) {
        return state;
      }

      members[index].events = listEvents.map(event => {
        const start = moment(event.start_time);
        const end = moment(event.end_time);

        return {
          id: event.id,
          user_id: userId,
          end: end.format(YYYYMMDDTHHmm),
          start: start.format(YYYYMMDDTHHmm),
          end_time: end.format(YYYYMMDDTHHmm),
          start_time: start.format(YYYYMMDDTHHmm),
          day_of_week: start.day(),
          status: 1,
          color: members[index].color,
          srcId: uuidv4(),
          recentAdded: true,
          overlap: true,
          custom_type: DATE_TIME_TYPE.default,
          isBooked: true,
          editable: false,
          option: members[index].option,
          name: event.name || event.event_name,
          hide: members[index].hide,
        };
      });

      // reset new booked event
      const bookedEvents = [];
      members.forEach(member =>
        member.checked ? bookedEvents.push(...(member.events || [])) : null,
      );

      return {
        ...state,
        bookedEvents: [...bookedEvents],
        // autoEvents: [], // reset auto event
        members: [...members],
      };
    },
    rerenderMemberChecked(state) {
      const { members } = state;
      // reset new booked event
      const bookedEvents = [];
      members.forEach(member =>
        member.checked ? bookedEvents.push(...(member.events || [])) : null,
      );

      return {
        ...state,
        bookedEvents: [...bookedEvents],
        autoEvents: [], // reset auto event
      };
    },
    setDisplayEvents(state, { payload }) {
      return {
        ...state,
        displayEvents: payload || [],
      };
    },
    setCustomEvents(state, { payload }) {
      return {
        ...state,
        customEvents: payload || [],
      };
    },
    setManualEvents(state, { payload }) {
      return {
        ...state,
        manualEvents: payload || [],
      };
    },
    setCalendarHeaders(state, { payload }) {
      return {
        ...state,
        calendarHeaders: payload || [],
      };
    },
    setHeaderSettingAdvance(state, { payload }) {
      return {
        ...state,
        headerSettingAdvance: payload,
      };
    },
    switchChange(state, { payload }) {
      let {
        calendarHeaders,
        customizeDayOnOff,
        customEvents,
        autoVoteEvents,
        autoEvents,
        relationshipType,
        manualEvents,
      } = state;
      const date = moment(payload.day);
      const isAuto = payload.isAuto;
      // switch
      const headerDate = calendarHeaders.find(e => {
        return date.isSame(moment(e.date), 'day');
      });

      if (!headerDate) {
        return state;
      }

      headerDate.status = !headerDate.status;

      // clean customize if day is off
      if (!headerDate.status) {
        customEvents = customEvents.filter(
          e => !date.isSame(moment(e.thisDay), 'day'),
        );

        manualEvents = manualEvents.filter(
          e => !date.isSame(moment(e.thisDay), 'day'),
        );
      }

      // check exits customize date
      const isCustomize = customizeDayOnOff.find(e =>
        moment(e.date).isSame(date, 'day'),
      );

      if (headerDate.status == headerDate.origin) {
        // is original setting => Remove all
        customizeDayOnOff = customizeDayOnOff.filter(
          e => !moment(e.date).isSame(date, 'day'),
        );
      } else {
        if (isCustomize && headerDate.status != isCustomize.status) {
          isCustomize.status = headerDate.status;
        }

        if (!isCustomize) {
          customizeDayOnOff.push({
            date: date.format(YYYYMMDD),
            status: headerDate.status,
          });
        }
      }

      // clear data time when switch off
      if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
        autoVoteEvents = autoVoteEvents.filter(e => {
          return !moment(e.start_time).isSame(date, 'day');
        });
      }

      // clear data time when switch off
      if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
        autoEvents = autoEvents.filter(e => {
          return !moment(e.start_time).isSame(date, 'day');
        });
      }

      return {
        ...state,
        calendarHeaders: [...calendarHeaders],
        customizeDayOnOff: [...customizeDayOnOff],
        customEvents: [...customEvents],
        autoVoteEvents: [...autoVoteEvents],
        manualEvents: [...manualEvents],
        autoEvents: [...autoEvents],
      };
    },
    addEvent(state, { payload }) {
      let {
        customEvents,
        bookedEvents,
        displayEvents,
        calendarHeaders,
        manualEvents,
        autoEvents,
        members,
        relationshipType,
        autoVoteEvents,
        customizeDayOnOff,
      } = state;
      const { info, basicSetting } = payload;

      const start = moment(info.date);
      const end = moment(info.date).add(basicSetting.block_number, 'minutes');

      if (relationshipType === TYPE_VOTE_RELATIONSHIP) {
        if (
          autoVoteEvents.length + customEvents.length >= MAX_BLOCK_VOTE &&
          !basicSetting.is_manual_setting
        ) {
          notify('投票時における候補日程は最大30個まで選択できます。');
          return state;
        }

        if (
          manualEvents.length >= MAX_BLOCK_VOTE &&
          basicSetting.is_manual_setting
        ) {
          notify('投票時における候補日程は最大30個まで選択できます。');
          return state;
        }
      }

      // Check day is active
      if (
        !calendarHeaders.find(
          header => header.weekDay === start.isoWeekday() && header.status,
        )
      ) {
        return state;
      }

      // Check event time was booked
      if (checkEventBooked(start, end, bookedEvents, members)) return state;

      const event = {
        end: end.format(YYYYMMDDTHHmm),
        start: start.format(YYYYMMDDTHHmm),
        end_time: end.format(YYYYMMDDTHHmm),
        start_time: start.format(YYYYMMDDTHHmm),
        day_of_week: start.day(),
        status: 1,
        srcId: uuidv4(),
        dayStr: start.format(YYYYMMDD),
        thisDay: start.format(YYYYMMDD),
        recentAdded: true,
        overlap: true,
        color: null,
        custom_type: DATE_TIME_TYPE.default,
        // flag check event is auto generated
        is_auto_generated: false,
      };

      if (basicSetting.is_manual_setting) {
        manualEvents = [...manualEvents, event];
      } else {
        // TODO: REMOVE ME
        // event.color = '#FF8484';
        customEvents = [...customEvents, event];

        const isCustomize = customEvents.find(e => {
          return (
            moment(e.start_time).isSame(moment(event.start_time), 'day') &&
            e.srcId != event.srcId
          );
        });

        if (!isCustomize) {
          let customzieBlock = [];

          if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
            customzieBlock = autoEvents.filter(e => {
              return moment(e.start_time).isSame(
                moment(event.start_time),
                'day',
              );
            });
          }

          if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
            customzieBlock = autoVoteEvents.filter(e => {
              return moment(e.start_time).isSame(
                moment(event.start_time),
                'day',
              );
            });
          }

          customzieBlock.map(e => {
            e.is_auto_generated = false;
            // e.color = '#FF8484';
          });

          // remove customize block from auto Vote Events
          if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
            autoVoteEvents = autoVoteEvents.filter(e => e.is_auto_generated);
          }

          // remove customize block from auto Vote Events
          if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
            autoEvents = autoEvents.filter(e => e.is_auto_generated);
          }

          customEvents = [...customEvents, ...customzieBlock];
        }
      }

      displayEvents = [...displayEvents, event];

      // trick rerender
      // if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
      customizeDayOnOff = [...customizeDayOnOff];
      // }

      return {
        ...state,
        customEvents: [...customEvents],
        displayEvents: [...displayEvents],
        manualEvents: [...manualEvents],
        autoVoteEvents: [...autoVoteEvents],
        customizeDayOnOff: customizeDayOnOff,
        autoEvents: [...autoEvents],
      };
    },
    deleteEvent(state, { payload }) {
      let {
        displayEvents,
        manualEvents,
        customEvents,
        autoEvents,
        autoVoteEvents,
        relationshipType,
        customizeDayOnOff,
      } = state;

      // keep last one auto event of a day
      let numberOfSameDayEvent = state.displayEvents.filter(function(item) {
        return item.thisDay === payload.thisDay;
      }).length;
      if (
        !payload.isManualSetting &&
        numberOfSameDayEvent === MIN_AUTO_EVENT_A_DAY
      ) {
        notify([
          '自動作成の場合、「オン」にしている日は、1日に最低1つの候補ブロックが必要です。',
          '下記3パターンの対応をご検討ください。',
          '①候補日時（緑のブロック）をドラッグする',
          '②STEP4で「手動」に切り替えて作成する',
          '③日付の下にある「オン」のボタンをクリックして、「終日オフ」にする',
        ]);
        return state;
      }

      // check event is autogenerated or cusmomize?
      const isAuto = payload.is_auto_generated;

      // don't hard delete event if is auto mode
      if (isAuto) {
        // check block is customize ?
        const isCustomize = customEvents.find(e => {
          return e.srcId == payload.srcId;
        });

        // remove block from customize if is customize
        if (isCustomize) {
          customEvents = customEvents.filter(e => {
            return e.srcId != payload.srcId;
          });
          // if is auto add all block that not be deleted to customize
        } else {
          let notDeletedDateBlock = [];

          if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
            notDeletedDateBlock = autoEvents.filter(e => {
              return (
                moment(e.start_time).isSame(
                  moment(payload.start_time),
                  'day',
                ) && e.srcId != payload.srcId
              );
            });
          }

          if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
            notDeletedDateBlock = autoVoteEvents.filter(e => {
              return (
                moment(e.start_time).isSame(
                  moment(payload.start_time),
                  'day',
                ) && e.srcId != payload.srcId
              );
            });
          }

          // TODO: REMOVE ME
          notDeletedDateBlock.map(e => {
            e.is_auto_generated = false;
            return e;
          });

          // remove customize block from auto Vote Events
          if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
            autoVoteEvents = autoVoteEvents.filter(
              e => e.is_auto_generated && e.srcId != payload.srcId,
            );
          }

          if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
            autoEvents = autoEvents.filter(
              e => e.is_auto_generated && e.srcId != payload.srcId,
            );
          }

          customEvents = [...notDeletedDateBlock, ...customEvents];
        }
      } else {
        manualEvents = manualEvents.filter(e => {
          return e.srcId != payload.srcId;
        });

        customEvents = customEvents.filter(e => {
          return e.srcId != payload.srcId;
        });
      }

      displayEvents = displayEvents.filter(e => {
        return e.srcId != payload.srcId;
      });

      // trick rerender
      // if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
      // alway rerender
      customizeDayOnOff = [...customizeDayOnOff];
      // }

      return {
        ...state,
        displayEvents: [...displayEvents],
        manualEvents: [...manualEvents],
        customEvents: [...customEvents],
        autoVoteEvents: [...autoVoteEvents],
        autoEvents: [...autoEvents],
        customizeDayOnOff: customizeDayOnOff,
      };
    },
    resizeEvent(state, { payload }) {
      let {
        displayEvents,
        bookedEvents,
        customEvents,
        manualEvents,
        autoEvents,
        members,
        autoVoteEvents,
        relationshipType,
        customizeDayOnOff,
      } = state;
      const event = payload.event._def.extendedProps;
      const delta = payload.endDelta.milliseconds;

      const isAuto = event.is_auto_generated;

      const start = moment(event.start_time);
      const newEnd = moment(event.end_time).add(delta, 'milliseconds');

      // reset if overlap to other booked block
      if (checkEventBooked(start, newEnd, bookedEvents, members)) {
        return {
          ...state,
          displayEvents: [...displayEvents],
        };
      }

      if (isAuto) {
        let resizedBlocks = [];

        if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
          resizedBlocks = autoEvents.filter(e => {
            if (e.srcId == event.srcId) {
              e.end = newEnd.format(YYYYMMDDTHHmm);
              e.end_time = newEnd.format(YYYYMMDDTHHmm);
            }

            return moment(e.start_time).isSame(moment(event.start_time), 'day');
          });
        }

        if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
          resizedBlocks = autoVoteEvents.filter(e => {
            if (e.srcId == event.srcId) {
              e.end = newEnd.format(YYYYMMDDTHHmm);
              e.end_time = newEnd.format(YYYYMMDDTHHmm);
            }

            return moment(e.start_time).isSame(moment(event.start_time), 'day');
          });
        }

        // TODO: REMOVE ME
        resizedBlocks.map(e => {
          // e.color = '#FF8484';
          e.is_auto_generated = false;
        });

        // remove customize block from auto Vote Events
        if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
          autoVoteEvents = autoVoteEvents.filter(e => e.is_auto_generated);
        }

        // remove customize block from auto  Events
        if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
          autoEvents = autoEvents.filter(e => e.is_auto_generated);
        }

        customEvents = [...resizedBlocks, ...customEvents];
      } else {
        manualEvents = manualEvents.map(e => {
          if (e.srcId == event.srcId) {
            e.end = newEnd.format(YYYYMMDDTHHmm);
            e.end_time = newEnd.format(YYYYMMDDTHHmm);
          }

          return e;
        });

        customEvents = customEvents.map(e => {
          if (e.srcId == event.srcId) {
            e.end = newEnd.format(YYYYMMDDTHHmm);
            e.end_time = newEnd.format(YYYYMMDDTHHmm);
          }

          return e;
        });
      }

      displayEvents = displayEvents.map(e => {
        if (e.srcId == event.srcId) {
          e.end = newEnd.format(YYYYMMDDTHHmm);
          e.end_time = newEnd.format(YYYYMMDDTHHmm);
        }

        return e;
      });

      // trick rerender
      // if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
      customizeDayOnOff = [...customizeDayOnOff];
      // }

      return {
        ...state,
        manualEvents: [...manualEvents],
        customEvents: [...customEvents],
        displayEvents: [...displayEvents],
        autoVoteEvents: [...autoVoteEvents],
        customizeDayOnOff: customizeDayOnOff,
        autoEvents: [...autoEvents],
      };
    },
    dropEvent(state, { payload }) {
      let {
        displayEvents,
        calendarHeaders,
        bookedEvents,
        customEvents,
        manualEvents,
        autoEvents,
        members,
        autoVoteEvents,
        relationshipType,
        customizeDayOnOff,
      } = state;
      const event = payload.event._def.extendedProps;
      const milliseconds = payload.delta.milliseconds;
      const days = payload.delta.days;

      const isAuto = event.is_auto_generated;

      const newStart = moment(event.start_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newEnd = moment(event.end_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');

      // Reset is is day off
      if (
        !calendarHeaders.find(
          header => header.weekDay === newStart.isoWeekday() && header.status,
        )
      ) {
        return {
          ...state,
          displayEvents: [...displayEvents],
        };
      }

      // reset if overlap to other booked block
      if (checkEventBooked(newStart, newEnd, bookedEvents, members)) {
        return {
          ...state,
          displayEvents: [...displayEvents],
        };
      }

      if (isAuto) {
        let dragDayBlocks = [];

        if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
          const dragDayBlocks = autoEvents.filter(e => {
            return moment(e.start_time).isSame(moment(event.start_time), 'day');
          });
        }

        if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
          const dragDayBlocks = autoVoteEvents.filter(e => {
            return moment(e.start_time).isSame(moment(event.start_time), 'day');
          });
        }

        // TODO: REMOVE ME
        dragDayBlocks.map(e => {
          if (e.srcId == event.srcId) {
            e.end = newEnd.format(YYYYMMDDTHHmm);
            e.end_time = newEnd.format(YYYYMMDDTHHmm);
            e.start = newStart.format(YYYYMMDDTHHmm);
            e.start_time = newStart.format(YYYYMMDDTHHmm);
            e.thisDay = newStart.format(YYYYMMDD);
            e.day_of_week = newStart.isoWeekday();
            e.dayStr = newStart.format(YYYYMMDD);
          }

          e.is_auto_generated = false;
          // e.color = '#FF8484';
        });

        // remove customize block from auto Vote Events
        if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
          autoVoteEvents = autoVoteEvents.filter(e => e.is_auto_generated);
        }

        // remove customize block from auto Vote Events
        if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
          autoEvents = autoEvents.filter(e => e.is_auto_generated);
        }

        customEvents = [...dragDayBlocks, ...customEvents];
      } else {
        manualEvents = manualEvents.map(e => {
          if (e.srcId == event.srcId) {
            e.end = newEnd.format(YYYYMMDDTHHmm);
            e.end_time = newEnd.format(YYYYMMDDTHHmm);
            e.start = newStart.format(YYYYMMDDTHHmm);
            e.start_time = newStart.format(YYYYMMDDTHHmm);
            e.thisDay = newStart.format(YYYYMMDD);
            e.day_of_week = newStart.isoWeekday();
            e.dayStr = newStart.format(YYYYMMDD);
          }

          return e;
        });

        customEvents = customEvents.map(e => {
          if (e.srcId == event.srcId) {
            e.end = newEnd.format(YYYYMMDDTHHmm);
            e.end_time = newEnd.format(YYYYMMDDTHHmm);
            e.start = newStart.format(YYYYMMDDTHHmm);
            e.start_time = newStart.format(YYYYMMDDTHHmm);
            e.thisDay = newStart.format(YYYYMMDD);
            e.day_of_week = newStart.isoWeekday();
            e.dayStr = newStart.format(YYYYMMDD);
          }

          return e;
        });
      }

      // drop day is not drag day
      if (days != 0) {
        // check drag day is customize ?
        const dropDayIsCustomize = customEvents.find(e => {
          return (
            moment(e.start_time).isSame(newStart, 'day') &&
            e.srcId != event.srcId
          );
        });

        // drag day is auto generated day
        if (!dropDayIsCustomize) {
          let dropDayBlock = [];

          if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
            dropDayBlock = autoEvents.filter(e => {
              return (
                moment(e.start_time).isSame(newStart, 'day') &&
                e.srcId != event.srcId
              );
            });
          }

          if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
            dropDayBlock = autoVoteEvents.filter(e => {
              return (
                moment(e.start_time).isSame(newStart, 'day') &&
                e.srcId != event.srcId
              );
            });
          }

          // TODO: REMOVE ME
          dropDayBlock.map(e => {
            e.is_auto_generated = false;
            // e.color = '#FF8484';
          });

          // remove customize block from auto Vote Events
          if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
            autoVoteEvents = autoVoteEvents.filter(e => e.is_auto_generated);
          }

          // remove customize block from auto Vote Events
          if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
            autoEvents = autoEvents.filter(e => e.is_auto_generated);
          }

          customEvents = [...dropDayBlock, ...customEvents];
        }
      }

      // trick rerender
      // if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
      customizeDayOnOff = [...customizeDayOnOff];
      // }

      return {
        ...state,
        displayEvents: [...displayEvents],
        customEvents: [...customEvents],
        manualEvents: [...manualEvents],
        autoVoteEvents: [...autoVoteEvents],
        customizeDayOnOff: customizeDayOnOff,
        autoEvents: [...autoEvents],
      };
    },
    nextWeek(state, { payload }) {
      const { calendarHeaders, calendarRef, customizeDayOnOff } = state;
      const settings = calendarHeaders.map(e => {
        return {
          weekDay: e.weekDay,
          status: e.origin,
        };
      });

      if (calendarRef && calendarRef.current) {
        const calendar = calendarRef.current.getApi();
        calendar.next();
      }

      calendarHeaders.map(header => {
        header.date = moment(header.date)
          .add(payload, 'days')
          .format(YYYYMMDD);

        header.weekDay = moment(header.date).isoWeekday();
        header.origin = settings.find(e => e.weekDay == header.weekDay)?.status;

        // check is customize date ?
        const isCustomize = customizeDayOnOff.find(e => {
          return moment(e.date).isSame(moment(header.date), 'day');
        });

        header.status = isCustomize ? isCustomize.status : header.origin;
        return header;
      });
      return {
        ...state,
        calendarHeaders: [...calendarHeaders],
      };
    },
    prevWeek(state, { payload }) {
      const { calendarHeaders, calendarRef, customizeDayOnOff } = state;

      const settings = calendarHeaders.map(e => {
        return {
          weekDay: e.weekDay,
          status: e.origin,
        };
      });

      if (calendarRef && calendarRef.current) {
        const calendar = calendarRef.current.getApi();
        calendar.prev();
      }

      calendarHeaders.map(header => {
        header.date = moment(header.date)
          .subtract(payload, 'days')
          .format(YYYYMMDD);

        header.weekDay = moment(header.date).isoWeekday();
        header.origin = settings.find(e => e.weekDay == header.weekDay)?.status;

        // check is customize date ?
        const isCustomize = customizeDayOnOff.find(e => {
          return moment(e.date).isSame(moment(header.date), 'day');
        });

        header.status = isCustomize ? isCustomize.status : header.origin;

        return header;
      });

      return {
        ...state,
        calendarHeaders: [...calendarHeaders],
      };
    },
    resetCalendarHeader(state) {
      const { calendarHeaders, customizeDayOnOff } = state;

      calendarHeaders.forEach((header, index) => {
        header.date = moment()
          .add(index, 'days')
          .format(YYYYMMDD);

        // check is customize date ?
        const isCustomize = customizeDayOnOff.find(e => {
          return moment(e.date).isSame(moment(header.date), 'day');
        });

        header.status = isCustomize ? isCustomize.status : header.origin;
      });

      return {
        ...state,
        calendarHeaders: [...calendarHeaders],
      };
    },
    // should change to effect
    autoGenerateEvent(state, { payload }) {
      const {
        scheduleSetting, // advance setting
        timeSetting, // child of advance setting,
        basicSetting,
        freeTimes, // global setting, is team and ? group time and of team,  is team OR ? group time or of team,
        relationshipType,
      } = payload;
      let {
        calendarHeaders, // list time 7 day
        bookedEvents, // lich ban cua user checkbox
        customizeDayOnOff, // check date on off render
        customEvents, // time render customer is not render to this day
        members, // list time of member checked
        autoVoteEvents, // vote
        autoEvents, // 1:1
      } = state;
      // Generate events
      // đủ điều kiện này thì mới render
      const invalid =
        !basicSetting.m_category_id ||
        basicSetting.is_manual_setting ||
        !basicSetting.block_number;

      const events = [];
      const bookeds = [];
      const customizedGroupBy = groupBy('dayStr')(customEvents);

      let maxAutoGenerateVoteBlock = MAX_AUTOGENERATE_VOTE; // max block time render default

      if (
        scheduleSetting.reservation_number &&
        scheduleSetting.reservation_number < MAX_AUTOGENERATE_VOTE
      ) {
        maxAutoGenerateVoteBlock = scheduleSetting.reservation_number; // max block time render of vote
      }

      const maxAutoGenerateEventBlock = scheduleSetting.reservation_number; // max block time render of 1:1

      // remove all current week date to rerender
      // 1:1
      const firstDate = calendarHeaders[0]?.date;

      if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
        autoEvents = autoEvents.filter(e => {
          if (
            e.is_auto_generated &&
            moment(firstDate).isSameOrBefore(moment(e.start_time)) &&
            moment(firstDate)
              .add(7, 'days')
              .isSameOrAfter(moment(e.start_time))
          ) {
            return false;
          }

          return true;
        });
      }

      if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
        // vote
        autoVoteEvents = autoVoteEvents.filter(e => {
          if (
            moment(firstDate).isSameOrBefore(moment(e.start_time)) &&
            moment(firstDate)
              .add(7, 'days')
              .isSameOrAfter(moment(e.start_time))
          ) {
            return false;
          }

          return true;
        });
      }

      calendarHeaders.forEach(header => {
        const date = header.date;

        // filter time booked in day
        const currentDateBookedEvents = bookedEvents.filter(e => {
          return moment(e.start_time).isSame(moment(date), 'day');
        });

        let validBlocks = [];
        let needAddBlock = true;

        // the date has customize block
        const exist = customizedGroupBy[moment(date).format(YYYYMMDD)];

        const generatedEventBlock = autoEvents.filter(e => e.is_auto_generated)
          .length;
        const voteGeneratedEventBlock = autoVoteEvents.filter(
          e => e.is_auto_generated,
        ).length;

        if (!invalid && !exist) {
          // handle event
          if (
            relationshipType === TYPE_EVENT_RELATIONSHIP &&
            !autoEvents.find(e => moment(e.start_time).isSame(date, 'day')) // if autoEvent not include date
          ) {
            validBlocks = autoGenerateOneDateEvent({
              scheduleSetting,
              timeSetting,
              basicSetting,
              freeTimes,
              bookedEvents: currentDateBookedEvents,
              date,
              customizeDayOnOff,
              members,
            });

            // cut time if maxAutoGenerateEventBlock true
            if (maxAutoGenerateEventBlock) {
              if (generatedEventBlock < maxAutoGenerateEventBlock) {
                const needAutoBlock =
                  maxAutoGenerateEventBlock -
                  generatedEventBlock -
                  validBlocks.length;

                if (needAutoBlock <= 0) {
                  validBlocks = validBlocks.slice(
                    0,
                    validBlocks.length + needAutoBlock,
                  );
                }

                autoEvents = [...autoEvents, ...validBlocks];
              }
            }

            if (!maxAutoGenerateEventBlock) {
              autoEvents = [...autoEvents, ...validBlocks];
            }

            needAddBlock = false;
          }

          // handle vote
          if (relationshipType === TYPE_VOTE_RELATIONSHIP) {
            if (
              voteGeneratedEventBlock < maxAutoGenerateVoteBlock &&
              voteGeneratedEventBlock + customEvents.length < MAX_BLOCK_VOTE &&
              !autoVoteEvents.find(e =>
                moment(e.start_time).isSame(moment(date), 'day'),
              )
            ) {
              // create time auto render
              validBlocks = autoGenerateOneDateEvent({
                scheduleSetting,
                timeSetting,
                basicSetting,
                freeTimes,
                bookedEvents: currentDateBookedEvents,
                date,
                customizeDayOnOff,
                members,
              });

              const needAutoBlock =
                maxAutoGenerateVoteBlock -
                voteGeneratedEventBlock -
                validBlocks.length;
              const reallyNeedBlock =
                MAX_BLOCK_VOTE -
                voteGeneratedEventBlock -
                validBlocks.length -
                customEvents.length;

              let needBlock =
                needAutoBlock < reallyNeedBlock
                  ? needAutoBlock
                  : reallyNeedBlock;

              if (needBlock <= 0) {
                validBlocks = validBlocks.slice(
                  0,
                  validBlocks.length + needBlock,
                );
              }
              autoVoteEvents = [...autoVoteEvents, ...validBlocks];
              needAddBlock = false;
            }
          }
        } else {
          validBlocks = exist && exist.length ? [...exist] : [];
          needAddBlock = true;
        }

        if (
          (relationshipType === TYPE_EVENT_RELATIONSHIP && needAddBlock) ||
          (relationshipType === TYPE_VOTE_RELATIONSHIP && needAddBlock)
        ) {
          // list time render in a day
          events.push(...validBlocks);
        }

        // list time booked in a day
        bookeds.push(...currentDateBookedEvents);
      });

      if (relationshipType === TYPE_VOTE_RELATIONSHIP) {
        events.push(...autoVoteEvents);
      }

      if (relationshipType === TYPE_EVENT_RELATIONSHIP) {
        events.push(...autoEvents);
      }
      return {
        ...state,
        displayEvents: [...events, ...bookeds],
        autoEvents: [...autoEvents], // only time render
        autoVoteEvents: autoVoteEvents,
      };
    },
    // should change to effect
    customizeGenerateEvent(state) {
      // turn on loading
      const {
        manualEvents,
        calendarHeaders,
        bookedEvents,
        customizeDayOnOff,
        members,
      } = state;
      let events = [];
      let bookeds = [];
      calendarHeaders.forEach(header => {
        const date = header.date;

        const isCustomizeOff = customizeDayOnOff.find(
          e => moment(e.date).isSame(moment(date), 'day') && !e.status,
        );

        const currentDateBookedEvents = bookedEvents.filter(e =>
          moment(e.start_time).isSame(moment(date), 'day'),
        );

        const currentDateManualEvents = manualEvents.filter(e => {
          if (isCustomizeOff || !header.status) {
            if (moment(e.start_time).isSame(moment(date), 'day')) {
              e.status = 0;
            }

            return false;
          }

          if (
            checkEventBooked(
              e.start_time,
              e.end_time,
              currentDateBookedEvents,
              members,
            )
          ) {
            return false;
          }

          if (moment(e.start_time).isSame(moment(date), 'day')) {
            e.status = 1;
            return true;
          }

          return false;
        });

        events = [...events, ...currentDateManualEvents];
        bookeds = [...bookeds, ...currentDateBookedEvents];
      });

      return {
        ...state,
        displayEvents: [...events, ...bookeds],
      };
    },
    // payload = isAuto
    deleteAllEvent(state) {
      return {
        ...state,
        displayEvents: [...state.bookedEvents],
        customEvents: [],
        manualEvents: [],
        autoEvents: [],
        autoVoteEvents: [],
      };
    },
    resetWhenChangeToAutoMode(state) {
      return {
        ...state,
        customEvents: [],
        autoEvents: [],
        autoVoteEvents: [],
      };
    },
    reset() {
      return deepCopyData(initState);
    },
    memberChecked(state, { payload }) {
      const { members } = state;
      const { checked, member } = payload;

      const index = members.findIndex(m => m.id === member.id);

      const events = [];
      if (index !== -1) {
        members[index].checked = checked;
      }

      members.forEach(m =>
        m.checked && m.events ? events.push(...m.events) : null,
      );

      return {
        ...state,
        members: [...members],
        displayEvents: [...events],
        bookedEvents: [...events],
      };
    },
    setRelationshipType(state, { payload }) {
      return {
        ...state,
        relationshipType: payload,
      };
    },
    setAutoVoteEvents(state, { payload }) {
      return {
        ...state,
        autoVoteEvents: payload,
      };
    },
    setAutoEvents(state, { payload }) {
      return {
        ...state,
        autoEvents: payload,
      };
    },
    setCustomizeDayOnOff(state, { payload }) {
      // filter calendar header if customize day on off was set
      if (state.calendarHeaders && state.calendarHeaders.length) {
        state.calendarHeaders.map(c => {
          // check is customize date ?calendarHeaders
          const isCustomize = payload.find(e => {
            return moment(e.date).isSame(moment(c.date), 'day');
          });

          // set status to customize
          if (isCustomize) {
            c.status = !!isCustomize.status;
          }

          return c;
        });
      }

      return {
        ...state,
        customizeDayOnOff: payload,
        calendarHeaders: state.calendarHeaders,
      };
    },
    setGenerateOption(state, { payload }) {
      return {
        ...state,
        generateOption: payload,
      };
    },

    // Handle mobile logic
    setMemberMobile(state, { payload }) {
      return {
        ...state,
        memberMobile: payload,
      };
    },
    setBookedEventsMobile(state, { payload }) {
      const { memberMobile } = state;
      const { listEvents, userId } = payload;

      const index = memberMobile.findIndex(member => member.id === userId);

      // dot not thing if member not exits
      if (index == -1) {
        return state;
      }

      memberMobile[index].events = listEvents.map(event => {
        const start = moment(event.start_time);
        const end = moment(event.end_time);

        return {
          ...event,
          id: event.id,
          user_id: userId,
          end: end.format(YYYYMMDDTHHmm),
          start: start.format(YYYYMMDDTHHmm),
          end_time: end.format(YYYYMMDDTHHmm),
          start_time: start.format(YYYYMMDDTHHmm),
          day_of_week: start.day(),
          status: 1,
          color: memberMobile[index].color,
          srcId: uuidv4(),
          recentAdded: true,
          overlap: true,
          custom_type: DATE_TIME_TYPE.default,
          isBooked: true,
          editable: false,
          option: memberMobile[index].option,
          name: event.name || event.event_name,
          title: event.title,
          hide: memberMobile[index].hide,
          textColor: event.text_color,
          isSync: true,
        };
      });

      // reset new booked event
      const bookedEvents = [];
      memberMobile.forEach(member =>
        member.checked ? bookedEvents.push(...(member.events || [])) : null,
      );

      return {
        ...state,
        bookedEvents: [...bookedEvents],
        // autoEvents: [], // reset auto event
        members: [...memberMobile],
      };
    },
    customizeGenerateEventMobile(state) {
      const { listCheckedBlockGenerate, bookedEvents, dataEventMobile } = state;
      let unCheckIds = [];
      // handle convert listCheckedBlockGenerate to event
      const flatData = Object.entries(listCheckedBlockGenerate)
        .map(([key, value]) => {
          const unchecks = value.filter(item => !item.checked);
          unCheckIds = [...unCheckIds, ...unchecks.map(item => item.srcId)];
          return value.filter(item => item.checked);
        })
        .flat();

      const showDataEventMobile = dataEventMobile.filter(
        item => !unCheckIds.includes(item.id),
      );

      return {
        ...state,
        displayEvents: [...showDataEventMobile, ...flatData, ...bookedEvents],
      };
    },
    addEventMobile(state, { payload }) {
      let { displayEvents, listCheckedBlockGenerate } = state;
      // console.log('addEventMobile displayEvents: ', displayEvents);
      const { info, block_number } = payload;

      const start = moment(info.date);
      const end = moment(info.date).add(block_number, 'minutes');

      const event = {
        title: formatMessage({ id: 'i18n_votes' }),
        end: end.format(YYYYMMDDTHHmm),
        start: start.format(YYYYMMDDTHHmm),
        end_time: end.format(YYYYMMDDTHHmm),
        start_time: start.format(YYYYMMDDTHHmm),
        day_of_week: start.day(),
        status: 1,
        srcId: uuidv4(),
        dayStr: start.format(YYYYMMDD),
        thisDay: start.format(YYYYMMDD),
        recentAdded: true,
        overlap: true,
        color: null,
        custom_type: DATE_TIME_TYPE.default,
        textColor: '#333333',
        backgroundColor: 'transparent',
        borderColor: '#1890ff',
        // flag check event is auto generated
        isSync: false,
        checked: true,
      };

      displayEvents = [...displayEvents, event];

      if (listCheckedBlockGenerate[start.format(YYYYMMDD)]) {
        listCheckedBlockGenerate[start.format(YYYYMMDD)].push({
          ...event,
        });
      } else {
        listCheckedBlockGenerate[start.format(YYYYMMDD)] = [
          {
            ...event,
          },
        ];
      }

      return {
        ...state,
        displayEvents: [...displayEvents],
        listCheckedBlockGenerate: listCheckedBlockGenerate,
      };
    },
    deleteEventMobile(state, { payload }) {
      let { displayEvents, listCheckedBlockGenerate } = state;

      displayEvents = displayEvents.filter(e => {
        if (e.randomId) {
          return e.randomId != payload.randomId;
        }
        const existEvent =
          e.id === payload.srcId &&
          moment(e.start_time).format(ADMIN_FULL_DATE_HOUR) ==
            moment(payload.start_time).format(ADMIN_FULL_DATE_HOUR) &&
          moment(e.end_time).format(ADMIN_FULL_DATE_HOUR) ==
            moment(payload.end_time).format(ADMIN_FULL_DATE_HOUR);
        return !existEvent;
      });

      // set checked block generate to false
      listCheckedBlockGenerate = Object.entries(listCheckedBlockGenerate).map(
        ([key, value]) => {
          return {
            [key]: value.map(item => {
              if (item.srcId == payload.srcId) {
                item.checked = false;
              }

              return item;
            }),
          };
        },
      );

      // revert to object
      listCheckedBlockGenerate = listCheckedBlockGenerate.reduce((acc, cur) => {
        return { ...acc, ...cur };
      }, {});

      return {
        ...state,
        displayEvents: displayEvents,
        listCheckedBlockGenerate: listCheckedBlockGenerate,
      };
    },
    resizeEventMobile(state, { payload }) {
      let { displayEvents, listCheckedBlockGenerate } = state;
      const event = payload.event;
      const eventProp = payload.event._def.extendedProps;

      const start = moment(event.start);
      const newEnd = moment(event.end);

      displayEvents = displayEvents.map(e => {
        if (e.srcId == eventProp.srcId) {
          e.end = newEnd.format(YYYYMMDDTHHmm);
          e.end_time = newEnd.format(YYYYMMDDTHHmm);
        }

        return e;
      });

      if (listCheckedBlockGenerate[start.format(YYYYMMDD)]) {
        listCheckedBlockGenerate[
          start.format(YYYYMMDD)
        ] = listCheckedBlockGenerate[start.format(YYYYMMDD)].map(e => {
          if (e.srcId == eventProp.srcId) {
            e.end = newEnd.format(YYYYMMDDTHHmm);
            e.end_time = newEnd.format(YYYYMMDDTHHmm);
            e.checked = true;
          }

          return e;
        });
      }

      return {
        ...state,
        displayEvents: [...displayEvents],
        listCheckedBlockGenerate: listCheckedBlockGenerate,
      };
    },
    dropEventMobile(state, { payload }) {
      let { displayEvents, listCheckedBlockGenerate } = state;
      const event = payload.event;
      const eventProp = event._def.extendedProps;

      const newStart = moment(event.start);
      const newEnd = moment(event.end);

      // loop displayEvents to update new time
      displayEvents = displayEvents.map(e => {
        if (e.srcId == eventProp.srcId) {
          e.end = newEnd.format(YYYYMMDDTHHmm);
          e.start = newStart.format(YYYYMMDDTHHmm);
          e.end_time = newEnd.format(YYYYMMDDTHHmm);
          e.start_time = newStart.format(YYYYMMDDTHHmm);
          e.thisDay = newStart.format(YYYYMMDD);
          e.day_of_week = newStart.isoWeekday();
          e.dayStr = newStart.format(YYYYMMDD);
        }

        return e;
      });

      // convert data displayEvents to listCheckedBlockGenerate to update new time
      const convertDataFromDisplayEvents = displayEvents.reduce((acc, cur) => {
        if (acc[cur.thisDay]) {
          acc[cur.thisDay].push(cur);
        } else {
          acc[cur.thisDay] = [cur];
        }

        return acc;
      }, {});

      // keep old data and update new time, remove old time if drop to other day
      listCheckedBlockGenerate = Object.entries(listCheckedBlockGenerate).map(
        ([key, value]) => {
          if (convertDataFromDisplayEvents[key]) {
            return {
              [key]: convertDataFromDisplayEvents[key],
            };
          }

          return {
            [key]: value.filter(e => e.srcId != eventProp.srcId),
          };
        },
      );

      // revert to object
      listCheckedBlockGenerate = listCheckedBlockGenerate.reduce((acc, cur) => {
        return { ...acc, ...cur };
      }, {});

      return {
        ...state,
        displayEvents: [...displayEvents],
        listCheckedBlockGenerate: listCheckedBlockGenerate,
      };
    },
    setSPBookedEvents(state, { payload }) {
      const { memberMobile } = state;
      const { listEvents, userId } = payload;

      const index = memberMobile.findIndex(member => member.id === userId);

      // dot not thing if member not exits
      if (index == -1) {
        return state;
      }

      memberMobile[index].events = listEvents.map(event => {
        const start = moment(event.start_time);
        const end = moment(event.end_time);

        return {
          id: event.id,
          user_id: userId,
          end: end.format(YYYYMMDDTHHmm),
          start: start.format(YYYYMMDDTHHmm),
          end_time: end.format(YYYYMMDDTHHmm),
          start_time: start.format(YYYYMMDDTHHmm),
          day_of_week: start.day(),
          status: 1,
          color: memberMobile[index].color,
          srcId: uuidv4(),
          recentAdded: true,
          overlap: true,
          custom_type: DATE_TIME_TYPE.default,
          isBooked: true,
          editable: false,
          option: memberMobile[index].option,
          name: event.name || event.event_name,
          hide: memberMobile[index].hide,
        };
      });

      // reset new booked event
      const bookedEvents = [];
      memberMobile.forEach(member =>
        member.checked ? bookedEvents.push(...(member.events || [])) : null,
      );

      return {
        ...state,
        bookedEvents: [...bookedEvents],
        // autoEvents: [], // reset auto event
        members: [...memberMobile],
      };
    },
    memberCheckedMobile(state, { payload }) {
      const { memberMobile } = state;
      const { checked, member } = payload;

      const index = memberMobile.findIndex(m => m.id === member.id);

      const events = [];
      if (index !== -1) {
        memberMobile[index].checked = checked;
      }

      memberMobile.forEach(m =>
        m.checked && m.events ? events.push(...m.events) : null,
      );

      return {
        ...state,
        members: [...memberMobile],
        displayEvents: [...events].concat(state.displayEvents),
        bookedEvents: [...events],
      };
    },
    rerenderMemberCheckedMobile(state) {
      const { memberMobile } = state;
      // reset new booked event
      const bookedEvents = [];
      memberMobile.forEach(member =>
        member.checked ? bookedEvents.push(...(member.events || [])) : null,
      );

      return {
        ...state,
        bookedEvents: [...bookedEvents],
        autoEvents: [], // reset auto event
      };
    },
    deleteCheckedGenerateBlockCalendar(state, { payload }) {
      let listCheckedBlockGenerate = state.listCheckedBlockGenerate || {};
      const groupKey = moment(payload.start_time).format(YYYYMMDD);

      if (listCheckedBlockGenerate[groupKey]) {
        const eventIndex = listCheckedBlockGenerate[groupKey]?.findIndex(
          e =>
            moment(e.start_time).format(ADMIN_FULL_DATE_HOUR) ==
              moment(payload.start_time).format(ADMIN_FULL_DATE_HOUR) &&
            moment(e.end_time).format(ADMIN_FULL_DATE_HOUR) ==
              moment(payload.end_time).format(ADMIN_FULL_DATE_HOUR),
        );

        if (eventIndex != -1) {
          listCheckedBlockGenerate[groupKey][eventIndex].checked = false;
        }
      }

      return {
        ...state,
        listCheckedBlockGenerate,
      };
    },
    setCheckedGenerateBlockCalendar(state, { payload }) {
      return {
        ...state,
        listCheckedBlockGenerate: payload,
      };
    },
    toggleBlockCalendar(state, { payload }) {
      if (!payload) return;
      const listCheckedBlockGenerate = state.listCheckedBlockGenerate || {};
      const groupKey = payload.thisDay;
      const eventIndex = listCheckedBlockGenerate[groupKey]?.findIndex(
        x => x.randomId === payload.randomId || x.srcId === payload.src,
      );

      if (eventIndex !== -1 && eventIndex !== undefined) {
        listCheckedBlockGenerate[groupKey][eventIndex].checked =
          payload.checked;
      }

      return {
        ...state,
        listCheckedBlockGenerate,
      };
    },
    dropBlockCalendar(state, { payload }) {
      const event = payload.event._def.extendedProps;
      const eventStartTime = moment(event.start_time).format(YYYYMMDDTHHmm);
      const eventEndTime = moment(event.end_time).format(YYYYMMDDTHHmm);
      const milliseconds = payload.delta.milliseconds;
      const days = payload.delta.days;

      const newStart = moment(event.start_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newStartTime = newStart.format(YYYYMMDDTHHmm);
      const newEnd = moment(event.end_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newEndTime = newEnd.format(YYYYMMDDTHHmm);

      const thisDay = newStart.format(YYYYMMDD);
      const day_of_week = newStart.isoWeekday();

      const newBlocks = state.listCheckedBlockGenerate || [];
      const groupKey =
        event.thisDay || moment(event.start_time).format(YYYYMMDD);

      const newGroupKey = newStart.format(YYYYMMDD);

      const result = newBlocks[groupKey];

      if (groupKey == newGroupKey) {
        const eventIndex = result?.findIndex(
          e =>
            moment(e.start_time).format(YYYYMMDDTHHmm) == eventStartTime &&
            moment(e.end_time).format(YYYYMMDDTHHmm) == eventEndTime,
        );
        const newEventIndex = result?.findIndex(
          e =>
            moment(e.start_time).format(YYYYMMDDTHHmm) == newStartTime &&
            moment(e.end_time).format(YYYYMMDDTHHmm) == newEndTime,
        );

        if (eventIndex !== undefined && eventIndex != -1) {
          newBlocks[groupKey][eventIndex].start_time = newStartTime;
          newBlocks[groupKey][eventIndex].start = newStartTime;
          newBlocks[groupKey][eventIndex].end_time = newEndTime;
          newBlocks[groupKey][eventIndex].end = newEndTime;
          newBlocks[groupKey][eventIndex].thisDay = thisDay;
          newBlocks[groupKey][eventIndex].dayStr = thisDay;
          newBlocks[groupKey][eventIndex].day_of_week = day_of_week;
        }
      } else {
        newBlocks[groupKey] = newBlocks[groupKey]?.filter(
          e =>
            moment(e.start_time).format(YYYYMMDDTHHmm) != eventStartTime &&
            moment(e.end_time).format(YYYYMMDDTHHmm) != eventEndTime,
        );

        newBlocks[newGroupKey] = newBlocks[newGroupKey] || [];
        newBlocks[newGroupKey].push({
          ...event,
          start_time: newStartTime,
          start: newStartTime,
          end_time: newEndTime,
          end: newEndTime,
          thisDay: thisDay,
          dayStr: thisDay,
          day_of_week: day_of_week,
        });
      }
      return {
        ...state,
        listCheckedBlockGenerate: newBlocks,
      };
    },
    dragStopBlockCalendar(state, { payload }) {
      // console.log('dragStopBlockCalendar payload: ', payload);
      const event = payload.event._def.extendedProps;
      const eventStartTime = moment(event.start_time).format(
        ADMIN_FULL_DATE_HOUR,
      );
      const eventEndTime = moment(event.end_time).format(ADMIN_FULL_DATE_HOUR);
      const milliseconds = payload.delta.milliseconds;
      const days = payload.delta.days;

      const newStart = moment(event.start_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newStartTime = newStart.format(YYYYMMDDTHHmm);
      const newEnd = moment(event.end_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newEndTime = newEnd.format(YYYYMMDDTHHmm);

      const thisDay = newStart.format(YYYYMMDD);
      const day_of_week = newStart.isoWeekday();

      const newBlocks = state.listCheckedBlockGenerate || [];
      const groupKey =
        event.thisDay || moment(event.start_time).format(YYYYMMDD);

      const newGroupKey = newStart.format(YYYYMMDD);

      const result = newBlocks[groupKey];

      if (groupKey == newGroupKey) {
        const eventIndex = result?.findIndex(
          e =>
            moment(e.start_time).format(ADMIN_FULL_DATE_HOUR) ==
              eventStartTime &&
            moment(e.end_time).format(ADMIN_FULL_DATE_HOUR) == eventEndTime,
        );

        if (eventIndex !== undefined && eventIndex != -1) {
          newBlocks[groupKey][eventIndex].start_time = newStartTime;
          newBlocks[groupKey][eventIndex].start = newStartTime;
          newBlocks[groupKey][eventIndex].end_time = newEndTime;
          newBlocks[groupKey][eventIndex].end = newEndTime;
          newBlocks[groupKey][eventIndex].thisDay = thisDay;
          newBlocks[groupKey][eventIndex].dayStr = thisDay;
          newBlocks[groupKey][eventIndex].day_of_week = day_of_week;
        }
      } else {
        newBlocks[groupKey] = newBlocks[groupKey]?.filter(
          e =>
            moment(e.start_time).format(ADMIN_FULL_DATE_HOUR) !=
              eventStartTime &&
            moment(e.end_time).format(ADMIN_FULL_DATE_HOUR) != eventEndTime,
        );

        newBlocks[newGroupKey] = newBlocks[newGroupKey] || [];
        newBlocks[newGroupKey].push({
          ...event,
          start_time: newStartTime,
          start: newStartTime,
          end_time: newEndTime,
          end: newEndTime,
          thisDay: thisDay,
          dayStr: thisDay,
          day_of_week: day_of_week,
        });
      }
      return {
        ...state,
        listCheckedBlockGenerate: newBlocks,
      };
    },
    setDataEventMobile(state, { payload }) {
      return {
        ...state,
        dataEventMobile: payload,
      };
    },
    setBlockCalendar(state, { payload }) {
      return {
        ...state,
        blockTime: payload,
      };
    },
    setViewEventCalendar(state, { payload }) {
      return {
        ...state,
        viewEventCalendar: payload,
      };
    },
    setCurrentStartDate(state, { payload }) {
      return {
        ...state,
        currentStartDate: payload,
      };
    },
  },
  effects: {
    *getMemberList(action, { put, call }) {
      let {
        teamId,
        profile,
        memberId,
        members,
        eventId,
        isClone,
        timeAsync,
      } = action.payload;
      // async loading api calender need_sync
      yield put({ type: 'setLoading', payload: true });

      const newMembers = [];

      try {
        // contract user
        const contractRes = yield call(EventRequest.getUserContract);
        if (contractRes.status == 200 && contractRes.body.data) {
          newMembers.push(...contractRes.body.data);
        }
        // share user
        const shareRes = yield call(EventRequest.getUserShare, {
          event_id: eventId,
        });
        if (shareRes.status == 200 && shareRes.body.data) {
          let hide = 1;
          shareRes.body.data.forEach(member => {
            if (!newMembers.some(m => m.email === member.email)) {
              if (member.user_id == null) {
                member.hide = hide++;
              }

              newMembers.push(member);
            }
          });
        }
      } catch (err) {
        console.log('failed to call share calendar request ', err);
      }

      // get member options - only call team if not is clone
      if (teamId && !isClone) {
        const optionRes = yield call(TeamRequest.getTeamOption, {
          team_id: teamId,
        });
        if (optionRes.status == 200 && optionRes.body.result.result) {
          optionRes.body.result.result.forEach(member => {
            const exist = newMembers.find(m => m.user_id === member.user_id);
            if (exist) {
              exist.checked = member.option != MEMBER_REQUIRED_TYPE.NOT;
              exist.option = member.option;
            }
          });
        }
      }

      // get option of team defaul is AND
      const option = newMembers.some(m => m.option === MEMBER_REQUIRED_TYPE.OR)
        ? MEMBER_REQUIRED_TYPE.OR
        : MEMBER_REQUIRED_TYPE.AND;

      // add agent member
      if (profile?.id) {
        const email =
          profile.email || profile.google_email || profile.microsoft_email;
        const agent = newMembers.find(
          member => member.email.toLowerCase() === email.toLowerCase(),
        );

        if (agent) {
          agent.id = profile?.id;
          agent.checked = true;
        } else {
          const type =
            isClone || !eventId
              ? 3
              : profile.google_email
              ? 1
              : profile.microsoft_email
              ? 2
              : 3;

          newMembers.push({
            id: profile?.id,
            email,
            option,
            type,
            checked: true,
          });
        }
      }
      // conver array
      const allMembers = newMembers.map(member => {
        let checkedMember = member.checked;

        // if create event in booking of member => member checked true
        if (!member.type && member.user_id === memberId) {
          checkedMember = true;
        }

        // if teamId clear all checked member when member expired
        if (teamId && member?.is_expired) {
          checkedMember = false;
        }

        return {
          id: !member.type ? member.user_id : member.email,
          type: member.type ? member.type : 3,
          email: member.email || member.google_email || member.microsoft_email,
          checked: checkedMember,
          provider:
            member.type == 1 ? 'google' : member.type == 2 ? 'microsoft' : null,
          option: member.option || option,
          hide: member.hide,
          is_expired: member?.is_expired,
        };
      });

      // client members
      members.forEach(member => {
        const exist = allMembers.find(m => m.email == member.email);
        if (exist) exist.checked = member.checked;
        else {
          member.option = option;
          allMembers.push(member);
        }
      });

      // agent to top
      allMembers.sort(member => (member.id === profile?.id ? -1 : 1));

      // add color
      allMembers.forEach((member, id) => (member.color = getColor(id)));

      yield put({ type: 'setMembers', payload: allMembers });
      // get list booked vote
      // add load to week
      for (const member of allMembers) {
        if (member.type == 3 && member.checked) {
          yield put.resolve({
            type: 'EVENT/getAllBookedScheduleByUser',
            payload: {
              user_id: member.id,
              color: member.color,
              option: member.option,
              checked: member.checked,
              ...timeAsync,
            },
          });
        } else if (member.checked) {
          yield put.resolve({
            type: 'EVENT/getCalendarByProvider',
            payload: {
              email: member.email,
              provider: member.provider,
              member: member,
              ...timeAsync,
            },
          });
        }
      }

      yield put({ type: 'generateOption', payload: option });
      yield put({ type: 'setLoading', payload: false });
    },
    *memberChecked({ payload }, { put }) {
      const { checked, member, timeAsync } = payload;

      yield put({
        type: 'setLoading',
        payload: true,
      });

      if (member.type == 3 && checked) {
        yield put.resolve({
          type: 'EVENT/getAllBookedScheduleByUser',
          payload: {
            user_id: member.id,
            color: member.color,
            option: member.option,
            checked: checked,
            ...timeAsync,
          },
        });
      } else if (checked) {
        yield put.resolve({
          type: 'EVENT/getCalendarByProvider',
          payload: {
            email: member.email,
            provider: member.provider,
            member: member,
            ...timeAsync,
          },
        });
      } else {
        // rerenderMemberChecked
        yield put({
          type: 'rerenderMemberChecked',
        });
      }

      yield put({
        type: 'setLoading',
        payload: false,
      });
    },
    *asyncToWeek({ payload }, { put }) {
      const { listMember, startTime, endTime } = payload;
      yield put({ type: 'setLoading', payload: true });
      for (const member of listMember) {
        if (member.type === 3 && member.checked) {
          yield put.resolve({
            type: 'EVENT/getAllBookedScheduleByUser',
            payload: {
              user_id: member.id,
              color: member.color,
              option: member.option,
              checked: member.checked,
              startTime,
              endTime,
            },
          });
        }
        if (member.type !== 3 && member.checked) {
          yield put.resolve({
            type: 'EVENT/getCalendarByProvider',
            payload: {
              email: member.email,
              provider: member.provider,
              member: member,
              startTime,
              endTime,
            },
          });
        }
      }

      yield put({ type: 'setLoading', payload: false });
    },
    // Handle mobile logic
    *sendAddMemberEmail({ payload }, { call }) {
      const { body } = yield call(EventRequest.sendEmailAddMember, payload);
      if (body && body.status) {
        notify('メンバーに招待状を送信しました。', 'bgWhite', 'success');
      } else {
        notify('メンバーに招待状を送信できませんでした。');
      }
    },
    *memberCheckedMobile({ payload }, { put }) {
      const { checked, member, timeAsync } = payload;

      yield put({
        type: 'setLoading',
        payload: true,
      });

      if (member.type == 3 && checked) {
        yield put.resolve({
          type: 'EVENT/getAllBookedScheduleByUserMobile',
          payload: {
            user_id: member.id,
            color: member.color,
            option: member.option,
            checked: checked,
            ...timeAsync,
          },
        });
      } else if (checked) {
        yield put.resolve({
          type: 'EVENT/getCalendarByProviderMobile',
          payload: {
            email: member.email,
            provider: member.provider,
            member: member,
            ...timeAsync,
          },
        });
      } else {
        // rerenderMemberChecked
        yield put({
          type: 'rerenderMemberCheckedMobile',
        });
      }

      yield put({
        type: 'setLoading',
        payload: false,
      });
    },
    *getMemberListMobile(action, { put, call }) {
      let {
        teamId,
        profile,
        memberId,
        members,
        eventId,
        isClone,
        timeAsync,
      } = action.payload;
      // async loading api calendar need_sync
      yield put({ type: 'setLoading', payload: true });

      const newMembers = [];

      try {
        // contract user
        const contractRes = yield call(EventRequest.getUserContract);
        if (contractRes.status == 200 && contractRes.body.data) {
          newMembers.push(...contractRes.body.data);
        }
        // share user
        const shareRes = yield call(EventRequest.getUserShare, {
          event_id: eventId,
        });
        if (shareRes.status == 200 && shareRes.body.data) {
          let hide = 1;
          shareRes.body.data.forEach(member => {
            if (!newMembers.some(m => m.email === member.email)) {
              if (member.user_id == null) {
                member.hide = hide++;
              }

              newMembers.push(member);
            }
          });
        }
      } catch (err) {
        console.log('failed to call share calendar request ', err);
      }

      // get member options - only call team if not is clone
      // if (teamId && !isClone) {
      //   const optionRes = yield call(TeamRequest.getTeamOption, {
      //     team_id: teamId,
      //   });
      //   if (optionRes.status == 200 && optionRes.body.result.result) {
      //     optionRes.body.result.result.forEach(member => {
      //       const exist = newMembers.find(m => m.user_id === member.user_id);
      //       if (exist) {
      //         exist.checked = member.option != MEMBER_REQUIRED_TYPE.NOT;
      //         exist.option = member.option;
      //       }
      //     });
      //   }
      // }

      // get option of team defaul is AND
      const option = newMembers.some(m => m.option === MEMBER_REQUIRED_TYPE.OR)
        ? MEMBER_REQUIRED_TYPE.OR
        : MEMBER_REQUIRED_TYPE.AND;

      // add agent member
      if (profile?.id) {
        const email =
          profile.email || profile.google_email || profile.microsoft_email;
        const agent = newMembers.find(
          member => member.email.toLowerCase() === email.toLowerCase(),
        );

        if (agent) {
          agent.id = profile?.id;
          agent.checked = true;
        } else {
          const type =
            isClone || !eventId
              ? 3
              : profile.google_email
              ? 1
              : profile.microsoft_email
              ? 2
              : 3;

          newMembers.push({
            id: profile?.id,
            email,
            option,
            type,
            checked: true,
          });
        }
      }
      // conver array
      const allMembers = newMembers.map(member => {
        let checkedMember = member.checked;

        // if create event in booking of member => member checked true
        if (!member.type && member.user_id === memberId) {
          checkedMember = true;
        }

        // if teamId clear all checked member when member expired
        if (teamId && member?.is_expired) {
          checkedMember = false;
        }

        return {
          id: !member.type ? member.user_id : member.email,
          type: member.type ? member.type : 3,
          email: member.email || member.google_email || member.microsoft_email,
          name: member.type == 2 ? member.name : null,
          checked: checkedMember,
          provider:
            member.type == 1 ? 'google' : member.type == 2 ? 'microsoft' : null,
          option: member.option || option,
          hide: member.hide,
          is_expired: member?.is_expired,
        };
      });

      // client members
      members.forEach(member => {
        const exist = allMembers.find(m => m.email == member.email);
        if (exist) exist.checked = member.checked;
        else {
          member.option = option;
          allMembers.push(member);
        }
      });

      // agent to top
      allMembers.sort(member => (member.id === profile?.id ? -1 : 1));

      // add color
      allMembers.forEach((member, id) => (member.color = getColor(id)));

      yield put({ type: 'setMemberMobile', payload: allMembers });
      // get list booked vote
      // add load to week
      for (const member of allMembers) {
        if (member.type == 3 && member.checked) {
          yield put.resolve({
            type: 'EVENT/getAllBookedScheduleByUserMobile',
            payload: {
              user_id: member.id,
              color: member.color,
              option: member.option,
              checked: member.checked,
              ...timeAsync,
            },
          });
        } else if (member.checked) {
          yield put.resolve({
            type: 'EVENT/getCalendarByProviderMobile',
            payload: {
              email: member.email,
              provider: member.provider,
              member: member,
              ...timeAsync,
            },
          });
        }
      }

      yield put({ type: 'generateOption', payload: option });
      yield put({ type: 'setLoading', payload: false });
    },
  },
};
