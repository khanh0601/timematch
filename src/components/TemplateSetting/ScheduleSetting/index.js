import React, { useEffect, useState } from 'react';
import styles from '../advanced_styles.less';
import moment from 'moment';
import { Row, Col, Select, TimePicker, Button, Tooltip } from 'antd';
import { useIntl, history } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import { compareMinute } from '@/commons/function.js';

import helperImage from '@/assets/images/imgQuestion.png';

function ScheduleSetting(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { Option } = Select;
  const suffixIcon = <DownOutlined />;

  const {
    updateScheduleSetting,
    scheduleValue,
    setScheduleValue,
    customReceptionStart,
    customReceptionEnd,
    customBreakTime,
    customPeriod,
    customReservation,
    relationshipType,
    setShowModalCustom,
    setModalInputType,
    setCurrentModalTitle,
    setCurrentModalType,
    errDefaultTime,
    errLunchTime,
    onCancelTemp,
  } = props;
  const defaultReceptionStart = [
    {
      id: 1,
      value: 0,
    },
    {
      id: 2,
      value: 60,
    },
    {
      id: 3,
      value: 180,
    },
    {
      id: 4,
      value: 360,
    },
    {
      id: 5,
      value: 720,
    },
    {
      id: 6,
      value: 1440,
    },
    {
      id: 7,
      value: undefined,
    },
  ];
  const defaultReceptionEnd = [
    {
      id: 1,
      value: 30,
    },
    {
      id: 2,
      value: 60,
    },
    {
      id: 3,
      value: 180,
    },
    {
      id: 4,
      value: 360,
    },
    {
      id: 5,
      value: 720,
    },
    {
      id: 6,
      value: 1440,
    },
    {
      id: 7,
      value: undefined,
    },
  ];
  const defaultRelaxTime = [
    {
      id: 1,
      value: 0,
    },
    {
      id: 2,
      value: 15,
    },
    {
      id: 3,
      value: 30,
    },
    {
      id: 4,
      value: 45,
    },
    {
      id: 5,
      value: 60,
    },
    {
      id: 6,
      value: undefined,
    },
  ];
  const defaultPeriod = [
    {
      id: 1,
      value: 1,
    },
    {
      id: 2,
      value: 2,
    },
    {
      id: 3,
      value: 3,
    },
    {
      id: 4,
      value: 4,
    },
    {
      id: 5,
      value: undefined,
    },
  ];
  const defaultReservation1 = [
    {
      id: 1,
      value: 5,
    },
    {
      id: 2,
      value: 10,
    },
    {
      id: 3,
      value: 15,
    },
    {
      id: 4,
      value: 20,
    },
    {
      id: 5,
      value: 25,
    },
    {
      id: 6,
      value: undefined,
    },
  ];

  const [receptionStartState, setReceptionStartState] = useState(
    defaultReceptionStart,
  );
  const [receptionEndState, setReceptionEndState] = useState(
    defaultReceptionEnd,
  );
  const [relaxTimeState, setRelaxTimeState] = useState(defaultRelaxTime);
  const [periodTimeState, setPeriodTimeState] = useState(defaultPeriod);
  const [reservationTimeState, setReservationTimeState] = useState(
    defaultReservation1,
  );
  const [openDefaultStart, setOpenDefaultStart] = useState(false);
  const [openDefaultEnd, setOpenDefaultEnd] = useState(false);
  const [openLunchStart, setOpenLunchStart] = useState(false);
  const [openLunchEnd, setOpenLunchEnd] = useState(false);

  useEffect(() => {
    // reception start
    const result1 = receptionStartState.map(item => {
      if (item.id === 7) {
        item.value = customReceptionStart;
      }
      return item;
    });
    setReceptionStartState(result1);
    if (customReceptionStart !== null) {
      scheduleValue.reception_start_time = customReceptionStart;
    }

    // break time
    const result2 = relaxTimeState.map(item => {
      if (item.id === 6) {
        item.value = customBreakTime;
      }
      return item;
    });
    setRelaxTimeState(result2);
    if (customBreakTime !== null) {
      scheduleValue.relax_time = customBreakTime;
    }

    // period
    const result3 = periodTimeState.map(item => {
      if (item.id === 5) {
        item.value = customPeriod;
      }
      return item;
    });
    setPeriodTimeState(result3);
    if (customPeriod !== null) {
      scheduleValue.period = customPeriod;
    }

    // reservation
    const result4 = defaultReservation1.map(item => {
      if (item.id === 6) {
        item.value = customReservation;
      }
      return item;
    });
    setReservationTimeState(result4);
    if (customReservation !== null) {
      scheduleValue.reservation_number = customReservation;
    }

    setScheduleValue(scheduleValue);
  }, [customReceptionStart, customBreakTime, customPeriod, customReservation]);

  const changeDefaultStartTime = value => {
    if (value) {
      compareMinute(
        scheduleValue.default_start_time,
        value,
        setOpenDefaultStart,
      );
      const newScheduleValue = {
        ...scheduleValue,
        default_start_time: value.format('HH:mm'),
      };
      setScheduleValue(newScheduleValue);
    } else {
      setScheduleValue({ ...scheduleValue, default_start_time: null });
    }
  };

  const changeDefaultEndTime = value => {
    if (value) {
      compareMinute(scheduleValue.default_end_time, value, setOpenDefaultEnd);
      const newScheduleValue = {
        ...scheduleValue,
        default_end_time: value.format('HH:mm'),
      };
      setScheduleValue(newScheduleValue);
    } else {
      setScheduleValue({ ...scheduleValue, default_end_time: null });
    }
  };

  const changeReceptionStart = id => {
    if (id) {
      const itemStart = defaultReceptionStart.find(item => item.id === id);
      if (itemStart && itemStart.id !== 7) {
        const newScheduleValue = {
          ...scheduleValue,
          reception_start_time: itemStart.value,
        };
        setScheduleValue(newScheduleValue);
      }
      if (itemStart.id === 7) {
        const newScheduleValue = {
          ...scheduleValue,
          reception_start_time: customReceptionStart,
        };
        setScheduleValue(newScheduleValue);
      }
    } else {
      setScheduleValue({ ...scheduleValue, reception_start_time: null });
    }
  };

  const changeReservationNumber = id => {
    if (id) {
      const itemReservation = defaultReservation1.find(item => item.id === id);
      if (itemReservation && itemReservation.id !== 6) {
        const newScheduleValue = {
          ...scheduleValue,
          reservation_number: itemReservation.value,
        };
        setScheduleValue(newScheduleValue);
      }
      if (itemReservation.id === 6) {
        const newScheduleValue = {
          ...scheduleValue,
          reservation_number: customReservation,
        };
        setScheduleValue(newScheduleValue);
      }
    } else {
      setScheduleValue({ ...scheduleValue, reservation_number: null });
    }
  };

  const changeRelaxTime = id => {
    if (id) {
      const itemRelax = defaultRelaxTime.find(item => item.id === id);
      if (itemRelax && itemRelax.id !== 6) {
        const newScheduleValue = {
          ...scheduleValue,
          relax_time: itemRelax.value,
        };
        setScheduleValue(newScheduleValue);
      }
      if (itemRelax.id === 6) {
        const newScheduleValue = {
          ...scheduleValue,
          relax_time: customBreakTime,
        };
        setScheduleValue(newScheduleValue);
      }
    } else {
      setScheduleValue({ ...scheduleValue, relax_time: null });
    }
  };

  const changeLunchStartTime = value => {
    if (value) {
      compareMinute(
        scheduleValue.lunch_break_start_time,
        value,
        setOpenLunchStart,
      );
      const newScheduleValue = {
        ...scheduleValue,
        lunch_break_start_time: value.format('HH:mm'),
      };
      setScheduleValue(newScheduleValue);
    } else {
      setScheduleValue({ ...scheduleValue, lunch_break_start_time: null });
    }
  };

  const changeLunchEndTime = value => {
    if (value) {
      compareMinute(scheduleValue.lunch_break_end_time, value, setOpenLunchEnd);
      const newScheduleValue = {
        ...scheduleValue,
        lunch_break_end_time: value.format('HH:mm'),
      };
      setScheduleValue(newScheduleValue);
    } else {
      setScheduleValue({ ...scheduleValue, lunch_break_end_time: null });
    }
  };

  const changePeriodTime = id => {
    if (id) {
      const itemPeriod = defaultPeriod.find(item => item.id === id);
      if (itemPeriod && itemPeriod.id !== 5) {
        const newScheduleValue = {
          ...scheduleValue,
          period: itemPeriod.value,
        };
        setScheduleValue(newScheduleValue);
      }
      if (itemPeriod.id === 5) {
        const newScheduleValue = {
          ...scheduleValue,
          period: customPeriod,
        };
        setScheduleValue(newScheduleValue);
      }
    } else {
      setScheduleValue({ ...scheduleValue, period: null });
    }
  };

  const changeReceptionEnd = id => {
    if (id) {
      const itemEnd = defaultReceptionEnd.find(item => item.id === id);
      if (itemEnd && itemEnd.id !== 7) {
        const newScheduleValue = {
          ...scheduleValue,
          reception_end_time: itemEnd.value,
        };
        setScheduleValue(newScheduleValue);
      }
      if (itemEnd.id === 7) {
        const newScheduleValue = {
          ...scheduleValue,
          reception_end_time: customReceptionEnd,
        };
        setScheduleValue(newScheduleValue);
      }
    } else {
      setScheduleValue({ ...scheduleValue, reception_end_time: null });
    }
  };
  const customValueFunc = (value, item, name, title) => {
    if (value.length === 5) {
      if (item === 5) {
        setShowModalCustom(true);
        setModalInputType(name);
        setCurrentModalTitle(formatMessage({ id: title }));
        setCurrentModalType(name);
      }
    }
    if (value.length === 6) {
      if (item === 6) {
        setShowModalCustom(true);
        setModalInputType(name);
        setCurrentModalTitle(formatMessage({ id: title }));
        setCurrentModalType(name);
      }
    }
    if (value.length === 7) {
      if (item === 7) {
        setShowModalCustom(true);
        setModalInputType(name);
        setCurrentModalTitle(formatMessage({ id: title }));
        setCurrentModalType(name);
      }
    }
  };
  return (
    <div className={styles.listField}>
      {(openDefaultStart ||
        openDefaultEnd ||
        openLunchEnd ||
        openLunchStart) && (
        <div
          onClick={() => {
            setOpenDefaultStart(false);
            setOpenDefaultEnd(false);
            setOpenLunchEnd(false);
            setOpenLunchStart(false);
          }}
          className="bgTransparent"
        ></div>
      )}
      <Row>
        <Col lg={8} md={9} sm={24} xs={24}>
          <div className={styles.listFieldColumn}>
            <div className={styles.selectField}>
              <div className={styles.titleField}>
                <div className={styles.titleFieldIcon}></div>
                <p>{formatMessage({ id: 'i18n_working_time' })}</p>
                <Tooltip
                  title={formatMessage({ id: 'i18n_working_time_tooltip' })}
                  overlayClassName={styles.tooltipAdvanced}
                >
                  <div className={styles.helper}>
                    <img src={helperImage} className="helper" />
                  </div>
                </Tooltip>
              </div>
              <div className={styles.selections}>
                <TimePicker
                  placeholder={formatMessage({
                    id: 'i18n_default_start_time_placeholder',
                  })}
                  format={'HH:mm'}
                  minuteStep={15}
                  suffixIcon={suffixIcon}
                  allowClear={true}
                  showNow={false}
                  inputReadOnly={true}
                  value={
                    moment(scheduleValue.default_start_time, 'HH:mm').isValid()
                      ? moment(scheduleValue.default_start_time, 'HH:mm')
                      : undefined
                  }
                  onChange={value => changeDefaultStartTime(value)}
                  onSelect={value => changeDefaultStartTime(value)}
                  popupClassName={styles.timePicker}
                  open={openDefaultStart}
                  onOpenChange={() => setOpenDefaultStart(true)}
                />
                <span className={styles.devideIcon}>〜</span>
                <TimePicker
                  placeholder={formatMessage({
                    id: 'i18n_default_end_time_placeholder',
                  })}
                  format={'HH:mm'}
                  minuteStep={15}
                  suffixIcon={suffixIcon}
                  allowClear={true}
                  showNow={false}
                  inputReadOnly={true}
                  value={
                    moment(scheduleValue.default_end_time, 'HH:mm').isValid()
                      ? moment(scheduleValue.default_end_time, 'HH:mm')
                      : undefined
                  }
                  onChange={value => changeDefaultEndTime(value)}
                  onSelect={value => changeDefaultEndTime(value)}
                  popupClassName={styles.timePicker}
                  open={openDefaultEnd}
                  onOpenChange={() => setOpenDefaultEnd(true)}
                />
              </div>
              {errDefaultTime && (
                <div className="errorMessage">
                  {formatMessage({ id: 'i18n_error_message_default_time' })}
                </div>
              )}
            </div>
            <div className={styles.selectField}>
              <div className={styles.titleField}>
                <div className={styles.titleFieldIcon}></div>
                <p>{formatMessage({ id: 'i18n_time_to_start_welcome' })}</p>
                <Tooltip
                  title={formatMessage({
                    id: 'i18n_time_to_start_welcome_tooltip',
                  })}
                  overlayClassName={styles.tooltipAdvanced}
                >
                  <div className={styles.helper}>
                    <img src={helperImage} className="helper" />
                  </div>
                </Tooltip>
              </div>
              <div className={styles.selections}>
                <Select
                  placeholder={formatMessage({
                    id: 'i18n_reception_start_placeholder',
                  })}
                  className={styles.width120}
                  value={
                    scheduleValue.reception_start_time
                      ? scheduleValue.reception_start_time !== 0
                        ? scheduleValue.reception_start_time % 60 === 0
                          ? `${parseInt(
                              scheduleValue.reception_start_time / 60,
                            )}${formatMessage({ id: 'i18n_hour' })}`
                          : parseInt(
                              scheduleValue.reception_start_time / 60,
                            ) === 0
                          ? `${scheduleValue.reception_start_time %
                              60}${formatMessage({ id: 'i18n_minute' })}`
                          : `${parseInt(
                              scheduleValue.reception_start_time / 60,
                            )}${formatMessage({ id: 'i18n_hour' })}
                              ${scheduleValue.reception_start_time %
                                60}${formatMessage({ id: 'i18n_minute' })}`
                        : `0${formatMessage({ id: 'i18n_minute' })}`
                      : null
                  }
                  onChange={value => changeReceptionStart(value)}
                  allowClear={true}
                >
                  {receptionStartState.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        <div
                          onClick={() =>
                            customValueFunc(
                              receptionStartState,
                              item.id,
                              'reception_start',
                              'i18n_custom',
                            )
                          }
                        >
                          {item.id !== 7
                            ? item.value
                              ? item.value !== 0
                                ? item.value % 60 === 0
                                  ? `${parseInt(
                                      item.value / 60,
                                    )}${formatMessage({ id: 'i18n_hour' })}`
                                  : parseInt(item.value / 60) > 0
                                  ? `${parseInt(
                                      item.value / 60,
                                    )}${formatMessage({ id: 'i18n_hour' })}
                                      ${item.value % 60}${formatMessage({
                                      id: 'i18n_minute',
                                    })}`
                                  : `${item.value % 60}${formatMessage({
                                      id: 'i18n_minute',
                                    })}`
                                : formatMessage({ id: 'i18n_custom' })
                              : `0${formatMessage({ id: 'i18n_minute' })}`
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={8} md={9} sm={24} xs={24}>
          <div className={styles.listFieldColumn}>
            <div className={styles.selectField}>
              <div className={styles.titleField}>
                <div className={styles.titleFieldIcon}></div>
                <p>{formatMessage({ id: 'i18n_break_time' })}</p>
                <Tooltip
                  placement="top"
                  title={formatMessage({ id: 'i18n_break_time_tooltip' })}
                >
                  <img src={helperImage} className="helper" />
                </Tooltip>
              </div>
              <div className={styles.selections}>
                <Select
                  placeholder={formatMessage({
                    id: 'i18n_relax_time_placeholder',
                  })}
                  className={styles.width120}
                  value={
                    scheduleValue.relax_time
                      ? scheduleValue.relax_time !== 0
                        ? scheduleValue.relax_time % 60 === 0
                          ? `${parseInt(
                              scheduleValue.relax_time / 60,
                            )}${formatMessage({ id: 'i18n_hour' })}`
                          : parseInt(scheduleValue.relax_time / 60) === 0
                          ? `${scheduleValue.relax_time % 60}${formatMessage({
                              id: 'i18n_minute',
                            })}`
                          : `${parseInt(
                              scheduleValue.relax_time / 60,
                            )}${formatMessage({ id: 'i18n_hour' })}
                              ${scheduleValue.relax_time % 60}${formatMessage({
                              id: 'i18n_minute',
                            })}`
                        : `0${formatMessage({ id: 'i18n_minute' })}`
                      : null
                  }
                  onChange={value => changeRelaxTime(value)}
                  allowClear={true}
                >
                  {relaxTimeState.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        <div
                          onClick={() =>
                            customValueFunc(
                              relaxTimeState,
                              item.id,
                              'relax_time',
                              'i18n_custom',
                            )
                          }
                        >
                          {item.id !== 6
                            ? item.value
                              ? item.value !== 0
                                ? item.value % 60 === 0
                                  ? `${parseInt(
                                      item.value / 60,
                                    )}${formatMessage({ id: 'i18n_hour' })}`
                                  : parseInt(item.value / 60) > 0
                                  ? `${parseInt(
                                      item.value / 60,
                                    )}${formatMessage({ id: 'i18n_hour' })}
                                  ${item.value % 60}${formatMessage({
                                      id: 'i18n_minute',
                                    })}`
                                  : `${item.value % 60}${formatMessage({
                                      id: 'i18n_minute',
                                    })}`
                                : formatMessage({ id: 'i18n_custom' })
                              : `0${formatMessage({ id: 'i18n_minute' })}`
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className={styles.selectField}>
              <div className={styles.titleField}>
                <div className={styles.titleFieldIcon}></div>
                <p>{formatMessage({ id: 'i18n_snap' })}</p>
                <Tooltip
                  title={formatMessage({ id: 'i18n_snap_tooltip' })}
                  overlayClassName={styles.tooltipAdvanced}
                >
                  <div className={styles.helper}>
                    <img src={helperImage} className="helper" />
                  </div>
                </Tooltip>
              </div>
              <div className={styles.selections}>
                <TimePicker
                  placeholder={formatMessage({
                    id: 'i18n_lunch_start_placeholder',
                  })}
                  format={'HH:mm'}
                  minuteStep={15}
                  suffixIcon={suffixIcon}
                  allowClear={true}
                  showNow={false}
                  inputReadOnly={true}
                  value={
                    moment(
                      scheduleValue.lunch_break_start_time,
                      'HH:mm',
                    ).isValid()
                      ? moment(scheduleValue.lunch_break_start_time, 'HH:mm')
                      : undefined
                  }
                  onChange={value => changeLunchStartTime(value)}
                  onSelect={value => changeLunchStartTime(value)}
                  popupClassName={styles.timePicker}
                  open={openLunchStart}
                  onOpenChange={() => setOpenLunchStart(true)}
                />
                <span className={styles.devideIcon}>〜</span>
                <TimePicker
                  placeholder={formatMessage({
                    id: 'i18n_lunch_end_placeholder',
                  })}
                  format={'HH:mm'}
                  minuteStep={15}
                  suffixIcon={suffixIcon}
                  allowClear={true}
                  showNow={false}
                  inputReadOnly={true}
                  value={
                    moment(
                      scheduleValue.lunch_break_end_time,
                      'HH:mm',
                    ).isValid()
                      ? moment(scheduleValue.lunch_break_end_time, 'HH:mm')
                      : undefined
                  }
                  onChange={value => changeLunchEndTime(value)}
                  onSelect={value => changeLunchEndTime(value)}
                  popupClassName={styles.timePicker}
                  open={openLunchEnd}
                  onOpenChange={() => setOpenLunchEnd(true)}
                />
              </div>
              {errLunchTime && (
                <div className="errorMessage">
                  {formatMessage({ id: 'i18n_error_message_lunch_time' })}
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col lg={8} md={6} sm={24} xs={24}>
          <div className={styles.listFieldColumn}>
            <div className={styles.selectField}>
              <div className={styles.titleField}>
                <div className={styles.titleFieldIcon}></div>
                <p>{formatMessage({ id: 'i18n_stage' })}</p>
                <Tooltip
                  title={formatMessage({ id: 'i18n_stage_tooltip' })}
                  overlayClassName={styles.tooltipAdvanced}
                >
                  <div className={styles.helper}>
                    <img src={helperImage} className="helper" />
                  </div>
                </Tooltip>
              </div>
              <div className={styles.selections}>
                <Select
                  placeholder={formatMessage({ id: 'i18n_period_placeholder' })}
                  className={styles.width120}
                  value={
                    scheduleValue.period
                      ? `${scheduleValue.period}${formatMessage({
                          id: 'i18n_weekly',
                        })}`
                      : null
                  }
                  onChange={value => changePeriodTime(value)}
                  allowClear={true}
                >
                  {periodTimeState.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        <div
                          onClick={() =>
                            customValueFunc(
                              periodTimeState,
                              item.id,
                              'period',
                              'i18n_custom_period',
                            )
                          }
                        >
                          {item.id !== 5
                            ? `${item.value}${formatMessage({
                                id: 'i18n_weekly',
                              })}`
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className={styles.selectField}>
              <div className={styles.titleField}>
                <div className={styles.titleFieldIcon}></div>
                <p>{formatMessage({ id: 'i18n_ordered_amount' })}</p>
                <Tooltip
                  title={formatMessage({ id: 'i18n_ordered_amount_tooltip' })}
                  overlayClassName={styles.tooltipAdvanced}
                >
                  <div className={styles.helper}>
                    <img src={helperImage} className="helper" />
                  </div>
                </Tooltip>
              </div>
              <div className={styles.selections}>
                <Select
                  placeholder={formatMessage({
                    id: 'i18n_reservation_placeholder',
                  })}
                  className={styles.width120}
                  value={
                    scheduleValue.reservation_number
                      ? `${scheduleValue.reservation_number}${formatMessage({
                          id: 'i18n_candidate',
                        })}`
                      : null
                  }
                  onChange={value => changeReservationNumber(value)}
                  allowClear={true}
                >
                  {reservationTimeState.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        <div
                          onClick={() =>
                            customValueFunc(
                              reservationTimeState,
                              item.id,
                              'reservation',
                              'i18n_custom_reservation',
                            )
                          }
                        >
                          {item.id !== 6
                            ? `${item.value}${formatMessage({
                                id: 'i18n_candidate',
                              })}`
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className={`${styles.selectField} ${styles.displayNone}`}>
              <div className={styles.titleField}>
                <div className={styles.titleFieldIcon}></div>
                <p>{formatMessage({ id: 'i18n_time_to_stop_welcome' })}</p>
                <Tooltip
                  title={formatMessage({
                    id: 'i18n_time_to_stop_welcome_tooltip',
                  })}
                  overlayClassName={styles.tooltipAdvanced}
                >
                  <div className={styles.helper}>
                    <img src={helperImage} className="helper" />
                  </div>
                </Tooltip>
              </div>
              <div className={styles.selections}>
                <Select
                  placeholder="例: 1時間"
                  className={styles.width120}
                  value={
                    scheduleValue.reception_end_time
                      ? scheduleValue.reception_end_time % 60 === 0
                        ? `${parseInt(
                            scheduleValue.reception_end_time / 60,
                          )}時間`
                        : parseInt(scheduleValue.reception_end_time / 60) > 0
                        ? `${parseInt(
                            scheduleValue.reception_end_time / 60,
                          )}時間${scheduleValue.reception_end_time % 60}分`
                        : `${scheduleValue.reception_end_time % 60}分`
                      : null
                  }
                  onChange={value => changeReceptionEnd(value)}
                  allowClear={true}
                >
                  {receptionEndState.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        <div
                          onClick={() => {
                            if (item.id === 7) {
                              setShowModalCustom(true);
                              setModalInputType('reception_end');
                              setCurrentModalTitle(
                                formatMessage({ id: 'i18n_custom' }),
                              );
                              setCurrentModalType('reception_end');
                            }
                          }}
                        >
                          {item.value
                            ? item.id !== 7
                              ? item.value % 60 === 0
                                ? `${parseInt(item.value / 60)}時間`
                                : parseInt(item.value / 60) > 0
                                ? `${parseInt(
                                    item.value / 60,
                                  )}時間${item.value % 60}分`
                                : `${item.value % 60}分`
                              : formatMessage({ id: 'i18n_custom' })
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Col span={24}>
        <div className={styles.buttonZone}>
          <Button className={styles.cancelBtn} onClick={() => onCancelTemp()}>
            {formatMessage({ id: 'i18n_cancel' })}
          </Button>
          <Button
            className={styles.saveBtn}
            onClick={() => updateScheduleSetting()}
          >
            {formatMessage({ id: 'i18n_set' })}
          </Button>
        </div>
      </Col>
    </div>
  );
}

export default ScheduleSetting;
