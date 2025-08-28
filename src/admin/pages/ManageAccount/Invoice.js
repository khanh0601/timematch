import React from 'react';
import { useIntl } from 'umi';
import styles from './styles.less';
import {
  FORMAT_DATE_TEXT,
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
  PAYMENT_TAX,
} from '@/constant';
import dayjs from 'dayjs';

function Invoice({ data }) {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div id="pdf-element" className={styles.invoiceContainer}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <table className="tableInvoice">
          <tbody>
            <tr>
              <td>請求書番号</td>
              <td></td>
            </tr>
            <tr>
              <td>請求日</td>
              <td>{dayjs().format(FORMAT_DATE_TEXT)}</td>
            </tr>
            <tr>
              <td>振込期日</td>
              <td>
                {dayjs().date() < 20
                  ? dayjs()
                      .endOf('month')
                      .format(FORMAT_DATE_TEXT)
                  : dayjs()
                      .add(1, 'month')
                      .endOf('month')
                      .format(FORMAT_DATE_TEXT)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'center', borderBottom: '3px solid black' }}>
        請 　求 　 書
      </div>
      <div>
        <div>会社名:EVERGREEN株式会社</div>
        <div>〒110-0008</div>
        <div>東京都台東区池之端一丁目1番1号</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div>担当：藤本 祐美子</div>
            <div>TEL：090-5666-0600</div>
          </div>
          <div>
            <div>会社名: {data.company}</div>
            <div>担当者名: {data.name}</div>
          </div>
        </div>
        <div>下記の通りご請求申し上げます。</div>
      </div>
      <div>
        <table className="tableInvoice" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>対象月</th>
              <th>件名</th>
              <th>アカウント数</th>
              <th>契約種別</th>
              <th colSpan={2}>金額</th>
              <th>備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{dayjs().month() + 1}月</td>
              <td>Smoothlyサービス利用料</td>
              <td>{data.quantity}</td>
              <td>
                {data.type_contract === CONTRACT_BY_MONTH
                  ? formatMessage({ id: 'i18n_by_month' })
                  : data.type_contract === CONTRACT_BY_YEAR
                  ? formatMessage({ id: 'i18n_by_year' })
                  : ''}
              </td>
              <td colSpan={2}></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ width: '150px' }}>小計（税抜)</td>
              <td style={{ width: '100px' }}>{data.price}</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>消費税</td>
              <td>{data.price && data.price + data.price * PAYMENT_TAX}</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>合計金額</td>
              <td>
                {data.price &&
                  data.price * data.quantity +
                    data.price * data.quantity * PAYMENT_TAX}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div>【振込先】</div>
        <table>
          <tbody>
            <tr>
              <td>銀行名:</td>
              <td>楽天銀行</td>
            </tr>
            <tr>
              <td>支店名：</td>
              <td>第一営業支店</td>
            </tr>
            <tr>
              <td>口座種別：</td>
              <td>普通</td>
            </tr>
            <tr>
              <td>口座番号: </td>
              <td>251</td>
            </tr>
            <tr>
              <td>口座名義：</td>
              <td>7943803</td>
            </tr>
          </tbody>
        </table>
        <div>振り込み手数料はEVERGREEN株式会社負担と致します。</div>
      </div>
    </div>
  );
}

export default Invoice;
