import moment from 'moment';
import styles from './styles/calendarPreview.less';
import { getDayInWeekWithShortName } from '@/commons/function';

export default function HeaderCalendar({ value }) {
  const date = moment(value.date);

  const currentDate = () => {
    // return date.month() + 1 + '/' + date.date();
    return date.date();
  };

  //   const renderHoliday = () => {
  //     if (!holiday) {
  //       return null;
  //     }

  //     return <div className={styles.holidayName}>{holiday?.holidayName}</div>;
  //   };

  const currentDay = moment();
  const compareDateAndCurrentDate =
    date.date() === currentDay.date() &&
    date.month() === currentDay.month() &&
    date.year() === currentDay.year();

  return (
    <div className={styles.headerTableCalendar}>
      <div>{currentDate()}</div>

      <div className={`${compareDateAndCurrentDate ? styles.currentDay : ''}`}>
        {getDayInWeekWithShortName(date.day())}
      </div>

      {/* {renderHoliday()} */}
    </div>
  );
}
