import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { useIntl } from 'umi';
import Footer from '@/components/Footer';
import Step from '@/components/Step';
import { Form, Checkbox, Button, TimePicker, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { DownOutlined } from '@ant-design/icons';

function DetailSetting(props) {
  const intl = useIntl();
  const format = 'HH:mm';
  const { dispatch, masterStore } = props;
  const [form] = Form.useForm();
  const [step, setStep] = useState(2);
  const suffixIcon = <DownOutlined />;
  const [open, setOpen] = useState(false);
  const [times, setTime] = useState([
    {
      day_of_week: 7,
      checked: false,
      name: '日曜日',
      start_time: '09:00',
      end_time: '18:00',
    },
    {
      day_of_week: 1,
      checked: true,
      name: '月曜日',
      start_time: '09:00',
      end_time: '18:00',
    },
    {
      day_of_week: 2,
      checked: true,
      name: '火曜日',
      start_time: '09:00',
      end_time: '18:00',
    },
    {
      day_of_week: 3,
      checked: true,
      name: '水曜日',
      start_time: '09:00',
      end_time: '18:00',
    },
    {
      day_of_week: 4,
      checked: true,
      name: '木曜日',
      start_time: '09:00',
      end_time: '18:00',
    },
    {
      day_of_week: 5,
      checked: true,
      name: '金曜日',
      start_time: '09:00',
      end_time: '18:00',
    },
    {
      day_of_week: 6,
      checked: false,
      name: '土曜日',
      start_time: '09:00',
      end_time: '18:00',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [errorNoDataState, setErrorNoDataState] = useState(false);
  const [errorTimeState, setErrorTimeState] = useState({
    status: false,
    id: undefined,
  });
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

  useEffect(() => {
    checkFirstLogin();
  }, []);

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

  const checkFirstLogin = async () => {
    setLoading(true);
    await dispatch({ type: 'MASTER/checkFirstSetup', payload: {} });
    setLoading(false);
  };

  function updateTime() {
    const payload = times.filter(timeItem => {
      timeItem.status = timeItem.checked ? 1 : 0;
      if (timeItem.checked) {
        delete timeItem.checked;
        return timeItem;
      }
    });
    if (payload.length > 0) {
      setErrorNoDataState(false);
      dispatch({ type: 'MASTER/updateTimeDefault', payload });
    } else {
      setErrorNoDataState(true);
    }
  }
  function skipSettingTime() {
    dispatch({ type: 'MASTER/updateTimeDefault', payload: {} });
  }
  function setTimeDefault(day) {
    day.end_time = '18:00';
    day.start_time = '09:00';
  }
  function changeStartTime(time, day_of_week, index) {
    if (moment(time).format(format)) {
      const dateNew = times.map(day => {
        if (day_of_week === day.day_of_week) {
          compareMinuteStart(day.start_time, time, index);
          if (
            moment(time, 'HH:mm').isAfter(moment('23:30', 'HH:mm')) ||
            moment(time, 'HH:mm').isAfter(moment(day.end_time, 'HH:mm'))
          ) {
            // alert('日付/時刻が解釈できません');
            setErrorTimeState({
              ...errorTimeState,
              status: true,
              id: day_of_week,
            });
            setTimeDefault(day);
          } else {
            day.start_time = time.format(format);
            setErrorTimeState({
              ...errorTimeState,
              status: false,
              id: undefined,
            });
          }
          day.checked = true;
        }
        return day;
      });
      setTime(dateNew);
    }
  }
  function changeEndTime(time, day_of_week, index) {
    const dateNew = times.map(day => {
      if (day_of_week === day.day_of_week) {
        compareMinuteEnd(day.end_time, time, index);
        day.checked = true;
        if (
          moment(time, 'HH:mm').isBefore(moment(day.start_time, 'HH:mm')) ||
          moment(time, 'HH:mm').isBefore(moment('00:15', 'HH:mm'))
        ) {
          // alert('日付/時刻が解釈できません');
          setErrorTimeState({
            ...errorTimeState,
            status: true,
            id: day_of_week,
          });
          setTimeDefault(day);
        } else {
          day.end_time = time.format(format);
          setErrorTimeState({
            ...errorTimeState,
            status: false,
            id: undefined,
          });
        }
      }
      return day;
    });
    setTime(dateNew);
  }
  function checkedDay(day_of_week) {
    const dateNew = times.map(day => {
      if (day_of_week === day.day_of_week) {
        day.checked = !day.checked;
      }
      return day;
    });
    setTime(dateNew);
    setErrorNoDataState(false);
  }
  return (
    <Spin spinning={loading}>
      <Step step={2} />
      <div className={styles.setting}>
        <div className={styles.settingContent}>
          <div className={styles.settingDescript1}>
            下記にて設定した曜日と日程に基づき、候補日程が選択されます。
          </div>
          <div className={styles.settingDescript2}>
            ※あとで変更可能です。
            <br />
          </div>
          <div className={`${styles.settingBtnGroup} btnGroup`}>
            <Button className="btn btnWhite" onClick={updateTime}>
              {intl.formatMessage({ id: 'i18n_btn_later' })}
            </Button>
            <Button className="btn btnGreen" onClick={updateTime}>
              {intl.formatMessage({ id: 'i18n_btn_decide' })}
            </Button>
          </div>
          <div className={styles.settingForm}>
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
                        onChange={value => checkedDay(timeItem.day_of_week)}
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
                          value={
                            moment(timeItem.start_time, format)
                              ? moment(timeItem.start_time, format)
                              : null
                          }
                          suffixIcon={suffixIcon}
                          onChange={value =>
                            changeStartTime(value, timeItem.day_of_week, index)
                          }
                          onSelect={value =>
                            changeStartTime(value, timeItem.day_of_week, index)
                          }
                          placeholder={intl.formatMessage({
                            id: 'i18n_start_time_placeholder',
                          })}
                          allowClear={false}
                          showNow={false}
                          popupClassName={styles.timePicker}
                          open={openStateStart}
                          onOpenChange={() => setOpenStateStart(true)}
                        />
                        <span className={styles.settingIcon}>～</span>
                        <TimePicker
                          minuteStep={15}
                          format={format}
                          inputReadOnly={true}
                          value={moment(timeItem.end_time, format)}
                          onChange={value =>
                            changeEndTime(value, timeItem.day_of_week, index)
                          }
                          onSelect={value =>
                            changeEndTime(value, timeItem.day_of_week, index)
                          }
                          suffixIcon={suffixIcon}
                          placeholder={intl.formatMessage({
                            id: 'i18n_end_time_placeholder',
                          })}
                          allowClear={false}
                          showNow={false}
                          popupClassName={styles.timePicker}
                          open={openStateEnd}
                          onOpenChange={() => setOpenStateEnd(true)}
                        />
                      </div>
                      <div className={styles.errorTime}>
                        {errorTimeState.status &&
                        errorTimeState.id === timeItem.day_of_week
                          ? intl.formatMessage({
                              id: 'i18n_time_frame_error',
                            })
                          : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="error">
                {errorNoDataState
                  ? intl.formatMessage({ id: 'i18n_required_time_default' })
                  : ''}
              </div>
              <br />
              <div className={`${styles.settingBtnGroup} btnGroup`}>
                <Button className="btn btnWhite" onClick={skipSettingTime}>
                  {intl.formatMessage({ id: 'i18n_btn_later' })}
                </Button>
                <Button className="btn btnGreen" onClick={updateTime}>
                  {intl.formatMessage({ id: 'i18n_btn_decide' })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(DetailSetting);
