import { deleteLocalInfo } from '@/commons/function';
import MenuSPBottom from '@/components/MenuSPBottom';
import { ExclamationCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react';
import { history, useIntl, withRouter } from 'umi';
import './styles.less';
const { confirm } = Modal;
import {
  UserOutlined,
  EditFilled,
  ContactsOutlined,
  TableOutlined,
  DesktopOutlined,
  WarningOutlined,
  MailOutlined,
} from '@ant-design/icons';
import HeaderMobile from '@/components/Mobile/Header';

const MenuPage = () => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const handleLogout = () => {
    confirm({
      title: intl.formatMessage({ id: 'i18n_confirm_logout' }),
      icon: <ExclamationCircleOutlined />,
      cancelText: intl.formatMessage({ id: 'i18n_cancel_text' }),
      okText: intl.formatMessage({ id: 'i18n_logout' }),
      className: 'logoutConfirm',
      onOk: () => {
        deleteLocalInfo();
        history.push('/');
        // location.reload();
      },
    });
  };

  return (
    <div className="menu-page">
      <div className="header">メニュー</div>
      <div className="menu-content bgGreyBlue">
        <div
          onClick={() => {
            history.push('/profile');
          }}
          className="content-item shadowPrimary bgWhite textPrimaryBlue"
        >
          <UserOutlined
            style={{
              fontSize: 22,
            }}
          />{' '}
          <div>プロフィール</div>
        </div>
        <div
          onClick={() => {
            history.push('/mail-template');
          }}
          className="content-item shadowPrimary bgWhite textPrimaryBlue"
        >
          <MailOutlined
            style={{
              fontSize: 22,
            }}
          />{' '}
          <div>定型文の作成</div>
        </div>
        <div
          onClick={() => {
            history.push('/contact-management');
          }}
          className="content-item shadowPrimary bgWhite textPrimaryBlue"
        >
          <ContactsOutlined
            style={{
              fontSize: 22,
            }}
          />
          <div>メールの送付先管理</div>
        </div>
        {/*<div*/}
        {/*  onClick={() => {*/}
        {/*    history.push('base-notation');*/}
        {/*  }}*/}
        {/*  className="content-item shadowPrimary bgWhite textPrimaryBlue"*/}
        {/*>*/}
        {/*  <DesktopOutlined*/}
        {/*    style={{*/}
        {/*      fontSize: 22,*/}
        {/*    }}*/}
        {/*  />{' '}*/}
        {/*  <div>このサイトについて</div>*/}
        {/*</div>*/}
        <div
          onClick={() => {
            history.push('documentation');
          }}
          className="content-item shadowPrimary bgWhite textPrimaryBlue"
        >
          <TableOutlined
            style={{
              fontSize: 22,
            }}
          />{' '}
          <div>ご利用ガイド</div>
        </div>
        <div
          onClick={() => {
            window.open('https://vision-net.co.jp/privacy.html', '_blank');
          }}
          className="content-item shadowPrimary bgWhite textPrimaryBlue"
        >
          <WarningOutlined
            style={{
              fontSize: 22,
            }}
          />{' '}
          <div>プライバシーポリシー</div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '8px',
            color: 'white',
            fontSize: 16,
            marginBottom: '20px',
          }}
          onClick={handleLogout}
          className="bgMediumGray textLightGray shadowPrimary"
        >
          <LogoutOutlined
            style={{
              fontSize: 22,
            }}
          />{' '}
          <div style={{ marginLeft: 8 }}>ログアウト</div>
        </div>
      </div>
      <MenuSPBottom />
    </div>
  );
};

export default withRouter(MenuPage);
