import React, { useState } from 'react';
import styles from '../advanced_styles.less';
import moment from 'moment';
import { Button, TimePicker } from 'antd';
import { useIntl, history } from 'umi';
import { DownOutlined } from '@ant-design/icons';

function TimeSetting(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const suffixIcon = <DownOutlined />;

  const { priorityTime, setPriorityTime, updateTimeSetting } = props;
  const [openPriorityStart1, setOpenPriorityStart1] = useState(false);
  const [openPriorityStart2, setOpenPriorityStart2] = useState(false);
  const [openPriorityStart3, setOpenPriorityStart3] = useState(false);
  const [openPriorityStart4, setOpenPriorityStart4] = useState(false);
  const [openPriorityStart5, setOpenPriorityStart5] = useState(false);
  const [openPriorityEnd1, setOpenPriorityEnd1] = useState(false);
  const [openPriorityEnd2, setOpenPriorityEnd2] = useState(false);
  const [openPriorityEnd3, setOpenPriorityEnd3] = useState(false);
  const [openPriorityEnd4, setOpenPriorityEnd4] = useState(false);
  const [openPriorityEnd5, setOpenPriorityEnd5] = useState(false);

  const compareMinuteStart = (oldValue, newValue, index) => {
    let setOpen;
    if (index === 0) {
      setOpen = setOpenPriorityStart1;
    }
    if (index === 1) {
      setOpen = setOpenPriorityStart2;
    }
    if (index === 2) {
      setOpen = setOpenPriorityStart3;
    }
    if (index === 3) {
      setOpen = setOpenPriorityStart4;
    }
    if (index === 4) {
      setOpen = setOpenPriorityStart5;
    }
    if (oldValue === null) {
      if (moment(newValue, 'HH:mm').minute() > 0) {
        return setOpen(false);
      } else {
        return setOpen(true);
      }
    } else {
      if (
        moment(newValue, 'HH:mm').minute() !==
        parseInt(oldValue.substring(3, 5))
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
  };
  const compareMinuteEnd = (oldValue, newValue, index) => {
    let setOpen;
    if (index === 0) {
      setOpen = setOpenPriorityEnd1;
    }
    if (index === 1) {
      setOpen = setOpenPriorityEnd2;
    }
    if (index === 2) {
      setOpen = setOpenPriorityEnd3;
    }
    if (index === 3) {
      setOpen = setOpenPriorityEnd4;
    }
    if (index === 4) {
      setOpen = setOpenPriorityEnd5;
    }
    if (oldValue === null) {
      if (moment(newValue, 'HH:mm').minute() > 0) {
        return setOpen(false);
      } else {
        return setOpen(true);
      }
    } else {
      if (
        moment(newValue, 'HH:mm').minute() !==
        parseInt(oldValue.substring(3, 5))
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
  };

  const changePriorityStartTime = (value, status, index) => {
    const tempPriorityTime = [...priorityTime];
    const newPriorityTime = tempPriorityTime.map(item => {
      if (item.status === status) {
        if (value) {
          compareMinuteStart(item.priority_start_time, value, index);
          return { ...item, priority_start_time: value.format('HH:mm:ss') };
        } else {
          return { ...item, priority_start_time: null };
        }
      } else {
        return { ...item };
      }
    });
    setPriorityTime(newPriorityTime);
  };

  const changePriorityEndTime = (value, status, index) => {
    const tempPriorityTime = [...priorityTime];
    const newPriorityTime = tempPriorityTime.map(item => {
      if (item.status === status) {
        if (value) {
          compareMinuteEnd(item.priority_end_time, value, index);
          return { ...item, priority_end_time: value.format('HH:mm:ss') };
        } else {
          return { ...item, priority_end_time: null };
        }
      } else {
        return { ...item };
      }
    });
    setPriorityTime(newPriorityTime);
  };

  return (
    <div>
      {priorityTime &&
        priorityTime.map((priorityTimeItem, index) => {
          let openStateStart;
          let setOpenStateStart;
          let openStateEnd;
          let setOpenStateEnd;
          if (index === 0) {
            openStateStart = openPriorityStart1;
            setOpenStateStart = setOpenPriorityStart1;
            openStateEnd = openPriorityEnd1;
            setOpenStateEnd = setOpenPriorityEnd1;
          }
          if (index === 1) {
            openStateStart = openPriorityStart2;
            setOpenStateStart = setOpenPriorityStart2;
            openStateEnd = openPriorityEnd2;
            setOpenStateEnd = setOpenPriorityEnd2;
          }
          if (index === 2) {
            openStateStart = openPriorityStart3;
            setOpenStateStart = setOpenPriorityStart3;
            openStateEnd = openPriorityEnd3;
            setOpenStateEnd = setOpenPriorityEnd3;
          }
          if (index === 3) {
            openStateStart = openPriorityStart4;
            setOpenStateStart = setOpenPriorityStart4;
            openStateEnd = openPriorityEnd4;
            setOpenStateEnd = setOpenPriorityEnd4;
          }
          if (index === 4) {
            openStateStart = openPriorityStart5;
            setOpenStateStart = setOpenPriorityStart5;
            openStateEnd = openPriorityEnd5;
            setOpenStateEnd = setOpenPriorityEnd5;
          }
          return (
            <div className={styles.selectField} key={priorityTimeItem.status}>
              {(openStateStart || openStateEnd) && (
                <div
                  onClick={() => {
                    setOpenStateStart(false);
                    setOpenStateEnd(false);
                  }}
                  className="bgTransparent"
                />
              )}
              <div className={styles.titleField}>
                <div className={styles.titleFieldIcon}></div>
                <p>
                  {formatMessage({ id: 'i18n_detail_time' })}{' '}
                  {priorityTimeItem.status}
                </p>
              </div>
              <div className={styles.selections}>
                <TimePicker
                  placeholder="例: 9:00"
                  format={'HH:mm'}
                  minuteStep={15}
                  suffixIcon={suffixIcon}
                  showNow={false}
                  inputReadOnly={true}
                  value={
                    moment(
                      priorityTimeItem.priority_start_time,
                      'HH:mm',
                    ).isValid()
                      ? moment(priorityTimeItem.priority_start_time, 'HH:mm')
                      : undefined
                  }
                  onChange={value =>
                    changePriorityStartTime(
                      value,
                      priorityTimeItem.status,
                      index,
                    )
                  }
                  onSelect={value =>
                    changePriorityStartTime(
                      value,
                      priorityTimeItem.status,
                      index,
                    )
                  }
                  popupClassName={styles.timePicker}
                  open={openStateStart}
                  onOpenChange={() => setOpenStateStart(true)}
                />
                <span className={styles.devideIcon}>〜</span>
                <TimePicker
                  placeholder="例: 18:00"
                  format={'HH:mm'}
                  minuteStep={15}
                  suffixIcon={suffixIcon}
                  showNow={false}
                  inputReadOnly={true}
                  value={
                    moment(
                      priorityTimeItem.priority_end_time,
                      'HH:mm',
                    ).isValid()
                      ? moment(priorityTimeItem.priority_end_time, 'HH:mm')
                      : undefined
                  }
                  onChange={value =>
                    changePriorityEndTime(value, priorityTimeItem.status, index)
                  }
                  onSelect={value =>
                    changePriorityEndTime(value, priorityTimeItem.status, index)
                  }
                  popupClassName={styles.timePicker}
                  open={openStateEnd}
                  onOpenChange={() => setOpenStateEnd(true)}
                />
              </div>
              {priorityTimeItem.hasError && (
                <span className="errorMessage">
                  {formatMessage({ id: 'i18n_error_message_priority_time' })}
                </span>
              )}
            </div>
          );
        })}
      <div className={styles.buttonZone}>
        <Button
          className={styles.cancelBtn}
          onClick={() => {
            history.push('/event');
          }}
        >
          {formatMessage({ id: 'i18n_cancel' })}
        </Button>
        <Button className={styles.saveBtn} onClick={() => updateTimeSetting()}>
          {formatMessage({ id: 'i18n_set' })}
        </Button>
      </div>
    </div>
  );
}

export default TimeSetting;
