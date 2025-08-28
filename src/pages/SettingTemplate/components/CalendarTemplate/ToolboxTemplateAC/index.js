import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import styles from '../index.less';
import {
  convertDataToString,
  convertStringToData,
  notify,
  notifyInfoTemplateError,
} from '../../../../../commons/function';
import { CALENDAR_TEMPLATE_ITEM, REGEX } from '../../../../../constant';
import SelectSizeText from '../../SelectSizeText';
import { useDispatch, useSelector } from 'umi';

// toolbox setting template c
const ToolboxTemplateAC = ({
  typeToolbox,
  valTextTemplate,
  updateData,
  templateSelected,
  nameTemplate,
}) => {
  const [valueTitle, setValueTitle] = useState('');
  const [fontTitle, setFontTitle] = useState('');
  const [valueContent, setValContent] = useState('');
  const [fontContent, setFontContent] = useState('');
  // store account team
  const { tabLoading } = useSelector(store => store.ACCOUNT_TEAM);
  // store event
  const { isLoading } = useSelector(store => store.EVENT);

  const dispatch = useDispatch();

  useEffect(() => {
    const { text, styles, title, content } = valTextTemplate;
    if (!typeToolbox) {
      const { fontSize } = convertStringToData(styles);
      // set data, styles title
      setFontTitle(fontSize);
      setValueTitle(text);
    }

    // set data, styles content
    if (typeToolbox) {
      const styleTitle = convertStringToData(title.styles);
      // set data, styles title
      setFontTitle(styleTitle.fontSize);
      setValueTitle(title.text);

      // set data, styles content
      const styleContent = convertStringToData(content.styles);
      setFontContent(styleContent.fontSize);
      setValContent(content.text);
    }
  }, [valTextTemplate]);

  const onChangeFont = (name, value) => {
    let data = {};
    let key;
    // if (value && !new RegExp(REGEX.stringNumberTemplate).test(value)) {
    //   return;
    // }
    if (name === 'stylesTitle') {
      key = 'title';
      setFontTitle(value);
      if (!typeToolbox) {
        data = {
          ...valTextTemplate,
          styles: convertDataToString({
            fontSize: value ? value : '0',
          }),
        };
      }
    }

    if (name === 'stylesContent') {
      key = 'content';
      setFontContent(value);
    }

    if (typeToolbox) {
      data = {
        ...valTextTemplate,
        [key]: {
          ...valTextTemplate[key],
          styles: convertDataToString({
            fontSize: value ? value : '0',
          }),
        },
      };
    }

    if (!Object.keys(data).length) {
      return;
    }
    // update data to store
    updateData(data);
  };

  const onFocusFont = e => {
    const { name, value } = e.target;
    if (value) {
      if (name === 'stylesTitle') {
        setFontTitle(value.slice(0, value.length - 2));
      }

      if (name === 'stylesContent') {
        setFontContent(value.slice(0, value.length - 2));
      }
    }
  };

  const onBlurFont = e => {
    const { name, value } = e.target;
    if (value) {
      if (name === 'stylesTitle') {
        setFontTitle(value + 'px');
      }

      if (name === 'stylesContent') {
        setFontContent(value + 'px');
      }
    }

    if (!value) {
      if (name === 'stylesTitle') {
        setFontTitle('');
      }

      if (name === 'stylesContent') {
        setFontContent('');
      }
    }
  };

  // update data text
  const onChangeText = e => {
    const { name, value } = e.target;
    let data = {};

    if (name === 'title') {
      setValueTitle(value);

      if (!typeToolbox) {
        data = {
          ...valTextTemplate,
          text: value,
        };
      }
    }

    if (name === 'content') {
      setValContent(value);
    }

    if (typeToolbox) {
      data = {
        ...valTextTemplate,
        [name]: {
          ...valTextTemplate[name],
          text: value,
        },
      };
      if (!value) {
        data = {
          ...valTextTemplate,
          [name]: {
            text: value,
            styles: convertDataToString({
              fontSize: '14px',
            }),
          },
        };
      }
    }

    if (!Object.keys(data).length) {
      return;
    }
    // update data to store
    updateData(data);
  };

  const onSubmit = () => {
    if (tabLoading || isLoading) {
      return;
    }
    if (notifyInfoTemplateError(templateSelected, valTextTemplate)) {
      return;
    }

    dispatch({
      type: 'SETTING_TEMPLATE/setOptionSelected',
      payload: '',
    });
    dispatch({
      type: 'SETTING_TEMPLATE/setKeyValid',
      payload: {
        [nameTemplate]: {
          isValid: false,
          message: '必須項目を入力してください。',
        },
      },
    });
  };

  return (
    <>
      {/*c*/}
      <div className={styles.stepItem}>
        <div className={styles.stepHeader}>
          <div className={styles.stepName}>
            <p>step&nbsp;1:</p>
          </div>
          <span>テキストをご入力ください。</span>
        </div>
        <div className={styles.stepContent}>
          <div className={styles.formSettingItem}>
            <div className={styles.formSettingTitle}>
              <div />
              タイトル
            </div>
            <div className={styles.formSettingContent}>
              <Input
                className={styles.inputTitle}
                name="title"
                placeholder="例) 無料での個別オンライン相談会です！"
                value={valueTitle}
                onChange={onChangeText}
              />
            </div>
          </div>
          <div className={styles.formSettingItem}>
            <div className={styles.formSettingTitle}>
              <div />
              テキストサイズ変更
            </div>
            <div className={styles.formSettingContent}>
              <SelectSizeText
                name="stylesTitle"
                // classStyle={styles.selectFontSize}
                updateStyle={onChangeFont}
                valSelect={fontTitle}
              />
            </div>
          </div>
        </div>
      </div>
      {typeToolbox && (
        <div className={styles.stepItem}>
          <div className={styles.stepHeader}>
            <div className={styles.stepName}>
              <p>step&nbsp;2:</p>
            </div>
            <span>テキストを変更いただけます。</span>
          </div>
          <div className={styles.stepContent}>
            <div className={styles.formSettingItem}>
              <div className={styles.formSettingTitle}>
                <div />
                説明文
              </div>
              <div className={styles.formSettingContent}>
                <textarea
                  rows={4}
                  className={styles.inputName}
                  placeholder={
                    '例) オンライン相談では、OOに関するご相談を受け\n' +
                    '付けております。ぜひ気軽にお申し込みください！'
                  }
                  value={valueContent}
                  name="content"
                  onChange={onChangeText}
                />
              </div>
            </div>

            <div className={styles.formSettingItem}>
              <div className={styles.formSettingTitle}>
                <div />
                テキストサイズ変更
              </div>
              <div className={styles.formSettingContent}>
                <SelectSizeText
                  name="stylesContent"
                  // classStyle={styles.selectFontSize}
                  updateStyle={onChangeFont}
                  valSelect={fontContent}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.btnSubmit}>
        <button onClick={onSubmit}>保存</button>
      </div>
    </>
  );
};

export default ToolboxTemplateAC;
