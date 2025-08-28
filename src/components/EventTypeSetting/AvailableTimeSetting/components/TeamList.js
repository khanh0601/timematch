import React from 'react';
import { Tooltip, Button, Checkbox, Input } from 'antd';
import { useIntl } from 'umi';

import { RightOutlined, DownOutlined } from '@ant-design/icons';
import helper from '@/assets/images/imgQuestion.png';
import userBoldImage from '@/assets/images/user-bold.png';
import Popup from 'reactjs-popup';
import ModalAddCalendarTeam from '@/components/ModalAddCalendarTeam';
import styles from '../../basic_styles.less';
import useWindowDimensions from '@/commons/useWindowDimensions';
import TooltipFormat from '../../../TooltipFormat';

const listDataTooltipMember = [
  '選択したメンバーの日程がカレンダーに反映され、メンバーのスケジュールを参考にした上で、',
  '「自動生成・手動生成」選択の上、候補日程の作成ができます。',
  '',
  '利用例：',
  '①チームメンバー全員が都合のいい日時を選択したい',
  '②チームメンバーで1人でも都合のいい日時を選択したい',
  '③秘書による会社役員・マネージャー等の日程調整をしたい',
  '②フリーランス・副業など複数のアドレスを利用する方が都合のいい日時を選択したい',
];

export default function TeamList({
  profile,
  members,
  onChecked,
  show,
  setShow,
  onSendEmail,
}) {
  const { formatMessage } = useIntl();
  const [provider, setProvider] = React.useState(false);
  const { width } = useWindowDimensions();

  const onSetProvider = provider => {
    if (provider === 'google' && profile.google_email !== null) {
      window
        .open(
          'https://calendar.google.com/calendar/u/0/r/settings/addcalendar',
          '_blank',
          'toolbar=0,location=0,menubar=0',
        )
        .focus();
      // } else if (provider === 'microsoft' && profile.microsoft_email !== null) {
      //   window.open('https://outlook.live.com/calendar/0/view/month')
    } else {
      setProvider(provider);
    }
  };

  if (!show && width > 768) {
    return (
      <div className={styles.teamMemberHide}>
        <div
          className={styles.buttonTeamMemberHide}
          onClick={() => setShow(true)}
        >
          <img className={styles.userBoldImage} src={userBoldImage} />
          <RightOutlined className={styles.chevronRightImage} />
        </div>
      </div>
    );
  }

  if (show) {
    return (
      <div className={styles.teamMemberShow}>
        <div
          className={styles.buttonTeamMemberShow}
          onClick={() => setShow(false)}
        >
          <div className={styles.beforeFieldIcon} />
          <p className={styles.listTeamTitle}>
            {formatMessage({ id: 'i18n_select_member' })}
          </p>
          <Tooltip title={<TooltipFormat dataFormat={listDataTooltipMember} />}>
            <img src={helper} className="helper" />
          </Tooltip>
          <DownOutlined className={styles.chevronDownImage} />
        </div>

        {members.map((member, index) => {
          return (
            <div key={index}>
              <Checkbox
                style={{
                  '--background-color': member.color,
                  '--border-color': member.color,
                }}
                checked={member.checked}
                className={styles.listCheckBoxTeamMember}
                onChange={e => onChecked(e.target.checked, member)}
              >
                <span title={member.email} className={styles.lineClamp}>
                  {member.hide
                    ? `${formatMessage({ id: 'i18n_anonymous_member' })}${
                        member.hide
                      }`
                    : member.email}
                </span>
              </Checkbox>
            </div>
          );
        })}

        <AddMemberPopup setProvider={onSetProvider} />
        <SendEmailPopup
          provider={provider}
          setProvider={setProvider}
          onSendEmail={onSendEmail}
        />
      </div>
    );
  }

  return '';
}

const AddMemberPopup = ({ setProvider }) => {
  const { formatMessage } = useIntl();
  return (
    <Popup
      modal
      trigger={
        <div className={styles.buttonAddMember}>
          <p>{formatMessage({ id: 'i18n_add_member_calendar' })}</p>
        </div>
      }
    >
      {close => (
        <ModalAddCalendarTeam setProvider={setProvider} onClose={close} />
      )}
    </Popup>
  );
};

const SendEmailPopup = ({ provider, setProvider, onSendEmail }) => {
  const { formatMessage } = useIntl();
  const [email, setEmail] = React.useState('');

  const onSubmit = () => {
    onSendEmail(provider, email);
    setProvider(null);
  };

  return (
    <Popup open={!!provider} modal onClose={() => setProvider(false)}>
      {close => (
        <div className={`modal ${styles.sendEmailPop}`}>
          <p className={`close ${styles.close}`} onClick={close}>
            &times;
          </p>
          <div className="header">
            <p>{formatMessage({ id: 'i18n_add_member_send_email_title' })}</p>
          </div>
          <br />
          <div className={styles.content}>
            <p>{formatMessage({ id: 'i18n_add_member_send_email_body_1' })}</p>
            <p>{formatMessage({ id: 'i18n_add_member_send_email_body_2' })}</p>
            <br />
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
          </div>
          <br />
          <div>
            <Button className={styles.button} onClick={onSubmit}>
              {formatMessage({ id: 'i18n_add_member_send_email_button' })}
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );
};
