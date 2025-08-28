import { Button } from 'antd';
import { useIntl } from 'umi';

import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';

import styles from '../styles.less';

function CardLogin({ microsoftLogin, googleLogin }) {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <>
      <Button onClick={googleLogin} className={`${styles.btnSocial}`}>
        <img src={iconGoogle} alt={'Google'} />
        {formatMessage({ id: 'i18n_google_login' })}
      </Button>
      <Button onClick={microsoftLogin} className={`${styles.btnSocial}`}>
        <img src={iconOffice} alt={'Microsoft'} />
        {formatMessage({ id: 'i18n_microsoft_login' })}
      </Button>
    </>
  );
}

export default CardLogin;
