import pencil from '@/assets/images/i-pencil.svg';
import pencil1 from '@/assets/images/template1.png';
import pencil2 from '@/assets/images/template2.png';
import pencil3 from '@/assets/images/template3.png';
import { Button, Menu, Modal, Spin } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { history, useIntl } from 'umi';
import styles from './styles.less';
import TeamRequest from '@/services/teamRequest';
import { MEMBER_REQUIRED_TYPE } from '@/constant';

function EventTemplateModal(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    eventStore,
    masterStore,
    accountTeamStore,
    dispatch,
    justFillData,
    getList,
    setFirstLoad,
    stateTemp1,
    stateTemp2,
    stateTemp3,
    relationship_type = 2,
    // setIsVisible,
  } = props;
  const { eventTemplateList, isLoading } = eventStore;
  const { listPaginateEvents } = accountTeamStore;
  const { profile } = masterStore;

  const [currentTemplate, setCurrentTemplate] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [typeTemplate, setTypeTemplate] = useState(undefined);
  useEffect(() => {
    const result = eventTemplateList.find(
      item => item.type_template === typeTemplate,
    );

    if (result) {
      const payload = {
        block_name: result.block_name,
        block_number: result.block_number,
        calendar_confirm_comment: result.calendar_confirm_comment,
        calendar_create_comment: result.calendar_create_comment,
        category_name: result.category_name,
        default_end_time: result.default_end_time,
        default_start_time: result.default_start_time,
        id: result.id,
        location_name: result.location_name,
        lunch_break_end_time: result.lunch_break_end_time,
        lunch_break_start_time: result.lunch_break_start_time,
        m_block_time_id: result.m_block_time_id,
        m_category_id: result.m_category_id,
        m_location_id: result.m_location_id,
        m_move_time_id:
          result.m_move_time_id !== null ? result.m_move_time_id : undefined,
        priority_times: result.m_priority_times,
        move_name: result.move_name,
        move_number: result.move_number,
        period: result.period,
        reception_end_time: result.reception_end_time,
        reception_start_time: result.reception_start_time,
        relax_time: result.relax_time,
        reservation_number: result.reservation_number,
        type_template: result.type_template,
        member_id: result.user_id,
      };
      dispatch({ type: 'EVENT/setCurrentTemplate', payload });
      setCurrentTemplate(payload);
    }
  }, [typeTemplate, eventTemplateList]);

  const onSelectTemplate = async value => {
    // setIsVisible(false);
    setFirstLoad && setFirstLoad(false);
    if (checkExistedTemplate(value)) {
      setTypeTemplate(value);
      if (!justFillData) {
        setShowModal(true);
      }
    }
  };

  const checkExistedTemplate = value => {
    return eventTemplateList.some(item => item.type_template === value);
  };

  const createEventType = async copy => {
    const newPriority = [...currentTemplate.priority_times].filter(item => {
      return (
        item.priority_start_time !== null && item.priority_end_time !== null
      );
    });
    [...currentTemplate.priority_times] = newPriority.map(item => {
      item.id = undefined;
      return item;
    });

    const payload = {
      ...currentTemplate,
      name: formatMessage({ id: 'i18n_event_type_no_name' }),
      status: 1,
      relationship_type: relationship_type,
      is_manual_setting: 0,
      getList: getList,
    };
    if (payload.m_block_time_id === null) {
      payload.m_block_time_id = undefined;
    }
    if (payload.m_category_id === null) {
      payload.m_category_id = undefined;
    }
    if (payload.m_location_id === null) {
      payload.m_location_id = undefined;
    }
    if (payload.m_move_time_id === null) {
      payload.m_move_time_id = undefined;
    }

    const { team_id, member_id, member_all, team_all } = history.location.query;
    if (team_id) {
      payload.team_id = team_id;
    }

    if (team_all && listPaginateEvents) {
      payload.team_id = listPaginateEvents[0].id;
    }

    if (payload.team_id) {
      const optionRes = await TeamRequest.getTeamOption({ team_id });
      if (optionRes.status == 200 && optionRes.body.result.result) {
        payload.client = optionRes.body.result.result.map(member => {
          const user = member.user;
          return {
            email: user.email || user.google_email || user.microsoft_email,
            type: 3,
            status: member.option != MEMBER_REQUIRED_TYPE.NOT ? 1 : 0,
          };
        });
      }
    } else {
      payload.client = [
        {
          email:
            profile.email || profile.google_email || profile.microsoft_email,
          type: 3,
          status: 1,
        },
      ];
    }

    if (member_id) {
      payload.member_id = member_id;
    }

    if (member_all && listPaginateEvents) {
      payload.member_id = listPaginateEvents[0].id;
    }

    if (copy) {
      await dispatch({ type: 'EVENT/createEventTypeByTemplate', payload });
    } else {
      await dispatch({ type: 'EVENT/createEventType', payload });
    }
    setShowModal(false);
  };

  const onPreview = () => {
    const { team_id, member_id, member_all, team_all } = history.location.query;

    const data = {
      typeTemplate,
      team_id,
      member_id,
    };

    if (team_all && listPaginateEvents) {
      data.team_id = listPaginateEvents[0].id;
    }

    if (member_all && listPaginateEvents) {
      data.member_id = listPaginateEvents[0].id;
    }

    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });

    window.open(`/preview?${new URLSearchParams(data).toString()}`);
  };
  const tempH = history.location.query;

  return (
    <>
      <Menu className={styles.dropdownMenu}>
        <Menu.Item
          className={`${styles.pageIndex} ${
            !checkExistedTemplate(1) && !stateTemp1
              ? styles.disabledTemplate
              : styles.dropdownMenuIcon
          }`}
          key="0"
          onClick={() => onSelectTemplate(1)}
        >
          <img src={pencil1} width={25} height={25} />{' '}
          {intl.formatMessage({ id: 'template_1' })}
        </Menu.Item>
        <Menu.Item
          className={`${styles.pageIndex} ${
            !checkExistedTemplate(2) && !stateTemp2
              ? styles.disabledTemplate
              : styles.dropdownMenuIcon
          }`}
          key="1"
          onClick={() => onSelectTemplate(2)}
        >
          <img src={pencil2} width={25} height={25} />{' '}
          {intl.formatMessage({ id: 'template_2' })}
        </Menu.Item>
        <Menu.Item
          className={`${styles.pageIndex} ${
            !checkExistedTemplate(3) && !stateTemp3
              ? styles.disabledTemplate
              : styles.dropdownMenuIcon
          }`}
          key="2"
          onClick={() => onSelectTemplate(3)}
        >
          <img src={pencil3} width={25} height={25} />{' '}
          {intl.formatMessage({ id: 'template_3' })}
        </Menu.Item>
        <Menu.Item
          className={styles.dropdownMenuIcon}
          key="3"
          onClick={() =>
            history.push(
              `/event-template?${tempH.idEvent ? 'id=' + tempH.idEvent : ''}${
                tempH.edit ? '&edit=' + tempH.edit : ''
              }${tempH.clone ? '&clone=' + tempH.clone : ''}${
                tempH.relationship_type
                  ? '&relationship=' + tempH.relationship_type
                  : ''
              }`,
            )
          }
        >
          <img
            style={{ margin: '0 2px 5px 5px' }}
            src={pencil}
            width={17}
            height={17}
          />{' '}
          {intl.formatMessage({ id: 'i18n_edit' })}
        </Menu.Item>
      </Menu>
      <Modal
        visible={showModal}
        width={800}
        onCancel={() => setShowModal(false)}
        footer={null}
        closable={false}
      >
        <Spin spinning={isLoading}>
          <div className={styles.templateModalContent}>
            <p className={styles.headTitle}>下記より選択ください。</p>
            <Button
              className={styles.createAndCopyBtn}
              onClick={() => createEventType(true)}
            >
              作成してURLコピーもする
            </Button>
            <p className={styles.notice}>※一回利用URLになります</p>
            <Button
              className={styles.createBtn}
              onClick={() => createEventType(false)}
            >
              作成する
            </Button>
            <Button onClick={onPreview} className={styles.createPreviewBtn}>
              プレビュー
            </Button>
            <Button
              className={styles.cancelBtn}
              onClick={() => setShowModal(false)}
            >
              キャンセル
            </Button>
          </div>
        </Spin>
      </Modal>
    </>
  );
}

export default connect(({ EVENT, ACCOUNT_TEAM, TAB, MASTER }) => ({
  eventStore: EVENT,
  accountTeamStore: ACCOUNT_TEAM,
  tabStore: TAB,
  masterStore: MASTER,
}))(EventTemplateModal);
