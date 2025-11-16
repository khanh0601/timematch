import { DownOutlined } from '@ant-design/icons';
import { Button, Checkbox, TimePicker, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from './styles.less';
const format = 'HH:mm';
const defaultStartTime = '09:00';
const defaultEndTime = '18:00';
const suffixIcon = <DownOutlined />;
import { profileFromStorage } from '@/commons/function';
import useIsMobile from '../../../hooks/useIsMobile';
import iconArrow from '@/assets/images/chevron-right.svg';
import { history } from 'umi';
const baseTimes = [
  {
    day_of_week: 7,
    name: '日曜日',
    start_time: '09:00',
    end_time: '18:00',
    checked: false,
  },
  {
    day_of_week: 1,
    name: '月曜日',
    start_time: '09:00',
    end_time: '18:00',
    checked: false,
  },
  {
    day_of_week: 2,
    name: '火曜日',
    start_time: '09:00',
    end_time: '18:00',
    checked: false,
  },
  {
    day_of_week: 3,
    name: '水曜日',
    start_time: '09:00',
    end_time: '18:00',
    checked: false,
  },
  {
    day_of_week: 4,
    name: '木曜日',
    start_time: '09:00',
    end_time: '18:00',
    checked: false,
  },
  {
    day_of_week: 5,
    name: '金曜日',
    start_time: '09:00',
    end_time: '18:00',
    checked: false,
  },
  {
    day_of_week: 6,
    name: '土曜日',
    start_time: '09:00',
    end_time: '18:00',
    checked: false,
  },
];

function SettingBlocktime(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { dispatch, eventStore } = props;
  const { firstSetupFreeTime } = eventStore;
  const [times, setTimes] = useState([]);
  const [userTimeDefault, setUserTimeDefault] = useState([]);
  const [errorNoDataState, setErrorNoDataState] = useState(false);
  const [errorTimeState, setErrorTimeState] = useState({
    status: false,
    id: undefined,
  });
  const profile = profileFromStorage();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(1);
  const [openStart1, setOpenStart1] = useState(false);
  const [openStart2, setOpenStart2] = useState(false);
  const [openStart3, setOpenStart3] = useState(false);
  const [openStart4, setOpenStart4] = useState(false);
  const [openStart5, setOpenStart5] = useState(false);
  const [openStart6, setOpenStart6] = useState(false);
  const [openStart7, setOpenStart7] = useState(false);
  const [openEnd1, setOpenEnd1] = useState(false);
  const [openEnd2, setOpenEnd2] = useState(false);
  const [openEnd3, setOpenEnd3] = useState(false);
  const [openEnd4, setOpenEnd4] = useState(false);
  const [openEnd5, setOpenEnd5] = useState(false);
  const [openEnd6, setOpenEnd6] = useState(false);
  const [openEnd7, setOpenEnd7] = useState(false);
  const isMobile = useIsMobile();

  const getUserDatetimes = useCallback(() => {
    dispatch({ type: 'EVENT/getFreeTime' });
  }, [dispatch]);

  useEffect(() => {
    getUserDatetimes();
  }, [getUserDatetimes]);

  useEffect(() => {
    const result = [...baseTimes];
    const objFirstSetup = {};
    if (firstSetupFreeTime.length <= 0) {
      for (let i = 1; i < 6; i++) {
        const item = result[i];
        result[i] = { ...item, checked: true };
      }
    } else {
      for (const item of firstSetupFreeTime) {
        objFirstSetup[item.day_of_week] = {
          checked: item.status ? true : false,
          start_time: item.start_time.slice(0, 5),
          end_time: item.end_time.slice(0, 5),
        };
      }

      for (let i = 0; i < result.length; i++) {
        const item = result[i];
        if (objFirstSetup[item.day_of_week]) {
          result[i] = {
            ...item,
            ...objFirstSetup[item.day_of_week],
          };
        }
      }
    }

    setTimes(result);
    setUserTimeDefault(result);
  }, [firstSetupFreeTime]);

  const compareMinuteStart = (oldValue, newValue, index) => {
    let setOpen;
    if (index === 0) {
      setOpen = setOpenStart1;
    }
    if (index === 1) {
      setOpen = setOpenStart2;
    }
    if (index === 2) {
      setOpen = setOpenStart3;
    }
    if (index === 3) {
      setOpen = setOpenStart4;
    }
    if (index === 4) {
      setOpen = setOpenStart5;
    }
    if (index === 5) {
      setOpen = setOpenStart6;
    }
    if (index === 6) {
      setOpen = setOpenStart7;
    }
    if (oldValue === undefined) {
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
      setOpen = setOpenEnd1;
    }
    if (index === 1) {
      setOpen = setOpenEnd2;
    }
    if (index === 2) {
      setOpen = setOpenEnd3;
    }
    if (index === 3) {
      setOpen = setOpenEnd4;
    }
    if (index === 4) {
      setOpen = setOpenEnd5;
    }
    if (index === 5) {
      setOpen = setOpenEnd6;
    }
    if (index === 6) {
      setOpen = setOpenEnd7;
    }
    if (oldValue === undefined) {
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

  const changeStartTime = (time, day_of_week, index) => {
    const day = { ...times[index] };
    compareMinuteStart(day.start_time, time, index);
    if (
      moment(time, format).isAfter(moment('23:30', format)) ||
      moment(time, format).isAfter(moment(day.end_time, format))
    ) {
      setErrorTimeState({
        ...errorTimeState,
        status: true,
        id: day_of_week,
      });
      day.start_time = defaultStartTime;
      day.end_time = defaultEndTime;
    } else {
      day.start_time = time.format(format);
      setErrorTimeState({
        ...errorTimeState,
        status: false,
        id: undefined,
      });
    }
    day.checked = true;
    setTimes([...times.slice(0, index), day, ...times.slice(index + 1)]);
  };

  const changeEndTime = (time, day_of_week, index) => {
    const day = { ...times[index] };
    compareMinuteEnd(day.end_time, time, index);
    if (
      moment(time, format).isBefore(moment(day.start_time, format)) ||
      moment(time, format).isBefore(moment('00:15', format))
    ) {
      setErrorTimeState({
        ...errorTimeState,
        status: true,
        id: day_of_week,
      });
      day.start_time = defaultStartTime;
      day.end_time = defaultEndTime;
    } else {
      day.end_time = time.format(format);
      setErrorTimeState({
        ...errorTimeState,
        status: false,
        id: undefined,
      });
    }
    day.checked = true;
    setTimes([...times.slice(0, index), day, ...times.slice(index + 1)]);
  };

  const handleGoBack = () => {
    history.go(-1);
  };

  const updateTime = () => {
    const reqBody = [];

    for (const item of times) {
      reqBody.push({
        day_of_week: item.day_of_week,
        name: item.name,
        start_time: item.start_time,
        end_time: item.end_time,
        status: item.checked ? 1 : 0,
      });
    }
    if (reqBody.length > 0) {
      setErrorNoDataState(false);
      dispatch({
        type: 'USER/updateTimeDefault',
        payload: {
          reqBody: {
            user_datetime: reqBody,
            time_period: period,
          },
          formatMessage,
          setLoading,
          updateTimesDefault: () => setUserTimeDefault(times),
        },
      });
    } else {
      setErrorNoDataState(true);
    }
  };

  useEffect(() => {
    if (profile?.setting) {
      setPeriod(profile?.setting?.time_period || 1);
    }
  }, []);

  const checkedDay = (event, index) => {
    const { checked } = event.target;
    setTimes([
      ...times.slice(0, index),
      {
        ...times[index],
        checked,
      },
      ...times.slice(index + 1),
    ]);

    setErrorNoDataState(false);
  };

  const cancelSettingTime = () => {
    setTimes(userTimeDefault);
  };

  const handleOpenChange = value => {
    if (!value) {
      setErrorTimeState({
        status: false,
        id: undefined,
      });
    }
  };

  return (
    <div className={styles.setting}>
      <div className={styles.formTab}>
        <div
          className={styles.formTabButton}
          onClick={() => {
            history.push('/profile');
          }}
        >
          プロフィール
        </div>
        <div
          className={[styles.formTabButton, styles.active].join(' ')}
          onClick={() => {
            onConfirmBeforeNavigate('/profile/schedule-setting');
          }}
        >
          自動日程調整オプション
        </div>
      </div>
      <div className={styles.pageTitle}>自動日程調整オプション</div>
      <div className={styles.mainSetting}>
        <div>
          <div className={styles.partTitle}>抽出期間</div>
          <div className={styles.partSub}>指定した期限だけ表示されます。</div>
        </div>

        <Select
          onChange={value => {
            setPeriod(value);
          }}
          suffixIcon={
            <img
              src={iconArrow}
              alt="arrow"
              style={{ width: 22, height: 22 }}
            />
          }
          name="period"
          value={period}
          size="small"
          className={styles.selectCustom}
        >
          <Select.Option value={1}>1週間</Select.Option>
          <Select.Option value={2}>2週間</Select.Option>
          <Select.Option value={3}>3週間</Select.Option>
          <Select.Option value={4}>4週間</Select.Option>
        </Select>
        <div>
          <div className={[styles.partTitle, styles.partTitle2].join(' ')}>
            調整日時(勤務時間)
          </div>
          <div className={styles.timeBlock}>
            <div>
              <div>
                {times.map((timeItem, index) => {
                  let openStateStart;
                  let setOpenStateStart;
                  let openStateEnd;
                  let setOpenStateEnd;
                  if (index === 0) {
                    openStateStart = openStart1;
                    setOpenStateStart = setOpenStart1;
                    openStateEnd = openEnd1;
                    setOpenStateEnd = setOpenEnd1;
                  }
                  if (index === 1) {
                    openStateStart = openStart2;
                    setOpenStateStart = setOpenStart2;
                    openStateEnd = openEnd2;
                    setOpenStateEnd = setOpenEnd2;
                  }
                  if (index === 2) {
                    openStateStart = openStart3;
                    setOpenStateStart = setOpenStart3;
                    openStateEnd = openEnd3;
                    setOpenStateEnd = setOpenEnd3;
                  }
                  if (index === 3) {
                    openStateStart = openStart4;
                    setOpenStateStart = setOpenStart4;
                    openStateEnd = openEnd4;
                    setOpenStateEnd = setOpenEnd4;
                  }
                  if (index === 4) {
                    openStateStart = openStart5;
                    setOpenStateStart = setOpenStart5;
                    openStateEnd = openEnd5;
                    setOpenStateEnd = setOpenEnd5;
                  }
                  if (index === 5) {
                    openStateStart = openStart6;
                    setOpenStateStart = setOpenStart6;
                    openStateEnd = openEnd6;
                    setOpenStateEnd = setOpenEnd6;
                  }
                  if (index === 6) {
                    openStateStart = openStart7;
                    setOpenStateStart = setOpenStart7;
                    openStateEnd = openEnd7;
                    setOpenStateEnd = setOpenEnd7;
                  }
                  return (
                    <div className={styles.checkboxItem} key={index}>
                      {(openStateStart || openStateEnd) && (
                        <div
                          onClick={() => {
                            setOpenStateStart(false);
                            setOpenStateEnd(false);
                          }}
                          className="bgTransparent"
                        ></div>
                      )}
                      <Checkbox
                        checked={timeItem.checked}
                        className={styles.checkboxCustom}
                        onChange={event => checkedDay(event, index)}
                      >
                        <div className={styles.checkboxContent}>
                          <div className={styles.labelCheckbox}>
                            {timeItem.name}
                          </div>
                        </div>
                      </Checkbox>
                      <div className={styles.checkboxSelect}>
                        <TimePicker
                          minuteStep={15}
                          format={format}
                          inputReadOnly={true}
                          size="small"
                          value={
                            moment(timeItem.start_time, format)
                              ? moment(timeItem.start_time, format)
                              : null
                          }
                          suffixIcon={
                            <img
                              src={iconArrow}
                              alt="icon"
                              style={{ width: 22, height: 22 }}
                            />
                          }
                          placeholder={formatMessage({
                            id: 'i18n_start_time_placeholder',
                          })}
                          allowClear={false}
                          showNow={false}
                          popupClassName={styles.timePicker}
                          onChange={value =>
                            changeStartTime(value, timeItem.day_of_week, index)
                          }
                          onSelect={value =>
                            changeStartTime(value, timeItem.day_of_week, index)
                          }
                          open={openStateStart}
                          onOpenChange={() => {
                            setOpenStateStart(true);
                            handleOpenChange();
                          }}
                        />
                        <span className={styles.settingIcon}>～</span>
                        <TimePicker
                          minuteStep={15}
                          format={format}
                          inputReadOnly={true}
                          value={moment(timeItem.end_time, format)}
                          suffixIcon={
                            <img
                              src={iconArrow}
                              alt="icon"
                              style={{ width: 22, height: 22 }}
                            />
                          }
                          placeholder={formatMessage({
                            id: 'i18n_end_time_placeholder',
                          })}
                          allowClear={false}
                          showNow={false}
                          popupClassName={styles.timePicker}
                          onChange={value =>
                            changeEndTime(value, timeItem.day_of_week, index)
                          }
                          onSelect={value =>
                            changeEndTime(value, timeItem.day_of_week, index)
                          }
                          open={openStateEnd}
                          onOpenChange={() => {
                            setOpenStateEnd(true);
                            handleOpenChange();
                          }}
                          disabledTime={current => {
                            return {
                              disabledHours: () => {
                                return Array.from(
                                  { length: 24 },
                                  (_, i) => i,
                                ).filter(
                                  item =>
                                    item <
                                    moment(timeItem.start_time, format).hour(),
                                );
                              },
                              disabledMinutes: () => {
                                return Array.from(
                                  { length: 60 },
                                  (_, i) => i,
                                ).filter(
                                  item =>
                                    item <=
                                      moment(
                                        timeItem.start_time,
                                        format,
                                      ).minute() &&
                                    moment(
                                      timeItem.start_time,
                                      format,
                                    ).hour() ===
                                      moment(timeItem.end_time, format).hour(),
                                );
                              },
                            };
                          }}
                        />
                      </div>
                      {errorTimeState.status &&
                        errorTimeState.id === timeItem.day_of_week && (
                          <div className={styles.errorTime}>
                            {formatMessage({
                              id: 'i18n_time_frame_error',
                            })}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
              {errorNoDataState && (
                <div className="error">
                  {formatMessage({ id: 'i18n_required_time_default' })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={styles.btnUpdate}
          loading={loading}
          onClick={updateTime}
        >
          保存{' '}
        </div>
      </div>
    </div>
  );
}

export default connect(({ EVENT, USER }) => ({
  eventStore: EVENT,
  userStore: USER,
}))(SettingBlocktime);
