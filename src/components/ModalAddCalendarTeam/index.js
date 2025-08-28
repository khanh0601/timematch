import React from 'react';
import styles from './styles.less';
import googleIconImage from '@/assets/images/google-icon.png';
import microsoftIconImage from '@/assets/images/microsoft-icon.png';
import { useIntl } from 'umi';

export default function ModalAddCalendarTeam({ setProvider, onClose }) {
  const { formatMessage } = useIntl();

  return (
    <div className="modal">
      <p className="close" onClick={onClose}>
        &times;
      </p>
      <div className="header">
        <p>
          {formatMessage({ id: 'i18n_modal_add_calendar_team_header_line_1' })}
        </p>
        <p>
          {formatMessage({ id: 'i18n_modal_add_calendar_team_header_line_2' })}
        </p>
      </div>
      <br />
      <div className="content">
        <p>
          {formatMessage({ id: 'i18n_modal_add_calendar_team_content_line_1' })}
        </p>
        <p>
          {formatMessage({ id: 'i18n_modal_add_calendar_team_content_line_2' })}
        </p>
        <br />
        <p>
          {formatMessage({ id: 'i18n_modal_add_calendar_team_content_line_3' })}
        </p>
        <p>
          {formatMessage({ id: 'i18n_modal_add_calendar_team_content_line_4' })}
        </p>
      </div>
      <br />
      <div className="actions">
        <p
          className="button"
          onClick={() => {
            setProvider('google');
            onClose();
          }}
        >
          <img
            className={styles.googleIconImage}
            src={googleIconImage}
            alt="google Icon"
          ></img>
          {formatMessage({ id: 'i18n_modal_add_calendar_team_account_google' })}
        </p>
      </div>
      <div className="actions">
        <p
          className="button"
          onClick={() => {
            setProvider('microsoft');
            onClose();
          }}
        >
          <img
            className={styles.microsoftIconImage}
            src={microsoftIconImage}
          ></img>
          {formatMessage({
            id: 'i18n_modal_add_calendar_team_account_microsoft',
          })}
        </p>
      </div>
    </div>
  );
}
