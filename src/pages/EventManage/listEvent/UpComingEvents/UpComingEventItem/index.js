import { getStep } from '@/commons/function.js';
import useWindowDimensions from '@/commons/useWindowDimensions';
import {
  GOOGLE_MEET_M_LOCATION_ID,
  TYPE_VOTE_RELATIONSHIP,
  ZOOM_M_LOCATION_ID,
  MICROSOFT_TEAMS_M_LOCATION_ID,
} from '@/constant';
import { Button } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { history, useIntl } from 'umi';
import styles from '../../styles.less';

function UpComingEventItem(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [detail, setDetail] = useState(false);
  const { calendar } = props;
  const { width } = useWindowDimensions();

  const showEmail = () => {
    const result = [];
    calendar.voters.map(item => {
      if (result.find(element => element === item.invite_email) === undefined) {
        result.push(item.invite_email);
      }
    });
    return result.join(', ');
  };

  function cloneEvent() {
    history.push(
      `/calendar-creation?idEvent=${calendar.event_id}&clone=1&relationship_type=${calendar.event_relationship_type}`,
    );
  }

  const redirectToMicrosoftLink = url => {
    window.location.replace(url);
  };

  const votersCount =
    calendar.event_relationship_type == TYPE_VOTE_RELATIONSHIP ? (
      <>
        {calendar.voters[0] ? (
          <div className={styles.voteCount}>
            {calendar.voters.length}{' '}
            {formatMessage({
              id: 'i18n_tab_preview_text_in',
            })}{' '}
            {calendar.voted_voters_count}{' '}
            {formatMessage({
              id: 'i18n_tab_preview_text_after',
            })}
          </div>
        ) : (
          <div className={styles.voteCount}>
            0{' '}
            {formatMessage({
              id: 'i18n_tab_preview_text_in',
            })}{' '}
            0{' '}
            {formatMessage({
              id: 'i18n_tab_preview_text_after',
            })}
          </div>
        )}
      </>
    ) : (
      ''
    );

  return (
    <div>
      <div className={styles.eventBox} key={calendar.id}>
        <div>
          <div className={styles.eventTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon}></div>
              <div className={styles.normalColIcon}></div>
            </div>
            <h2>
              <span>
                {moment(calendar.start_time).format('MMMM Do (dd) HH:mm')}
              </span>
              <span>～</span>
              <span>
                {moment(calendar.start_time)
                  .add(getStep(calendar), 'minutes')
                  .format('HH:mm')}
              </span>
            </h2>
            {width >= 767 && votersCount}
          </div>
          {width < 767 && votersCount}
          <div className={styles.eventDetail}>
            <div className={styles.eventTime}>
              <p>
                {formatMessage({ id: 'i18n_meeting_format' })}：
                {calendar.event && calendar.event.real_category}
                <br />
                {formatMessage({
                  id: 'i18n_calendar_category_description',
                })}
              </p>
              <div className={styles.eventTypesList}>
                {calendar.move_number && (
                  <div className={styles.eventType}>
                    <p>
                      {moment(calendar.start_time)
                        .subtract(calendar.move_number, 'minutes')
                        .format('HH:mm')}{' '}
                      ~{moment(calendar.start_time).format('HH:mm')}
                    </p>
                    <div className={styles.selectBar}></div>
                    <p>{formatMessage({ id: 'i18n_move_time' })}</p>
                  </div>
                )}
                <div className={styles.eventType}>
                  <p>
                    {moment(calendar.start_time).format('HH:mm')}～
                    {moment(calendar.start_time)
                      .add(calendar.block_number, 'minutes')
                      .format('HH:mm')}
                  </p>
                  <div className={`${styles.selectBar} ${styles.active}`}></div>
                  <p>{formatMessage({ id: 'i18n_event_time_short' })}</p>
                </div>
                {calendar.move_number && (
                  <div className={styles.eventType}>
                    <p>
                      {moment(calendar.start_time)
                        .add(calendar.block_number, 'minutes')
                        .format('HH:mm')}
                      ～
                      {moment(calendar.start_time)
                        .add(
                          calendar.block_number + calendar.move_number,
                          'minutes',
                        )
                        .format('HH:mm')}
                    </p>
                    <div className={styles.selectBar}></div>
                    <p>{formatMessage({ id: 'i18n_move_time' })}</p>
                  </div>
                )}
              </div>
            </div>
            <div className={`${styles.eventLocation} ${'mm'}`}>
              <div className={styles.guest}>
                <p className={styles.avatar}>{calendar.owner_name.charAt(0)}</p>
                <p className={styles.name}>{calendar.owner_name}</p>
              </div>

              <p style={{ wordBreak: 'break-all' }}>
                {formatMessage({ id: 'i18n_meeting_location' })} ：
                {calendar.location_name}
              </p>
              {calendar.m_location_id === ZOOM_M_LOCATION_ID &&
                calendar.zoom_url && (
                  <a href={calendar.zoom_url} className={styles.string}>
                    {formatMessage({ id: 'i18n_zoom_url' })}
                  </a>
                )}
              {calendar.m_location_id === GOOGLE_MEET_M_LOCATION_ID &&
                calendar.google_meet_url && (
                  <a
                    href={calendar.google_meet_url}
                    className={styles.locationLinkBadge}
                  >
                    {formatMessage({ id: 'i18n_google_meet_url' })}
                  </a>
                )}
              {calendar.m_location_id === MICROSOFT_TEAMS_M_LOCATION_ID &&
                calendar.microsoft_team_url && (
                  <div
                    className={`${styles.locationLinkBadge} ${styles.locationMicrosoft}`}
                    onClick={() =>
                      redirectToMicrosoftLink(calendar.microsoft_team_url)
                    }
                  >
                    Microsoft Teams
                    <br />
                    URLはこちら
                  </div>
                )}
            </div>
            <div className={styles.eventAction}>
              {width > 767 ? (
                <Button
                  className={`${styles.cancelButton}`}
                  onClick={() => setDetail(!detail)}
                >
                  {formatMessage({ id: 'i18n_view_detail' })}
                </Button>
              ) : (
                <Button
                  className={`${styles.cancelButton}`}
                  style={{
                    border: detail ? '#38c5c9 2px solid' : '#d4d4d4 2px solid',
                  }}
                  onClick={() => setDetail(!detail)}
                >
                  {formatMessage({ id: 'i18n_view_detail' })}
                </Button>
              )}

              <Button
                className={styles.cancelButton}
                onClick={() =>
                  history.push(`/cancel-booking?id=${calendar.id}`)
                }
              >
                {formatMessage({ id: 'i18n_cancel' })}
              </Button>
              <Button
                className={styles.cancelButton}
                onClick={() => {
                  cloneEvent();
                }}
              >
                {formatMessage({ id: 'i18n_copy_menu' })}
              </Button>
            </div>
          </div>
        </div>
        {detail && (
          <div>
            <div className={styles.endLine}></div>
            <div className={`${styles.eventInfo} ${styles.detail}`}>
              <div className={styles.infoLine}>
                <div className={styles.boldColIcon}></div>
                <p className={styles.infoTitle}>
                  {formatMessage({ id: 'i18n_company_name' })}
                </p>
                <p>{calendar.owner_company}</p>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.boldColIcon}></div>
                <p className={styles.infoTitle}>
                  {formatMessage({ id: 'i18n_contact_info' })}
                </p>
                <p>{calendar.owner_contact_infor}</p>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.boldColIcon}></div>
                <p className={styles.infoTitle}>
                  {formatMessage({ id: 'i18n_comment' })}
                </p>
                <p>{calendar.description}</p>
              </div>
              {calendar.voters[0] && (
                <div className={styles.infoLine}>
                  <div className={styles.boldColIcon}></div>
                  <p className={styles.infoTitle}>
                    {formatMessage({ id: 'i18n_vote_title' })}
                  </p>
                  <p>{showEmail()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpComingEventItem;
