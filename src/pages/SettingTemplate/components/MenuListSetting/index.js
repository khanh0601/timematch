import React, { memo, useEffect, useState } from 'react';
import { Menu } from 'antd';
import styles from './index.less';
import {
  MESSAGE_ERROR_BUTTON_EMBED_EMPTY,
  SETTING_TEMPLATE,
} from '../../../../constant';
import { useDispatch, useHistory, useLocation, useSelector } from 'umi';
import { notify } from '../../../../commons/function';

const MenuListSetting = memo(() => {
  let { location } = useHistory();
  const { templateActive, dataButtonEmbedTemplate } = useSelector(
    store => store.SETTING_TEMPLATE,
  );
  const dispatch = useDispatch();
  const [hideSettingBtn, setHideSettingBtn] = useState(false);
  let { query } = useLocation();
  const history = useHistory();

  useEffect(() => {
    const { query } = location;
    if (query?.type === '3') {
      setHideSettingBtn(true);
    }
  }, []);

  const onChangeKey = e => {
    const { key } = e;
    if ([SETTING_TEMPLATE.logo, SETTING_TEMPLATE.home].includes(key)) {
      history.push('/');
      return;
    }

    if (
      templateActive === SETTING_TEMPLATE.buttonEmbedTemplate &&
      !dataButtonEmbedTemplate.text
    ) {
      notify(MESSAGE_ERROR_BUTTON_EMBED_EMPTY);
      return;
    }

    dispatch({
      type: 'SETTING_TEMPLATE/onActiveTemplate',
      payload: key,
    });
  };

  return (
    <Menu
      className={styles.menuListSetting}
      selectedKeys={[templateActive]}
      onClick={onChangeKey}
      mode="horizontal"
    >
      <Menu.Item key={SETTING_TEMPLATE.logo}>
        <div className={styles.headerLogo}>
          <div className={styles.imgLogo} />
        </div>
      </Menu.Item>

      <Menu.Item key={SETTING_TEMPLATE.home}>ホームに戻る</Menu.Item>

      {!hideSettingBtn && (
        <Menu.Item
          key={SETTING_TEMPLATE.buttonEmbedTemplate}
          className={
            templateActive === SETTING_TEMPLATE.buttonEmbedTemplate
              ? styles.activeItem
              : ''
          }
        >
          {query?.type === '1' ? 'ボタン' : 'テキスト'}
        </Menu.Item>
      )}

      <Menu.Item
        key={SETTING_TEMPLATE.calendarTemplate}
        className={
          templateActive === SETTING_TEMPLATE.calendarTemplate
            ? styles.activeItem
            : ''
        }
      >
        カレンダー＆説明箇所
      </Menu.Item>

      <Menu.Item
        key={SETTING_TEMPLATE.confirmTemplate}
        className={
          templateActive === SETTING_TEMPLATE.confirmTemplate
            ? styles.activeItem
            : ''
        }
      >
        入力項目
      </Menu.Item>
    </Menu>
  );
});

export default MenuListSetting;
