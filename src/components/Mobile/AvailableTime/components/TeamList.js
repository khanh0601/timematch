import { formatMessage } from 'umi';
import styles from '../../basic_styles.less';
import { Button, Input } from 'antd';
import React from 'react';

function TeamList(props) {
  const { provider, onSendEmail, modalTeamVisible } = props;
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = () => {
    setLoading(true);
    onSendEmail(provider, email);
    modalTeamVisible(false);
    setLoading(false);
  };

  return (
    <>
      <div className={styles.content}>
        <p>{formatMessage({ id: 'i18n_add_member_send_email_body_1' })}</p>
        <p>{formatMessage({ id: 'i18n_add_member_send_email_body_2' })}</p>
      </div>
      <Input
        className={`${styles.inputField} ${styles.inputSendMail}`}
        placeholder={formatMessage({
          id: 'i18n_add_member_send_email_placeholder',
        })}
        type="email"
        autoComplete="on"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <div className={styles.btnTeamList}>
        <Button
          loading={loading}
          className={`${styles.button} ${styles.bgDarkBlue}`}
          onClick={onSubmit}
        >
          {formatMessage({ id: 'i18n_add_member_send_email_button' })}
        </Button>
      </div>
    </>
  );
}

export default TeamList;
