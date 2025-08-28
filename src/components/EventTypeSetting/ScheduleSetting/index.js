import React, { useState } from 'react';
import { connect } from 'dva';
import { useIntl } from 'umi';

import { Row, Col, Select, Button } from 'antd';
import TimePicker from './components/TimePicker';
import Label from './components/Label';
import TimeModal from './components/TimeModal';
import LocationModal from './components/LocationModal';

import {
  defaultReceptionStart,
  defaultRelaxTime,
  defaultPeriod,
  defaultReservation,
  defaultMinVote,
} from './constants';

import {
  setDefaultEndTime,
  setDefaultStartTime,
  setLunchBreakEndTime,
  setLunchBreakStartTime,
  setRelaxTime,
  setMinVote,
  setPeriod,
  setReceptionEndTime,
  setReceptionStartTime,
  setReservationNumber,
  displayHourMinute,
  setState,
} from './actions';
import { saveAdvencedSetting } from '@/pages/CalendarCreation/actions';

import styles from '../advanced_styles.less';
import moment from 'moment';
import TooltipFormat from '../../TooltipFormat';

const listDataTooltipMinVote = [
  '投票相手が投票する際に、必要な最低投票数を設定できます。日程調整相手が選択した日数がこれより少ない場合、アラートが表示されます。',
  '例：最低投票数を3つで設定した後、投票相手が1つで進めると、アラートを表示され日程調整する上で大変便利です。',
];

function ScheduleSetting(props) {
  const { formatMessage } = useIntl();
  const {
    // props
    onClose,
    relationshipType,
    // state
    scheduleSetting,
    messageSetting,
    timeSetting,
    calendarStore,
    // actions
    onSetDefaultEndTime,
    onSetDefaultStartTime,
    onSetLunchBreakEndTime,
    onSetLunchBreakStartTime,
    onSetRelaxTime,
    onSetMinVote,
    onSetPeriod,
    onSetReceptionStartTime,
    onSetReservationNumber,
    onResetState,
    onSave,
  } = props;

  const [errorDefaultTime, setErrorDefaultTime] = useState(false);
  const [errorLunchTime, setErrorLunchTime] = useState(false);
  // modal
  const [relaxModal, setRelaxModal] = useState(false);
  const [receptionStartModal, setReceptionStartModal] = useState(false);
  const [minVoteModal, setMinVoteModal] = useState(false);
  const [periodModal, setPeriodModal] = useState(false);
  const [reservationModal, setReservationModal] = useState(false);

  const onSaveSetting = () => {
    let isValid = true;
    if (
      scheduleSetting.default_start_time ||
      scheduleSetting.default_end_time
    ) {
      if (
        !scheduleSetting.default_start_time ||
        !scheduleSetting.default_end_time ||
        moment(scheduleSetting.default_start_time, 'HH:mm').isSameOrAfter(
          moment(scheduleSetting.default_end_time, 'HH:mm'),
        )
      ) {
        setErrorDefaultTime(true);
        isValid = false;
      } else {
        setErrorDefaultTime(false);
      }
    }

    if (
      scheduleSetting.lunch_break_start_time ||
      scheduleSetting.lunch_break_end_time
    ) {
      if (
        !scheduleSetting.lunch_break_end_time ||
        !scheduleSetting.lunch_break_start_time ||
        moment(scheduleSetting.lunch_break_start_time, 'HH:mm').isSameOrAfter(
          moment(scheduleSetting.lunch_break_end_time, 'HH:mm'),
        )
      ) {
        setErrorLunchTime(true);
        isValid = false;
      } else {
        setErrorLunchTime(false);
      }
    }

    for (let property in scheduleSetting) {
      if (scheduleSetting[property] === undefined) {
        scheduleSetting[property] = null;
      }
    }

    if (isValid) {
      onSave(scheduleSetting, messageSetting, timeSetting);
      onClose();
    }
  };

  return (
    <div className={styles.listField}>
      <Row>
        <Col lg={8} md={9} sm={24} xs={24}>
          <div className={styles.listFieldColumn}>
            <div className={styles.selectField}>
              <Label
                label={formatMessage({ id: 'i18n_working_time' })}
                tooltip={formatMessage({ id: 'i18n_working_time_tooltip' })}
              />
              <div className={styles.selections}>
                <TimePicker
                  placeholder={formatMessage({
                    id: 'i18n_default_start_time_placeholder',
                  })}
                  onChange={onSetDefaultStartTime}
                  value={scheduleSetting.default_start_time}
                />
                <span className={styles.devideIcon}>〜</span>
                <TimePicker
                  placeholder={formatMessage({
                    id: 'i18n_default_end_time_placeholder',
                  })}
                  onChange={onSetDefaultEndTime}
                  value={scheduleSetting.default_end_time}
                />
                {errorDefaultTime && (
                  <div className="errorMessage">
                    {formatMessage({ id: 'i18n_error_message_default_time' })}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.selectField}>
              <Label
                label={formatMessage({ id: 'i18n_time_to_start_welcome' })}
                tooltip={formatMessage({
                  id: 'i18n_time_to_start_welcome_tooltip',
                })}
              />
              <div className={styles.selections}>
                <Select
                  placeholder={formatMessage({
                    id: 'i18n_reception_start_placeholder',
                  })}
                  className={styles.width120}
                  value={displayHourMinute(
                    scheduleSetting.reception_start_time,
                  )}
                  onChange={onSetReceptionStartTime}
                  allowClear={true}
                >
                  {defaultReceptionStart.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.id}>
                        <div
                          onClick={() =>
                            item.id == 7 ? setReceptionStartModal(true) : null
                          }
                        >
                          {item.id !== 7
                            ? displayHourMinute(item.value)
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            {relationshipType === 3 && (
              <div className={styles.selectField}>
                <Label
                  label={formatMessage({ id: 'i18n_min_vote' })}
                  tooltip={
                    <TooltipFormat dataFormat={listDataTooltipMinVote} />
                  }
                />
                <div className={styles.selections}>
                  <Select
                    placeholder={formatMessage({
                      id: 'i18n_min_vote_placeholder',
                    })}
                    className={styles.width120}
                    value={
                      scheduleSetting.min_vote
                        ? `${scheduleSetting.min_vote}${formatMessage({
                            id: 'i18n_votes',
                          })}`
                        : null
                    }
                    onChange={onSetMinVote}
                    allowClear={true}
                  >
                    {defaultMinVote.map(item => {
                      return (
                        <Select.Option value={item.value} key={item.id}>
                          <div
                            onClick={() =>
                              item.id === 4 ? setMinVoteModal(true) : null
                            }
                          >
                            {item.id !== 4
                              ? `${item.value}${formatMessage({
                                  id: 'i18n_votes',
                                })}`
                              : formatMessage({ id: 'i18n_custom' })}
                          </div>
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col lg={8} md={9} sm={24} xs={24}>
          <div className={styles.listFieldColumn}>
            <div className={styles.selectField}>
              <Label
                label={formatMessage({ id: 'i18n_break_time' })}
                tooltip={formatMessage({ id: 'i18n_break_time_tooltip' })}
              />
              <div className={styles.selections}>
                <Select
                  placeholder={formatMessage({
                    id: 'i18n_relax_time_placeholder',
                  })}
                  className={styles.width120}
                  value={displayHourMinute(scheduleSetting.relax_time)}
                  onChange={onSetRelaxTime}
                  allowClear={true}
                >
                  {defaultRelaxTime.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.id}>
                        <div
                          onClick={() =>
                            item.id === 6 ? setRelaxModal(true) : null
                          }
                        >
                          {item.id !== 6
                            ? displayHourMinute(item.value)
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className={styles.selectField}>
              <Label
                label={formatMessage({ id: 'i18n_snap' })}
                tooltip={formatMessage({ id: 'i18n_snap_tooltip' })}
              />
              <div className={styles.selections}>
                <TimePicker
                  placeholder={formatMessage({
                    id: 'i18n_lunch_start_placeholder',
                  })}
                  onChange={onSetLunchBreakStartTime}
                  value={scheduleSetting.lunch_break_start_time}
                />
                <span className={styles.devideIcon}>〜</span>
                <TimePicker
                  placeholder={formatMessage({
                    id: 'i18n_lunch_end_placeholder',
                  })}
                  onChange={onSetLunchBreakEndTime}
                  value={scheduleSetting.lunch_break_end_time}
                />
                {errorLunchTime && (
                  <div className="errorMessage">
                    {formatMessage({ id: 'i18n_error_message_lunch_time' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Col>
        <Col lg={8} md={6} sm={24} xs={24}>
          <div className={styles.listFieldColumn}>
            <div className={styles.selectField}>
              <Label
                label={formatMessage({ id: 'i18n_stage' })}
                tooltip={formatMessage({ id: 'i18n_stage_tooltip' })}
              />
              <div className={styles.selections}>
                <Select
                  placeholder={formatMessage({ id: 'i18n_period_placeholder' })}
                  className={styles.width120}
                  value={
                    scheduleSetting.period
                      ? `${scheduleSetting.period}${formatMessage({
                          id: 'i18n_weekly',
                        })}`
                      : null
                  }
                  onChange={onSetPeriod}
                  allowClear={true}
                >
                  {defaultPeriod.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.id}>
                        <div
                          onClick={() =>
                            item.id === 5 ? setPeriodModal(true) : null
                          }
                        >
                          {item.id !== 5
                            ? `${item.value}${formatMessage({
                                id: 'i18n_weekly',
                              })}`
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className={styles.selectField}>
              <Label
                label={formatMessage({ id: 'i18n_ordered_amount' })}
                tooltip={formatMessage({ id: 'i18n_ordered_amount_tooltip' })}
              />
              <div className={styles.selections}>
                <Select
                  placeholder={formatMessage({
                    id: 'i18n_reservation_placeholder',
                  })}
                  className={styles.width120}
                  value={
                    scheduleSetting.reservation_number
                      ? `${scheduleSetting.reservation_number}${formatMessage({
                          id: 'i18n_candidate',
                        })}`
                      : null
                  }
                  onChange={onSetReservationNumber}
                  allowClear={true}
                >
                  {defaultReservation.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.id}>
                        <div
                          onClick={() =>
                            item.id === 6 ? setReservationModal(true) : null
                          }
                        >
                          {item.id !== 6
                            ? `${item.value}${formatMessage({
                                id: 'i18n_candidate',
                              })}`
                            : formatMessage({ id: 'i18n_custom' })}
                        </div>
                      </Select.Option>
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
          <Button className={styles.cancelBtn} onClick={onClose}>
            {formatMessage({ id: 'i18n_cancel' })}
          </Button>
          <Button
            className={styles.cancelBtn}
            onClick={() => onResetState(calendarStore.scheduleSetting)}
          >
            {formatMessage({ id: 'i18n_clear' })}
          </Button>
          <Button className={styles.saveBtn} onClick={onSaveSetting}>
            {formatMessage({ id: 'i18n_set' })}
          </Button>
        </div>
      </Col>
      {/* Modal */}
      <TimeModal
        value={scheduleSetting.relax_time}
        visible={relaxModal}
        onChange={value => {
          onSetRelaxTime(value);
          setRelaxModal(false);
        }}
        onClose={() => {
          onSetRelaxTime(null);
          setRelaxModal(false);
        }}
      />
      <TimeModal
        value={scheduleSetting.reception_start_time}
        visible={receptionStartModal}
        onChange={value => {
          onSetReceptionStartTime(value);
          setReceptionStartModal(false);
        }}
        onClose={() => {
          onSetReceptionStartTime(null);
          setReceptionStartModal(false);
        }}
      />
      <TimeModal
        value={scheduleSetting.min_vote}
        visible={minVoteModal}
        onChange={value => {
          onSetMinVote(value);
          setMinVoteModal(false);
        }}
        onClose={() => {
          onSetMinVote(null);
          setMinVoteModal(false);
        }}
      />
      <LocationModal
        placeholder="候補"
        value={scheduleSetting.reservation_number}
        visible={reservationModal}
        onChange={value => {
          onSetReservationNumber(value);
          setReservationModal(false);
        }}
        onClose={() => {
          onSetReservationNumber(null);
          setReservationModal(false);
        }}
      />
      <LocationModal
        placeholder="週間"
        value={scheduleSetting.period}
        visible={periodModal}
        onChange={value => {
          onSetPeriod(value);
          setPeriodModal(false);
        }}
        onClose={() => {
          onSetPeriod(null);
          setPeriodModal(false);
        }}
      />
    </div>
  );
}

const mapStateToProps = ({
  SCHEDULE_SETTING,
  MESSAGE_SETTING,
  TIME_SETTING,
  CALENDAR_CREATION,
}) => ({
  scheduleSetting: SCHEDULE_SETTING,
  messageSetting: MESSAGE_SETTING,
  timeSetting: TIME_SETTING,
  calendarStore: CALENDAR_CREATION,
});

function mapDispatchToProps(dispatch) {
  return {
    onSetDefaultEndTime: value => dispatch(setDefaultEndTime(value)),
    onSetDefaultStartTime: value => dispatch(setDefaultStartTime(value)),
    onSetLunchBreakEndTime: value => dispatch(setLunchBreakEndTime(value)),
    onSetLunchBreakStartTime: value => dispatch(setLunchBreakStartTime(value)),
    onSetRelaxTime: value => dispatch(setRelaxTime(value)),
    onSetMinVote: value => dispatch(setMinVote(value)),
    onSetPeriod: value => dispatch(setPeriod(value)),
    onSetReceptionEndTime: value => dispatch(setReceptionEndTime(value)),
    onSetReceptionStartTime: value => dispatch(setReceptionStartTime(value)),
    onSetReservationNumber: value => dispatch(setReservationNumber(value)),
    onResetState: value => dispatch(setState(value)),
    onSave: (...props) => dispatch(saveAdvencedSetting(...props)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleSetting);
