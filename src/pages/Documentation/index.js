import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { Spin } from 'antd';
import { connect } from 'dva';
import HeaderMobile from '@/components/Mobile/Header';
import { ROUTER } from '@/constant';

import iconBack from '@/assets/images/i-back-white.png';
import doc01 from '@/assets/images/doc-01.png';
import doc02 from '@/assets/images/doc-02.png';
import doc03 from '@/assets/images/doc-03.png';
import doc04 from '@/assets/images/doc-04.png';
import doc05 from '@/assets/images/doc-05.png';
import docPC01 from '@/assets/images/pc/doc-01.png';
import docPC02 from '@/assets/images/pc/doc-02.png';
import docPC03 from '@/assets/images/pc/doc-03.png';
import docPC04 from '@/assets/images/pc/doc-04.png';
import docPC05 from '@/assets/images/pc/doc-05.png';
import docPC06 from '@/assets/images/pc/doc-06.png';
import docPC07 from '@/assets/images/pc/doc-07.png';
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
      {isMobile ? (
        <HeaderMobile
          title={formatMessage({ id: 'i18n_document_title' })}
          isShowLeft={true}
          itemLeft={{
            event: 'back',
            url: ROUTER.menu,
            icon: iconBack,
            bgColor: 'bgPrimaryBlue',
            textColor: 'textLightGray',
          }}
          handleEventLeft={() => {
            history.push('/');
          }}
        />
      ) : (
        <PCHeader />
      )}

      {isMobile ? null : (
        <div
          style={{
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 700,
            padding: '40px 0',
          }}
        >
          ご利用ガイド
        </div>
      )}

      <div className={`${styles.documentation} bgGreyBlue`}>
        <section>
          <h2 className="textPrimaryBlue fontWeightBold fontSize24">
            日程設定方法
          </h2>
          <div className={styles.content}>
            <div className={styles.title}>
              <div
                className={`${styles.titleText} fontWeightBold bgLightBlue textDarkBlue rounded-lg px-4 py-2 fontSize16`}
              >
                日程作成1
              </div>
              <div className="fontWeightBold fontSize20">候補を提案</div>
            </div>
            <div className={styles.image}>
              <img src={isMobile ? doc01 : docPC01} alt="document-1" />
            </div>
            {isMobile ? (
              <div className={styles.description}>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeightBold fontSize14`}
                  >
                    <span className="bgLightBlue py-2 rounded-xs">
                      メニュー
                    </span>
                    <span className="px-1">→</span>
                    <span className="bgLightBlue py-2 rounded-xs">
                      プロフィール
                    </span>
                    <span className="px-1">→</span>
                    <span className="bgLightBlue py-2 rounded-xs">
                      自動調節オプション
                    </span>
                  </div>
                </div>
                <div
                  style={{ paddingTop: 5, paddingLeft: 30, fontWeight: 500 }}
                  className="fontSize16"
                >
                  で設定した日程を自動抽出
                </div>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    2
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    自動抽出した日程から候補日と時間選択
                  </div>
                </div>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    3
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    候補日程を選択できたら「保存」ボタンで完了
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.description}>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 14,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeightBold fontSize14`}
                  >
                    <span
                      className="bgLightBlue py-2 rounded-xs"
                      style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                      }}
                    >
                      予定を作成
                    </span>
                    <span className="px-1">→</span>
                    <span
                      className="bgLightBlue py-2 rounded-xs"
                      style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                      }}
                    >
                      候補を自動抽出
                    </span>
                  </div>
                </div>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 16,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    2
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    自動抽出した日程から候補日と時間選択
                  </div>
                </div>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 16,
                    paddingBottom: 12,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    3
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    候補日程を選択できたら「保存」ボタンで完了
                  </div>
                </div>
              </div>
            )}
            <div className={styles.title} style={{ paddingTop: 20 }}>
              <div
                className={`${styles.titleText} fontWeightBold bgLightBlue textDarkBlue fontSize16 rounded-lg px-4 py-2`}
              >
                日程作成2
              </div>
              <div className="fontWeightBold fontSize20">
                カレンダーから選択
              </div>
            </div>
            <div className={styles.image}>
              <img src={isMobile ? doc02 : docPC02} alt="document-2" />
            </div>
            {isMobile ? (
              <div className={`${styles.description} pb-2`}>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    カレンダーから直接選択
                  </div>
                </div>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    2
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    「詳細」ボタンクリックして作成を仕上げる
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${styles.description} pb-2`}>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 14,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    カレンダーから選択
                  </div>
                </div>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 16,
                    paddingBottom: 12,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    2
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    候補日が自動的に入る
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="bgWhite">
          <h2 className="textPrimaryBlue fontWeightBold">
            設定した候補日を参加者に共有
          </h2>
          <div className={styles.content}>
            <div className={styles.image}>
              <img src={isMobile ? doc03 : docPC03} alt="document-3" />
            </div>
            {isMobile ? (
              <div className={`${styles.description} pb-2`}>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    URL共有
                  </div>
                </div>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    2
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    定型文で共有
                  </div>
                </div>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    3
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    参加者のメールで共有
                  </div>
                </div>
                <div
                  style={{
                    paddingTop: 2,
                    paddingLeft: 30,
                    fontWeight: 500,
                    color: '#7A7A7A',
                    fontSize: 12,
                  }}
                >
                  ※参加者が返信するためには加入必須
                </div>
              </div>
            ) : (
              <div className={`${styles.description} pb-2`}>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 14,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    URL共有
                  </div>
                </div>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 16,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    2
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    定型文で共有
                  </div>
                </div>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 16,
                    paddingBottom: 12,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    3
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    参加者のメールで共有
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <section>
          <h2 className="textPrimaryBlue fontWeightBold">日程を確定</h2>
          <div className={styles.content}>
            <div className={styles.image}>
              <img src={isMobile ? doc04 : docPC04} alt="document-4" />
            </div>
            {isMobile ? (
              <div className={`${styles.description} pb-2`}>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    参加者が返信して可能な日に対してボタンが活性しますので、「確定」→「決定」ボタンでで完了
                  </div>
                </div>
                <div
                  style={{
                    paddingTop: 2,
                    paddingLeft: 30,
                    fontWeight: 500,
                    color: '#7A7A7A',
                    fontSize: 12,
                  }}
                >
                  ※全ての参加者が返信したら確定できる
                </div>
              </div>
            ) : (
              <div className={`${styles.description} pb-2`}>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 14,
                    paddingBottom: 12,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    参加者が返信して可能な日に対してボタンが活性しますので、「確定」→「決定」ボタンでで完了
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="bgWhite">
          <h2 className="textPrimaryBlue fontWeightBold">日程削除</h2>
          <div className={styles.content}>
            <div className={styles.image}>
              <img src={isMobile ? doc05 : docPC05} alt="document-5" />
              {isMobile ? null : (
                <img
                  style={{ paddingTop: 24 }}
                  src={docPC06}
                  alt="document-6"
                />
              )}
              {isMobile ? null : (
                <img
                  style={{ paddingTop: 24 }}
                  src={docPC07}
                  alt="document-6"
                />
              )}
            </div>
            {isMobile ? (
              <div className={`${styles.description} pb-2`}>
                <div className={styles.descItem}>
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    日程をスワイプすると削除可能。
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${styles.description} pb-2`}>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 14,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    1
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    「調整一覧」選択
                  </div>
                </div>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 16,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    2
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    作成した日程にマウスを上にあげて削除アイコンが表した時、クリックして削除
                  </div>
                </div>
                <div
                  className={styles.descItem}
                  style={{
                    paddingTop: 16,
                    paddingBottom: 12,
                  }}
                >
                  <div
                    className={`${styles.descItemIcon} bgPrimaryBlue textLightGray fontWeightBold rounded-full`}
                  >
                    3
                  </div>
                  <div
                    className={`${styles.descItemText} fontWeight500 fontSize16`}
                  >
                    作成した日程を選択して「削除」クリック
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(Documentation);
