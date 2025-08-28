import React, { useEffect, useRef, useState } from 'react';
import styles from './style.less';
import { Row, Col, Input, Button, Spin } from 'antd';
import { useDispatch, useHistory, useSelector } from 'umi';
import config from '../../config';
import { convertStringToData, copyText, notify } from '../../commons/function';
import SettingTemplateRequest from '../../services/settingTemplateRequest.js';

const { TextArea } = Input;

export default () => {
  const dispatch = useDispatch();
  const { isLoadingTemplate, dataViewTemplate } = useSelector(
    store => store.SETTING_TEMPLATE,
  );

  // use refs get width,height text link embed
  const btnRefs = useRef();
  const [urlCopy, setUrlCopy] = useState('');
  const [urlElement, setUrlElement] = useState('');
  const [isLoadingCopyLink, setLoadingCopyLink] = useState(false);
  const [isLoadingCopyIframe, setLoadingCopyIframe] = useState(false);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleAdConversionId, setGoogleAdConversionId] = useState('');
  const [googleAdConversionLabel, setGoogleAdConversionLabel] = useState('');
  const [
    isLoadingSummitGoogleAnalytic,
    setIsLoadingSummitGoogleAnalytic,
  ] = useState(false);
  const [isLoadingSummitGoogleAd, setIsLoadingSummitGoogleAd] = useState(false);
  const [textEmbed, setTextEmbed] = useState({
    title: '',
    isSet: false,
    user_code: '',
    event_code: '',
    tracking: '',
    id: '',
    styles: {
      visibility: 'hidden',
    },
  });
  const history = useHistory();

  useEffect(() => {
    if (!Object.keys(dataViewTemplate).length) {
      history.push('/');
      return;
    }
    const { calendar, buttonEmbed, status, id } = dataViewTemplate;
    const { user_code, event_code, tracking } = calendar.calendar;
    setGoogleAnalyticsId(tracking);

    // link router
    let url = 'button-embed';
    let urlBooking = 'booking-calendar';
    let elementIframe;

    const urlLink = handleUrl(urlBooking, user_code, event_code, tracking, id);
    setUrlCopy(urlLink);

    if (status === 1) {
      const { styles } = buttonEmbed;
      const { height, width } = convertStringToData(styles);
      elementIframe =
        "<iframe src='" +
        handleUrl(url, user_code, event_code, tracking, id) +
        "' width='" +
        `${width}` +
        "' height='" +
        `${height}` +
        "' style='border: transparent'/>";
    }

    if (status === 2) {
      const { styles, text } = buttonEmbed;
      const { height, width, ...rest } = convertStringToData(styles);
      setTextEmbed({
        title: text,
        isSet: true,
        user_code,
        event_code,
        tracking,
        id,
        styles: { ...textEmbed.styles, ...rest, padding: 'unset' },
      });
    }

    if (status === 3) {
      elementIframe =
        "<iframe src='" +
        handleUrl(urlBooking, user_code, event_code, tracking, id) +
        "' style='border: transparent; overflow: auto; -webkit-overflow-scrolling: touch' width='900px' height='500px'/>";
    }

    setUrlElement(elementIframe);

    return () => {
      dispatch({
        type: 'SETTING_TEMPLATE/reset',
      });
    };
  }, []);

  // create element iframe embed
  useEffect(() => {
    const { isSet, user_code, event_code, tracking, id } = textEmbed;
    if (!isSet) {
      return;
    }

    let { height, width } = btnRefs.current.getBoundingClientRect();
    setUrlElement(
      "<iframe src='" +
        handleUrl('button-embed', user_code, event_code, tracking, id) +
        "' width='" +
        `${width}px` +
        "' height='" +
        `${height}px` +
        "' style='border: transparent'/>",
    );
  }, [textEmbed]);

  const handleUrl = (urlBooking, user_code, event_code, tracking, id) => {
    let urlTemplate = `${config.WEB_DOMAIN}/${urlBooking}?form_id=${id}&user_code=${user_code}&event_code=${event_code}`;
    if (tracking) {
      urlTemplate += `&tracking=${tracking}`;
    }
    return urlTemplate;
  };

  const copyUrl = () => {
    setLoadingCopyLink(true);
    copyText(urlCopy);

    setTimeout(() => {
      setLoadingCopyLink(false);
    }, 1000);
  };

  const copyElementIframe = () => {
    setLoadingCopyIframe(true);
    copyText(urlElement);

    setTimeout(() => {
      setLoadingCopyIframe(false);
    }, 1000);
  };

  const onSummitGoogleAnalytic = async () => {
    setIsLoadingSummitGoogleAnalytic(true);
    const response = await SettingTemplateRequest.createGoogleAnalyticOrAd({
      google_status: 0,
      google_analytics_id: googleAnalyticsId,
    });
    notify(response.body.status.message);
    setTimeout(() => {
      setIsLoadingSummitGoogleAnalytic(false);
    }, 1000);
  };

  const onSummitGoogleAd = async () => {
    setIsLoadingSummitGoogleAd(true);
    const response = await SettingTemplateRequest.createGoogleAnalyticOrAd({
      google_status: 1,
      google_ad_conversion_id: googleAdConversionId,
      google_ad_conversion_label: googleAdConversionLabel,
    });
    notify(response.body.status.message);
    setTimeout(() => {
      setIsLoadingSummitGoogleAd(false);
    }, 1000);
  };

  return (
    <Spin spinning={isLoadingTemplate}>
      <Row className={styles.containerFirst}>
        <Col sm={24}>
          <div className={styles.bigTitle}>
            <span>作成が完了しました！</span>
          </div>
          <div className={styles.smallTitle}>
            フォームの設置方法が２パターンございますので、下記よりご選択ください
          </div>
        </Col>
      </Row>
      <Row className={styles.container}>
        <Col lg={12} sm={24} className={styles.columnLeft}>
          <div className={styles.step}>
            <div className={styles.sectionText}>設置方法1：URLで埋め込む</div>
            <div className={styles.stepNumer}>
              <span>
                <b>STEP 1</b>
              </span>
            </div>
            <div className={styles.pdf25}>
              <div className={styles.stepText}>
                URLをコピーして使用します。
                <br /> Webサイト上やSNSにURLを設置できます。
              </div>
              <div>
                <Input
                  readOnly
                  value={urlCopy}
                  className={styles.stepInput}
                  placeholder="https://〜〜"
                />
              </div>
              <div className={styles.stepAction}>
                <Button
                  className={isLoadingCopyLink ? styles.active : ''}
                  onClick={copyUrl}
                >
                  {isLoadingCopyLink ? 'コピー完了' : 'URLをコピーする'}
                </Button>
              </div>
            </div>
            <div className={`${styles.stepNumer} ${styles.mgt60}`}>
              <span>
                <b>STEP 2</b>
              </span>
            </div>
            <div className={styles.pdf25}>
              <div className={styles.stepText}>
                Googleアナリティクスを埋め込む場合は下記より設定ください。
              </div>
              <div className={`${styles.stepText} ${styles.mgt20}`}>
                <div className={styles.beforeFieldIcon} />
                <b>
                  <span>Googleアナリティクス</span>
                </b>
                <div className={styles.mgt8}>トラッキングID</div>
              </div>
              <div>
                <Input
                  className={styles.stepInput}
                  placeholder="例：UA—00000000-0"
                  value={googleAnalyticsId}
                  onChange={e => {
                    setGoogleAnalyticsId(e.target.value);
                  }}
                />
              </div>
              <div className={styles.stepAction}>
                <Button
                  className={isLoadingSummitGoogleAnalytic ? styles.active : ''}
                  onClick={onSummitGoogleAnalytic}
                >
                  設定を完了する
                </Button>
              </div>

              {/*<div className={`${styles.stepText} ${styles.mgt45}`}>*/}
              {/*  <div className={styles.beforeFieldIcon} />*/}
              {/*  <b>*/}
              {/*    <span>Googleアナリティクス</span>*/}
              {/*  </b>*/}
              {/*  <div className={styles.mgt8}>コンバージョンID</div>*/}
              {/*</div>*/}
              {/*<div>*/}
              {/*  <Input*/}
              {/*    className={styles.stepInput}*/}
              {/*    placeholder="例：UA—00000000-0"*/}
              {/*    value={googleAdConversionId}*/}
              {/*    onChange={e => {*/}
              {/*      setGoogleAdConversionId(e.target.value);*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</div>*/}
              {/*<div className={styles.stepText}>コンバージョンラベル </div>*/}
              {/*<div>*/}
              {/*  <Input*/}
              {/*    className={styles.stepInput}*/}
              {/*    placeholder="例：UA—00000000-0"*/}
              {/*    value={googleAdConversionLabel}*/}
              {/*    onChange={e => {*/}
              {/*      setGoogleAdConversionLabel(e.target.value);*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</div>*/}
              {/*<div className={styles.stepAction}>*/}
              {/*  <Button*/}
              {/*    className={isLoadingSummitGoogleAd ? styles.active : ''}*/}
              {/*    onClick={onSummitGoogleAd}*/}
              {/*  >*/}
              {/*    設定を完了する*/}
              {/*  </Button>*/}
              {/*</div>*/}
            </div>
          </div>
        </Col>
        <Col lg={12} sm={24} className={styles.columnRight}>
          <div className={styles.step}>
            <div className={styles.sectionText}>
              設置方法2：Webサイトに直接埋め込む
            </div>
            <div className={styles.stepText2}>
              Webサイト上にフォームを埋め込むことができます。
              <br />
              （iframe方式）
              <br />
              フォームを設置したい場所に、
              <br />
              下記のコードを貼り付けてください。
            </div>
            <TextArea value={urlElement} className={styles.textAreaCptNav} />
            <div className={styles.stepAction}>
              <Button
                className={isLoadingCopyIframe ? styles.active : ''}
                onClick={copyElementIframe}
              >
                {isLoadingCopyIframe ? 'コピー完了' : 'コードをコピーする'}
              </Button>
            </div>
            <div>
              <button
                ref={btnRefs}
                className="textEmbed"
                style={{ ...textEmbed.styles }}
              >
                {textEmbed.title}
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Spin>
  );
};
