import React, { memo, useEffect, useState } from 'react';
import ColorPicker from '../ColorPicker';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './index.less';
import SelectSizeText from '../SelectSizeText';

const ToolBoxButton = memo(
  ({
    onChangeText,
    valueText,
    typeButtonEmbedSetting,
    styleBtn,
    onChangeStyleBtn,
    styleText,
    onChangeStyleText,
    onSubmit,
    onPre,
  }) => {
    const [activeStyle, setActiveStyle] = useState(false);
    const [valColor, setValColor] = useState('');

    useEffect(() => {
      if (!activeStyle && styleText) {
        // add value color
        setValColor(styleText['color']);
      }
    }, [styleText]);

    // handle active style
    const onChangeActiveStyle = () => {
      if (activeStyle) {
        setValColor(styleText['color']);
      }

      if (!activeStyle) {
        let color;
        if (typeButtonEmbedSetting) {
          color = styleBtn['background'];
        }
        if (!typeButtonEmbedSetting) {
          const [itemColor, itemColor2, rest] = styleBtn['borderBottom'].split(
            ' ',
          );
          color = rest;
        }
        setValColor(color);
      }
      setActiveStyle(!activeStyle);
    };

    const onChangeColor = val => {
      {
        /*setting style text*/
      }
      if (!activeStyle) {
        onChangeStyleText({
          ...styleText,
          color: val,
        });
        setValColor(val);
      }

      {
        /*setting style button*/
      }

      if (activeStyle) {
        let objColor;
        if (typeButtonEmbedSetting) {
          objColor = { background: val };
        }
        if (!typeButtonEmbedSetting) {
          objColor = { borderBottom: '2px solid ' + val };
        }

        onChangeStyleBtn({
          ...styleBtn,
          ...objColor,
        });
        setValColor(val);
      }
    };

    const onChangeTextSize = (name, value) => {
      if (name === 'fontSize') {
        onChangeStyleText({
          ...styleText,
          [name]: value,
        });
      }
      if (['height', 'width'].includes(name)) {
        onChangeStyleBtn({
          ...styleBtn,
          [name]: value,
        });
      }
      // if (name !== 'fontSize') {
      //   setValBtnSize({
      //     ...valBtnSize,
      //     [name]: valFormat,
      //   });
      // }
    };

    return (
      <div className={styles.toolBox}>
        <div className={styles.title}>
          <p>
            {typeButtonEmbedSetting
              ? 'ボタンをカスタマイズできます'
              : 'テキストをカスタマイズできます'}
          </p>
        </div>
        <div className={styles.stepItem}>
          <div className={styles.stepHeader}>
            <div className={styles.lineItem}>
              <div className={styles.lineBig} />
              <div className={styles.lineChild} />
            </div>
            <div className={styles.stepName}>
              <p>step&nbsp;1:</p>
            </div>
            <span>
              {typeButtonEmbedSetting
                ? 'ボタンに表示するテキストを'
                : '埋め込むテキストを'}
              <br />
              ご入力ください
            </span>
          </div>
          <div className={styles.stepContent}>
            <input
              type="text"
              value={valueText}
              onChange={e => onChangeText(e.target.value)}
              className={styles.inputName}
              placeholder="例）オンライン相談はこちら"
            />
          </div>
        </div>
        <div className={styles.stepItem}>
          <div className={styles.stepHeader}>
            <div className={styles.lineItem}>
              <div className={styles.lineBig} />
              <div className={styles.lineChild} />
            </div>
            <div className={styles.stepName}>
              <p>step&nbsp;2:</p>
            </div>
            <span>
              {typeButtonEmbedSetting
                ? 'ボタン・テキストの色と'
                : 'テキストとアンダーバーの'}
              <br />
              {typeButtonEmbedSetting
                ? 'テキストサイズを変更いただけます'
                : '色を変更いただけます'}
            </span>
          </div>
          <div className={styles.stepContent}>
            <div className={styles.switchSetting}>
              {/*setting style text*/}
              <div
                onClick={onChangeActiveStyle}
                className={`${!activeStyle ? styles.active : ''}`}
              >
                テキスト
              </div>

              {/*setting style button*/}
              <div
                onClick={onChangeActiveStyle}
                className={`${activeStyle ? styles.active : ''}`}
              >
                {typeButtonEmbedSetting ? 'ボタン' : 'アンダーバー'}
              </div>
            </div>

            <div className={styles.formSettingItem}>
              <p className={styles.formSettingTitle}>①色の変更</p>
              <div className={styles.formSettingContent}>
                <ColorPicker
                  valColor={valColor}
                  onChangeColor={onChangeColor}
                />
              </div>
            </div>

            <div className={styles.formSettingItem}>
              <p className={styles.formSettingTitle}>②テキストのサイズの変更</p>
              <div className={styles.formSettingContent}>
                <SelectSizeText
                  name="fontSize"
                  classStyle={styles.selectFontSize}
                  updateStyle={onChangeTextSize}
                  valSelect={styleText['fontSize']}
                />
              </div>
            </div>

            {typeButtonEmbedSetting && (
              <div className={styles.formSettingItem}>
                <p className={styles.formSettingTitle}>③ボタンのサイズの変更</p>
                <div className={styles.formSettingContent}>
                  <div className={styles.widthHeight}>
                    <div className={styles.title}>横幅：</div>
                    <div className={styles.content}>
                      <SelectSizeText
                        name="width"
                        classStyle={styles.selectButton}
                        updateStyle={onChangeTextSize}
                        valSelect={styleBtn['width']}
                      />
                    </div>
                  </div>
                  <div className={styles.widthHeight}>
                    <div className={styles.title}>縦幅：</div>
                    <div className={styles.content}>
                      <SelectSizeText
                        name="height"
                        classStyle={styles.selectButton}
                        updateStyle={onChangeTextSize}
                        valSelect={styleBtn['height']}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={`${styles.btnGroupSubmit} ${styles.btnGroupSubmitText}`}
        >
          <button onClick={onPre}>
            <LeftOutlined className={styles.iconNextLef} />
            <span>戻る</span>
          </button>
          <button onClick={onSubmit}>
            <span>次へ</span>
            <RightOutlined
              style={{
                fontWeight: 'bold',
              }}
              className={styles.iconNextRight}
            />
          </button>
        </div>
      </div>
    );
  },
);

export default ToolBoxButton;
