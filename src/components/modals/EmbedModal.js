import React, { useState } from 'react';
import styles from './styles.less';
import { Button, Modal, Spin, Input, message } from 'antd';
import { connect } from 'dva';
import { copyText } from '@/commons/function';
import { Link, useIntl } from 'umi';
import useWindowDimensions from '@/commons/useWindowDimensions';

function EmbedModal(props) {
  const { width } = useWindowDimensions();
  const { visible, embedUrl, closeModal } = props;
  const { TextArea } = Input;
  const [
    showModalCopyContentEmbedLink,
    setShowModalCopyContentEmbedLink,
  ] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const intl = useIntl();
  const { formatMessage } = intl;

  const handleClick = option => {
    if (option === 1) {
      const code = `<a href="${embedUrl}" style="text-decoration: none;" target="_blank">
      <button class="btn btn-success" style='display:block;margin: 0 auto;width:110px;border-radius:16px;font-weight:bold;background-color:#33c3c7;color:white;border:1px solid transparent;box-shadow:0 2px 0 rgb(0 0 0 / 2%);cursor: pointer;font-weight:400;'>
      <span styles='display: inline-block;'>オンライン相談</span>
      </button></a>`;
      setEmbedCode(code);
      setShowModalCopyContentEmbedLink(true);
    }
    if (option === 2) {
      setEmbedCode(
        `<a style='color: #33c3c7;font-size:14px;text-align:center;text-decoration: none;' target="_blank" href='${embedUrl}'>オンライン相談</a>`,
      );
      setShowModalCopyContentEmbedLink(true);
    }
  };

  const onChange = e => {
    setEmbedCode(e.target.value);
  };

  return (
    <>
      {showModalCopyContentEmbedLink === false ? (
        <Modal
          width={800}
          visible={visible}
          onCancel={closeModal}
          bodyStyle={{
            paddingTop: '49px',
            height: width < 767 ? '984px' : 'auto',
          }}
          footer={[
            <Button
              key="back"
              className={styles.backButtonModal}
              onClick={closeModal}
            >
              戻る
            </Button>,
          ]}
        >
          <h2 className={styles.embemModalTitle}>
            WEBサイトへの埋め込み方法を選択してください。
          </h2>
          <div className={styles.embedModalContent}>
            <div
              className={styles.embedModalInner}
              onClick={() => handleClick(1)}
            >
              <div>
                <div></div>
                <div>
                  <div></div>
                  <div></div>
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
                <div></div>
                <div>
                  <div></div>
                  <div></div>
                </div>
                <div>
                  <p className={styles.embedLinkButton}>
                    オンライン予約ページへ
                  </p>
                </div>
              </div>
              <div>
                <h2>「テキスト」で埋め込む</h2>
                <p>テキストに日程調整ページを埋め込む</p>
                <p>際のタグを簡単に発行できます。</p>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal visible={visible} closable={false} footer={null} width={700}>
          <div className={styles.modalCopyContentEmbedLinkContainer}>
            <h2>埋め込みコード</h2>
            <p>ボタンを設置したい場所にこのコードを貼り付けることで、</p>
            <p>WEBページにボタンを設置できます。</p>
            <Button
              className={styles.buttonCopyContent1}
              onClick={() => {
                copyText(embedCode);
                message.success(formatMessage({ id: 'i18n_copied' }));
              }}
            >
              コードをコピーする
            </Button>
            <TextArea
              defaultValue={embedCode}
              rows={7}
              className={styles.textArea}
              onChange={onChange}
            />
            <p>
              WordPress、Wixなどでの操作方法については、ヘルプページの
              <Link to="qa" className={styles.linkEmbedCode}>
                「埋め込みコード」
              </Link>
              をご確認ください。
            </p>
            <Button
              className={styles.buttonCopyContent2}
              onClick={() => {
                copyText(embedCode);
                message.success(formatMessage({ id: 'i18n_copied' }));
              }}
            >
              コードをコピーする
            </Button>
            <div className={styles.buttonFooterContainer}>
              <Button onClick={() => setShowModalCopyContentEmbedLink(false)}>
                戻る
              </Button>
              <Button
                onClick={() => {
                  closeModal();
                  setShowModalCopyContentEmbedLink(false);
                }}
              >
                閉じる
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default connect(({ EVENT }) => ({
  eventStore: EVENT,
}))(EmbedModal);
