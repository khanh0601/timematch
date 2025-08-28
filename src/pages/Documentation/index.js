import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { LeftOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import DocImg11 from '@/assets/images/document1-1.png';
import DocImg12 from '@/assets/images/document1-2.png';
import DocImg21 from '@/assets/images/document2-1.png';
import DocImg22 from '@/assets/images/document2-2.png';
import DocImg23 from '@/assets/images/document2-3.png';
import DocImg24 from '@/assets/images/document2-4.png';
import DocImg25 from '@/assets/images/document2-5.png';
import DocImg31 from '@/assets/images/document3-1.png';
import DocImg32 from '@/assets/images/document3-2.png';
import DocImg33 from '@/assets/images/document3-3.png';
import DocImg34 from '@/assets/images/document3-4.png';

function Documentation(props) {
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
      <div className={styles.documentation}>
        <h1>1. CONNECT TO ZOOM</h1>
        <p>
          1. After login to <a href="/">smoothly.jp</a>, click{' '}
          <strong>"“サービス連携”"</strong>. <br />
          <img src={DocImg11} />
        </p>
        <p>
          2. Click <strong>“連携する”</strong> to connect to Zoom. <br />
          <img src={DocImg12} />
        </p>
        <p>
          When you connected to Zoom, you can book a Zoom Room by Smoothly app.
        </p>
        <h1>2. USAGE</h1>
        <p>
          1. After login to <a href="/">smoothly.jp</a>, click{' '}
          <strong>"新規作成"</strong>. <br />
          <img src={DocImg31} />
        </p>
        <p>
          2. Input your event type information and then submit by click button{' '}
          <strong>"作 成"</strong>
          <img src={DocImg32} />
        </p>
        <p>
          3. In list event type, click button <strong>"一回利用 URL"</strong> or{' '}
          <strong>"継続利用 URL"</strong> to book calendar. After you clicked in
          that, our system will auto copy a link that you can go and book
          calendar.
          <img src={DocImg33} />
        </p>
        <p>
          4. Open in new tab and paste the link that our system auto-copied for
          you and go. In this page, please choose the time you want, fill some
          information if it needed. And it've done.
          <img src={DocImg34} />
        </p>
        <h1>2. DISCONNECT ZOOM</h1>
        <p>
          1. After login to <a href="/">smoothly.jp</a>, click to{' '}
          <strong>“アカウント設定”</strong>. <br />
          <img src={DocImg21} />
        </p>
        <p>
          2. Click <strong>“解除する”</strong> to disconnect Zoom. <br />
          <img src={DocImg22} />
        </p>
        <p>
          3. Go to this page :{' '}
          <a href="https://marketplace.zoom.us/">
            https://marketplace.zoom.us/
          </a>{' '}
          and login.
        </p>
        <p>
          4. Click <strong>"Manage"</strong>. <br />
          <img src={DocImg23} />
        </p>
        <p>
          5. Click to <strong>"Installed Apps"</strong>.<br />
          <img src={DocImg24} />
        </p>
        <p>
          6. Click to button <strong>"Uninstall"</strong> of your Zoom account.{' '}
          <br />
          <img src={DocImg25} />
        </p>
      </div>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(Documentation);
