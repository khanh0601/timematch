import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'dva';
import { useIntl, useHistory } from 'umi';
import { Button, Select, Input, Table, message } from 'antd';
import { getCookie, notify } from '@/commons/function.js';

import {
  CONTRACT_BY_YEAR,
  CONTRACT_BY_MONTH,
  ROLE_MANAGER_CLIENT,
  ROLE_MEMBER_CLIENT,
  emailRegex,
  emailRegex2,
} from '@/constant';
import ConfirmModal from '@/components/ConfirmModal';
import Footer from '@/components/Footer';

import AddMemberComplete from './AddMemberComplete';
import styles from './styles.less';
import {
  createListAddMember,
  profileFromStorage,
} from '../../commons/function';

const { Option } = Select;

const InputRowItem = ({
  email,
  index,
  placeholder,
  handleChangeEmail,
  errorMessage,
}) => {
  const [value, setValue] = useState(email);
  const [validEmail, setValidEmail] = useState(true);

  const handleBlurInput = event => {
    handleChangeEmail(event, index, validEmail);
  };

  const handleChangeInput = event => {
    let { value } = event.target;
    let valid = true;
    let valueFormat = value.trim();
    if (!emailRegex2.test(valueFormat)) {
      valid = false;
    }

    setValidEmail(valid);
    setValue(valueFormat);
  };

  return (
    <div className={styles.inputContainer}>
      <Input
        value={value}
        onBlur={handleBlurInput}
        name="email"
        onChange={handleChangeInput}
        placeholder={placeholder}
        autoComplete="off"
      />
      {/* {!validEmail ? (
        <div className={styles.textError}>{errorMessage}</div>
      ) : (
        <div className={styles.emptyError} />
      )} */}
    </div>
  );
};

function AddMember({ dispatch, accountStore, userConnectionsStore }) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { slotsAvailable, activeAccounts } = accountStore;
  const history = useHistory();

  // get is_trial check account trial
  const { is_trial, is_expired } = profileFromStorage();
  const [listAccount, setListAccount] = useState(
    is_trial ? createListAddMember(5) : [],
  );
  const [yearContractIds, setYearContractIds] = useState(
    is_trial ? [] : [null, null, null, null, null],
  );
  const [monthContractIds, setMonthContractIds] = useState(
    is_trial ? [] : [null, null, null, null, null],
  );

  const [createSuccess, setCreateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);

  const getUserConnections = useCallback(() => {
    dispatch({ type: 'ACCOUNT/getUserConnections' });
  }, [dispatch]);

  useEffect(() => {
    getUserConnections();
  }, [getUserConnections]);

  useEffect(() => {
    if (!is_trial) {
      const monthIds = [];
      const yearIds = [];
      let countSlot = 0;
      for (const item of slotsAvailable) {
        if (!item.user_connection) {
          item.m_contract_id === CONTRACT_BY_YEAR
            ? yearIds.push(item.id)
            : monthIds.push(item.id);
          countSlot++;
        }
      }
      if (countSlot) {
        setListAccount(createListAddMember(countSlot));
      }
      setMonthContractIds(monthIds);
      setYearContractIds(yearIds);
    } else {
      setListAccount(createListAddMember(5));
      setMonthContractIds([null, null, null, null, null]);
      setYearContractIds([null, null, null, null, null]);
    }
  }, [slotsAvailable]);

  const handleSelectOption = (value, index, name) => {
    const updatedListAccount = [...listAccount];
    const item = { ...updatedListAccount[index] };
    const updatedMonthIds = [...monthContractIds];
    const updatedYearIds = [...yearContractIds];
    if (name === 'contractType') {
      const prevValue = item.contractType;
      const prevUserContractId = item.userContractId;

      if (prevValue === CONTRACT_BY_MONTH && !value) {
        updatedMonthIds.push(prevUserContractId);
      }

      if (prevValue === CONTRACT_BY_YEAR && !value) {
        updatedYearIds.push(prevUserContractId);
      }

      if (prevUserContractId && value === CONTRACT_BY_YEAR) {
        item.userContractId = updatedYearIds.pop();
        if (prevValue === CONTRACT_BY_MONTH) {
          updatedMonthIds.push(prevUserContractId);
        } else {
          updatedYearIds.push(prevUserContractId);
        }
      }

      if (prevUserContractId && value === CONTRACT_BY_MONTH) {
        item.userContractId = updatedMonthIds.pop();
        if (prevValue === CONTRACT_BY_MONTH) {
          updatedMonthIds.push(prevUserContractId);
        } else {
          updatedYearIds.push(prevUserContractId);
        }
      }

      if (!prevValue && value === CONTRACT_BY_YEAR) {
        item.userContractId = updatedYearIds.pop();
      }

      if (!prevValue && value === CONTRACT_BY_MONTH) {
        item.userContractId = updatedMonthIds.pop();
      }
    }
    updatedListAccount[index] = {
      ...item,
      [name]: value,
      isValid: true,
    };
    setListAccount(updatedListAccount);
    setMonthContractIds(updatedMonthIds);
    setYearContractIds(updatedYearIds);
  };

  const handleChangeEmail = (event, index, validEmail) => {
    const { value, name } = event.target;
    const updatedListAccount = [...listAccount];
    updatedListAccount[index] = {
      ...updatedListAccount[index],
      [name]: value,
      invalidEmail: !validEmail,
      isValid: true,
    };
    setListAccount(updatedListAccount);
  };

  const checkValidBackEnd = listEmailError => {
    const updatedList = [...listAccount];
    let listEmailActivedError = '';
    let check = true;
    let listError = {};
    delete listError.emailActivedError;
    if (listAccount.length === 0) {
      return false;
    }
    listEmailError.forEach(emailErrorObj => {
      updatedList.forEach(item => {
        if (emailErrorObj.email === item.email) {
          item.isValid = false;
          check = false;
          let emailErrorMessage = emailErrorObj.errorMessage;
          notify(emailErrorMessage);
          listEmailActivedError += `${emailErrorMessage}\n`;
        }
      });
    });

    if (listEmailActivedError)
      listError.emailActivedError = listEmailActivedError;
    if (check) listError = {};
    setListAccount(updatedList);
    setErrorMessage(listError);

    return check;
  };

  const checkValid = isSendEmail => {
    const updatedList = [...listAccount];
    const listEmailActive = {};
    let emailErrorMessage;
    let roleErrorMessage;
    let contractErrorMessage;
    let check = true;
    let listError = isSendEmail ? {} : { ...errorMessage };
    delete listError.emailError;
    delete listError.roleError;
    delete listError.contractError;
    if (listAccount.length === 0) {
      return false;
    }
    if (
      slotsAvailable.length ===
      monthContractIds.length + yearContractIds.length
    ) {
      check = false;
    }
    for (const item of activeAccounts) {
      listEmailActive[item.user_connection.member_email] = {};
    }
    for (const item of updatedList) {
      if (listEmailActive[item.email]) {
        item.isValid = false;
        check = false;
        listError.emailExist = formatMessage(
          {
            id: `i18n_email_exist_account`,
          },
          { listEmail: item.email },
        );

        notify(listError.emailExist);
      } else if (
        (item.email && item.role && item.contractType && !item.invalidEmail) ||
        (!item.email && !item.role && !item.contractType)
      ) {
        item.isValid = true;
      } else {
        if (!item.contractType) {
          contractErrorMessage = formatMessage({
            id: 'i18n_add_member_contract_type_error',
          });

          notify(contractErrorMessage);
        }
        if (!item.role) {
          roleErrorMessage = formatMessage({
            id: 'i18n_add_member_role_error',
          });

          notify(roleErrorMessage);
        }

        if (item.invalidEmail || !item.email) {
          emailErrorMessage = formatMessage({
            id: 'i18n_add_member_email_error',
          });

          notify(emailErrorMessage);
        }

        item.isValid = false;
        check = false;
      }
    }

    if (emailErrorMessage) listError.emailError = emailErrorMessage;
    if (roleErrorMessage) listError.roleError = roleErrorMessage;
    if (contractErrorMessage) listError.contractError = contractErrorMessage;
    if (check) listError = {};
    setListAccount(updatedList);
    setErrorMessage(listError);
    return check;
  };

  const checkValidTrial = isSendEmail => {
    const updatedList = [...listAccount];
    const listEmailActive = {};
    let emailErrorMessage;
    let roleErrorMessage;
    let contractErrorMessage;
    let check = true;
    let listError = isSendEmail ? {} : { ...errorMessage };
    delete listError.emailError;
    delete listError.roleError;
    delete listError.contractError;
    if (listAccount.length === 0) {
      return false;
    }
    // if (
    //   slotsAvailable.length ===
    //   monthContractIds.length + yearContractIds.length
    // ) {
    //   check = false;
    // }
    // for (const item of activeAccounts) {
    //   listEmailActive[item.user_connection.member_email] = {};
    // }
    for (const item of updatedList) {
      // if (listEmailActive[item.email]) {
      //   item.isValid = false;
      //   check = false;
      //   listError.emailExist = formatMessage(
      //     {
      //       id: `i18n_email_exist_account`,
      //     },
      //     { listEmail: item.email },
      //   );
      // }
      if (
        (item.email && item.role && item.contractType && !item.invalidEmail) ||
        (!item.email && !item.role && !item.contractType)
      ) {
        item.isValid = true;
      } else {
        if (!item.contractType) {
          contractErrorMessage = formatMessage({
            id: 'i18n_add_member_contract_type_error',
          });
          notify(contractErrorMessage);
        }
        if (!item.role) {
          roleErrorMessage = formatMessage({
            id: 'i18n_add_member_role_error',
          });
          notify(roleErrorMessage);
        }
        if (item.invalidEmail || !item.email) {
          emailErrorMessage = formatMessage({
            id: 'i18n_add_member_email_error',
          });
          notify(emailErrorMessage);
        }

        item.isValid = false;
        check = false;
      }
    }

    if (emailErrorMessage) listError.emailError = emailErrorMessage;
    if (roleErrorMessage) listError.roleError = roleErrorMessage;
    if (contractErrorMessage) listError.contractError = contractErrorMessage;
    if (check) listError = {};
    setListAccount(updatedList);
    setErrorMessage(listError);
    return check;
  };

  const columns = [
    {
      dataIndex: 'index',
      render: (_, record, index) => index + 1,
      align: 'center',
      width: '10%',
    },
    {
      title: formatMessage({ id: 'i18n_email' }),
      dataIndex: 'email',
      render: (_, record, index) => (
        <InputRowItem
          email={record.email}
          handleChangeEmail={handleChangeEmail}
          index={index}
          placeholder={formatMessage({
            id: 'i18n_email_placeholder',
          })}
          errorMessage={formatMessage({ id: 'i18n_invalid_email' })}
        />
      ),
    },
    {
      title: formatMessage({ id: 'i18n_authority' }),
      dataIndex: 'role',
      render: (_, record, index) => (
        <Select
          dropdownClassName={styles.selectDropdownClassname}
          value={record.role}
          placeholder={formatMessage({ id: 'i18n_authority_placeholder' })}
          onSelect={value => handleSelectOption(value, index, 'role')}
          allowClear
          onClear={() => handleSelectOption(undefined, index, 'role')}
        >
          <Option value={ROLE_MANAGER_CLIENT}>
            {formatMessage({ id: 'i18n_manager' })}
          </Option>
          <Option value={ROLE_MEMBER_CLIENT}>
            {formatMessage({ id: 'i18n_member' })}
          </Option>
        </Select>
      ),
      width: '26%',
    },
    {
      title: formatMessage({ id: 'i18n_contract_type' }),
      dataIndex: 'contractType',
      render: (_, record, index) => (
        <Select
          dropdownClassName={styles.selectDropdownClassname}
          value={record.contractType}
          placeholder={formatMessage({ id: 'i18n_contract_type_placeholder' })}
          onSelect={value => handleSelectOption(value, index, 'contractType')}
          onClear={() => handleSelectOption(undefined, index, 'contractType')}
          allowClear
        >
          <Option
            value={CONTRACT_BY_YEAR}
            className={yearContractIds.length === 0 && 'hideOption'}
          >
            {formatMessage({ id: 'i18n_annual_contract' })}
          </Option>

          <Option
            value={CONTRACT_BY_MONTH}
            className={monthContractIds.length === 0 && 'hideOption'}
          >
            {formatMessage({ id: 'i18n_monthly_contract' })}
          </Option>
        </Select>
      ),
      width: '26%',
    },
  ];

  const addMember = () => {
    setListAccount([
      ...listAccount,
      {
        email: null,
        role: null,
        contractType: null,
      },
    ]);
    setYearContractIds([...yearContractIds, null]);
    setMonthContractIds([...monthContractIds, null]);
  };

  const handleSendEmailInvitations = () => {
    let isValid;
    if (is_trial) {
      if (checkValidTrial('isSendEmail')) {
        isValid = true;
      }
    } else {
      if (checkValid('isSendEmail')) {
        isValid = true;
      }
    }
    if (isValid) {
      const invitees = listAccount.reduce((currentVal, nextVal) => {
        const { email, role, contractType, userContractId } = nextVal;
        if (email && role && contractType) {
          return currentVal.concat({
            email: email,
            role_type: role - 1,
            contract_type: contractType, // trial is null
            user_contract_id: userContractId,
          });
        }
        return currentVal;
      }, []);

      const payload = {
        invitees,
        showMessage: message,
        formatMessage,
        setLoadingSendMessage,
        checkValidBackEnd,
      };
      dispatch({ type: 'ACCOUNT/sendEmailInvitations', payload });
    }
  };

  return (
    <div>
      {createSuccess ? (
        <AddMemberComplete />
      ) : (
        <div className={styles.addMember}>
          <div className={styles.paymentTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon}></div>
              <div className={styles.normalColIcon}></div>
            </div>
            <div className={styles.paymentTitleText}>
              {formatMessage({ id: 'i18n_add_member' })}
            </div>
          </div>
          <div className={styles.addMemberDescript}>
            <div className={styles.descriptionTitle}>
              <div className={styles.descriptionTitleBorder}></div>
              <div className={styles.title}>
                {formatMessage({ id: 'i18n_step_add_member_description_1' })}
              </div>
            </div>
            <div>{formatMessage({ id: 'i18n_add_member_description_2' })}</div>
            <div>{formatMessage({ id: 'i18n_add_member_description_3' })}</div>
            <div>{formatMessage({ id: 'i18n_add_member_description_4' })}</div>
          </div>
          <div className={styles.addMemberDescript}>
            <div className={styles.descriptionTitle}>
              <div className={styles.descriptionTitleBorder}></div>
              <div className={styles.title}>
                {formatMessage({ id: 'i18n_step_add_member_description_2' })}
              </div>
            </div>
            {/* <div>{formatMessage({ id: 'i18n_add_member_description_5' })}</div> */}
          </div>

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
              loading={loadingSendMessage || loading}
              rowKey="id"
              scroll={{ y: 500 }}
              locale={{
                emptyText: formatMessage({ id: 'i18n_empty_data_table' }),
              }}
            />
            {is_trial && (
              <button
                type="button"
                onClick={addMember}
                className={styles.addMemberBtn}
              >
                + {formatMessage({ id: 'i18n_add_member' })}
              </button>
            )}
          </div>
          <div className={styles.errorMessageBox}>
            {/* <ul>
              {Object.values(errorMessage).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul> */}
          </div>
          <div className={styles.btnGroup}>
            <Button
              disabled={loading || loadingSendMessage}
              className={`btn btn-white__shadow btn-custom-height`}
              onClick={() => history.goBack()}
            >
              {formatMessage({ id: 'i18n_turn_back' })}
            </Button>
            <Button
              loading={loadingSendMessage}
              disabled={
                loading ||
                !listAccount.find(
                  item => item.email || item.contractType || item.role,
                )
              }
              style={
                loading ||
                !listAccount.find(
                  item => item.email || item.contractType || item.role,
                )
                  ? { cursor: 'not-allowed' }
                  : {}
              }
              className={`btn btn-custom-height ${
                !listAccount.find(
                  item => item.email || item.contractType || item.role,
                )
                  ? 'disabledBtn'
                  : 'btnGreen'
              }`}
              onClick={handleSendEmailInvitations}
            >
              {formatMessage({ id: 'i18n_send_invitation_email' })}
            </Button>
            {/* <Button
              className={`btn btn-custom-height ${
                !listAccount.find(
                  item => item.email || item.contractType || item.role,
                )
                  ? 'disabledBtn'
                  : 'btnGreen'
              }`}
              style={
                loading ||
                !listAccount.find(
                  item => item.email || item.contractType || item.role,
                )
                  ? { cursor: 'not-allowed' }
                  : {}
              }
              onClick={handleCreateConnections}
              disabled={
                loadingSendMessage ||
                !listAccount.find(
                  item => item.email || item.contractType || item.role,
                )
              }
              loading={loading}
            >
              {formatMessage({ id: 'i18n_registration' })}
            </Button> */}
          </div>
        </div>
      )}
      <Footer />

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
    </div>
  );
}

export default connect(({ ACCOUNT, USERCONNECTIONS }) => ({
  accountStore: ACCOUNT,
  userConnectionsStore: USERCONNECTIONS,
}))(AddMember);
