import {
  CALENDAR_ACCOUNT_COLORS,
  MEMBER_REQUIRED_TYPE,
  YYYYMMDD,
  YYYYMMDDTHHmm,
  TYPE_EVENT_RELATIONSHIP,
  TYPE_VOTE_RELATIONSHIP,
  ACCOUNT_TYPE_BUSINESS,
  DOW_NAME,
  CALENDAR_TEMPLATE_ITEM,
  HOUR_FORMAT,
} from '@/constant';
import moment from 'moment';
import zone from 'moment-timezone';
import { $ } from 'react-jquery-plugin';
import { formatMessage, history } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { Modal, message, notification } from 'antd';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { INPUT_DEFAULT } from '../constant';

export function getDayInWeek(value) {
  switch (value) {
    case 0:
      return '日曜日';
    case 1:
      return '月曜日';
    case 2:
      return '火曜日';
    case 3:
      return '水曜日';
    case 4:
      return '木曜日';
    case 5:
      return '金曜日';
    case 6:
      return '土曜日';
  }
}

export function getDayInWeekWithShortName(value) {
  switch (value) {
    case 0:
      return '日';
    case 1:
      return '月';
    case 2:
      return '火';
    case 3:
      return '水';
    case 4:
      return '木';
    case 5:
      return '金';
    case 6:
      return '土';
  }
}

export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = `expires=${exdays ? d.toUTCString() : 0}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export function getCookie(name) {
  var cookieArr = document.cookie.split(';');
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split('=');
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}
export function meetingMethod(value, showDetail = true) {
  switch (value.m_location_id) {
    case 1:
      return 'Zoom';
    case 2:
      return 'Google Meet';
    case 3:
      return showDetail ? `電話 (${value.location_name})` : '電話';
    case 4:
      return showDetail ? `対面 (${value.location_name})` : '対面';
    case 5:
      return value.location_name;
    case 6:
      return 'Microsoft Teams';
    default:
      break;
  }
}

export function meetingCategory(id) {
  let type;
  switch (id) {
    case 1:
      type = 'オンライン';
      break;
    case 2 || 3:
      type = '対面';
      break;
    default:
      type = '対面';
  }
  return type;
}

export function formatCurrency(value) {
  if (value) {
    return value.toLocaleString('ja-JA') + '円';
  }
  return value;
}

export function convertMinToHour(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return `${h}:${m}`;
}

export function getJPFullDate(item) {
  return formatMessage(
    { id: 'i18n_jp_format_date' },
    {
      year: moment(item).year(),
      month: moment(item).month() + 1,
      date: moment(item).date(),
    },
  );
}

export function getJPMonthAndDay(item) {
  return formatMessage(
    { id: 'i18n_jp_format_date_month_day' },
    {
      month: moment(item).month() + 1,
      date: moment(item).date(),
    },
  );
}

export function getJPFullDateAndNameDay(item) {
  return formatMessage(
    { id: 'i18n_jp_format_date' },
    {
      year: moment(item).year(),
      month: moment(item).month() + 1,
      date: moment(item).date(),
    },
  );
}

export function deleteLocalInfo() {
  localStorage.clear();
  document.cookie.split(';').forEach(c => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
}

export function mapDataEventTemplate(data) {
  const result = {};
  for (const key in data) {
    if (key === 'm_priority_times') {
      result.m_priority_times = data[key];
    } else {
      result[key] = data[key];
    }
  }
  return result;
}

export function copyRichText(text, type = 'email') {
  if (type === 'tool') {
    var $temp = $('<textarea>');
    var brRegex = /<br\s*[\/]?>/gi;
    $('body').append($temp);
    $temp.val(text.replace(brRegex, '\r\n')).select();
    document.execCommand('copy');
    $temp.remove();
  } else {
    const listener = function(ev) {
      ev.preventDefault();
      ev.clipboardData.setData('text/plain', text);
      ev.clipboardData.setData('text/html', text);
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }
}

export function getMax(arr, property) {
  let max = arr[0] && arr[0][property] ? arr[0][property] : 0;
  for (let item of arr) {
    if (Number(item[property]) > Number(max)) {
      max = item[property];
    }
  }
  return max;
}

export function copyText(textToCopy) {
  const fakeTextArea = document.createElement('textarea');
  let result;
  // $FlowFixMe
  document.body.appendChild(fakeTextArea);
  fakeTextArea.value = textToCopy;
  fakeTextArea.select();
  try {
    result = document.execCommand('copy');
  } catch (err) {
    result = false;
  }

  // $FlowFixMe
  document.body.removeChild(fakeTextArea);
  return result;
}

export function compareMinute(oldValue, newValue, setOpen) {
  if (oldValue === null) {
    if (moment(newValue, 'HH:mm').minute() > 0) {
      return setOpen(false);
    } else {
      return setOpen(true);
    }
  } else {
    if (
      moment(newValue, 'HH:mm').minute() !== parseInt(oldValue.substring(3, 5))
    ) {
      return setOpen(false);
    }
    if (
      moment(newValue, 'HH:mm').minute() ===
        parseInt(oldValue.substring(3, 5)) &&
      moment(newValue, 'HH:mm').hour() === parseInt(oldValue.substring(0, 2))
    ) {
      return setOpen(false);
    } else {
      return setOpen(true);
    }
  }
}

export function getWeekDuration(list) {
  const minDate = moment(findMinDate(list)).format('YYYY-MM-DD');
  const maxDate = moment(findMaxDate(list)).format('YYYY-MM-DD');
  return Math.ceil(moment(maxDate).diff(moment(minDate)) / 604800000);
}

export function findMinDate(arr) {
  if (arr.length) {
    let result = arr[0].start_time;
    arr.map(item => {
      if (
        (item.start_time && moment(item.start_time).isBefore(moment(result))) ||
        !result
      ) {
        result = item.start_time;
      }
    });
    return result;
  }
  return null;
}

export function findMaxDate(arr) {
  if (arr.length) {
    let result = arr[0].start_time;
    arr.map(item => {
      if (moment(item.start_time).isAfter(moment(result)) || !result) {
        result = item.start_time;
      }
    });
    return result;
  }
  return null;
}

export const getStep = value => {
  return Number(value?.block_number) || undefined;
};

export function findMinHour(arr) {
  const bookedCalendar = arr.filter(item => item.isBooked);
  arr = arr.filter(item => !item.isBooked);
  if (arr.length) {
    let result = arr[0].start_time
      ? moment(arr[0].start_time).format('HH:mm:ss')
      : null;
    arr.map(item => {
      if (
        (item.start_time &&
          moment(item.start_time).format('HH:mm:ss') < result) ||
        !result
      ) {
        result = item.start_time
          ? moment(item.start_time).format('HH:mm:ss')
          : null;
      }
    });
    let time = result.split(':');
    let start = moment(arr[0].start_time, YYYYMMDDTHHmm).set({
      hour: time[0],
      minute: time[1],
    });
    let end = moment(arr[0].end_time, YYYYMMDDTHHmm).set({
      hour: time[0],
      minute: time[1],
    });
    for (let item of bookedCalendar) {
      let cond1 = moment(item.start_time, YYYYMMDDTHHmm).isBefore(start);
      let cond2 = start.isBefore(moment(item.end_time, YYYYMMDDTHHmm));
      let cond3 = moment(item.start_time, YYYYMMDDTHHmm).isAfter(start);
      let cond4 = moment(item.start_time, YYYYMMDDTHHmm).isBefore(end);
      if ((cond1 && cond2) || (cond3 && cond4)) {
        result = moment(item.start_time).format(HOUR_FORMAT);
        break;
      }
    }
    return !!result ? result : null;
  }
  return null;
}

export function genPriorityBlock(
  nextValue = 0,
  eventInfo,
  firstSetupFreeTime = [],
  finalResult,
) {
  let result = [];
  const currentWeekDay = moment().isoWeekday();
  const priority_times =
    eventInfo && eventInfo.m_priority_times
      ? eventInfo.m_priority_times
      : eventInfo.priority_times;
  if (eventInfo && priority_times && priority_times.length) {
    priority_times.map(pri => {
      for (let i = 0; i < 7; i++) {
        if (
          (moment()
            .isoWeekday(currentWeekDay + i)
            .isoWeekday() === 6 ||
            moment()
              .isoWeekday(currentWeekDay + i)
              .isoWeekday() === 0) &&
          firstSetupFreeTime &&
          !firstSetupFreeTime.length &&
          !eventInfo.default_end_time &&
          !eventInfo.default_start_time
        ) {
          result.push({
            day_of_week: currentWeekDay + nextValue + i,
            start: null,
            end: null,
            start_time: null,
            end_time: null,
            thisDay: moment()
              .isoWeekday(currentWeekDay + i)
              .format(YYYYMMDD),
            status: 0,
            srcId: i,
          });
        } else {
          const curDate = moment()
            .add(nextValue * 7, 'd')
            .format(YYYYMMDD);
          const startTime = `${curDate}T${pri.priority_start_time}`;
          const endTime = `${curDate}T${pri.priority_end_time}`;
          result.push({
            day_of_week: currentWeekDay + nextValue + i,
            start: moment(startTime)
              .add(i, 'd')
              .format(YYYYMMDDTHHmm),
            start_time: moment(startTime)
              .add(i, 'd')
              .format(YYYYMMDDTHHmm),
            end: moment(endTime)
              .add(i, 'd')
              .format(YYYYMMDDTHHmm),
            end_time: moment(endTime)
              .add(i, 'd')
              .format(YYYYMMDDTHHmm),
            thisDay: moment(startTime)
              .add(i, 'd')
              .format(YYYYMMDD),
            status: finalResult
              ? finalResult.filter(
                  item =>
                    item.thisDay ===
                    moment()
                      .add(i, 'd')
                      .format(YYYYMMDD),
                )[0].status
              : 1,
            srcId: i,
            custom_type: 1,
          });
        }
      }
    });
  }
  let listPriorityBlock = [];
  result.map((item, index) => {
    let chosenEndTime = item?.end_time;
    let chosenStartTime = item?.start_time;
    while (moment(chosenStartTime).isBefore(moment(chosenEndTime))) {
      let startTime = moment(chosenStartTime);
      let endTime = moment(chosenEndTime);
      let newEndTime = moment(chosenStartTime).add(getStep(eventInfo), 'm');
      if (moment(newEndTime).isSameOrBefore(moment(chosenEndTime))) {
        listPriorityBlock.push({
          isPriorityFirstGen: true,
          srcId: moment(chosenStartTime).format(YYYYMMDDTHHmm),
          start: moment(chosenStartTime).format(YYYYMMDDTHHmm),
          end: newEndTime.format(YYYYMMDDTHHmm),
          start_time: moment(chosenStartTime).format(YYYYMMDDTHHmm),
          end_time: newEndTime.format(YYYYMMDDTHHmm),
          day_of_week:
            moment(chosenStartTime).isoWeekday() === 0
              ? 7
              : moment(chosenStartTime).isoWeekday(),
          thisDay: moment(chosenStartTime).format(YYYYMMDD),
          status: item.status,
          overlap: false,
        });
      }
      chosenStartTime = moment(chosenStartTime).add(
        getStep(eventInfo) + eventInfo.relax_time,
        'm',
      );
    }
  });
  return listPriorityBlock;
}

export function getLimitBlock(
  priorities = [],
  defaults = [],
  limit,
  team_id = false,
  counterLimit = 10,
) {
  if (!limit) {
    if (team_id) {
      let counter = 0;
      const tempList = [...priorities, ...defaults];

      tempList.forEach((item, i) => {
        if (counter >= counterLimit) {
          item.isDeleted = true;
          return;
        }

        if (item.status && item.start_time && !item.isDeleted) {
          ++counter;
        }
      });

      return tempList;
    }
    return [...priorities, ...defaults];
  }
  let result = [];
  let count = 1;
  let clonePriorities = JSON.parse(JSON.stringify(priorities));
  let cloneDefaults = JSON.parse(JSON.stringify(defaults));
  let record = 0;
  let curLimit = clonePriorities.length
    ? moment(clonePriorities[0].thisDay).format(YYYYMMDD)
    : null;

  clonePriorities.map(item => {
    if (moment(item.thisDay).format(YYYYMMDD) === curLimit && count <= limit) {
      if (
        result.filter(
          re =>
            moment(re.thisDay).format(YYYYMMDD) ===
            moment(item.thisDay).format(YYYYMMDD),
        ).length < limit
      ) {
        result.push(item);
      }
      if (
        moment(item.thisDay).format(YYYYMMDD) ===
        moment(clonePriorities[0].thisDay).format(YYYYMMDD)
      ) {
        record++;
      }
      count++;
    } else if (moment(item.thisDay).format(YYYYMMDD) !== curLimit) {
      if (
        moment(item.thisDay).format(YYYYMMDD) ===
        moment(clonePriorities[0].thisDay).format(YYYYMMDD)
      ) {
        if (limit >= record) {
          record++;
        }
      }
      if (
        result.filter(
          re =>
            moment(re.thisDay).format(YYYYMMDD) ===
            moment(item.thisDay).format(YYYYMMDD),
        ).length < limit
      ) {
        result.push(item);
      }
      curLimit = moment(item.thisDay).format(YYYYMMDD);
      count = 2;
    }
  });
  count = 1;
  let newLimit = limit - record;

  if (record < limit) {
    cloneDefaults.map(item => {
      if (
        moment(item.thisDay).format(YYYYMMDD) === curLimit &&
        count <= newLimit
      ) {
        result.push(item);
        count++;
      } else if (moment(item.thisDay).format(YYYYMMDD) !== curLimit) {
        result.push(item);
        curLimit = moment(item.thisDay).format(YYYYMMDD);
        count = 2;
      }
    });
  } else {
    result = [
      ...result,
      {
        start: null,
        end: null,
        start_time: null,
        end_time: null,
        thisDay: moment()
          .day(6)
          .format(YYYYMMDDTHHmm),
        srcId: moment()
          .day(6)
          .format(YYYYMMDDTHHmm),
        status: 0,
        day_of_week: 6,
      },
      {
        start: null,
        end: null,
        start_time: null,
        end_time: null,
        thisDay: moment()
          .day(7)
          .format(YYYYMMDDTHHmm),
        srcId: moment()
          .day(7)
          .format(YYYYMMDDTHHmm),
        status: 0,
        day_of_week: 7,
      },
    ];
  }
  if (team_id) {
    let finalResultTrue = [];
    for (let i = 0; i < 7; i++) {
      finalResultTrue = [
        ...finalResultTrue,
        ...result.filter(
          item =>
            item.status &&
            moment(item.start_time).format('YYYYMMDD') ===
              moment()
                .add(i, 'd')
                .format('YYYYMMDD'),
        ),
      ];
    }
    const finalResultFalse = result.filter(
      item => !item.start_time || !item.status,
    );
    for (let i = 10; i < finalResultTrue.length; i++) {
      finalResultTrue[i].isDeleted = true;
    }
    result = [...finalResultTrue, ...finalResultFalse];
  }
  return result;
}

export function sortByTime(arr) {
  let leng = arr.length;
  for (let i = 0; i < leng; i++) {
    for (let j = 0; j < leng - 1; j++) {
      if (moment(arr[j].start).isAfter(moment(arr[j + 1].start))) {
        let tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
}

// This is the actual copy function.
// It expects an HTML string to copy as rich text.
export function copyFormatted(html) {
  // Create an iframe (isolated container) for the HTML
  var container = document.createElement('div');
  container.innerHTML = html;

  // Hide element
  container.style.position = 'fixed';
  // container.style.pointerEvents = 'none';
  // container.style.opacity = 0;

  // Detect all style sheets of the page
  var activeSheets = Array.prototype.slice
    .call(document.styleSheets)
    .filter(function(sheet) {
      return !sheet.disabled;
    });

  // // Mount the iframe to the DOM to make `contentWindow` available
  document.body.appendChild(container);

  // // Copy to clipboard
  window.getSelection().removeAllRanges();

  var range = document.createRange();
  range.selectNode(container);
  window.getSelection().addRange(range);

  document.execCommand('copy');
  // for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = true;
  document.execCommand('copy');
  // for (var i = 0; i < activeSheets.length; i++)
  //   activeSheets[i].disabled = false;

  // // Remove the iframe
  document.body.removeChild(container);
}

export function getNewResultStartSinceCurrentTime(breakResult) {
  let newResult = [];
  let currentTime = moment();

  for (let index = 0; index < breakResult.length; index++) {
    const item = breakResult[index];
    let blockFreeTime = moment(item.start_time);

    // currentTime - blockFreeTime < 0 => blockFreeTime > currentTime => blockFreeTime is future time
    if (currentTime.diff(blockFreeTime) < 0) {
      newResult.push(item);
    }
    // currentTime - blockFreeTime >= 0 => blockFreeTime <= currentTime => blockFreeTime is past time
    else {
    }
  }

  return newResult;
}

export function isOverlap(firstStart, firstEnd, secondStart, secondEnd) {
  firstStart = moment(firstStart);
  firstEnd = moment(firstEnd);
  secondStart = moment(secondStart);
  secondEnd = moment(secondEnd);

  if (firstStart.isSameOrBefore(secondStart) && secondStart.isBefore(firstEnd))
    return true; // b starts in a
  if (firstStart.isBefore(secondEnd) && secondEnd.isSameOrBefore(firstEnd))
    return true; // b ends in a
  if (secondStart.isBefore(firstStart) && firstEnd.isBefore(secondEnd))
    return true; // a in b
  return false;
}

export const getColor = index => {
  if (index < CALENDAR_ACCOUNT_COLORS.length) {
    return CALENDAR_ACCOUNT_COLORS[index];
  }

  return (
    index -
    CALENDAR_ACCOUNT_COLORS.length *
      Math.floor(index / CALENDAR_ACCOUNT_COLORS.length)
  );
};

export const checkEventBooked = (start, end, bookedEvents, members) => {
  let or_dupplicate = 0;

  // filter key
  let key = 'user_id';
  if (bookedEvents.length > 0 && bookedEvents[0].email) {
    key = 'email';
  }

  const groupByUserID = groupBy(key)(bookedEvents);

  const andOrMembers = members.filter(
    e => e.option !== MEMBER_REQUIRED_TYPE.NOT && e.checked,
  );

  for (let i = 0; i < andOrMembers.length; i++) {
    const memberBookedEvents = groupByUserID[andOrMembers[i].id];

    // not have anny booked event
    if (!memberBookedEvents) {
      continue;
    }

    if (andOrMembers[i].option === MEMBER_REQUIRED_TYPE.AND) {
      for (let i = 0; i < memberBookedEvents.length; i++) {
        if (
          isOverlap(
            start,
            end,
            memberBookedEvents[i].start_time,
            memberBookedEvents[i].end_time,
          )
        ) {
          return true;
        }
      }
    }

    if (andOrMembers[i].option === MEMBER_REQUIRED_TYPE.OR) {
      for (let i = 0; i < memberBookedEvents.length; i++) {
        if (
          isOverlap(
            start,
            end,
            memberBookedEvents[i].start_time,
            memberBookedEvents[i].end_time,
          )
        ) {
          or_dupplicate++;
          break;
        }
      }
    }
  }
  // is or team
  if (or_dupplicate > 0) {
    return or_dupplicate >= andOrMembers.length;
  }

  // is not overlap
  return false;
};

// start : moment
// end : moment
// minuties: thoi gian generate block
// spacer: khoang cach giua 2 block. don vi phut
// return range cac block da duoc chia
export const splitRange = (start, end, minutes, spacer) => {
  let startTime = moment(start);
  let endTime = moment(end);

  let range = [];

  do {
    let block = {
      id: `${startTime.format('YYYYMMDDTHHmm')}`,
      start_time: startTime.format(YYYYMMDDTHHmm),
      start: startTime.format(YYYYMMDDTHHmm),
      thisDay: startTime.format(YYYYMMDD),
      dayStr: startTime.format(YYYYMMDD),
      day_of_week: startTime.isoWeekday(),
      status: 1,
      custom_type: 1,
      overlap: true,
      // flag check event is auto generated
      is_auto_generated: true,
      srcId: uuidv4(),
    };

    startTime = startTime.add(minutes, 'minutes');

    if (startTime.isAfter(endTime)) {
      break;
    }

    // customize block
    block.end_time = startTime.format(YYYYMMDDTHHmm);
    block.end = startTime.format(YYYYMMDDTHHmm);

    range = [...range, block];

    // add relax time
    if (spacer) {
      startTime = startTime.add(spacer, 'minutes');
    }
  } while (startTime.isBefore(endTime));

  return range;
};

export const autoGenerateOneDateEvent = payload => {
  const {
    scheduleSetting, // advance setting
    timeSetting, // child of advance setting,
    basicSetting,
    freeTimes, // global setting, is team and ? group time and of team,  is team OR ? group time or of team,
    date,
    bookedEvents, // lich ban cua user checkbox
    customizeDayOnOff, // check date on off render
    members,
  } = payload;
  const { move_number, block_number } = basicSetting;
  if (!date) {
    return [];
  }

  // if date is off, no generate
  const dayOfWeek = moment(date).isoWeekday();
  const settingOfDayOfWeek = freeTimes.find(item => {
    return item.day_of_week === dayOfWeek;
  });

  // handle customize day
  const haveCustomize = customizeDayOnOff.find(item => {
    return moment(item.date).isSame(moment(date), 'day');
  });

  let settings = {};
  if (haveCustomize) {
    if (!haveCustomize.status) {
      return [];
    }
    // setting time in this day
    if (settingOfDayOfWeek) {
      settings = settingOfDayOfWeek;
    } else {
      // setting time in this day default
      settings.start_time = '09:00';
      settings.end_time = '18:00';
    }
  } else {
    if (!settingOfDayOfWeek || !settingOfDayOfWeek.status) {
      return [];
    }
    // setting time in this day
    settings = settingOfDayOfWeek;
  }

  // default_start_time
  // default_end_time
  let startTime = moment(`${date} ${settings.start_time}`);
  let endTime = moment(`${date} ${settings.end_time}`);

  if (scheduleSetting.default_start_time && scheduleSetting.default_end_time) {
    startTime = moment(`${date} ${scheduleSetting.default_start_time}`);
    endTime = moment(`${date} ${scheduleSetting.default_end_time}`);
  }

  let validBlocks = [];
  if (
    timeSetting &&
    timeSetting.length &&
    timeSetting.some(e => e.priority_start_time && e.priority_end_time)
  ) {
    timeSetting.forEach(item => {
      if (item.priority_start_time && item.priority_end_time) {
        let priority_start_time = moment(`${date}T${item.priority_start_time}`);
        let priority_end_time = moment(`${date}T${item.priority_end_time}`);

        let tempBlocks = splitRange(
          priority_start_time,
          priority_end_time,
          block_number,
          scheduleSetting.relax_time,
        );
        validBlocks = [...validBlocks, ...tempBlocks];
      }
    });
  } else {
    validBlocks = splitRange(
      startTime,
      endTime,
      block_number,
      scheduleSetting.relax_time,
    );
  }

  // filter by advance
  validBlocks = validBlocks.filter((item, index) => {
    let start = moment(item.start);
    let end = moment(item.end);

    // add time move between a meeting
    if (move_number) {
      start = moment(item.start).subtract(move_number, 'm');
      end = moment(item.end).add(move_number, 'm');
    }

    // lunch_break_start_time
    // lunch_break_end_time
    if (
      scheduleSetting.lunch_break_start_time &&
      scheduleSetting.lunch_break_end_time
    ) {
      let breakStartTime = moment(
        `${date} ${scheduleSetting.lunch_break_start_time}`,
      );
      let breakEndTime = moment(
        `${date} ${scheduleSetting.lunch_break_end_time}`,
      );

      // check is duplicate with break lunch time
      const duplicate = isOverlap(breakStartTime, breakEndTime, start, end);
      if (duplicate) {
        return false;
      }
    }

    // check event booked
    if (checkEventBooked(start, end, bookedEvents, members)) {
      return false;
    }

    return true;
  });

  const receptionTime = scheduleSetting.reception_start_time || 0;
  const moveTime = move_number || 0;

  validBlocks = filterReceptionTime(validBlocks, receptionTime + moveTime);

  return validBlocks;
};

export const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export const slotLabelFormat = date => {
  let hour = date.date.hour;
  let minute = date.date.minute;
  let prefix = '午前 ';
  if (hour > 12) {
    hour = hour - 12;
    prefix = '午後 ';
  }

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (minute < 10) {
    minute = `0${minute}`;
  }

  return `${prefix}${hour}:${minute}`;
};

export const filterReceptionTime = (blocks, receptionTime) => {
  if (!receptionTime && receptionTime !== 0) {
    return blocks;
  }

  if (!blocks) {
    return [];
  }

  if (!blocks.length) {
    return [];
  }

  return blocks.filter(item => {
    return canStartAt(item, receptionTime);
  });
};

export const canStartAt = (block, receptionTime) => {
  if (!receptionTime && receptionTime != 0) {
    return true;
  }

  // no need check current date
  // const isCurrentDate = moment().isSame(moment(block.start_time), 'day');

  // if (!isCurrentDate) {
  //   return true;
  // }

  let canReceptionAt = moment().add(receptionTime, 'minutes');

  if (canReceptionAt.isAfter(moment(block.start_time))) {
    return false;
  }

  return true;
};

export const getLocation = (customizeTab, relationship_type) => {
  const member_id = history.location.query.member_id;
  const team_id = history.location.query.team_id;
  const member_all = history.location.query.member_all;
  const team_all = history.location.query.team_all;
  let tab = history.location.query.tab || 1;

  if (customizeTab) {
    tab = customizeTab;
  }

  if (relationship_type) {
    tab = relationship_type == TYPE_EVENT_RELATIONSHIP ? 1 : 2;
  }

  let prefix = '';

  if (member_id && member_id != '0') {
    prefix = `&member_id=${member_id}`;
  }

  if (team_id && team_id != '0') {
    prefix = `&team_id=${team_id}`;
  }

  if (team_all && team_all != 'undefined') {
    prefix = `&team_all=true`;
  }

  if (member_all && member_all != 'undefined') {
    prefix = `&member_all=true`;
  }

  return `/event?tab=${tab}${prefix}`;
};

export const handleError = (error, mes, loca) => {
  if (error && error.response && error.response.body) {
    const { code } = error.response.body;
    // ignore if is expired code
    if ([900, 904, 905, 800, 801, 802].includes(code)) {
      return;
    }
  }

  if (mes) {
    notify(mes);
    return;
  }

  if (loca) {
    history.push(loca);
    location.reload();
  }

  notify(formatMessage({ id: 'i18n_message_error_get_calendar_by_provider' }));
};

export const personalExpiredModal = () => {
  Modal.error({
    content: (
      <div>
        <br />
        「プレミアム機能」の無料体験期間もしくは有料期間が終了したメンバーが含まれているため、下記機能は利用できません。
        <br />
        ①チーム機能（メンバー招待も含む)
        <br />
        ②Web埋め込み機能
        <br />
        <br />
        ①のチーム機能をご利用いただくためには、アカウント購入後下記ご対応をお願い致します。
        <br />
        <br />
        ①チーム機能（メンバー招待も含む）
        <br />
        有料プランを購入いただいた後に、該当メンバー（無料体験期間もしくは有料期間が終了したメンバー）を「メンバー招待」にて招待ください。
        <br />
        上記にて、再度該当メンバーも含めたチーム機能などがご利用いただけるのでぜひご活用ください。
        <br />
        <br />
        ※②Web埋め込み機能はアカウント購入後すぐにご利用いただけます。 <br />
      </div>
    ),
    className: 'messageError',
    closable: true,
    okText: 'はい',
    keyboard: true,
    maskClosable: true,
  });
};

export const businessExpiredModal = () => {
  Modal.error({
    content: (
      <div>
        <br />
        無料体験期間もしくは有料期間が終了したメンバーが含まれているため、下記機能は利用できません。
        <br />
        ①チーム機能（メンバー招待も含む）
        <br />
        ②Web埋め込み機能
        <br />
        <br />
        ①チーム機能（メンバー招待も含む
        <br />
        有料プランを購入いただいた後に、該当メンバー（無料体験期間もしくは有料期間が終了したメンバー）を「メンバー招待」にて招待ください。
        <br />
        上記にて、再度該当メンバーも含めたチーム機能などがご利用いただけるのでぜひご活用ください。{' '}
        <br />
        <br />
        ※②Web埋め込み機能はアカウント購入後すぐにご利用いただけます。 <br />
      </div>
    ),
    className: 'messageError',
    closable: true,
    okText: 'はい',
    keyboard: true,
    maskClosable: true,
  });
};

export const isExpired = () => {
  const profile = profileFromStorage();
  if (!profile || !profile?.id) {
    deleteLocalInfo();
    history.push({ pathname: '/' });
    location.reload();
  }

  return profile.is_expired && !profile.is_trial;
};

export const isBusiness = () => {
  const profile = profileFromStorage();
  if (!profile || !profile?.id) {
    deleteLocalInfo();
    history.push({ pathname: '/' });
    location.reload();
  }

  return profile.account_type == ACCOUNT_TYPE_BUSINESS;
};

export const profileFromStorage = () => {
  return JSON.parse(localStorage.getItem('profile'));
};

export const notifyMessage = (content, type = 'error', duration = 2) => {
  message.open({
    type: type,
    content,
    duration: duration,
    className: 'notifyMessage',
    icon: <CloseOutlined style={{ fontSize: '13px' }} />,
  });
};

export const tz = () => {
  return zone.tz.guess();
};

export const notify = (
  messageProps,
  classNameProps,
  type = 'error',
  code = '',
  onFunc,
) => {
  let message =
    '権限がないため、操作できません。「マスター管理者」もしくは「チーム管理権限あり」の方にご連絡ください。';
  let className = 'notifyCustomize';
  if (classNameProps) {
    className = classNameProps;
  }

  if (messageProps) {
    if (Array.isArray(messageProps)) {
      message = (
        <div>
          {messageProps.map(item => (
            <p>{item}</p>
          ))}
        </div>
      );
    } else {
      if (messageProps.search('<br/>') != -1) {
        message = (
          <div>
            {messageProps.split('<br/>').map(item => (
              <p>{item}</p>
            ))}
          </div>
        );
      } else {
        message = messageProps;
      }
    }
  }

  if (code && code === '2000') {
    message = (
      <div>
        <p>選択いただいた日時は、直前に他の方との日程調整が完了しました。</p>
        <p>
          申し訳ございませんが、 <span onClick={onFunc}>こちら</span>
          より別日程を選択ください。
        </p>
      </div>
    );
  }

  notification[type]({
    className,
    message,
  });
};

export function createListAddMember(count) {
  let listMember = [];
  if (!count) {
    return listMember;
  }

  const dataMember = {
    email: null,
    role: null,
    contractType: null,
  };
  for (let i = 0; i < count; i++) {
    listMember.push(dataMember);
  }
  return listMember;
}

export function deepCopyData(dataCopy) {
  return JSON.parse(JSON.stringify(dataCopy));
}

export function createTimeAsync(timeSet, countDate) {
  let dateNow = moment().format(YYYYMMDD);
  let dateNext = moment()
    .add(countDate ? countDate : 6, 'd')
    .format(YYYYMMDD);

  if (timeSet) {
    dateNow = timeSet;
    dateNext = moment(timeSet, YYYYMMDD)
      .add(6, 'd')
      .format(YYYYMMDD);
  }

  return {
    startTime: dateNow,
    endTime: dateNext,
  };
}

export const formatTime = item => {
  const { start_time, day_of_week, end_time } = item;
  return (
    getJPMonthAndDay(start_time) +
    ' (' +
    DOW_NAME[
      dayjs()
        .day(day_of_week)
        .day()
    ].name_jp +
    ') ' +
    dayjs(start_time).format('HH:mm') +
    '~' +
    dayjs(end_time).format('HH:mm')
  );
};

export function sortDate(listTime, formatDate) {
  for (let i = 0; i < listTime.length; i++) {
    if (formatDate) {
      listTime[i].timeFormat = formatTime(listTime[i]);
    }
    for (let j = i + 1; j < listTime.length; j++) {
      if (
        moment(listTime[j].start_time, YYYYMMDDTHHmm).isBefore(
          listTime[i].start_time,
        )
      ) {
        let numberI = listTime[i];
        listTime[i] = listTime[j];
        listTime[j] = numberI;
      }
      if (
        moment(listTime[j].start_time, YYYYMMDDTHHmm).isSame(
          listTime[i].start_time,
        ) &&
        moment(listTime[j].end_time, YYYYMMDDTHHmm).isBefore(
          listTime[i].end_time,
        )
      ) {
        let numberI = listTime[i];
        listTime[i] = listTime[j];
        listTime[j] = numberI;
      }
    }
  }
  return listTime;
}

export function convertDataToString(data) {
  return JSON.stringify(data);
}

export function convertStringToData(data) {
  return JSON.parse(data);
}
// genera data init embed
export const generaDateBookingEmbed = () => {
  moment.locale('ja');
  let listDate = [];
  let i = 0;
  while (i < 7) {
    const validDate = moment()
      .add(i, 'd')
      .format('YYYY年M月D日 (ddd)');
    listDate = listDate.concat({
      date: validDate,
      listBlockTime: [],
    });
    i++;
  }
  return listDate;
};

export function handlePrepareAnswer(id, items, createAt) {
  if (!items || typeof items !== typeof [] || !Array.isArray(items)) {
    return [];
  }
  let obj = {
    id,
    name: '',
    phone: '',
    email: '',
    dateSend: moment(createAt).format('YYYY/MM/DD'),
    company: '',
  };
  items.forEach(ans => {
    if (INPUT_DEFAULT[ans.question.question_name]) {
      obj[INPUT_DEFAULT[ans.question.question_name]] =
        ans.question.type === 1
          ? ans.content
          : ans.question_content.content_name;
    }
  });
  return obj;
}

export function objValid(data) {
  return data && Object.keys(data).length > 0;
}

export function sortData(list) {
  return list.sort((a, b) => {
    if (a.index > b.index) {
      return 1;
    }
    if (a.index < b.index) {
      return -1;
    }
    return 0;
  });
}

export function notifyInfoTemplateError(optionSelected, valueCalendar) {
  let isValid;
  switch (optionSelected) {
    case CALENDAR_TEMPLATE_ITEM.a:
      if (valueCalendar?.text?.length === 0) {
        notify([
          '未入力の項目があるため、入力後に',
          '「保存」をクリックください。',
        ]);
        isValid = true;
      }
      break;
    case CALENDAR_TEMPLATE_ITEM.c:
      if (
        valueCalendar?.content?.text?.length === 0 ||
        valueCalendar?.title?.text?.length === 0
      ) {
        notify([
          '未入力の項目があるため、入力後に',
          '「保存」をクリックください。',
        ]);
        isValid = true;
      }
      break;
  }
  return isValid;
}

export function generateCodeCopy(eventCode) {
  let charSet =
    'ABCDlmnopqrstuLMNOP' +
    moment().valueOf() +
    'WXYZabcghijkEFGHde' +
    eventCode +
    'fIJKvwxyQRSTUVz';
  let randomString = '';
  for (let i = 0; i < 8; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export const renderPageSize = (perPage, totalPage) => {
  if (!perPage || !totalPage) {
    return 1;
  }
  if (totalPage < perPage || totalPage === perPage) {
    return totalPage;
  }
  return perPage;
};

export const renderCssPageSize = (perPage, totalPage) => {
  if (!perPage) {
    return false;
  }
  return totalPage < perPage || totalPage === perPage;
};
