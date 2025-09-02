import config from '@/config';
import { Button, Dropdown, Input, Menu, Radio, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from '../basic_styles.less';
import {
  onSetCheckAccountMicrosoft,
  setBasicSettingBlockNumber,
  setBasicSettingBlockTime,
  setBasicSettingCategory,
  setBasicSettingLocation,
  setBasicSettingLocationName,
  setBasicSettingManual,
  setBasicSettingMoveTime,
  setBasicSettingName,
  onReset,
} from './actions';
import LocationModal from './modal/LocationModal';
import TimeModal from './modal/TimeModal';
import { profileFromStorage } from '../../../commons/function';
import zoomCalendar from '@/assets/images/zoom-calendar.png';
import phoneCalendar from '@/assets/images/phone-calendar.png';
import microsoftCalendar from '@/assets/images/microsoft.png';
import googleMeetCalendar from '@/assets/images/google-meet-calendar.png';
import closeCircleMb from '@/assets/images/close-circle-mb.png';
import EventTemplateModal from '../../EventTemplateModal';
import imgArrowDown from '@/assets/images/icon-arrow-down.png';
import { history } from 'umi';
import pencil from '@/assets/images/i-edit-template.png';
import iClose from '@/assets/images/close-red.png';
import pencil1 from '@/assets/images/calendar-green-1.png';
import pencil2 from '@/assets/images/calendar-green-2.png';
import pencil3 from '@/assets/images/calendar-green-3.png';
import { CloseCircleOutlined } from '@ant-design/icons';

function BasicSetting(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { Option } = Select;

  const {
    // props
    showAdvancedSetting,
    onHideBasicSetting,
    // actions
    onSetBasicSettingName,
    onSetBasicSettingCategory,
    onSetBasicSettingLocation,
    onSetBasicSettingLocationName,
    onSetBasicSettingBlockTime,
    onSetBasicSettingBlockNumber,
    onSetBasicSettingMoveTime,
    onSetBasicSettingMoveNumber,
    onSetBasicSettingManual,
    onCheckAccountMicrosoft,
    onSetCheckAccountMicrosoft,
    onGetEventTemplateById,
    reset,
    resetMovingTime,
    // state
    eventStore,
    calendarStore,
    settings,
  } = props;

  const {
    listEventLocation,
    listEventBlockTime,
    listEventMoveTime,
    eventTemplateList,
    isLoading,
  } = eventStore;

  const { urlZoom, urlMeet, validated, checkAccountMicroSoft } = calendarStore;

  const {
    name,
    m_category_id,
    m_location_id,
    location_name,
    m_block_time_id,
    block_number,
    m_move_time_id,
    move_number,
    is_manual_setting,
  } = settings;
  // URL Microsoft Team
  const redirectUri = `${window.location.protocol}//${window.location.host}/msteam-login-success`;
  const urlMSTeam = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.MICROSOFT_CLIENT_KEY}&scope=User.Read Calendars.Read Calendars.ReadWrite offline_access&response_type=code&redirect_uri=${redirectUri}&state=ClientStateGoesHere&prompt=login`;

  // Modal
  const [locationModal, setLocationModal] = useState(false);
  const [blockTimeModal, setBlockTimeModal] = useState(false);
  const [moveTimeModal, setMoveTimeModal] = useState(false);
  const [showMessageLocation, setShowMessageLocation] = useState(false);

  useEffect(() => {
    const { isCallApi, isChecked } = checkAccountMicroSoft;
    if (m_location_id === 6) {
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
  }, [m_location_id]);

  useEffect(() => {
    const { isChecked } = checkAccountMicroSoft;
    if (m_location_id === 6) {
      if (!isChecked) {
        setShowMessageLocation(true);
      }
      if (isChecked) {
        setShowMessageLocation(false);
      }
    }
  }, [calendarStore]);

  useEffect(() => {
    return () => {
      onSetCheckAccountMicrosoft({
        isCallApi: false,
        isChecked: false,
      });
    };
  }, []);

  const categoriesLive = () => {
    return m_category_id === 1;
  };

  const onSetMoveTime = (id, block) => {
    if (!id) {
      onSetBasicSettingMoveTime(null);
      onSetBasicSettingMoveNumber(null);
      return;
    }
    onSetBasicSettingMoveTime(id);

    if (block) {
      onSetBasicSettingMoveNumber(block);
      return;
    }

    if (id === 6) {
      setMoveTimeModal(true);
      onSetBasicSettingMoveNumber(null);
      return;
    }
    const { move_number } = listEventMoveTime.find(move => move.id === id);
    if (move_number) {
      onSetBasicSettingMoveNumber(move_number);
    }
  };

  const onSetBlockTime = (id, block) => {
    onSetBasicSettingBlockTime(id);

    if (block) {
      onSetBasicSettingBlockNumber(block);
      return;
    }

    if (id === 6) {
      setBlockTimeModal(true);
      onSetBasicSettingBlockNumber(null);
      return;
    }

    const { block_number } = listEventBlockTime.find(block => block.id === id);
    onSetBasicSettingBlockNumber(block_number);
  };

  const onChangeLocation = id => {
    const { name } = listEventLocation.find(item => item.id === id);
    const listIdShowInput = [3, 5];
    if (id === 3) {
      setLocationModal(true);
    }
    onSetBasicSettingLocation(id);
    onSetBasicSettingLocationName(
      listIdShowInput.includes(id) ? undefined : name,
    );
  };

  const settingLocation = () => {
    const listLocationEvent = () => {
      if (!listEventLocation.length) {
        return;
      }
      //カスタム
      const listId = [1, 2, 6, 3];
      const listIdShowInput = [5];
      let zoomCss = styles.locationItem;
      let googleCss = styles.locationItem;
      let microsoftCss = styles.locationItem;
      let phoneCss = styles.locationItem;
      if (m_location_id === 1) {
        zoomCss += ' ' + styles.locationActive;
      }
      if (m_location_id === 2) {
        googleCss += ' ' + styles.locationActive;
      }
      if (m_location_id === 6) {
        microsoftCss += ' ' + styles.locationActive;
      }
      if (m_location_id === 3) {
        phoneCss += ' ' + styles.locationActive;
      }

      const messageLocation = () => {
        const { isChecked } = checkAccountMicroSoft;
        const { is_link_google, is_link_zoom } = profileFromStorage();
        if (!m_location_id && !validated) {
          if (!showMessageLocation) {
            setShowMessageLocation(true);
          }
          return formatMessage({ id: 'i18n_required_notice' });
        }

        if (!is_link_zoom && m_location_id === 1) {
          if (!showMessageLocation) {
            setShowMessageLocation(true);
          }
          return (
            <>
              {formatMessage({ id: 'i18n_zoom_not_connected' })}{' '}
              {formatMessage({ id: 'i18n_to_connect_zoom' })}
              <a href={urlZoom} target="_blank">
                {formatMessage({ id: 'i18n_here' })}
              </a>
            </>
          );
        }

        if (!is_link_google && m_location_id === 2) {
          if (!showMessageLocation) {
            setShowMessageLocation(true);
          }
          return (
            <>
              {formatMessage({ id: 'i18n_to_connect_google_meet' })}
              <a href={urlMeet} target="_blank">
                {formatMessage({ id: 'i18n_here' })}
              </a>
            </>
          );
        }

        if (m_location_id === 6) {
          if (isChecked) {
            // set value text, style css visible hide
            return 'string';
          }
          if (!isChecked) {
            return (
              <>
                {formatMessage({ id: 'i18n_microsoft_teams_not_connected' })}{' '}
                {formatMessage({ id: 'i18n_to_connect_microsoft_teams' })}
                <a href={urlMSTeam} target="_blank">
                  {formatMessage({ id: 'i18n_here' })}
                </a>
              </>
            );
          }
        }
        if (showMessageLocation) {
          setShowMessageLocation(false);
        }
        // set value text, style css visible hide
        return 'string';
      };

      return (
        <>
          {!listIdShowInput.includes(m_location_id) && (
            <>
              <div className={styles.locationSetting}>
                <div className={zoomCss} onClick={() => onChangeLocation(1)}>
                  <img src={zoomCalendar} alt="huyngocpham-error" />
                  <p>Zoom</p>
                </div>
                <div className={googleCss} onClick={() => onChangeLocation(2)}>
                  <img src={googleMeetCalendar} alt="huyngocpham-error" />
                  <p>Google Meet</p>
                </div>
                <div
                  className={microsoftCss}
                  onClick={() => onChangeLocation(6)}
                >
                  <img
                    width={34}
                    height={56}
                    src={microsoftCalendar}
                    alt="huyngocpham-error"
                  />
                  <p>
                    Microsoft
                    <br />
                    Teams
                  </p>
                </div>
                <div className={phoneCss} onClick={() => onChangeLocation(3)}>
                  <img src={phoneCalendar} alt="huyngocpham-error" />
                  <p>電話</p>
                </div>
              </div>
              <span
                className={`${styles.errorNotice} ${
                  showMessageLocation ? styles.showErrorNotice : ''
                }`}
              >
                {messageLocation()}
              </span>
            </>
          )}
          <div className={styles.inputTool}>
            {m_location_id === 3 && (
              <div>
                <Input
                  onClick={() => {
                    setLocationModal(true);
                  }}
                  placeholder="ミーティング場所"
                  readOnly
                  value={location_name}
                />
              </div>
            )}
            <p>
              その他のツールをご使用の場合、
              <span
                onClick={() => onChangeLocation(m_location_id === 5 ? 1 : 5)}
              >
                こちら
              </span>
              をクリックください。
            </p>
            {listIdShowInput.includes(m_location_id) && (
              <div>
                <Input
                  onChange={e => onSetBasicSettingLocationName(e.target.value)}
                  placeholder="ミーティング場所"
                  value={location_name}
                />
              </div>
            )}
          </div>
        </>
      );
    };
    return (
      <>
        <div className={styles.description}>
          {formatMessage({ id: 'i18n_setting_basic_step2_des' })}
        </div>

        {listLocationEvent()}
      </>
    );
  };

  const settingBlockEvent = () => {
    const listBlockTimeEvent = () => {
      if (!listEventBlockTime.length) {
        return [];
      }
      const idRemove = categoriesLive() ? [4, 5, 7] : [1, 5, 7];
      const listEventBlockTimeCustom = listEventBlockTime.filter(
        item => !idRemove.includes(item.id),
      );

      // if (!categoriesLive()) {
      //   const listIdSort = [1, 2];
      //   const indexLast = listEventBlockTimeCustom.length - 1;
      //   for (let i = 1; i < listEventBlockTimeCustom.length; i++) {
      //     // sort array
      //     if (listIdSort.includes(i)) {
      //       const a = listEventBlockTimeCustom[i];
      //       listEventBlockTimeCustom[i] = listEventBlockTimeCustom[indexLast];
      //       listEventBlockTimeCustom[indexLast] = a;
      //     }
      //   }
      // }

      return listEventBlockTimeCustom.map(item => {
        const { id, block_name } = item;
        return (
          <Radio value={id} key={id}>
            {block_name}
          </Radio>
        );
      });
    };

    return (
      <>
        <div className={styles.description}>
          {formatMessage({ id: 'i18n_setting_basic_step3_des' })}
        </div>

        <div className={styles.inputRadio}>
          <Radio.Group
            className={styles.inputBlockTime}
            value={m_block_time_id}
            onChange={e => onSetBlockTime(e.target.value)}
          >
            {listBlockTimeEvent()}
          </Radio.Group>
        </div>
        {m_block_time_id === 6 && (
          <div className={styles.inputTool}>
            <p>任意の時間を入力してください</p>
            <div>
              <Input
                readOnly
                onClick={() => setBlockTimeModal(true)}
                placeholder="ミーティング時間"
                value={block_number}
              />
              <span>分</span>
            </div>
          </div>
        )}
      </>
    );
  };

  const settingMoveTimeEvent = () => {
    const listTimeMove = () => {
      const listId = [2, 3, 6];
      if (!listEventMoveTime.length) {
        return [];
      }
      const listTime = [
        {
          id: null,
          move_number: null,
          move_name: 'なし',
        },
        ...listEventMoveTime.filter(item => listId.includes(item.id)),
      ];
      return listTime.map(item => {
        const { id, move_name } = item;
        return (
          <Radio value={id} key={id}>
            {move_name}
          </Radio>
        );
      });
    };
    return (
      <>
        <div className={styles.description}>
          会議前後の移動時間を選択してください
          <p>移動時間がある場合、前後の時間をブロックできます</p>
        </div>

        <div className={styles.inputRadio}>
          <Radio.Group
            className={styles.inputBlockTime}
            value={m_move_time_id}
            onChange={e => onSetMoveTime(e.target.value)}
          >
            {listTimeMove()}
          </Radio.Group>
        </div>
        {m_move_time_id === 6 && (
          <div className={styles.inputTool}>
            <p>任意の時間を入力してください</p>
            <div>
              <Input
                readOnly
                onClick={() => setMoveTimeModal(true)}
                placeholder="移動時間"
                value={move_number}
              />
              <span>分</span>
            </div>
          </div>
        )}
      </>
    );
  };

  const settingCategories = () => {
    const onChange = e => {
      const { value } = e.target;
      onSetBasicSettingCategory(value);

      // reset block time
      onSetBasicSettingBlockNumber(undefined);
      onSetBasicSettingBlockTime(undefined);
      // reset location name
      let isLive = value === 1;
      onSetBasicSettingLocation(isLive ? null : 5);
      onSetBasicSettingLocationName(null);

      // reset time move
      onSetBasicSettingMoveTime(undefined);
      onSetBasicSettingMoveNumber(undefined);

      // reset moving time in store
      resetMovingTime();
    };
    // confirm
    const listCategoriesEvent = () => {
      const listCategory = [
        {
          id: 1,
          name: 'オンライン',
        },
        {
          id: 2,
          name: 'オフライン',
        },
      ];

      return listCategory.map(item => {
        const { id, name } = item;
        return (
          <Radio value={id} key={id}>
            {name}
          </Radio>
        );
      });
    };

    return (
      <div className={styles.inputRadio}>
        <Radio.Group onChange={onChange} value={m_category_id}>
          {listCategoriesEvent()}
        </Radio.Group>
      </div>
    );
  };

  const dropdownTemplate = () => {
    const [visible, setVisible] = useState(false);
    const [textDisplay, setTextDisplay] = useState(
      '登録済みのテンプレートから選択',
    );
    const onSelectTemplate = (id, title) => {
      // load data event template to calendar
      if (id === 4) {
        reset();
        setVisible(false);
        setTextDisplay('登録済みのテンプレートから選択');
      }
      if (id !== 4 && checkExistedTemplate(id)) {
        onGetEventTemplateById(id);
        setVisible(false);
        setTextDisplay(title);
      }
    };

    const checkExistedTemplate = value => {
      return eventTemplateList.some(item => item.type_template === value);
    };

    const listCss = id => {
      let listCss = styles.pageIndex;
      if (checkExistedTemplate(id)) {
        listCss += ' ' + styles.dropdownMenuIcon;
      } else {
        listCss += ' ' + styles.disabledTemplate;
      }
      return listCss;
    };

    const menuSelectTemplate = () => {
      return (
        <>
          <Menu className={styles.dropdownMenuTemplate}>
            <Menu.Item
              className={listCss(1)}
              key="0"
              onClick={() => onSelectTemplate(1, 'テンプレート1を選択')}
            >
              <img src={pencil1} width={25} height={25} />
              <span>テンプレート1を選択</span>
            </Menu.Item>
            <Menu.Item
              className={listCss(2)}
              key="1"
              onClick={() => onSelectTemplate(2, 'テンプレート2を選択')}
            >
              <img src={pencil2} width={25} height={25} />
              <span>テンプレート2を選択</span>
            </Menu.Item>
            <Menu.Item
              className={listCss(3)}
              key="2"
              onClick={() => onSelectTemplate(3, 'テンプレート3を選択')}
            >
              <img src={pencil3} width={25} height={25} />
              <span>テンプレート3を選択</span>
            </Menu.Item>
            <Menu.Item
              className={`${styles.pageIndex} ${styles.dropdownMenuIcon}`}
              key="3"
              onClick={() => onSelectTemplate(4)}
            >
              <img src={iClose} width={21} height={21} />
              <span>テンプレートを選択しない</span>
            </Menu.Item>
            <Menu.Item
              className={styles.dropdownMenuIcon}
              key="5"
              onClick={() => history.push(`/event-template`)}
            >
              <img
                style={{ margin: '0 2px 5px 5px' }}
                src={pencil}
                width={17}
                height={17}
              />
              <span>{intl.formatMessage({ id: 'i18n_edit' })}</span>
            </Menu.Item>
          </Menu>
        </>
      );
    };

    return (
      <Dropdown
        overlay={menuSelectTemplate}
        visible={visible}
        onVisibleChange={() => {
          setVisible(!visible);
        }}
      >
        <Button
          onClick={() => {
            setVisible(!visible);
          }}
          className={styles.btnDropdownTemplate}
          placement="bottomCenter"
        >
          <p>{textDisplay}</p>
          <img src={imgArrowDown} alt="smoothly" />
        </Button>
      </Dropdown>
    );
  };

  return (
    <div className={styles.calendarInfoContainer}>
      <button className={styles.btnCloseModal} onClick={onHideBasicSetting}>
        <img src={closeCircleMb} alt="huyngocpham-error" />
      </button>
      <div className={styles.calendarInfoContent}>
        <div className={styles.stepCalendarTitle}>
          <div className={styles.titleIcon}>
            <div className={styles.bolderColIcon} />
            <div className={styles.normalColIcon} />
          </div>
          <h2>1 : {formatMessage({ id: 'i18n_calendar_creation_step_1' })}</h2>
        </div>
      </div>

      <div className={styles.formSettingBasic}>
        <div className={styles.stepSetting}>
          <div className={styles.stepSettingItem}>
            <div className={styles.content}>{dropdownTemplate()}</div>
          </div>

          <div className={styles.stepSettingItem}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>

            <div className={styles.content}>
              <div className={styles.title}>step&nbsp;1</div>
              <div className={styles.description}>
                {formatMessage({ id: 'i18n_setting_basic_step1_des' })}
              </div>
              {settingCategories()}
            </div>
          </div>

          <div className={styles.stepSettingItem}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>

            <div className={styles.content}>
              <div className={styles.title}>step &nbsp; 2</div>
              {categoriesLive() ? settingLocation() : settingBlockEvent()}
            </div>
          </div>

          <div className={styles.stepSettingItem}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>

            <div className={styles.content}>
              <div className={styles.title}>step 3</div>
              {categoriesLive() ? settingBlockEvent() : settingMoveTimeEvent()}
            </div>
          </div>

          {!categoriesLive() && (
            <div className={styles.stepSettingItem}>
              <div className={styles.titleIcon}>
                <div className={styles.bolderColIcon} />
                <div className={styles.normalColIcon} />
              </div>

              <div className={styles.content}>
                <div className={styles.title}>step 4</div>

                <div className={styles.description}>
                  会議の場所を入力してください
                </div>

                <div className={`${styles.inputTool} ${styles.mt0}`}>
                  <div>
                    <Input
                      placeholder="ミーティング場所"
                      value={location_name === '指定なし' ? '' : location_name}
                      onChange={e =>
                        onSetBasicSettingLocationName(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.stepSettingItem}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>

            <div className={styles.content}>
              <div className={styles.title}>
                step {categoriesLive() ? 4 : 5}
              </div>

              <div className={styles.description}>
                {formatMessage({ id: 'i18n_setting_basic_step4_des' })}
              </div>
              <div className={styles.inputRadio}>
                <Radio.Group
                  onChange={onSetBasicSettingManual}
                  value={is_manual_setting}
                >
                  <Radio value={false}>自動</Radio>
                  <Radio value={true}>手動</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>

          <div className={styles.stepSettingItem}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>

            <div className={styles.content}>
              <div className={styles.title}>option</div>
              <div className={styles.descriptionOption}>
                <div>{formatMessage({ id: 'i18n_setting_basic_option' })}</div>
                <div
                  onClick={() => {
                    showAdvancedSetting();

                    if (onHideBasicSetting) {
                      onHideBasicSetting();
                    }
                  }}
                >
                  <span>+</span> 設定する
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.groupSaveBasicSetting}>
        <button onClick={reset}>入力内容をクリア</button>
        <button onClick={onHideBasicSetting}>設定を完了する</button>
      </div>

      <LocationModal
        type={m_location_id}
        value={location_name}
        visible={locationModal}
        onChange={value => {
          onSetBasicSettingLocationName(value);
          setLocationModal(false);
        }}
        onClose={() => {
          onChangeLocation(1);
          setLocationModal(false);
        }}
      />
      <TimeModal
        value={block_number}
        visible={blockTimeModal}
        onChange={value => {
          setBlockTimeModal(false);
          onSetBlockTime(6, value);
        }}
        onClose={() => {
          setBlockTimeModal(false);
          onSetBlockTime(2); // FIXME: huypn
        }}
      />
      <TimeModal
        value={move_number}
        visible={moveTimeModal}
        onChange={value => {
          onSetMoveTime(6, value);
          setMoveTimeModal(false);
        }}
        onClose={() => {
          onSetMoveTime(null);
          setMoveTimeModal(false);
        }}
      />
    </div>
  );
}

const mapStateToProps = ({
  EVENT,
  MASTER,
  CALENDAR_CREATION,
  BASIC_SETTING,
}) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  calendarStore: CALENDAR_CREATION,
  settings: BASIC_SETTING,
});

function mapDispatchToProps(dispatch) {
  return {
    onSetBasicSettingName: event =>
      dispatch(setBasicSettingName(event.target.value)),
    onSetBasicSettingCategory: value =>
      dispatch(setBasicSettingCategory(value)),
    onSetBasicSettingLocation: value =>
      dispatch(setBasicSettingLocation(value)),
    onSetBasicSettingBlockTime: value =>
      dispatch(setBasicSettingBlockTime(value)),
    onSetBasicSettingMoveTime: value =>
      dispatch(setBasicSettingMoveTime(value)),
    onSetBasicSettingManual: event =>
      dispatch(setBasicSettingManual(event.target.value)),
    onSetBasicSettingLocationName: value =>
      dispatch(setBasicSettingLocationName(value)),
    onSetBasicSettingBlockNumber: value =>
      dispatch(setBasicSettingBlockNumber(value)),
    onSetBasicSettingMoveNumber: value =>
      dispatch({
        type: 'BASIC_SETTING/setBasicSettingMoveNumber',
        payload: value,
      }),
    onCheckAccountMicrosoft: () =>
      dispatch({ type: 'CALENDAR_CREATION/checkAccountMicrosoft' }),
    onSetCheckAccountMicrosoft: payload =>
      dispatch(onSetCheckAccountMicrosoft(payload)),
    onGetEventTemplateById: id =>
      dispatch({
        type: 'EVENT/getEventTemplateById',
        id,
      }),
    //
    reset: () => {
      dispatch(onReset());
    },
    resetMovingTime: () => {
      dispatch({
        type: 'BASIC_SETTING/resetMovingTime',
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicSetting);
