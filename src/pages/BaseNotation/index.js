import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Row, Col, Table } from 'antd';
import HomeHeader from '@/components/HomeHeader';
import { LeftOutlined } from '@ant-design/icons';
function BaseNotation(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid darkblue',
          padding: 15,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            background: 'dodgerblue',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
          onClick={() => history.go(-1)}
        >
          <LeftOutlined style={{ color: '#FFF' }} />
        </div>
        <div className={styles.header}>プロフィール</div>
        <div
          style={{
            width: 30,
            height: 30,
          }}
        ></div>
      </div>
      <div className={styles.baseNotation}>
        <h3>特定商取引に基づく表記</h3>
        <table>
          <tr>
            <td>事業者名</td>
            <td>LiTAER株式会社</td>
          </tr>
          <tr>
            <td>代表責任者名</td>
            <td>藤本　尚也</td>
          </tr>
          <tr>
            <td>所在地</td>
            <td>〒110-0008　東京都台東区池之端1-1-1</td>
          </tr>

          <tr>
            <td>連絡先</td>
            <td>
              「<a href="mailto:info@smoothly.jp">info@smoothly.jp</a>
              」よりお問い合わせください。
            </td>
          </tr>
          <tr>
            <td>販売価格</td>
            <td>サービス説明ページにてご確認ください。</td>
          </tr>
          <tr>
            <td>その他の必要費用</td>
            <td>
              消費税（銀行振込の場合に振込手数料をお客様にご負担いただいております）
            </td>
          </tr>
          <tr>
            <td>お支払い方法</td>
            <td>
              クレジットカード決済もしくは請求書払い（一部の法人のみ）による銀行振込も可
            </td>
          </tr>
          <tr>
            <td>サービス提供時期</td>
            <td>お申し込み後、即日</td>
          </tr>
          <tr>
            <td rowspan="2">返品の可否と条件</td>
            <td>サービスの性質上、返品・返金は受け付けておりません。</td>
          </tr>
          <tr>
            <td>
              解約をご希望の場合は、上記メールアドレスまでご連絡ください。
            </td>
          </tr>
          <tr>
            <td>動作環境</td>
            <td>「サポート」をご確認ください。</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(BaseNotation);
