import React from 'react';
import styles from './styles.less';
import { useIntl } from 'umi';
import { Button } from 'antd';

function ContractConfirm() {
  const intl = useIntl();
  const { formatMessage } = intl;
  return (
    <div className={styles.contractConfirm}>
      <div className={styles.headTitle}>
        <div className={styles.titleIcon}>
          <div className={styles.bolderCol}></div>
          <div className={styles.thinnerCol}></div>
        </div>
        <p>{formatMessage({ id: 'i18n_contract_detail_confirm' })}</p>
      </div>
      <p className={styles.reminder}>
        {formatMessage({ id: 'i18n_contract_detail_confirm_reminder' })}
      </p>
      <div className={styles.tableContent}>
        <table>
          <tr>
            <td>{formatMessage({ id: 'i18n_contract_term' })}</td>
            <td>10/1/2020～11/1/2020</td>
          </tr>
          <tr>
            <td>{formatMessage({ id: 'i18n_added_account' })}</td>
            <td>1</td>
          </tr>
          <tr>
            <td>{formatMessage({ id: 'i18n_contract_type' })}</td>
            <td>月額</td>
          </tr>
          <tr>
            <td>{formatMessage({ id: 'i18n_used_money_not_included_tax' })}</td>
            <td>790円</td>
          </tr>
          <tr>
            <td>{formatMessage({ id: 'i18n_used_money_included_tax' })}</td>
            <td>869円</td>
          </tr>
          <tr>
            <td>{formatMessage({ id: 'i18n_credit_card' })}</td>
            <td>
              ******3931
              <Button className={styles.changeBtn}>
                {formatMessage({ id: 'i18n_change' })}
              </Button>
            </td>
          </tr>
        </table>
      </div>
      <div className={styles.btnZone}>
        <Button className={styles.returnBtn}>
          {formatMessage({ id: 'i18n_turn_back' })}
        </Button>
        <Button className={styles.paymentConfirmBtn}>
          {formatMessage({ id: 'i18n_payment_confirm' })}
        </Button>
      </div>
    </div>
  );
}

export default ContractConfirm;
