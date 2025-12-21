import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { Spin } from 'antd';
import { connect } from 'dva';
import HeaderMobile from '@/components/Mobile/Header';
import { ROUTER } from '@/constant';

import iconBack from '@/assets/images/i-back-white.png';
import docpc01 from '@/assets/images/doc_pc1.jpg';
import docpc02 from '@/assets/images/doc_pc2.jpg';
import docpc03 from '@/assets/images/doc_pc3.jpg';
import docpc04 from '@/assets/images/doc_pc4.jpg';
import docmb01 from '@/assets/images/doc_mb1.png';
import docmb02 from '@/assets/images/doc_mb2.png';
import docmb03 from '@/assets/images/doc_mb3.png';
import docmb04 from '@/assets/images/doc_mb4.png';
import docmb05 from '@/assets/images/doc_mb5.png';
import useIsMobile from '@/hooks/useIsMobile';
import PCHeader from '@/components/PC/Header';
import FooterMobile from '@/components/Mobile/Footer';

function Documentation(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;

  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Spin spinning={loading}>
      <PCHeader />

      <div className={`${styles.documentation}`}>
        <div className={styles.documentation_top}>
          <h1 className={styles.documentation_top_title}>ご利用ガイド</h1>
        </div>
        <section>
          {isMobile ? (
            <h2 className={styles.documentation_title}>日程設定方法</h2>
          ) : (
            ''
          )}
          {isMobile ? (
            <div className={styles.documentation_img}>
              <div className={styles.documentation_img_item}>
                <img src={docmb01} alt="doc01" />
              </div>
              <div className={styles.documentation_img_item}>
                <img src={docmb02} alt="doc02" />
              </div>
              <div className={styles.documentation_img_item}>
                <img src={docmb03} alt="doc03" />
              </div>
              <div className={styles.documentation_img_item}>
                <img src={docmb04} alt="doc04" />
              </div>
              <div className={styles.documentation_img_item}>
                <img src={docmb05} alt="doc05" />
              </div>
            </div>
          ) : (
            <div className={styles.documentation_img}>
              <div className={styles.documentation_img_item}>
                <img src={docpc01} alt="doc01" />
              </div>
              <div className={styles.documentation_img_item}>
                <img src={docpc02} alt="doc02" />
              </div>
              <div className={styles.documentation_img_item}>
                <img src={docpc03} alt="doc03" />
              </div>
              <div className={styles.documentation_img_item}>
                <img src={docpc04} alt="doc04" />
              </div>
            </div>
          )}
          <div className={styles.documentation_btn}>
            <button
              className={styles.documentation_btn_item}
              onClick={() => history.push('/')}
            >
              元ページに戻る
            </button>
          </div>
        </section>
      </div>
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(Documentation);
