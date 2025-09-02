import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import Header from '@/components/Header';
import styles from './styles.less';
import { Redirect } from 'umi';
import config from '@/config';

function Authenticated({ children }) {
  const [checkDevice, setCheckDevice] = useState(false);
  const [checkChrome, setCheckChrome] = useState(false);
  const [checkFirefoxNotMac, setCheckFirefoxNotMac] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const device = navigator.userAgent.toLowerCase();
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    if (device.indexOf('firefox') > -1 && !isMac) {
      setCheckFirefoxNotMac(true);
    }

    if (isMac) {
      // add class for chrome in macos
      if (device.indexOf('chrome') > -1) {
        setCheckChrome(true);
      }
      // add class for firefox in macos
      if (device.indexOf('firefox') > -1) {
        setCheckFirefox(true);
      }
      if (device.indexOf('safari') > -1) {
        setCheckDevice(true);
      }
    } else {
      setNotMac(true);
    }
  }, []);

  if (window.location.hostname === config.ADMIN_HOSTNAME) {
    return <Redirect to="/admin/accounts" />;
  }

  const classes = [
    styles.layout,
    checkDevice ? styles.safari : '',
    checkChrome ? styles.chrome : '',
    checkFirefoxNotMac ? styles.firefox : '',
  ];

  return (
    <div className={classes.join(' ')}>
      <Header createEventType={createEventType} />
      {children}
      <div id="tooltip-root"></div>
    </div>
  );
}

export default withRouter(Authenticated);
