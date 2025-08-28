import React, { memo, useEffect, useState } from 'react';
import styles from '../index.less';
import { Checkbox, Radio, Select, Space, Spin } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { profileFromStorage } from '../../../../../commons/function';

const { Option } = Select;

const typeSelect = {
  member: 'member',
  team: 'team',
};

const ToolboxTemplateD = memo(() => {
  // list member
  // list event
  const { tabLoading, listPaginateTeamFull, paginateEvents } = useSelector(
    store => store.ACCOUNT_TEAM,
  );
  // store team
  const { loading, listTeam } = useSelector(store => store.TEAM);
  // store event
  const { isLoading } = useSelector(store => store.EVENT);
  // store setting template
  const { dataCalendarTemplate } = useSelector(store => store.SETTING_TEMPLATE);
  const { hideTitleCalendar, calendar } = dataCalendarTemplate;

  const dispatch = useDispatch();
  // get information profile
  const profile = profileFromStorage();
  // member checked radio box
  const [memberChecked, setMemberChecked] = useState({
    id: profile?.id,
    type: typeSelect.member,
  });

  useEffect(() => {
    if (!paginateEvents) {
      const payload = {
        relationship_type: 1,
        has_pagination: false,
        user_id_of_member: calendar.user_id,
      };
      dispatch({
        type: 'ACCOUNT_TEAM/getOnePaginateEvents',
        payload,
      });
    }

    // if not have list member, call api load list
    if (!listPaginateTeamFull) {
      const payload = {
        has_pagination: false,
      };
      dispatch({ type: 'ACCOUNT_TEAM/getPaginateTeamFull', payload });
    }

    // if not have list team, call api load list
    if (!listTeam) {
      dispatch({
        type: 'TEAM/getTeam',
      });
    }

    setMemberChecked({
      id: calendar.team_id ? calendar.team_id : calendar.user_id,
      type: calendar.team_id ? typeSelect.team : typeSelect.member,
    });

    // mở toolbox lên nếu k có list paginates sẽ call api lấy list paginates theo calendar, event_code đc select từ trc
    // setEventChecked(calendar);
  }, []);

  // show list member and team
  const generateListMemberOrTeamDataSelect = (listData, type, title) => {
    if (!listData) {
      return;
    }
    return (
      <>
        <div className={styles.formSettingTitle}>
          <div />
          {title}
        </div>

        <Radio.Group
          onChange={onSelectMemberOrTeam}
          value={memberChecked.type === type ? memberChecked.id : ''}
          className={styles.radioSelect}
          name={type}
        >
          <Space direction="vertical">
            {listData.map((item, index) => (
              <Radio key={index} value={item.id}>
                {item.name}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </>
    );
  };

  // show list event to member id or team id
  const generateListEventSelect = () => {
    return (
      <Select
        showSearch
        placeholder="会食"
        optionFilterProp="children"
        className={styles.selectEvent}
        onChange={onChangeSelectEvent}
        value={calendar?.id}
        // onSearch={onSearch}
        // filterOption={(input, option) =>
        //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        // }
      >
        {paginateEvents?.data &&
          paginateEvents.data.map((item, index) => (
            <Option key={index} value={item.id}>
              {item.name}
            </Option>
          ))}
      </Select>
    );
  };

  // reload list event by id selected
  const onLoadListEventById = (id, type) => {
    const payload = {
      relationship_type: 1,
      has_pagination: false,
    };
    if (type === typeSelect.member) {
      payload.user_id_of_member = id;
    }
    if (type === typeSelect.team) {
      payload.team_id = id;
    }
    dispatch({
      type: 'ACCOUNT_TEAM/getOnePaginateEvents',
      payload,
    });
  };

  // select member or team render list calendar
  const onSelectMemberOrTeam = e => {
    const { name, value } = e.target;
    onLoadListEventById(value, name);

    setMemberChecked({
      id: value,
      type: name,
    });
  };

  // change id event selected
  const onChangeSelectEvent = idEventSelect => {
    const eventSelect = paginateEvents.data.find(
      item => item.id === idEventSelect,
    );
    if (eventSelect) {
      updatedDataSettingTemplate('calendar', eventSelect);
    }

    if (!eventSelect) {
      updatedDataSettingTemplate('calendar', {});
    }
  };

  // set checkbox
  const onChangeCheckbox = e => {
    const { name, checked } = e.target;
    updatedDataSettingTemplate(name, checked);
  };

  // update to store setting template
  const updatedDataSettingTemplate = (key, data) => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateDataCalendarTemplate',
      payload: {
        key,
        value: data,
      },
    });
  };

  return (
    <>
      <Spin spinning={tabLoading || isLoading || loading}>
        {/*<h3 className={styles.title}>使用するカレンダーを選択ください</h3>*/}
        <div className={`${styles.stepItem} ${styles.stepItemCalendar}`}>
          <div className={styles.stepContent}>
            <div className={styles.formSettingItem}>
              <div className={styles.formSettingTitle}>
                {/*<div />*/}
                STEP1: ユーザーもしくはチームを選択ください。
              </div>
              <div className={styles.formSettingContent}>
                <div className={styles.listMemberSelect}>
                  {generateListMemberOrTeamDataSelect(
                    listPaginateTeamFull?.data,
                    typeSelect.member,
                    'ユーザー',
                  )}

                  {generateListMemberOrTeamDataSelect(
                    listTeam,
                    typeSelect.team,
                    'チーム',
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formSettingItem}>
              <div className={styles.formSettingTitle}>
                {/*<div />*/}
                STEP2: 使用するカレンダーを選択ください。
              </div>

              <div className={styles.formSettingContent}>
                {generateListEventSelect()}
              </div>

              <div className={styles.listCheckboxConfirm}>
                <Checkbox
                  name="hideTitleCalendar"
                  checked={hideTitleCalendar}
                  onChange={onChangeCheckbox}
                >
                  <div className={styles.inputCheckbox}>
                    <span className={styles.label}>
                      依頼内容のテキストを非表示にする
                    </span>
                  </div>
                </Checkbox>
                {/*<Checkbox*/}
                {/*  name="hideAll"*/}
                {/*  checked={listCheckbox.hideAll}*/}
                {/*  onChange={onChangeCheckbox}*/}
                {/*>*/}
                {/*  <div className={styles.inputCheckbox}>*/}
                {/*    <div>*/}
                {/*      <span>d</span>*/}
                {/*    </div>*/}
                {/*    <span className={styles.label}>*/}
                {/*      (カレンダーのカスタマイズ）を*/}
                {/*      <br />*/}
                {/*      全て非表示にする*/}
                {/*    </span>*/}
                {/*  </div>*/}
                {/*</Checkbox>*/}
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
});

export default ToolboxTemplateD;
