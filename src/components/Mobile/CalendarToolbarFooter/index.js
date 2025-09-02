import { useIntl, Link } from 'umi';
import styles from './styles.less';
import { UpOutlined } from '@ant-design/icons';
import iconCalendarClose from '@/assets/images/i-close-white.png';
import iconTitle from '@/assets/images/i-title.png';
import { Button, Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { notify } from '../../../commons/function';
import moment from 'moment';
import { ROUTER } from '@/constant';

function CalendarToolbarFooter(props) {
  const {
    isShowCandidate,
    isCalendarTitle,
    setCalendarTitle,
    isSubmitCalendarCreation,
  } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleChangeViewAutoCalendar = () => {
    isShowCandidate(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      calendar_title: isCalendarTitle,
    });
  }, [isCalendarTitle]);

  const handleCalendarCreation = () => {
    form
      .validateFields(['calendar_title'])
      .then(async value => {
        if (!value.errorFields) {
          setLoading(true);
          isSubmitCalendarCreation(true);
          setLoading(false);
        } else {
          notify(formatMessage({ id: 'i18n_please_fill_in_all_fields' }));
        }
      })
      .catch(err => err);
  };

  const renderUrlCalendar = () => {
    return `${ROUTER.calendar}`;
  };

  return (
    <div className={styles.footerCalendarCreation}>
      <div className={styles.footerCalendarCreationContent__item}>
        <div
          className={`${styles.footerCalendarCreation__title} ${styles.textDarkGray}`}
        >
          {formatMessage({ id: 'i18n_calendar_creation_title' })}
        </div>
        <div className={styles.footerCalendarCreation__action}>
          <Button
            onClick={handleChangeViewAutoCalendar}
            className={`${styles.footerCalendarCreation__action__select} ${styles.borderPrimaryBlue} ${styles.textPrimaryBlue} ${styles.rounded}`}
          >
            <span>{formatMessage({ id: 'i18n_view_detail' })}</span>
            <UpOutlined />
          </Button>
          <Link
            to={renderUrlCalendar}
            className={`${styles.footerCalendarCreation__action__button} ${styles.bgPrimaryBlue} ${styles.rounded}`}
          >
            <img src={iconCalendarClose} alt={'icon'} />
          </Link>
        </div>
      </div>
      <Form form={form} className={styles.footerCalendarCreation__form}>
        <Form.Item
          name={'calendar_title'}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'i18n_required_text' }),
            },
          ]}
        >
          <Input
            className={styles.inputField}
            placeholder={formatMessage({
              id: 'i18n_calendar_creation_title_filed',
            })}
            onChange={e => setCalendarTitle(e.target.value)}
            value={isCalendarTitle}
          />
        </Form.Item>
        <Button
          className={styles.saveBtn}
          loading={loading}
          htmlType="submit"
          onClick={handleCalendarCreation}
        >
          {formatMessage({ id: 'i18n_btn_save' })}
        </Button>
      </Form>
    </div>
  );
}

export default CalendarToolbarFooter;
