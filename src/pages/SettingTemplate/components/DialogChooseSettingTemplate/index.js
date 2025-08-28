import React from 'react';
import { Button, Modal } from 'antd';
import styles from './styles.less';
import { useDispatch, useHistory } from 'umi';

const DialogChooseSettingTemplate = ({ visible, closeModal }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleClick = type => {
    closeModal();
    dispatch({
      type: 'ACCOUNT_TEAM/resetAccountTeam',
    });
    history.push(`/setting-template?type=${type}`);
  };

  return (
    <Modal
      width={1070}
      visible={visible}
      onCancel={closeModal}
      wrapClassName={styles.dialogChooseTemplate}
      footer={null}
    >
      <div className={styles.bodyTemplate}>
        <h2 className={styles.embedTitle}>
          Webサイト上に、候補日時を直接埋め込む ことができます。
        </h2>
        <div className={styles.embedModalContent}>
          <div
            className={styles.embedModalInner}
            onClick={() => handleClick(1)}
          >
            <div>
              <div />
              <div>
                <div />
                <div />
                <div />
              </div>
              <div>
                <Button>オンライン予約ページへ</Button>
              </div>
            </div>
            <div>
              <h2>「ボタン」で埋め込む</h2>
              <p>日程調整ページに遷移するボタンを</p>
              <p>簡単に設置できます。</p>
            </div>
          </div>

          <div
            className={styles.embedModalInner}
            onClick={() => handleClick(2)}
          >
            <div>
              <div />
              <div>
                <div />
                <div />
                <div />
              </div>
              <div>
                <p className={styles.embedLinkButton}>オンライン予約ページへ</p>
              </div>
            </div>
            <div>
              <h2>「テキスト」で埋め込む</h2>
              <p>テキストに日程調整ページを埋め込む</p>
              <p>際のタグを簡単に発行できます。</p>
            </div>
          </div>

          <div
            className={styles.embedModalInner}
            onClick={() => handleClick(3)}
          >
            <div>
              <div />

              <div>
                <div />
                <div />
                <div />
              </div>

              <div>
                <p className={styles.embedLinkButton}>オンライン予約ページへ</p>
              </div>
            </div>
            <div>
              <h2 style={{ paddingLeft: '11px' }}>
                候補日時を「直接」埋め込む
              </h2>
              <p>Webサイト上に、候補日時を直接埋め込む</p>
              <p>ことができます。</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DialogChooseSettingTemplate;
