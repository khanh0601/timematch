import {
  DOW_NAME,
  FORMAT_DATE_TEXT,
  FORMAT_YYYY,
  FORMAT_HH,
  FORMAT_mm,
  FORMAT_D,
  FORMAT_M,
} from '../constant/index.js';
import moment from 'moment';

export default {
  getMonth: date => {
    let month = date.format(FORMAT_M);
    return month;
  },

  getYear: date => {
    let year = date.format(FORMAT_YYYY);
    return year;
  },

  getDate: date => {
    let day = date.format(FORMAT_D);
    return day;
  },

  getHours: data => {
    return data.format(FORMAT_HH);
  },

  getMinutes: data => {
    return data.format(FORMAT_mm);
  },
  getDayByMonth: (year, month) => {
    var monthIndex = month - 1;

    var date = new Date(year, monthIndex, 1);
    var allDayOfMonth = [];
    while (date.getMonth() === monthIndex) {
      allDayOfMonth.push({
        date: date.getDate(),
        dow: DOW_NAME[date.getDay()].name_jp,
        month: parseInt(date.getMonth()) + 1,
        year: date.getFullYear(),
        status: false,
      });

      date.setDate(date.getDate() + 1);
    }

    return allDayOfMonth;
  },

  getNextMonth: date => {
    if (date.getMonth() === 11) {
      return new Date(date.getFullYear() + 1, 0, 1);
    }
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  },

  getPrevMonth: date => {
    if (date.getMonth() === 0) {
      return new Date(date.getFullYear() - 1, 11, 1);
    }
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  },

  convertDateTime: datetime => {
    let arrDateTime = [];
    arrDateTime = datetime.split(' ');
    let time = arrDateTime[1];
    return (
      moment(arrDateTime[0]).format(FORMAT_DATE_TEXT) + ' ' + time.substr(0, 5)
    );
  },

  getTimeUTC: datetime => {
    let filterDate = new Date(datetime);
    return new Date(
      Date.UTC(
        filterDate.getFullYear(),
        filterDate.getMonth(),
        filterDate.getDate(),
        filterDate.getHours(),
        filterDate.getMinutes(),
        filterDate.getSeconds(),
      ),
    );
  },
};
