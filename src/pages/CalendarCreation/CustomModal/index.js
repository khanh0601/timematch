import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { Input, Button, InputNumber, Modal, Form } from 'antd';
import { useIntl } from 'umi';
import { phoneNumberRegex } from '@/constant';
import btnDownImage from '@/assets/images/btnDown.png';
import btnUpImage from '@/assets/images/btnUp.png';

function CustomModal(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    customValue,
    isShow,
    onClose,
    onUpdate,
    modalTitle,
    inputType = 'text',
  } = props;
  const [currentValue, setCurrentValue] = useState(customValue);
  const [checkValid, setCheckValid] = useState(false);
  const [currentReceptionStartHour, setCurrentReceptionStartHour] = useState(1);
  const [
    currentReceptionStartMinute,
    setCurrentReceptionStartMinute,
  ] = useState(0);
  const [currentReceptionEndHour, setCurrentReceptionEndHour] = useState(1);
  const [currentReceptionEndMinute, setCurrentReceptionEndMinute] = useState(0);
  const [currentRelaxHour, setCurrentRelaxHour] = useState(1);
  const [currentRelaxMinute, setCurrentRelaxMinute] = useState(0);
  const [currentRequiredHour, setCurrentRequiredHour] = useState(1);
  const [currentRequiredMinute, setCurrentRequiredMinute] = useState(0);
  const [currentTravelHour, setCurrentTravelHour] = useState(1);
  const [currentTravelMinute, setCurrentTravelMinute] = useState(0);
  const [currentPeriodTime, setCurrentPeriodTime] = useState();
  const [currentReservation, setCurrentReservation] = useState();
  const [disableButton, setDisableButton] = useState(false);
  useEffect(() => {
    setCheckValid(false);
  }, []);
  const changeRequiredHourTime = value => {
    if (
      value * 60 + currentRequiredMinute <= 0 ||
      value < 0 ||
      (value > 23 && currentRequiredMinute > 0) ||
      value > 24 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentRequiredHour(value);
  };
  const changeRequiredMinuteTime = value => {
    if (
      value + currentRequiredHour * 60 <= 0 ||
      value < 0 ||
      (value > 0 && currentRequiredHour > 23) ||
      value > 60 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentRequiredMinute(value);
  };
  const changeTravelHour = value => {
    if (
      value * 60 + currentTravelMinute < 0 ||
      value < 0 ||
      (value > 23 && currentTravelMinute > 0) ||
      value > 24 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentTravelHour(value);
  };
  const changeTravelMinute = value => {
    if (
      value + currentTravelHour * 60 < 0 ||
      value < 0 ||
      (value > 0 && currentTravelHour > 23) ||
      value > 60 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentTravelMinute(value);
  };
  const changeReceptionStartHour = value => {
    if (
      value * 60 + currentReceptionStartMinute < 0 ||
      value < 0 ||
      (value > 23 && currentReceptionStartMinute > 0) ||
      value > 24 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentReceptionStartHour(value);
  };
  const changeReceptionStartMinute = value => {
    if (
      value + currentReceptionStartHour * 60 < 0 ||
      value < 0 ||
      (value > 0 && currentReceptionStartHour > 23) ||
      value > 60 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentReceptionStartMinute(value);
  };
  const changeReceptionEndHour = value => {
    if (
      value * 60 + currentReceptionEndMinute <= 0 ||
      value < 0 ||
      (value > 23 && currentReceptionEndMinute > 0) ||
      value > 24 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentReceptionEndHour(value);
  };
  const changeReceptionEndMinute = value => {
    if (
      value + currentReceptionEndHour * 60 <= 0 ||
      value < 0 ||
      (value > 0 && currentReceptionEndHour > 23) ||
      value > 60 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentReceptionEndMinute(value);
  };
  const changeRelaxHour = value => {
    if (
      value * 60 + currentRelaxMinute < 0 ||
      value < 0 ||
      (value > 23 && currentRelaxMinute > 0) ||
      value > 24 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentRelaxHour(value);
  };
  const changeRelaxMinute = value => {
    if (
      value + currentRelaxHour * 60 < 0 ||
      value < 0 ||
      (value > 0 && currentRelaxHour > 23) ||
      value > 60 ||
      isNaN(value)
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
    setCurrentRelaxMinute(value);
  };
  const updateValue = () => {
    setCheckValid(true);
    if (
      (inputType === 'phone' &&
        !phoneNumberRegex.test(currentValue.toString().trim())) ||
      !currentValue.toString().trim()
    ) {
      return false;
    }
    setCheckValid(false);
    onUpdate(currentValue);
    setCurrentValue('');
  };
  const updateReceptionStartValue = () => {
    const newSchedule =
      currentReceptionStartHour * 60 + currentReceptionStartMinute;
    onUpdate(newSchedule, 'reception_start');
  };
  const updateReceptionEndValue = () => {
    const newSchedule =
      currentReceptionEndHour * 60 + currentReceptionEndMinute;
    onUpdate(newSchedule);
  };
  const updateRelaxValue = () => {
    const newSchedule = currentRelaxHour * 60 + currentRelaxMinute;
    onUpdate(newSchedule, 'relax_time');
  };
  const updateRequiredValue = () => {
    const newSchedule = currentRequiredHour * 60 + currentRequiredMinute;
    onUpdate(newSchedule);
  };
  const updateTravelValue = () => {
    const newSchedule = currentTravelHour * 60 + currentTravelMinute;
    onUpdate(newSchedule, 'travel_time');
  };
  const updatePeriodValue = () => {
    setCheckValid(true);
    if (
      (inputType === 'period' &&
        !phoneNumberRegex.test(currentPeriodTime.toString().trim())) ||
      !currentPeriodTime.toString().trim()
    ) {
      return false;
    }
    setCheckValid(false);
    onUpdate(currentPeriodTime);
    setCurrentValue('');
  };
  const updateReservationValue = () => {
    setCheckValid(true);
    if (
      (inputType === 'reservation' &&
        !phoneNumberRegex.test(currentReservation.toString().trim())) ||
      !currentReservation.toString().trim()
    ) {
      return false;
    }
    setCheckValid(false);
    onUpdate(currentReservation);
    setCurrentValue('');
  };
  const onCloseModal = () => {
    setCurrentValue(null);
    onClose();
  };
  return (
    <div className={styles.customModal}>
      <Modal
        title={
          inputType === 'reception_start' ||
          inputType === 'reception_end' ||
          inputType === 'relax_time' ||
          inputType === 'required_time' ||
          inputType === 'travel_time'
            ? ''
            : modalTitle
        }
        wrapClassName={
          inputType === 'period' || inputType === 'reservation'
            ? 'modalPeriod'
            : ''
        }
        visible={isShow}
        closable={false}
        footer={null}
        width={
          inputType === 'reception_start' ||
          inputType === 'reception_end' ||
          inputType === 'relax_time' ||
          inputType === 'required_time' ||
          inputType === 'travel_time'
            ? 1000
            : 600
        }
      >
        {inputType === 'text' && (
          <Input
            value={currentValue}
            onChange={event => setCurrentValue(event.target.value)}
          />
        )}
        {inputType === 'phone' && (
          <>
            <Input
              value={currentValue}
              onChange={event => setCurrentValue(event.target.value)}
            />
            {!phoneNumberRegex.test(currentValue) && checkValid && (
              <span className={styles.errorNotice}>
                {formatMessage({ id: 'i18n_wrong_phone_number' })}
              </span>
            )}
          </>
        )}
        {inputType !== 'text' &&
          inputType !== 'phone' &&
          inputType !== 'reception_start' &&
          inputType !== 'reception_end' &&
          inputType !== 'relax_time' &&
          inputType !== 'period' &&
          inputType !== 'reservation' &&
          inputType !== 'required_time' &&
          inputType !== 'travel_time' && (
            <InputNumber
              value={currentValue}
              onChange={value => setCurrentValue(value)}
              min={0}
              max={1440}
              className={styles.modalInputNumber}
            />
          )}
        {inputType === 'required_time' && (
          <div className={styles.changeTime}>
            <div className={styles.center}>
              <div className={styles.title}>
                {formatMessage({ id: 'i18n_custom_setting' })}
              </div>
              <div className={styles.description}>
                <img src={btnDownImage} />
                <span>・</span>
                <img src={btnUpImage} />
                <div>{formatMessage({ id: 'i18n_schedule_custom_value' })}</div>
              </div>
              <div className={styles.description2}>
                {formatMessage({ id: 'i18n_schedule_custom_value_2' })}
              </div>
              <Form className={styles.form}>
                <Form.Item>
                  <InputNumber
                    min={0}
                    max={24}
                    value={currentRequiredHour}
                    onChange={value => changeRequiredHourTime(value)}
                  />
                  <span className={styles.text}>時間</span>
                  <InputNumber
                    min={0}
                    max={60}
                    value={currentRequiredMinute}
                    onChange={value => changeRequiredMinuteTime(value)}
                  />
                  <span className={styles.text}>分</span>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
        {inputType === 'travel_time' && (
          <div className={styles.changeTime}>
            <div className={styles.center}>
              <div className={styles.title}>
                {formatMessage({ id: 'i18n_custom_setting' })}
              </div>
              <div className={styles.description}>
                <img src={btnDownImage} />
                <span>・</span>
                <img src={btnUpImage} />
                <div>{formatMessage({ id: 'i18n_schedule_custom_value' })}</div>
              </div>
              <div className={styles.description2}>
                {formatMessage({ id: 'i18n_schedule_custom_value_2' })}
              </div>
              <Form className={styles.form}>
                <Form.Item>
                  <InputNumber
                    min={0}
                    max={23}
                    value={currentTravelHour}
                    onChange={value => changeTravelHour(value)}
                  />
                  <span className={styles.text}>時間</span>
                  <InputNumber
                    min={0}
                    max={59}
                    value={currentTravelMinute}
                    onChange={value => changeTravelMinute(value)}
                  />
                  <span className={styles.text}>分</span>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
        {inputType === 'reception_start' && (
          <div className={styles.changeTime}>
            <div className={styles.center}>
              <div className={styles.title}>
                {formatMessage({ id: 'i18n_custom_setting' })}
              </div>
              <div className={styles.description}>
                <img src={btnDownImage} />
                <span>・</span>
                <img src={btnUpImage} />
                <div>{formatMessage({ id: 'i18n_schedule_custom_value' })}</div>
              </div>
              <div className={styles.description2}>
                {formatMessage({ id: 'i18n_schedule_custom_value_2' })}
              </div>
              <Form className={styles.form}>
                <Form.Item>
                  <InputNumber
                    min={0}
                    max={23}
                    value={currentReceptionStartHour}
                    onChange={value => changeReceptionStartHour(value)}
                  />
                  <span className={styles.text}>時間</span>
                  <InputNumber
                    min={0}
                    max={59}
                    value={currentReceptionStartMinute}
                    onChange={value => changeReceptionStartMinute(value)}
                  />
                  <span className={styles.text}>分</span>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
        {inputType === 'reception_end' && (
          <div className={styles.changeTime}>
            <div className={styles.center}>
              <div className={styles.title}>
                {formatMessage({ id: 'i18n_custom_setting' })}
              </div>
              <div className={styles.description}>
                <img src={btnDownImage} />
                <span>・</span>
                <img src={btnUpImage} />
                <div>{formatMessage({ id: 'i18n_schedule_custom_value' })}</div>
              </div>
              <div className={styles.description2}>
                {formatMessage({ id: 'i18n_schedule_custom_value_2' })}
              </div>
              <Form className={styles.form}>
                <Form.Item>
                  <InputNumber
                    min={0}
                    max={23}
                    value={currentReceptionEndHour}
                    onChange={value => changeReceptionEndHour(value)}
                  />
                  <span className={styles.text}>時間</span>
                  <InputNumber
                    min={0}
                    max={59}
                    value={currentReceptionEndMinute}
                    onChange={value => changeReceptionEndMinute(value)}
                  />
                  <span className={styles.text}>分</span>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
        {inputType === 'relax_time' && (
          <div className={styles.changeTime}>
            <div className={styles.center}>
              <div className={styles.title}>
                {formatMessage({ id: 'i18n_custom_setting' })}
              </div>
              <div className={styles.description}>
                <img src={btnDownImage} />
                <span>・</span>
                <img src={btnUpImage} />
                <div>{formatMessage({ id: 'i18n_schedule_custom_value' })}</div>
              </div>
              <div className={styles.description2}>
                {formatMessage({ id: 'i18n_schedule_custom_value_2' })}
              </div>
              <Form className={styles.form}>
                <Form.Item>
                  <InputNumber
                    min={0}
                    max={23}
                    value={currentRelaxHour}
                    onChange={value => changeRelaxHour(value)}
                  />
                  <span className={styles.text}>時間</span>
                  <InputNumber
                    min={0}
                    max={59}
                    value={currentRelaxMinute}
                    onChange={value => changeRelaxMinute(value)}
                  />
                  <span className={styles.text}>分</span>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
        {inputType === 'period' && (
          <div className="inputCustomValue">
            <div className="customTitleDescript">
              {formatMessage({ id: 'i18n_custom_descript_title' })}
            </div>
            <Input
              value={currentPeriodTime ? currentPeriodTime : undefined}
              onChange={event =>
                setCurrentPeriodTime(parseInt(event.target.value))
              }
            />
            <div className="inputCustomValueText">週間</div>
            {!phoneNumberRegex.test(currentPeriodTime) && checkValid && (
              <span className={styles.errorNotice}>
                {formatMessage({ id: 'i18n_message_invalid_syntax_number' })}
              </span>
            )}
          </div>
        )}
        {inputType === 'reservation' && (
          <div className="inputCustomValue">
            <div className="customTitleDescript">
              {formatMessage({ id: 'i18n_custom_descript_title' })}
            </div>
            <Input
              value={currentReservation ? currentReservation : undefined}
              onChange={event =>
                setCurrentReservation(parseInt(event.target.value))
              }
            />
            <div className="inputCustomValueText">候補</div>
            {!phoneNumberRegex.test(currentReservation) && checkValid && (
              <span className={styles.errorNotice}>
                {formatMessage({ id: 'i18n_message_invalid_syntax_number' })}
              </span>
            )}
          </div>
        )}
        <div className={styles.btnZoneModal}>
          {inputType === 'required_time' && (
            <>
              <Button
                className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={onClose}
              >
                {formatMessage({ id: 'i18n_cancel_text' })}
              </Button>
              <Button
                className={`${styles.updateScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={() => updateRequiredValue()}
                disabled={disableButton ? true : false}
              >
                {formatMessage({ id: 'i18n_update' })}
              </Button>
            </>
          )}
          {inputType === 'travel_time' && (
            <>
              <Button
                className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={onClose}
              >
                {formatMessage({ id: 'i18n_cancel_text' })}
              </Button>
              <Button
                className={`${styles.updateScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={() => updateTravelValue()}
                disabled={disableButton ? true : false}
              >
                {formatMessage({ id: 'i18n_update' })}
              </Button>
            </>
          )}
          {inputType === 'reception_start' && (
            <>
              <Button
                className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={onClose}
              >
                {formatMessage({ id: 'i18n_cancel_text' })}
              </Button>
              <Button
                className={`${styles.updateScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={() => updateReceptionStartValue()}
                disabled={disableButton ? true : false}
              >
                {formatMessage({ id: 'i18n_update' })}
              </Button>
            </>
          )}
          {inputType === 'reception_end' && (
            <>
              <Button
                className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={onClose}
              >
                {formatMessage({ id: 'i18n_cancel_text' })}
              </Button>
              <Button
                className={`${styles.updateScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={() => updateReceptionEndValue()}
                disabled={disableButton ? true : false}
              >
                {formatMessage({ id: 'i18n_update' })}
              </Button>
            </>
          )}
          {inputType === 'relax_time' && (
            <>
              <Button
                className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={onClose}
              >
                {formatMessage({ id: 'i18n_cancel_text' })}
              </Button>
              <Button
                className={`${styles.updateScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={() => updateRelaxValue()}
                disabled={disableButton ? true : false}
              >
                {formatMessage({ id: 'i18n_update' })}
              </Button>
            </>
          )}
          {inputType === 'period' && (
            <>
              <Button
                className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={onClose}
              >
                {formatMessage({ id: 'i18n_cancel_text' })}
              </Button>
              <Button
                className={`${styles.updateScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={() => updatePeriodValue()}
              >
                {formatMessage({ id: 'i18n_update' })}
              </Button>
            </>
          )}
          {inputType === 'reservation' && (
            <>
              <Button
                className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={onClose}
              >
                {formatMessage({ id: 'i18n_cancel_text' })}
              </Button>
              <Button
                className={`${styles.updateScheduleBtn} ${styles.btnScheduleTime}`}
                onClick={() => updateReservationValue()}
              >
                {formatMessage({ id: 'i18n_update' })}
              </Button>
            </>
          )}
          {inputType !== 'reception_start' &&
            inputType !== 'reception_end' &&
            inputType !== 'relax_time' &&
            inputType !== 'period' &&
            inputType !== 'reservation' &&
            inputType !== 'required_time' &&
            inputType !== 'travel_time' && (
              <>
                <Button
                  className={styles.updateBtn}
                  onClick={() => updateValue()}
                  disabled={currentValue && !currentValue.toString().trim()}
                >
                  {formatMessage({ id: 'i18n_update' })}
                </Button>
                <Button
                  className={styles.cancelBtn}
                  onClick={() => onCloseModal()}
                >
                  {formatMessage({ id: 'i18n_cancel' })}
                </Button>
              </>
            )}
        </div>
      </Modal>
    </div>
  );
}

export default CustomModal;
