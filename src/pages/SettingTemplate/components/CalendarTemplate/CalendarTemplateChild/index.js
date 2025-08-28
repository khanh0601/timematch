import React from 'react';
import styles from './index.less';
import { useDispatch } from 'umi';

const CalendarTemplateChild = React.memo(
  ({
    code,
    children,
    listCssCustom,
    templateSelect,
    validate,
    nameTemplate,
    isConfirmTemplate,
  }) => {
    const listCssMark = () => {
      let css = styles.markCalendar;
      if (templateSelect && templateSelect === code) {
        css += ' ' + styles.markActive;
      }
      return css;
    };
    const dispatch = useDispatch();

    const listCss = () => {
      let css = styles.calendarTemplateChild;
      if (listCssCustom) {
        css += ' ' + listCssCustom;
      }
      if (validate?.isValid) {
        css += ' ' + styles.errorActive;
      }

      if (isConfirmTemplate) {
        css += ' ' + styles.confirmTemplate;
      }

      return css;
    };

    const listStyleError = () => {
      let css = styles.error;
      if (validate?.isValid) {
        css += ' ' + styles.errorActive;
      }
      return css;
    };

    const onChangeOptionSelect = code => {
      dispatch({
        type: 'SETTING_TEMPLATE/setOptionSelected',
        payload: code,
      });
    };

    const onChooseTemplate = () => {
      onChangeOptionSelect(code);
      if (nameTemplate) {
        dispatch({
          type: 'SETTING_TEMPLATE/setKeyValid',
          payload: {
            [nameTemplate]: {
              isValid: false,
              message: '必須項目を入力してください。',
            },
          },
        });
      }
    };

    return (
      <div className={listCssMark()}>
        <div className={listCss()}>
          <div className={styles.code}>
            <span>{code}</span>
          </div>
          {children}
          <span className={listStyleError()}>
            {validate?.message
              ? validate?.message
              : '必須項目を入力してください。'}
          </span>
        </div>
      </div>
    );
  },
);

export default CalendarTemplateChild;
