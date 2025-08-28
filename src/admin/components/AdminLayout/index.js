import React, { useState } from 'react';
import { Redirect, withRouter, history, useIntl } from 'umi';
import { Layout, Menu, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getCookie } from '@/commons/function.js';
import styles from './styles.less';
import logoImage from '@/assets/images/logo-black.svg';
import ManageAccount from '@/admin/pages/ManageAccount';
import AddNewAccount from '@/admin/pages/AddNewAccount';
import AddNewAgency from '@/admin/pages/AddNewAgency';
import ListAgency from '@/admin/pages/ListAgency';
import { deleteLocalInfo } from '@/commons/function';
import ChangePassword from '../ChangePassword';

const { Content, Sider } = Layout;
const { confirm } = Modal;

function AdminLayout(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { location } = props;
  const isLogin = getCookie('token');
  const [visible, setVisible] = useState(false);

  const menu = [
    {
      title: formatMessage({ id: 'i18n_account_management' }),
      listItem: [
        {
          name: formatMessage({ id: 'i18n_list_of_acccount' }),
          linkTo: '/admin/accounts',
        },
        {
          name: formatMessage({ id: 'i18n_add_new' }),
          linkTo: '/admin/add-new-account',
        },
      ],
    },
    {
      title: formatMessage({ id: 'i18n_agency_management' }),
      listItem: [
        {
          name: formatMessage({ id: 'i18n_list_of_agencies' }),
          linkTo: '/admin/list-agency',
        },
        {
          name: formatMessage({ id: 'i18n_add_new' }),
          linkTo: '/admin/add-new-agency',
        },
      ],
    },
    {
      title: formatMessage({ id: 'i18n_update_password' }),
      isLogoutTitle: true,
      listItem: [],
    },
    {
      title: formatMessage({ id: 'i18n_logout' }),
      isLogoutTitle: true,
      listItem: [],
    },
  ];

  const handleClickMenuTitle = title => {
    if (title === formatMessage({ id: 'i18n_logout' })) {
      confirm({
        title: intl.formatMessage({ id: 'i18n_confirm_logout' }),
        icon: <ExclamationCircleOutlined />,
        cancelText: intl.formatMessage({ id: 'i18n_cancel_text' }),
        okText: intl.formatMessage({ id: 'i18n_logout' }),
        className: styles.logoutConfirm,
        onOk: () => {
          deleteLocalInfo();
          history.push('/admin/login');
        },
      });
    } else if (title === formatMessage({ id: 'i18n_update_password' })) {
      setVisible(true);
    }
  };

  const handleClickMenuItem = item => {
    history.push(item.key);
  };

  const checkActiveMenu = link => {
    return link === location.pathname;
  };

  if (isLogin) {
    return (
      <Layout className={styles.LayoutContainer}>
        <Sider className={styles.adminSider}>
          <div className={styles.headerLogo} onClick={() => history.push('/')}>
            <img src={logoImage} className={styles.imgLogo} />
          </div>
          <Menu
            mode="inline"
            theme="dark"
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleClickMenuItem}
          >
            {menu.map(menuGroup => (
              <Menu.ItemGroup
                className={menuGroup.isLogoutTitle && 'logoutTitle'}
                key={menuGroup.title}
                title={
                  <div onClick={() => handleClickMenuTitle(menuGroup.title)}>
                    {menuGroup.title}
                  </div>
                }
              >
                {menuGroup.listItem.map(menuItem => (
                  <Menu.Item
                    className={
                      checkActiveMenu(menuItem.linkTo) && 'menu_item_active'
                    }
                    key={menuItem.linkTo}
                  >
                    {menuItem.name}
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            ))}
          </Menu>
        </Sider>

        <Layout className={styles.layoutContent}>
          <Content className={styles.contentContainer}>
            {location.pathname === '/admin/accounts' && <ManageAccount />}
            {location.pathname === '/admin/add-new-account' && (
              <AddNewAccount />
            )}
            {location.pathname === '/admin/add-new-agency' && <AddNewAgency />}
            {location.pathname === '/admin/list-agency' && <ListAgency />}
            <ChangePassword
              visible={visible}
              onClose={() => setVisible(false)}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
  return <Redirect to="/admin/login" />;
}

export default withRouter(AdminLayout);
