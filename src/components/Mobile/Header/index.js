import { connect } from 'dva';
import styles from './styles.less';
import { history } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import { ROUTER } from '@/constant';
import { profileFromStorage } from '@/commons/function';

function HeaderMobile(props) {
  const {
    title,
    primary,
    isShowLeft,
    isShowRight,
    itemLeft,
    itemRight,
    customStyleLeft,
    customStyleRight,
    handleEventLeft,
    handleEventRight,
    showLogo,
  } = props;
  const profile = profileFromStorage();

  const handleEventType = event => {
    if (!profile?.id) {
      history.push(ROUTER.login);
      return;
    }
    switch (event) {
      case 'back':
        history.push(itemLeft?.url);
        break;
      case 'left':
        handleEventLeft();
        break;
      case 'right':
        handleEventRight();
        break;
      case 'backRight':
        history.push(itemRight?.url);
        break;
      case 'history':
        history.go(-1);
        break;
      default:
        history.push(ROUTER.home);
        break;
    }
  };

  const headerLeft = () => {
    if (isShowLeft) {
      return (
        <div
          onClick={() => handleEventType(itemLeft?.event)}
          className={`${styles.backURL} ${itemLeft?.bgColor} ${itemLeft?.borderColor} ${itemLeft?.textColor} ${styles.rounded}`}
          style={customStyleLeft}
        >
          {itemLeft?.icon ? (
            <img src={itemLeft?.icon} alt={'icon'} />
          ) : (
            <div className={styles.itemName}>{itemLeft?.text}</div>
          )}
        </div>
      );
    }
  };

  const headerRight = () => {
    if (isShowRight) {
      return (
        <div
          onClick={() => handleEventType(itemRight?.event)}
          className={`${styles.backURL} ${itemRight?.bgColor} ${itemRight?.borderColor} ${itemRight?.textColor} ${styles.rounded}`}
          style={customStyleRight}
        >
          {itemRight?.icon ? (
            <img src={itemRight?.icon} alt={'icon'} />
          ) : (
            <>
              <div className={styles.itemName}>{itemRight?.text}</div>
              <DownOutlined />
            </>
          )}
        </div>
      );
    }
  };

  const renderHeader = () => {
    return (
      <div className={`${styles.mainHeader} main-header`}>
        <div
          className={`${styles.flexHeader} ${primary?.bgColor} ${
            primary?.textColor
          } ${showLogo ? styles.flexHeaderLogo : ''}`}
          style={{
            backgroundColor: primary?.bgColor,
            color: primary?.textColor,
          }}
        >
          <div className={`${styles.headerMenuLeft}`}>{headerLeft()}</div>
          {showLogo ? (
            <div className={`${styles.headerLogo}`}>
              <img
                src={require('@/assets/images/logo.png')}
                alt={'logo'}
                className={styles.logo}
              />
            </div>
          ) : (
            <div className={`${styles.headerTitle}`}>{title}</div>
          )}

          <div className={`${styles.headerMenuRight} header-menu-right`}>
            {headerRight()}
          </div>
        </div>
      </div>
    );
  };

  return <>{renderHeader()}</>;
}

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(HeaderMobile);
