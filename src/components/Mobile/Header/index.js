import { connect } from 'dva';
import styles from './styles.less';
import { useIntl } from 'umi';
import iconBack from '@/assets/images/i-back-white.png';
import iconCalendarClose from '@/assets/images/i-close-white.png';
import { Button, Select } from 'antd';

function HeaderMobile(props) {
  const intl = useIntl();
  const {
    createEventType,
    hideHeader,
    typeHeader,
    showModal,
    title,
    isShowBack,
    isCalendarCreation,
    isSelectDetail,
    backURL,
    isRight,
  } = props;
  const { formatMessage } = intl;
  const mapTypeHeader = ['calendar'];

  const handleShowModal = () => {
    showModal();
  };

  const handleBackPage = () => {
    window.location.href = '/login';
  };

  const handleBackCalendar = () => {
    window.location.href = '/calendar';
  };

  const headerLeft = () => {
    if (isCalendarCreation) {
      return (
        <Button
          className={styles.headerMenuLeft}
          style={{ width: '10%' }}
          onClick={handleBackCalendar}
        >
          <img src={iconCalendarClose} alt={'icon'} />
        </Button>
      );
    } else {
      return (
        <Button className={styles.headerMenuLeft} onClick={handleShowModal}>
          {formatMessage({ id: 'i18n_name' })}
        </Button>
      );
    }
  };

  const handleSelectDetail = value => {
    isSelectDetail(value);
  };

  const headerRight = () => {
    if (isCalendarCreation && isRight) {
      return (
        <Select defaultValue={'true'} onChange={handleSelectDetail}>
          <Select.Option value="false">
            {formatMessage({ id: 'i18n_view_hide' })}
          </Select.Option>
          <Select.Option value="true">
            {formatMessage({ id: 'i18n_view_detail' })}
          </Select.Option>
        </Select>
      );
    } else {
      return <div className={styles.headerMenuRight}></div>;
    }
  };

  const renderHeader = () => {
    if (!mapTypeHeader.includes(typeHeader) && !hideHeader) {
      return (
        <div className={`${styles.mainHeader}`}>
          <div className={`${styles.flexHeader} ${styles.bgBlue}`}>
            {isShowBack ? (
              <Button
                className={`${styles.headerMenuLeft} ${styles.bgBackBtn}`}
                onClick={handleBackPage}
              >
                <img src={iconBack} alt={'icon'} />
              </Button>
            ) : (
              <div className={styles.headerMenuRight}></div>
            )}
            <div className={`${styles.headerTitle} ${styles.textWhite}`}>
              {title}
            </div>
            <div className={styles.headerMenuRight}></div>
          </div>
        </div>
      );
    } else if (mapTypeHeader.includes(typeHeader) && !hideHeader) {
      return (
        <div className={`${styles.mainHeader}`}>
          <div className={`${styles.flexHeader}`}>
            {headerLeft()}
            <div className={`${styles.headerTitle}`}>{title}</div>
            {headerRight()}
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return <>{renderHeader()}</>;
}

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(HeaderMobile);
