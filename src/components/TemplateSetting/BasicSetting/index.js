import React, { useEffect, useState } from 'react';
import styles from '../basic_styles.less';
import { Select, Button, Spin } from 'antd';
import { useIntl, history } from 'umi';
import { profileFromStorage } from '../../../commons/function';
import {
  onSetCheckAccountMicrosoft,
  setBasicSettingBlockNumber,
  setBasicSettingBlockTime,
  setBasicSettingCategory,
  setBasicSettingLocation,
  setBasicSettingLocationName,
  setBasicSettingManual,
  setBasicSettingMoveNumber,
  setBasicSettingMoveTime,
  setBasicSettingName,
} from '../../EventTypeSetting/BasicSetting/actions';
import { connect } from 'dva';
import config from '@/config';

function BasicSetting(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { Option } = Select;

  const {
    listEventLocation,
    listEventCategories,
    listEventBlockTime,
    listEventMoveTime,
    profile,
    eventTypeName,
    setEventTypeName,
    checkValidate,
    meetingFormat,
    setMeetingFormat,
    meetingPlace,
    setMeetingPlace,
    setShowModalCustom,
    setModalInputType,
    setCurrentModalTitle,
    setCurrentModalType,
    customPhoneNumber,
    customLocation,
    customPlaceName,
    customRequiredTime,
    customTravelTime,
    requiredTime,
    setRequiredTime,
    travelTime,
    setTravelTime,
    onlyTemplate,
    updateBasicSetting,
    templateStatus,
    urlMeet,
    urlZoom,
    onCancelTemp,
    calendarStore,
    onCheckAccountMicrosoft,
  } = props;
  const { checkAccountMicroSoft, loading } = calendarStore;
  const { is_link_google, is_link_zoom } = profileFromStorage();
  const [showMessageLocation, setShowMessageLocation] = useState(false);
  // URL Microsoft Team
  const redirectUri = `${window.location.protocol}//${window.location.host}/msteam-login-success`;
  const urlMSTeam = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.MICROSOFT_CLIENT_KEY}&scope=User.Read Calendars.Read Calendars.ReadWrite offline_access&response_type=code&redirect_uri=${redirectUri}&state=ClientStateGoesHere&prompt=login`;

  useEffect(() => {
    const { isCallApi, isChecked } = checkAccountMicroSoft;
    if (meetingPlace === 6) {
      if (!isCallApi) {
        onCheckAccountMicrosoft();
        return;
      }
      if (isCallApi) {
        if (isChecked && showMessageLocation) {
          setShowMessageLocation(false);
        }
        if (!isChecked && !showMessageLocation) {
          setShowMessageLocation(true);
        }
      }
    }
  }, [meetingPlace]);

  useEffect(() => {
    const { isChecked } = checkAccountMicroSoft;
    if (meetingPlace === 6) {
      if (!isChecked) {
        setShowMessageLocation(true);
      }
      if (isChecked) {
        setShowMessageLocation(false);
      }
    }
  }, [calendarStore]);

  return (
    <Spin spinning={loading}>
      <div
        className={`${styles.calendarInfoContainer} ${
          templateStatus ? styles.templateContent : ''
        }`}
      >
        <div className={`${styles.moreInput} ${styles.basicSettingTemp}`}>
          <div className={styles.inputField}>
            <div className={styles.fieldIcon} />
            <p>{formatMessage({ id: 'i18n_meeting_format' })}</p>
            <div className={styles.moreInputField}>
              <Select
                className={styles.selectInput}
                value={meetingFormat}
                allowClear={true}
                onChange={value => setMeetingFormat(value)}
                placeholder={formatMessage({ id: 'i18n_meeting_format' })}
              >
                {listEventCategories.map(category => {
                  return (
                    <Option value={category.id} key={category.id}>
                      <img
                        src={category.image}
                        className={styles.imageEventTypeIcon}
                      />
                      {category.name}
                    </Option>
                  );
                })}
              </Select>
              {!meetingFormat && checkValidate && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_required_text' })}
                </span>
              )}
            </div>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldIcon}></div>
            <p>{formatMessage({ id: 'i18n_meeting_place' })}</p>
            <div className={styles.moreInputField}>
              <Select
                className={styles.selectInput}
                value={meetingPlace}
                allowClear={true}
                onChange={value => setMeetingPlace(value)}
                placeholder={formatMessage({ id: 'i18n_meeting_place' })}
              >
                {listEventLocation.map(location => {
                  return (
                    <Option value={location.id} key={location.id}>
                      {
                        <div
                          onClick={async () => {
                            if (location.id === 5 && meetingPlace !== 5) {
                              setShowModalCustom(true);
                              setModalInputType('text');
                              setCurrentModalTitle(
                                formatMessage({
                                  id: 'i18n_custom_location_other',
                                }),
                              );
                              setCurrentModalType('place');
                            }
                            if (location.id === 3 && meetingPlace !== 3) {
                              setShowModalCustom(true);
                              setModalInputType('phone');
                              setCurrentModalTitle(
                                formatMessage({ id: 'i18n_custom_location' }),
                              );
                              setCurrentModalType('phone');
                            }
                            if (location.id === 4 && meetingPlace !== 4) {
                              setShowModalCustom(true);
                              setModalInputType('text');
                              setCurrentModalTitle(
                                formatMessage({ id: 'i18n_custom_location' }),
                              );
                              setCurrentModalType('location');
                            }
                          }}
                        >
                          <img
                            src={location.image}
                            className={styles.imageEventTypeIcon}
                          />
                          {location.name}
                          {customPhoneNumber &&
                            location.id === 3 &&
                            ` (${customPhoneNumber})`}
                          {customLocation &&
                            location.id === 4 &&
                            ` (${customLocation})`}
                          {customPlaceName &&
                            location.id === 5 &&
                            ` (${customPlaceName})`}
                        </div>
                      }
                    </Option>
                  );
                })}
              </Select>

              {!meetingPlace && checkValidate && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_required_notice' })}
                </span>
              )}

              {!is_link_google && meetingPlace === 2 && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_to_connect_google_meet' })}
                  <a href={urlMeet} target="_blank">
                    {formatMessage({ id: 'i18n_here' })}
                  </a>
                </span>
              )}

              {!is_link_zoom && meetingPlace === 1 && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_zoom_not_connected' })}{' '}
                  {formatMessage({ id: 'i18n_to_connect_zoom' })}
                  <a href={urlZoom} target="_blank">
                    {formatMessage({ id: 'i18n_here' })}
                  </a>
                </span>
              )}

              {showMessageLocation && meetingPlace === 6 && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_microsoft_teams_not_connected' })}{' '}
                  {formatMessage({ id: 'i18n_to_connect_microsoft_teams' })}
                  <a href={urlMSTeam} target="_blank">
                    {formatMessage({ id: 'i18n_here' })}
                  </a>
                </span>
              )}
            </div>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldIcon}></div>
            <p>{formatMessage({ id: 'i18n_required_time' })}</p>
            <div className={styles.moreInputField}>
              <Select
                className={styles.selectInput}
                value={requiredTime}
                allowClear={true}
                onChange={value => setRequiredTime(value)}
                placeholder={formatMessage({ id: 'i18n_required_time' })}
              >
                {listEventBlockTime.map(block_time => {
                  return (
                    <Option value={block_time.id} key={block_time.id}>
                      <div
                        onClick={() => {
                          if (block_time.id === 6 && requiredTime !== 6) {
                            setShowModalCustom(true);
                            setCurrentModalTitle(
                              formatMessage({
                                id: 'i18n_custom_required_time',
                              }),
                            );
                            setModalInputType('required_time');
                            setCurrentModalType('required_time');
                          }
                        }}
                      >
                        {block_time.block_name}
                        {customRequiredTime &&
                          block_time.id === 6 &&
                          ` (${customRequiredTime}${formatMessage({
                            id: 'i18n_minute',
                          })})`}
                      </div>
                    </Option>
                  );
                })}
              </Select>
              {!requiredTime && checkValidate && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_required_notice' })}
                </span>
              )}
            </div>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldIcon}></div>
            <p>{formatMessage({ id: 'i18n_travel_time' })}</p>
            <div className={styles.moreInputField}>
              <Select
                className={styles.selectInput}
                value={travelTime}
                allowClear={true}
                onChange={value => setTravelTime(value ? value : null)}
                placeholder={formatMessage({ id: 'i18n_travel_time' })}
              >
                {listEventMoveTime.map(move_time => {
                  return (
                    <Option value={move_time.id} key={move_time.id}>
                      <div
                        onClick={() => {
                          if (move_time.id === 7 && travelTime !== 7) {
                            setShowModalCustom(true);
                            setCurrentModalTitle(
                              formatMessage({ id: 'i18n_custom_travel_time' }),
                            );
                            setModalInputType('travel_time');
                            setCurrentModalType('travel_time');
                          }
                        }}
                      >
                        {move_time.move_name}
                        {customTravelTime !== null && move_time.id === 7
                          ? `(${customTravelTime}${formatMessage({
                              id: 'i18n_minute',
                            })})`
                          : ''}
                      </div>
                    </Option>
                  );
                })}
              </Select>
              {!travelTime && checkValidate && meetingFormat === 2 && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_required_notice' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.basicSettingButtonZone}>
          <Button className={styles.cancelBtn} onClick={() => onCancelTemp()}>
            {formatMessage({ id: 'i18n_cancel' })}
          </Button>
          <Button
            className={styles.saveBtn}
            onClick={() => updateBasicSetting()}
          >
            {formatMessage({ id: 'i18n_set' })}
          </Button>
        </div>
      </div>
    </Spin>
  );
}

const mapStateToProps = ({ CALENDAR_CREATION }) => ({
  calendarStore: CALENDAR_CREATION,
});

function mapDispatchToProps(dispatch) {
  return {
    onCheckAccountMicrosoft: () =>
      dispatch({ type: 'CALENDAR_CREATION/checkAccountMicrosoft' }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicSetting);
