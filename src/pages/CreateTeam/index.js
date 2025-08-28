import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { useIntl, history, withRouter } from 'umi';
import {
  Button,
  Spin,
  Input,
  Form,
  Select,
  Table,
  Tooltip,
  Modal,
  AutoComplete,
  message,
} from 'antd';
import ConfirmModal from '@/components/ConfirmModal';
import Footer from '@/components/Footer';
import { connect } from 'dva';
import pencil from '@/assets/images/i-pencil.svg';
import deleteIcons from '@/assets/images/i-remove.png';
import helper from '@/assets/images/imgQuestion.png';
import {
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { getCookie } from '@/commons/function.js';
import useWindowDimensions from '@/commons/useWindowDimensions';
import MenuSPBottom from '@/components/MenuSPBottom';
import DropDownIcon from '@/assets/images/drop-down-icon.png';
import ClearIcon from '@/assets/images/times-circle-solid.png';
import { TYPE_SELECT_TEAM } from '../../constant';
import { notify, profileFromStorage } from '../../commons/function';
import TooltipFormat from '../../components/TooltipFormat';

const { confirm } = Modal;
const { Option } = AutoComplete;

const listDataTooltipManagementAuthorityCalendar = [
  '当該チームのメンバーごとの編集権限を設定できます。',
  '「あり」に設定したメンバーは、チームメンバーの編集やチームの日程調整ページの作成・編集・削除が可能になります。',
  '一方で、「なし」に設定したメンバーは、チームメンバーの編集やチームの日程調整ページの作成・編集・削除ができなくなります。',
];
const listDataTooltipActionTeamMember = [
  'チームのメンバーごとでのミーティングへの参加条件を設定できます。',
  '①「必須」→出席必須なメンバーは「必須」を選択ください。',
  '例：AとBが参加メンバーで「必須」を設定。AとBの両方が参加日程が選択されます。',
  '',
  '②「または」→選択したメンバーのうち、1名が参加できる候補日程を選択されます。',
  '例；AとBが参加メンバーで「または」を設定。AもしくはBのどちらかが参加できる候補日程が選択されます。',
  '実施企業例：営業メンバーが複数参加するチームを作成。営業メンバーの内で１名が参加できればいい候補日程が選択されます。',
  '※１つのチーム設定で「必須」と「または」は併用できません。',
  '',
  '③「不参加」→ミーティングには参加しないが、日程調整するかたに「不参加」を設定ください。',
  '例：秘書や営業アシスタントによるミーティング参加者の日程設定、インサイドセールスメンバーによるフィールドセールスメンバーの日程調整',
];
const listDataTooltipEditDelete = [
  '「編集ボタン」ボタンをクリックすると、当該ユーザーの設定を編集できます。',
  '「ごみ箱」ボタンをクリックすると、選択したユーザーをチームメンバーから削除することができます。',
];
function CreateTeam(props) {
  const { width } = useWindowDimensions();
  const {
    location,
    dispatch,
    teamStore,
    masterStore,
    accountStore,
    accountTeamStore,
  } = props;
  const {
    loading,
    availableSlots,
    metadata,
    users,
    listUsers,
    informationTeam,
  } = teamStore;
  const { profile } = masterStore;
  const { is_expired } = profileFromStorage();

  const { listConnection } = accountStore;
  const { listPaginateTeamFull } = accountTeamStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const [currentTab, setCurrentTab] = useState('1');

  const [listAccount, setListAccount] = useState([
    {
      email: null,
      is_admin: null,
      option: null,
    },
    {
      email: null,
      is_admin: null,
      option: null,
    },
    {
      email: null,
      is_admin: null,
      option: null,
    },
    {
      email: null,
      is_admin: null,
      option: null,
    },
    {
      email: null,
      is_admin: null,
      option: null,
    },
  ]);
  const [countAccount, setCountAccount] = useState(0);
  const [optionSelect, setOptionSelect] = useState(-1);
  const [nameTeam, setNameTeam] = useState('');
  const [activeEdit, setActiveEdit] = useState(-1);
  const [listIdUserEdit, setListIdUserEdit] = useState([]);
  const [listUserEditOld, setListUserEditOld] = useState([]);
  const [checkRole, setCheckRole] = useState(-1);
  const [checkRoleAdmin, setCheckRoleAdmin] = useState(-1);
  const [checkEmail, setCheckEmail] = useState(true);
  const [isEmailExistInList, setIsEmailExistInList] = useState(true);
  const [modalState, setStateModal] = useState(false);
  const checkTrial = getCookie('checkTrial');

  const isTrial = profile.is_trial;

  useEffect(() => {
    if (profile) {
      if (profile.connection_role === null) {
        notify(
          intl.formatMessage({
            id: 'i18n_message_error_account_is_not_manager',
          }),
        );
        // history.push('/');
      } else {
        dispatch({ type: 'TEAM/getCreateTeam' });
      }
    }
  }, []);

  useEffect(() => {
    setCountAccount(listAccount.length);
  }, [listAccount]);

  useEffect(() => {
    if (history.location.query.slug) {
      let index = -1;
      listConnection[0] &&
        listConnection.forEach((item, i) => {
          if (profile.email === item.user_connection.member_email) {
            index = i;
            setCheckRole(item.user_connection.role_type);
            return 1;
          }
        });
      if (index === -1) {
        setCheckRole(1);
      }
      if (informationTeam) {
        setCheckRoleAdmin(informationTeam.is_admin);
      }
    }
  }, [listConnection, informationTeam]);

  useEffect(() => {
    !listAccount.filter((item, index) => {
      if (item.option === 1 || item.option === 2) {
        item.option === 1 ? setOptionSelect(2) : setOptionSelect(1);
        return item;
      }
    })[0] && setOptionSelect(-1);
    if (listUserEditOld && listUserEditOld[0]) {
      let listTemId = [];
      for (let i = 0; i < listUserEditOld.length; i++) {
        if (
          listUserEditOld[i].email !== listAccount[i].email ||
          listUserEditOld[i].is_admin !== listAccount[i].is_admin ||
          listUserEditOld[i].option !== listAccount[i].option
        ) {
          listTemId.push(listUserEditOld[i].user_id);
        }
      }
      setListIdUserEdit(listTemId);
    }
    if (listUsers) {
      let payload = listUsers;
      for (let i = 0; i < listAccount.length; i++) {
        payload = payload.filter(item => {
          if (item.email && item.email !== listAccount[i].email) {
            return item;
          } else if (
            item.google_email &&
            item.google_email !== listAccount[i].email
          ) {
            return item;
          } else if (
            item.microsoft_email &&
            item.microsoft_email !== listAccount[i].email
          ) {
            return item;
          }
        });
      }
      dispatch({ type: 'TEAM/setUsers', payload });
    }
  }, [listAccount]);

  useEffect(() => {
    if (history.location.query.slug) {
      const payload = {
        team_slug: history.location.query.slug,
      };
      dispatch({ type: 'TEAM/getTeamEdit', payload });
    } else dispatch({ type: 'TEAM/setInformationTeam', payload: null });
  }, []);

  useEffect(() => {
    if (!document) {
      return;
    }

    if (
      document.querySelectorAll('[class*=bgEdit]') &&
      history.location.query.slug
    ) {
      for (
        let i = 0;
        i < document.querySelectorAll('.ant-select').length;
        i++
      ) {
        if (document.querySelectorAll('.ant-select')[i].closest('td')) {
          document
            .querySelectorAll('.ant-select')
            [i].closest('td')
            .classList.remove('wrapperTdEdit');
        }
      }
      for (
        let i = 0;
        i < document.querySelectorAll('[class*=bgEdit]').length;
        i++
      ) {
        document
          .querySelectorAll('[class*=bgEdit]')
          [i].closest('td')
          .classList.add('wrapperTdEdit');
      }
    }
    if (
      document.querySelector('[class*=backGround]') &&
      history.location.query.slug
    ) {
      for (
        let i = 0;
        i < document.querySelectorAll('.ant-select').length;
        i++
      ) {
        document
          .querySelectorAll('.ant-select')
          [i].closest('td')
          .classList.remove('wrapperTd');
      }
      for (
        let i = 0;
        i < document.querySelectorAll('[class*=backGround]').length;
        i++
      ) {
        document
          .querySelectorAll('[class*=backGround]')
          [i].closest('td')
          .classList.add('wrapperTd');
      }
    }
  }, [activeEdit, listIdUserEdit]);

  useEffect(() => {
    if (informationTeam && listUsers && location.query.slug) {
      let listAccountEdit = [...informationTeam.members];
      listAccountEdit.forEach((account, i) => {
        const tem = listUsers.find(item => item.id === account.user_id);
        if (tem) {
          listAccountEdit[i].email =
            tem.email || tem.google_email || tem.microsoft_email;
        } else {
          listAccountEdit[i].email = profile.email;
          listAccountEdit[i].id = profile?.id;
        }
        return 1;
      });
      setListAccount(listAccountEdit);
      setListUserEditOld(listAccountEdit);
      setNameTeam(informationTeam.name);
    } else {
      setNameTeam('');
      setListAccount([
        {
          email: null,
          is_admin: null,
          option: null,
        },
        {
          email: null,
          is_admin: null,
          option: null,
        },
        {
          email: null,
          is_admin: null,
          option: null,
        },
        {
          email: null,
          is_admin: null,
          option: null,
        },
        {
          email: null,
          is_admin: null,
          option: null,
        },
      ]);
    }
  }, [informationTeam, listUsers, location.query.slug]);

  const handleSubmitForm = values => {
    const listAccountSubmit = [];
    listAccount.forEach(item => {
      if (item.email === undefined) {
        item.email = null;
      }
      if (item.is_admin === undefined) {
        item.is_admin = null;
      }
      if (item.option === undefined) {
        item.option = null;
      }
      listAccountSubmit.push(item);
    });

    const listAccountTem = listAccountSubmit.filter(
      item => item.email && item.is_admin !== null && item.option,
    );
    const listAccountCheckNull = listAccountSubmit.filter(
      item => !item.email && item.is_admin === null && !item.option,
    );
    const listAccountTemExist = listAccountSubmit.find(
      item => item.email || (item.is_admin !== null) & item.option,
    );
    if (!checkEmail) {
      notify(intl.formatMessage({ id: 'i18n_error_email_null' }));
      return;
    }
    if (!isEmailExistInList) {
      notify(intl.formatMessage({ id: 'i18n_error_add_member_field' }));
      return;
    }
    const checkNullEmail = listAccountSubmit.filter(
      item =>
        (!item.email &&
          (item.is_admin !== null ||
            item.is_admin !== undefined ||
            item.option)) ||
        (!item.email && item.is_admin === null && !item.option),
    );

    if (
      checkNullEmail.length &&
      listAccountCheckNull.length < checkNullEmail.length
    ) {
      notify(intl.formatMessage({ id: 'i18n_add_member_email_error' }));
      return;
    }
    const checkNullRole = listAccountSubmit.filter(
      item =>
        item.is_admin === null ||
        (item.is_admin === undefined && (item.email || item.option)) ||
        (!item.email && item.is_admin === null && !item.option),
    );
    if (
      checkNullRole.length &&
      listAccountCheckNull.length < checkNullRole.length
    ) {
      notify(intl.formatMessage({ id: 'i18n_error_add_member_role_hollow' }));
      return;
    }
    const checkNullType = listAccountSubmit.filter(
      item =>
        (!item.option &&
          (item.email ||
            item.is_admin !== null ||
            item.is_admin !== undefined)) ||
        (!item.email && item.is_admin === null && !item.option),
    );
    if (
      checkNullType.length &&
      listAccountCheckNull.length < checkNullType.length
    ) {
      notify(intl.formatMessage({ id: 'i18n_add_member_email_error' }));
      return;
    }
    if (!listAccountTemExist) {
      notify(intl.formatMessage({ id: 'i18n_add_member_email_error' }));
      return;
    }
    for (let i = 0; i < listAccountTem.length; i++) {
      const tem = listUsers.find(
        item =>
          (item.email && item.email === listAccountTem[i].email) ||
          (item.google_email &&
            item.google_email === listAccountTem[i].email) ||
          (item.microsoft_email &&
            item.microsoft_email === listAccountTem[i].email),
      );
      listAccountTem[i].id = tem ? tem.id : profile?.id;
    }
    if (listAccountTem.length > availableSlots && availableSlots !== -1) {
      setStateModal(true);
    } else {
      if (nameTeam.length > 255) {
        notify(
          formatMessage(
            {
              id: 'i18n_validate_field_name_limit_255_characters',
            },
            { validateField: formatMessage({ id: 'i18n_team_name' }) },
          ),
        );
      } else if (nameTeam.trim().length === 0) {
        notify(
          formatMessage(
            {
              id: 'i18n_input_all_white_space',
            },
            { validateField: formatMessage({ id: 'i18n_team_name' }) },
          ),
        );
      } else {
        if (history.location.query.slug) {
          const payload = {
            name: nameTeam,
            members: listAccountTem,
          };
          dispatch({
            type: 'TEAM/postTeamEdit',
            payload: { ...payload, id: informationTeam.id },
          });
        } else {
          const payload = {
            name: nameTeam,
            members: listAccountTem,
          };
          dispatch({ type: 'TEAM/postCreateTeam', payload });
        }
      }
    }
  };

  const addMemberTeam = () => {
    // Handle is trial
    if (isTrial) {
      setListAccount([
        ...listAccount,
        {
          email: null,
          is_admin: null,
          option: null,
        },
      ]);

      return;
    }

    if (availableSlots === -1) {
      setStateModal(true);
    } else if (countAccount < availableSlots && availableSlots > 0) {
      setListAccount([
        ...listAccount,
        {
          email: null,
          is_admin: null,
          option: null,
        },
      ]);
    } else {
      setStateModal(true);
    }
  };

  const handleSelectOption = (value, index, name) => {
    const arrValueCheck = [1, 2];
    if (name === TYPE_SELECT_TEAM.option && arrValueCheck.includes(value)) {
      let pass = false;
      let valueCheck = 1;
      if (value === 1) {
        valueCheck = 2;
      }
      const arrCheck = JSON.parse(JSON.stringify(listAccount));
      let indexNotAccept = arrCheck.filter((item, key) => {
        if (item.option === valueCheck) {
          item.key = key;
          return item;
        }
      });

      if (indexNotAccept && indexNotAccept.length) {
        if (indexNotAccept.length > 1) {
          pass = true;
        }
        if (indexNotAccept.length === 1 && indexNotAccept[0].key !== index) {
          pass = true;
        }
      }
      if (pass) {
        notify(
          '「または」「必須」を同一チーム内で併用して選択することはできません。同一チーム内では、どちらかを選択ください。※なお、「不参加」は併用可能です。',
        );
        return;
      }
    }
    const updatedListAccount = [...listAccount];
    const item = { ...updatedListAccount[index] };
    updatedListAccount[index] = {
      ...item,
      [name]: value,
    };
    setListAccount(updatedListAccount);
  };

  const removeMember = index => {
    const listTem = [...listAccount];
    const listTemOld = [...listUserEditOld];
    listTem.splice(index, 1);
    listTemOld.splice(index, 1);
    setListAccount([...listTem]);
    setListUserEditOld([...listTemOld]);
  };

  const confirmRemoveMember = index => {
    confirm({
      title: intl.formatMessage({ id: 'i18n_confirm_delete_account' }),
      icon: <ExclamationCircleOutlined />,
      cancelText: intl.formatMessage({ id: 'i18n_will_not_release' }),
      okText: intl.formatMessage({ id: 'i18n_release' }),
      className: styles.removeMemberConfirm,
      onOk: () => {
        removeMember(index);
      },
    });
  };

  const handleChange = (value, index) => {
    let newListAccount = [...listAccount];
    newListAccount[index].email = value;
    setListAccount(newListAccount);

    if (
      users.find(
        item =>
          item.email === value ||
          item.google_email === value ||
          item.microsoft_email === value,
      )
    ) {
      setCheckEmail(true);
      setIsEmailExistInList(true);
    } else if (value === '' || value === undefined) {
      setCheckEmail(false);
    } else {
      setCheckEmail(true);
      setIsEmailExistInList(false);
    }
  };

  function handleCancel() {
    setStateModal(false);
  }

  async function handleOk() {
    history.push('/payment?addPlan=creditCard');
    setStateModal(false);
  }

  const columns = [
    {
      title: formatMessage({ id: 'i18n_email' }),
      dataIndex: 'email',
      width: width > 767 ? 250 : 200,
      render: (_, record, index) => (
        <>
          <AutoComplete
            value={record.email || ''}
            onChange={value => handleChange(value, index)}
            dropdownClassName={styles.selectDropdownClassname}
            onSelect={value =>
              handleSelectOption(value, index, TYPE_SELECT_TEAM.email)
            }
            onClear={() =>
              handleSelectOption(undefined, index, TYPE_SELECT_TEAM.email)
            }
            clearIcon={
              <img
                style={{
                  width: '19px',
                  marginTop: '-5px',
                }}
                src={ClearIcon}
                alt="Clear Icon"
              />
            }
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
            allowClear
            placeholder="プルダウンから選択ください"
            className={
              index === activeEdit
                ? styles.backGround
                : listIdUserEdit.filter(item => item === record.user_id)[0]
                ? styles.bgEdit
                : ''
            }
            disabled={
              checkRole === -1 || checkRole === 0 ? false : checkRoleAdmin !== 1
            }
          >
            {users &&
              users.map(item => (
                <Option
                  key={item.id}
                  value={
                    item.email || item.google_email || item.microsoft_email
                  }
                >
                  {item.email || item.google_email || item.microsoft_email}
                </Option>
              ))}
          </AutoComplete>
        </>
      ),
    },
    {
      title: (
        <>
          {formatMessage({ id: 'i18n_management_authority_calendar' })}
          <Tooltip
            trigger={['hover', 'click']}
            placement="top"
            title={
              <TooltipFormat
                dataFormat={listDataTooltipManagementAuthorityCalendar}
              />
            }
          >
            {width <= 767 ? (
              <img
                src={helper}
                className="helper"
                style={{ position: 'absolute', right: '4px', top: '4px' }}
              />
            ) : (
              <img
                src={helper}
                className="helper"
                style={{ marginLeft: '8px', marginTop: '-5px' }}
              />
            )}
          </Tooltip>
        </>
      ),
      dataIndex: 'is_admin',
      width: width > 767 ? 280 : 130,
      render: (_, record, index) => (
        <Select
          suffixIcon={<img src={DropDownIcon} alt="Drop Down Icon" />}
          clearIcon={
            <img
              src={ClearIcon}
              alt="Clear Icon"
              style={{
                width: '19px',
                marginTop: '-5px',
              }}
            />
          }
          dropdownClassName={styles.selectDropdownClassname}
          value={record.is_admin}
          placeholder={formatMessage({ id: 'i18n_authority_placeholder' })}
          onSelect={value =>
            handleSelectOption(value, index, TYPE_SELECT_TEAM.is_admin)
          }
          allowClear
          onClear={() =>
            handleSelectOption(undefined, index, TYPE_SELECT_TEAM.is_admin)
          }
          className={
            index === activeEdit
              ? styles.backGround
              : listIdUserEdit.filter(item => item === record.user_id)[0]
              ? styles.bgEdit
              : ''
          }
          disabled={
            checkRole === -1 || checkRole === 0 ? false : checkRoleAdmin !== 1
          }
        >
          {metadata &&
            metadata.roles.map(item => (
              <Select.Option key={item.value} value={item.key}>
                {item.value}
              </Select.Option>
            ))}
        </Select>
      ),
    },
    {
      title: (
        <>
          {formatMessage({ id: 'i18n_action_team_member' })}

          <Tooltip
            trigger={['hover', 'click']}
            placement="top"
            title={
              <TooltipFormat dataFormat={listDataTooltipActionTeamMember} />
            }
          >
            {width <= 767 ? (
              <img
                src={helper}
                className="helper"
                style={{ position: 'absolute', right: '4px', top: '4px' }}
              />
            ) : (
              <img
                src={helper}
                className="helper"
                style={{ marginLeft: '8px', marginTop: '-5px' }}
              />
            )}
          </Tooltip>
        </>
      ),
      dataIndex: 'option',
      width: width > 767 ? 311 : 200,
      render: (_, record, index) => (
        <Select
          suffixIcon={<img src={DropDownIcon} alt="Drop Down Icon" />}
          clearIcon={
            <img
              style={{
                width: '19px',
                marginTop: '-5px',
              }}
              src={ClearIcon}
              alt="Clear Icon"
            />
          }
          dropdownClassName={styles.selectDropdownClassname}
          value={record.option}
          placeholder={formatMessage({ id: 'i18n_contract_type_placeholder' })}
          onSelect={value =>
            handleSelectOption(value, index, TYPE_SELECT_TEAM.option)
          }
          onClear={() =>
            handleSelectOption(null, index, TYPE_SELECT_TEAM.option)
          }
          allowClear
          className={
            index === activeEdit
              ? styles.backGround
              : listIdUserEdit.filter(item => item === record.user_id)[0]
              ? styles.bgEdit
              : ''
          }
          disabled={
            checkRole === -1 || checkRole === 0 ? false : checkRoleAdmin !== 1
          }
        >
          {metadata &&
            metadata.options.map(item => (
              <Select.Option key={item.value} value={item.key}>
                {item.value}
              </Select.Option>
            ))}
        </Select>
      ),
    },
  ];

  history.location.query.slug &&
    columns.push({
      dataIndex: 'actions',
      width: 70,
      render: (_, record, index) => (
        <>
          {history.location.query.slug && (
            <>
              <button
                type="button"
                className={styles.btnActionEdit}
                onClick={() => setActiveEdit(index)}
                disabled={
                  checkRole === -1 || checkRole === 0
                    ? false
                    : checkRoleAdmin !== 1
                }
              >
                <img src={pencil} />
              </button>
              <button
                type="button"
                className={styles.btnActionDelete}
                onClick={() => {
                  confirmRemoveMember(index);
                }}
                disabled={
                  checkRole === -1 || checkRole === 0
                    ? false
                    : checkRoleAdmin === 1
                    ? false
                    : true
                }
              >
                <img src={deleteIcons} />
              </button>
            </>
          )}
        </>
      ),
    });

  return (
    <>
      <Spin spinning={loading} style={{ margin: 'auto' }}>
        <div className={styles.createTeam}>
          <div className={styles.numberAccountContent}>
            <div className={styles.numberAccountBorder} />
            <div className={styles.numberAccountTitle}>
              {history.location.query.slug
                ? formatMessage({ id: 'i18n_team_title' })
                : formatMessage({ id: 'i18n_create_team' })}
            </div>
          </div>
          <Form form={form} onFinish={handleSubmitForm}>
            <Form.Item
              rules={[
                {
                  required: !nameTeam,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
              ]}
              name={'nameTeam'}
              className={styles.formItem}
            >
              <div>
                <label className={styles.label}>
                  <span className={styles.labelBorder} />
                  {formatMessage({ id: 'i18n_label_name_team' })}
                </label>
                <Input
                  className={styles.input}
                  value={nameTeam}
                  placeholder={formatMessage({
                    id: 'i18n_name_team_placeholder',
                  })}
                  onChange={e => setNameTeam(e.target.value)}
                  disabled={
                    checkRole === -1 || checkRole === 0
                      ? false
                      : checkRoleAdmin !== 1
                  }
                />
              </div>
            </Form.Item>
            <Form.Item name={'teamMember'} className={styles.formItem}>
              {history.location.query.slug ? (
                <div style={{ display: 'flex' }}>
                  <label className={styles.labelNoInput}>
                    <span className={styles.labelBorder} />
                    {formatMessage({ id: 'i18n_label_team_member' })}
                  </label>
                  <button
                    type="button"
                    className={styles.btnEdit}
                    style={{
                      margin: '0 0 0 8px',
                      padding: '0',
                      color: '#848484',
                      fontWeight: '400',
                    }}
                  >
                    <img src={pencil} /> : {formatMessage({ id: 'i18n_edit' })}
                  </button>
                  <button
                    type="button"
                    className={styles.btnEdit}
                    style={{
                      margin: '0 0 0 8px',
                      padding: '0',
                      color: '#848484',
                      fontWeight: '400',
                    }}
                  >
                    <img src={deleteIcons} /> :{' '}
                    {formatMessage({ id: 'i18n_delete_event' })}
                  </button>
                  <Tooltip
                    placement="top"
                    trigger={['hover', 'click']}
                    title={
                      <TooltipFormat dataFormat={listDataTooltipEditDelete} />
                    }
                  >
                    <img
                      src={helper}
                      className="helper"
                      style={{
                        width: width > 767 ? '20px' : '15px',
                        height: width > 767 ? '20px' : '15px',
                        marginLeft: width > 767 ? '6px' : '8px',
                        marginTop: width > 767 ? '8.5px' : '6.5px',
                      }}
                    />
                  </Tooltip>
                </div>
              ) : (
                <label className={styles.labelNoInput}>
                  <span className={styles.labelBorder} />
                  {formatMessage({ id: 'i18n_label_team_member' })}
                </label>
              )}
            </Form.Item>
            <Form.Item
              name={'tableMemberTeam'}
              className={styles.formItem}
              style={{ marginBottom: '0' }}
            >
              <div className={styles.tableAccountContainer}>
                <Table
                  className={styles.tableAccount}
                  columns={columns}
                  dataSource={listAccount}
                  bordered
                  pagination={false}
                  rowClassName={record =>
                    record.isValid === false && styles.inValidRow
                  }
                  rowKey="id"
                  scroll={{ x: 300, y: 500 }}
                  locale={{
                    emptyText: formatMessage({ id: 'i18n_empty_data_table' }),
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item>
              <button
                type="button"
                onClick={addMemberTeam}
                className={styles.addMemberTeam}
                disabled={
                  checkRole === -1 || checkRole === 0
                    ? false
                    : checkRoleAdmin !== 1
                }
              >
                + {formatMessage({ id: 'i18n_add_member' })}
              </button>
            </Form.Item>
            <Form.Item>
              <div className={styles.paymentBtnGroup}>
                <Button
                  disabled={loading}
                  className={`btn btn-white__shadow btn-custom-height`}
                  onClick={() => history.goBack()}
                  style={{ fontSize: width > 767 ? '20px' : '18px' }}
                >
                  {formatMessage({ id: 'i18n_go_back' })}
                </Button>
                <Button
                  htmlType="submit"
                  loading={loading}
                  disabled={
                    checkRole === -1 || checkRole === 0
                      ? false
                      : checkRoleAdmin !== 1
                  }
                  className={`btn btnGreen btn-custom-height`}
                  style={{ fontSize: width > 767 ? '20px' : '18px' }}
                >
                  {!history.location.query.slug
                    ? formatMessage({ id: 'i18n_create_team_send' })
                    : formatMessage({ id: 'i18n_create_team_send_edit' })}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
        <Footer />
        <div style={{ height: '1px' }} />
        <MenuSPBottom currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </Spin>
      <Modal
        visible={modalState}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        footer={null}
      >
        {listPaginateTeamFull && listPaginateTeamFull.is_admin_contract ? (
          <div className={styles.modalDelete}>
            <div className={styles.modalDescription}>
              <p>
                {formatMessage({ id: 'i18n_error_create_team_Description' })}
              </p>
              <p>{formatMessage({ id: 'i18n_error_create_team_Title' })}</p>
            </div>

            <div className={styles.btnGroup}>
              <Button onClick={() => handleCancel()} className="btn btnWhite">
                {formatMessage({ id: 'i18n_cancel_delete' })}
              </Button>
              <Button onClick={() => handleOk()} className="btn btnGreen">
                {formatMessage({ id: 'i18n_confirm_delete_event' })}
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.modalDelete}>
            <div className={styles.modalDescription}>
              <p>
                {formatMessage({
                  id: 'i18n_error_create_team_Description_Member',
                })}
              </p>
            </div>

            <div className={styles.btnGroup}>
              <Button onClick={() => handleCancel()} className="btn btnGreen">
                {formatMessage({ id: 'i18n_confirm_ok' })}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/*account not try and expired show modal warning*/}
      <ConfirmModal
        visible={is_expired}
        title={formatMessage({ id: 'i18n_error_add_member_Title' })}
        description={formatMessage({ id: 'i18n_error_add_member_Descript' })}
        action={
          <Button
            onClick={() => history.push('/payment?addPlan=creditCard')}
            className="btn btnGreen"
          >
            {formatMessage({ id: 'i18n_here' })}
          </Button>
        }
      />
    </>
  );
}

export default connect(({ TEAM, MASTER, ACCOUNT, ACCOUNT_TEAM }) => ({
  teamStore: TEAM,
  masterStore: MASTER,
  accountStore: ACCOUNT,
  accountTeamStore: ACCOUNT_TEAM,
}))(withRouter(CreateTeam));
