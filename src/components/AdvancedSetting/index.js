import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import pinion from '@/assets/images/i-pinion.svg';
import {
  Col,
  Button,
  Input,
  Collapse,
  TimePicker,
  Row,
  Select,
  Tooltip,
} from 'antd';
import helper from '@/assets/images/imgQuestion.png';
import clock from '@/assets/images/i-clock.svg';
import message from '@/assets/images/message-setting.png';
import { useIntl, history } from 'umi';
import bubbleArrow from '@/assets/images/i-bubble-arrow.svg';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { connect } from 'dva';

function AdvancedSetting(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { Panel } = Collapse;
  const format = 'HH:mm';
  const suffixIcon = <DownOutlined />;
  const { Option } = Select;
  const { dispatch, eventStore } = props;
  const { detailEventType } = props;
  const [defaultStartTime, setDefaultStartTime] = useState(undefined);
  const [defaultEndTime, setDefaultEndTime] = useState(undefined);
  const [relaxTime, setRelaxTime] = useState();
  const [period, setPeriod] = useState();
  const [receptionStartTime, setReceptionStartTime] = useState();
  const [receptionEndTime, setReceptionEndTime] = useState();
  const [lunchStartTime, setLunchStartTime] = useState('');
  const [lunchEndTime, setLunchEndTime] = useState('');
  const [reservationNumber, setNumberReservation] = useState();
  const [calendarCreateComment, setCalendarCreateComment] = useState('');
  const [calendarConfirmComment, setCalendarConfirmComment] = useState('');
  const [priorityStartTime, setPriorityStart] = useState(undefined);
  const [priorityEndTime, setPriorityEnd] = useState(undefined);
  const [idPriority, setIdPriority] = useState('');
  const today = moment().format('YYYY/MM/DD');
  const [priorityTime, setPriorityTime] = useState([
    {
      status: 1,
      priority_start_time: priorityStartTime,
      priority_end_time: priorityEndTime,
      id: idPriority,
      is_delete: false,
    },
    {
      status: 2,
      priority_start_time: priorityStartTime,
      priority_end_time: priorityEndTime,
      id: idPriority,
      is_delete: false,
    },
    {
      status: 3,
      priority_start_time: priorityStartTime,
      priority_end_time: priorityEndTime,
      id: '',
      is_delete: false,
    },
    {
      status: 4,
      priority_start_time: priorityStartTime,
      priority_end_time: priorityEndTime,
      id: idPriority,
      is_delete: false,
    },
    {
      status: 5,
      priority_start_time: priorityStartTime,
      priority_end_time: priorityEndTime,
      id: idPriority,
      is_delete: false,
    },
  ]);
  useEffect(() => {
    if (detailEventType) {
      setDefaultStartTime(detailEventType.default_start_time);
      setDefaultEndTime(detailEventType.default_end_time);
      setRelaxTime(detailEventType.relax_time);
      setPeriod(detailEventType.period);
      setReceptionStartTime(detailEventType.reception_start_time);
      setReceptionEndTime(detailEventType.reception_end_time);
      setLunchStartTime(detailEventType.lunch_break_start_time);
      setLunchEndTime(detailEventType.lunch_break_end_time);
      setNumberReservation(detailEventType.reservation_number);
      setCalendarCreateComment(detailEventType.calendar_create_comment);
      setCalendarConfirmComment(detailEventType.calendar_confirm_comment);
    }
  }, [detailEventType]);
  useEffect(() => {
    if (detailEventType) {
      if (detailEventType.m_priority_times.length > 0) {
        let result = [];
        detailEventType.m_priority_times.map(item => {
          result = priorityTime.map(priority => {
            if (priority.status === item.status) {
              priority.priority_start_time = item.priority_start_time;
              priority.priority_end_time = item.priority_end_time;
              priority.id = item.id;
            }
            return priority;
          });
        });
        setPriorityTime(result);
      }
    }
  }, [detailEventType]);
  const headerScheduleSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={pinion} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_set_schedule' })}
        </div>
      </div>
    </div>
  );
  const timeSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={clock} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_time_setting' })}
        </div>
        <div className={styles.helper}>
          <img src={helper} className="helper" />
          <div className={styles.helperTooltip}>
            <img src={bubbleArrow} />
            詳細メッセージ
          </div>
        </div>
      </div>
    </div>
  );
  const messageSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={message} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_message_setting' })}
        </div>
      </div>
    </div>
  );

  function changeCalendarCreateComment(event) {
    setCalendarCreateComment(event.target.value);
  }
  function changeCalendarConfirmComment(event) {
    setCalendarConfirmComment(event.target.value);
  }
  function changePriorityStartTime(value, status) {
    const temp = [...priorityTime];
    const dayNew = temp.map(item => {
      if (item.status === status) {
        if (value) {
          return { ...item, priority_start_time: value.format(format) };
        } else {
          return { ...item, priority_start_time: undefined };
        }
      } else {
        return { ...item };
      }
    });
    setPriorityTime(dayNew);
  }

  function changePriorityEndTime(value, status) {
    const dayNew = priorityTime.map(item => {
      if (item.status === status) {
        if (value) {
          return { ...item, priority_end_time: value.format(format) };
        } else {
          return { ...item, priority_end_time: undefined };
        }
      } else {
        return { ...item };
      }
    });
    setPriorityTime(dayNew);
  }
  function changeDefaultStartTime(value) {
    if (value) {
      setDefaultStartTime(value.format(format));
    } else {
      setDefaultStartTime(undefined);
    }
  }
  function changeDefaultEndTime(value) {
    value
      ? setDefaultEndTime(value.format(format))
      : setDefaultEndTime(undefined);
  }
  function changeLunchStartTime(value) {
    value
      ? setLunchStartTime(value.format(format))
      : setLunchStartTime(undefined);
  }
  function changeLunchEndTime(value) {
    value ? setLunchEndTime(value.format(format)) : setLunchEndTime(undefined);
  }
  function changeReceptionStart(value) {
    setReceptionStartTime(value);
  }
  function changeReceptionEnd(value) {
    setReceptionEndTime(value);
  }
  function changeReservationNumber(value) {
    setNumberReservation(value);
  }
  function changeRelaxTime(value) {
    setRelaxTime(value);
  }
  function changePeriodTime(value) {
    setPeriod(value);
  }
  function compareDefaultTime() {
    if (
      moment(defaultEndTime, 'HH:mm').isBefore(
        moment(defaultStartTime, 'HH:mm'),
      ) ||
      moment(defaultStartTime, 'HH:mm').isAfter(moment('23:30', 'HH:mm')) ||
      moment(defaultStartTime, 'HH:mm').isAfter(
        moment(defaultEndTime, 'HH:mm'),
      ) ||
      moment(defaultEndTime, 'HH:mm').isBefore(moment('00:15', 'HH:mm'))
    ) {
      setDefaultStartTime(undefined);
      setDefaultEndTime(undefined);
      return true;
    }
    if (defaultStartTime) {
      if (!defaultEndTime) {
        return true;
      }
    }
  }
  function compareLunchTime() {
    if (
      moment(lunchEndTime, 'HH:mm').isBefore(moment(lunchStartTime, 'HH:mm')) ||
      moment(lunchStartTime, 'HH:mm').isAfter(moment('23:30', 'HH:mm')) ||
      moment(lunchStartTime, 'HH:mm').isAfter(moment(lunchEndTime, 'HH:mm')) ||
      moment(lunchEndTime, 'HH:mm').isBefore(moment('00:15', 'HH:mm'))
    ) {
      setLunchStartTime(undefined);
      setLunchEndTime(undefined);
      return true;
    }
    if (lunchStartTime) {
      if (!lunchEndTime) {
        return true;
      }
    }
  }
  function comparePriorityTime() {
    let state = false;
    const result = priorityTime.map(item => {
      if (
        moment(item.priority_end_time, 'HH:mm').isBefore(
          moment(item.priority_start_time, 'HH:mm'),
        )
      ) {
        item.priority_start_time = undefined;
        item.priority_end_time = undefined;
        state = true;
      }
      if (
        (item.priority_start_time && !item.priority_end_time) ||
        (item.priority_end_time && !item.priority_start_time)
      ) {
        item.priority_start_time = undefined;
        item.priority_end_time = undefined;
        state = true;
      }
      if (
        moment(`${today} ${item.priority_start_time}`).isBefore(
          moment(`${today} ${defaultStartTime}`),
        ) ||
        moment(`${today} ${item.priority_start_time}`).isBefore(
          moment(`${today} ${detailEventType.default_start_time}`),
        ) ||
        moment(`${today} ${item.priority_end_time}`).isAfter(
          moment(`${today} ${detailEventType.default_end_time}`),
        ) ||
        moment(`${today} ${item.priority_end_time}`).isAfter(
          moment(`${today} ${defaultEndTime}`),
        )
      ) {
        item.priority_start_time = undefined;
        item.priority_end_time = undefined;
        state = true;
      }
      return item;
    });
    setPriorityTime(result);
    return state;
  }
  function priorityDiffer() {
    let state = false;
    const result = priorityTime.map((item, index) => {
      priorityTime.map((item1, index1) => {
        if (index != index1) {
          if (
            moment(`${today} ${item.priority_start_time}`).isSame(
              moment(`${today} ${item1.priority_start_time}`),
            )
          ) {
            state = true;
            item.priority_start_time = undefined;
            item.priority_end_time = undefined;
          }
          if (
            moment(`${today} ${item.priority_end_time}`).isSame(
              moment(`${today} ${item1.priority_end_time}`),
            )
          ) {
            state = true;
            item.priority_start_time = undefined;
            item.priority_end_time = undefined;
          }
          if (
            moment(`${today} ${item.priority_start_time}`).isAfter(
              moment(`${today} ${item1.priority_start_time}`),
            ) &&
            moment(`${today} ${item.priority_end_time}`).isBefore(
              moment(`${today} ${item1.priority_end_time}`),
            )
          ) {
            item.priority_start_time = undefined;
            item.priority_end_time = undefined;
            state = true;
          }
        }
      });
      return item;
    });
    setPriorityTime(result);
    return state;
  }
  function updateScheduleSetting() {
    if (detailEventType) {
      if (
        compareDefaultTime() ||
        compareLunchTime() ||
        comparePriorityTime() ||
        priorityDiffer()
      ) {
        compareDefaultTime();
        compareLunchTime();
        comparePriorityTime();
        priorityDiffer();
        alert(formatMessage({ id: 'i18n_choose_available_time' }));
      } else {
        const payload = {
          data: {
            id: detailEventType.id,
            method: 'put',
            default_start_time: defaultStartTime,
            default_end_time: defaultEndTime,
            relax_time: relaxTime,
            period: period,
            reception_start_time: receptionStartTime,
            reception_end_time: receptionEndTime,
            lunch_break_start_time: lunchStartTime,
            lunch_break_end_time: lunchEndTime,
            reservation_number: reservationNumber,
            calendar_create_comment: calendarCreateComment,
            calendar_confirm_comment: calendarConfirmComment,
          },
        };
        payload.data.m_priority_times = priorityTime.filter(priority => {
          return priority.priority_start_time && priority.priority_end_time;
        });
        dispatch({
          type: 'EVENT/updateAdvancedSetting',
          payload,
        });
        props.addAdvancedSetting(false);
      }
    } else {
      const advancedSettingValue = {
        default_start_time: defaultStartTime,
        default_end_time: defaultEndTime,
        relax_time: relaxTime,
        period: period,
        reception_start_time: receptionStartTime,
        reception_end_time: receptionEndTime,
        lunch_break_start_time: lunchStartTime,
        lunch_break_end_time: lunchEndTime,
        reservation_number: reservationNumber,
        calendar_create_comment: calendarCreateComment,
        calendar_confirm_comment: calendarConfirmComment,
      };
      advancedSettingValue.m_priority_times = priorityTime.filter(priority => {
        return priority.priority_start_time && priority.priority_end_time;
      });
      // dispatch({ type: 'EVENT/createEventType', payload });
      props.getAdvancedSetting(advancedSettingValue);
      props.addAdvancedSetting(false);
    }
  }
  function cancelSetting() {
    props.addAdvancedSetting(false);
  }
  return (
    <div className={styles.advancedSetting}>
      <Collapse expandIconPosition="right" defaultActiveKey={['1', '2', '3']}>
        <Panel
          header={headerScheduleSetting}
          key="1"
          className={styles.collapse}
        >
          <div className={styles.listField}>
            <Row>
              <Col span={8}>
                <div className={styles.listFieldColumn}>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_working_time' })}</p>
                    </div>
                    <div className={styles.selections}>
                      <TimePicker
                        placeholder="例: 9:00"
                        format={format}
                        minuteStep={15}
                        suffixIcon={suffixIcon}
                        showNow={false}
                        inputReadOnly={true}
                        value={
                          moment(defaultStartTime, format).isValid()
                            ? moment(defaultStartTime, format)
                            : undefined
                        }
                        onChange={value => changeDefaultStartTime(value)}
                      />
                      <span className={styles.devideIcon}>〜</span>
                      <TimePicker
                        placeholder="例: 18:00"
                        format={format}
                        minuteStep={15}
                        suffixIcon={suffixIcon}
                        showNow={false}
                        inputReadOnly={true}
                        value={
                          moment(defaultEndTime, format).isValid()
                            ? moment(defaultEndTime, format)
                            : undefined
                        }
                        onChange={value => changeDefaultEndTime(value)}
                      />
                    </div>
                  </div>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>
                        {formatMessage({
                          id: 'i18n_time_to_start_welcome',
                        })}
                      </p>
                      <div className={styles.helper}>
                        <img src={helper} />
                        <div className={styles.helperTooltip}>
                          <img src={bubbleArrow} />
                          詳細メッセージ
                        </div>
                      </div>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        placeholder="例: 12時間後"
                        style={{ width: 120 }}
                        value={receptionStartTime}
                        onChange={value => changeReceptionStart(value)}
                      >
                        <Option value="1">時間</Option>
                        <Option value="3">3時間</Option>
                        <Option value="6">6時間</Option>
                        <Option value="12">12時間</Option>
                        <Option value="24">24時間</Option>
                        <Option value="">カスタム</Option>
                      </Select>
                    </div>
                  </div>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_ordered_amount' })}</p>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        placeholder="例: 1件"
                        style={{ width: 120 }}
                        value={reservationNumber}
                        onChange={value => changeReservationNumber(value)}
                      >
                        <Option value="50">50候補</Option>
                        <Option value="100">100候補</Option>
                        <Option value="150">3時間</Option>
                        <Option value="200">200候補</Option>
                        <Option value="250">250候補</Option>
                        <Option value="">カスタム </Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.listFieldColumn}>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <div className={styles.toolTipAdvanced}>
                        <p>{formatMessage({ id: 'i18n_break_time' })}</p>
                        <Tooltip
                          placement="top"
                          title={formatMessage({
                            id: 'i18n_break_time_tooltip',
                          })}
                        >
                          <img src={helper} />
                        </Tooltip>
                      </div>
                      <div className={styles.helper}>
                        <img src={helper} />
                        <div className={styles.helperTooltip}>
                          <img src={bubbleArrow} />
                          詳細メッセージ
                        </div>
                      </div>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        placeholder=" 例: 15分"
                        style={{ width: 120 }}
                        value={relaxTime}
                        onChange={value => changeRelaxTime(value)}
                      >
                        <Option value="15">15分</Option>
                        <Option value="30">30分</Option>
                        <Option value="45">45分</Option>
                        <Option value="60">60分</Option>
                        <Option value="">カスタム</Option>
                      </Select>
                    </div>
                  </div>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_snap' })}</p>
                    </div>
                    <div className={styles.selections}>
                      <TimePicker
                        placeholder="例: 9:00 "
                        format={format}
                        minuteStep={15}
                        suffixIcon={suffixIcon}
                        showNow={false}
                        inputReadOnly={true}
                        value={
                          moment(lunchStartTime, format).isValid()
                            ? moment(lunchStartTime, format)
                            : undefined
                        }
                        onChange={value => changeLunchStartTime(value)}
                      />
                      <span className={styles.devideIcon}>〜</span>
                      <TimePicker
                        placeholder="例: 18:00"
                        format={format}
                        minuteStep={15}
                        suffixIcon={suffixIcon}
                        showNow={false}
                        inputReadOnly={true}
                        value={
                          moment(lunchEndTime, format).isValid()
                            ? moment(lunchEndTime, format)
                            : undefined
                        }
                        onChange={value => changeLunchEndTime(value)}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.listFieldColumn}>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_stage' })}</p>
                      <div className={styles.helper}>
                        <img src={helper} />
                        <div className={styles.helperTooltip}>
                          <img src={bubbleArrow} />
                          詳細メッセージ
                        </div>
                      </div>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        placeholder="例: 3期間"
                        style={{ width: 120 }}
                        value={period}
                        onChange={value => changePeriodTime(value)}
                      >
                        <Option value="">設定なし</Option>
                        <Option value="1">1時間</Option>
                        <Option value="3">3時間</Option>
                        <Option value="12">12時間</Option>
                        <Option value="24">12時間</Option>
                        <Option value="">カスタム </Option>
                      </Select>
                    </div>
                  </div>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>
                        {formatMessage({ id: 'i18n_time_to_stop_welcome' })}
                      </p>
                      <div className={styles.helper}>
                        <img src={helper} />
                        <div className={styles.helperTooltip}>
                          <img src={bubbleArrow} />
                          詳細メッセージ
                        </div>
                      </div>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        placeholder="例: 1時間"
                        style={{ width: 120 }}
                        value={receptionEndTime}
                        onChange={value => changeReceptionEnd(value)}
                      >
                        <Option value="1">1週間</Option>
                        <Option value="2">2週間</Option>
                        <Option value="3">3時間</Option>
                        <Option value="4">4週間</Option>
                        <Option value="">カスタム </Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Col span={24}>
            <div className={styles.buttonZone}>
              <Button
                className={styles.cancelBtn}
                onClick={() => cancelSetting()}
              >
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
        </Panel>
        <Panel header={timeSetting} key="2" className={styles.collapse}>
          {priorityTime.map(priorityTimeItem => {
            return (
              <div className={styles.selectField} key={priorityTimeItem.status}>
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
                    format={format}
                    minuteStep={15}
                    suffixIcon={suffixIcon}
                    showNow={false}
                    inputReadOnly={true}
                    value={
                      moment(
                        priorityTimeItem.priority_start_time,
                        format,
                      ).isValid()
                        ? moment(priorityTimeItem.priority_start_time, format)
                        : undefined
                    }
                    onChange={value =>
                      changePriorityStartTime(value, priorityTimeItem.status)
                    }
                  />
                  <span className={styles.devideIcon}>〜</span>
                  <TimePicker
                    placeholder="例: 18:00"
                    format={format}
                    minuteStep={15}
                    suffixIcon={suffixIcon}
                    showNow={false}
                    inputReadOnly={true}
                    value={
                      moment(
                        priorityTimeItem.priority_end_time,
                        format,
                      ).isValid()
                        ? moment(priorityTimeItem.priority_end_time, format)
                        : undefined
                    }
                    onChange={value =>
                      changePriorityEndTime(value, priorityTimeItem.status)
                    }
                  />
                </div>
              </div>
            );
          })}
          <div className={styles.buttonZone}>
            <Button
              className={styles.cancelBtn}
              onClick={() => cancelSetting()}
            >
              {formatMessage({ id: 'i18n_cancel' })}
            </Button>
            <Button
              className={styles.saveBtn}
              onClick={() => updateScheduleSetting()}
            >
              {formatMessage({ id: 'i18n_set' })}
            </Button>
          </div>
        </Panel>
        <Panel
          header={messageSetting}
          key="3"
          className={`${styles.message} ${styles.collapse}`}
        >
          <p className={styles.intruction}>
            {formatMessage({ id: 'i18n_message_setting_intruction' })}
          </p>
          <div className={styles.textareaField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>
                {formatMessage({
                  id: 'i18n_message_announced_when_start_adjust',
                })}
              </p>
              <div className={styles.helper}>
                <img src={helper} />
                <div className={styles.helperTooltip}>
                  <img src={bubbleArrow} />
                  詳細メッセージ
                </div>
              </div>
            </div>
            <Input.TextArea
              placeholder={formatMessage({
                id: 'i18n_message_announced_when_start_adjust_placeholder',
              })}
              value={
                calendarCreateComment != null
                  ? calendarCreateComment
                  : formatMessage({
                      id:
                        'i18n_message_announced_when_start_adjust_placeholder',
                    })
              }
              onChange={event => changeCalendarCreateComment(event)}
            ></Input.TextArea>
          </div>
          <div className={styles.textareaField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>
                {formatMessage({
                  id: 'i18n_message_announced_when_stop_adjust',
                })}
              </p>
              <div className={styles.helper}>
                <img src={helper} />
                <div className={styles.helperTooltip}>
                  <img src={bubbleArrow} />
                  詳細メッセージ
                </div>
              </div>
            </div>
            <Input.TextArea
              placeholder={formatMessage({
                id: 'i18n_message_announced_when_stop_adjust_placeholder',
              })}
              value={
                calendarConfirmComment != null ? calendarConfirmComment : ''
              }
              onChange={event => changeCalendarConfirmComment(event)}
            ></Input.TextArea>
          </div>
          <div className={styles.buttonZone}>
            <Button
              className={styles.cancelBtn}
              onClick={() => cancelSetting()}
            >
              {formatMessage({ id: 'i18n_cancel' })}
            </Button>
            <Button
              className={styles.saveBtn}
              onClick={() => updateScheduleSetting()}
            >
              {formatMessage({ id: 'i18n_set' })}
            </Button>
          </div>
        </Panel>
      </Collapse>
      <div className={styles.buttonZone}>
        <Button className={styles.backBtn}>
          {formatMessage({ id: 'i18n_back' })}
        </Button>
      </div>
    </div>
  );
}

export default connect(({ EVENT }) => ({
  eventStore: EVENT,
}))(AdvancedSetting);
