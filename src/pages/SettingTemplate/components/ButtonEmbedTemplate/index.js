import React, { useEffect, useState } from 'react';
import styles from './index.less';
import ToolBoxButton from '../ToolBoxButton';
import { useDispatch, useHistory, useSelector } from 'umi';
import {
  convertDataToString,
  convertStringToData,
  notify,
} from '../../../../commons/function';
import { MESSAGE_ERROR_BUTTON_EMBED_EMPTY } from '../../../../constant';

const ButtonEmbedTemplate = () => {
  const dispatch = useDispatch();
  let { location } = useHistory();
  const { query } = location;

  const { templateActive, dataButtonEmbedTemplate } = useSelector(
    store => store.SETTING_TEMPLATE,
  );
  const [isEditTextBtn, setEditTextBtn] = useState(false);
  const [nameBtn, setNameBtn] = useState('');

  const [textPlace, setTextPlace] = useState('オンライン相談はこちら');

  const [listStyleText, setStyleText] = useState({
    color: '#ffffff',
    fontSize: '14px',
  });

  const [listStyleBtn, setStyleBtn] = useState({});

  // init data button embed
  useEffect(() => {
    if (query?.type === '1') {
      // style button
      setStyleBtn({
        width: '200px',
        height: '35px',
        outline: 'none',
        cursor: 'pointer',
        border: '1px solid transparent',
        background: '#33c3c7',
        padding: 0,
      });
    }

    if (query?.type === '2') {
      setStyleText({
        ...listStyleText,
        color: '#3C3C3C',
      });
      // style button
      setStyleBtn({
        outline: 'none',
        cursor: 'pointer',
        padding: 0,
        background: 'transparent',
        borderTop: 'transparent',
        borderLeft: 'transparent',
        borderRight: 'transparent',
        borderBottom: '2px solid #33c3c7',
      });
    }
  }, []);

  // calendar change
  useEffect(() => {
    const { styles, text } = dataButtonEmbedTemplate;
    if (!styles) {
      return;
    }

    const { color, fontSize, ...rest } = convertStringToData(styles);
    if (text !== textPlace) {
      setNameBtn(text);
    }
    setStyleText({
      color,
      fontSize,
    });
    setStyleBtn(rest);
  }, [dataButtonEmbedTemplate]);

  // save value
  const onSubmit = () => {
    if (nameBtn.trim() === '') {
      notify(MESSAGE_ERROR_BUTTON_EMBED_EMPTY);
      return;
    }
    dispatch({
      type: 'SETTING_TEMPLATE/updateDataButtonEmbedTemplate',
      payload: {
        data: {
          text: nameBtn ? nameBtn : textPlace,
          styles: convertDataToString({ ...listStyleBtn, ...listStyleText }),
        },
        keyNext: templateActive,
      },
    });
  };

  const onPre = () => {
    // dispatch({
    //   type: 'SETTING_TEMPLATE/onActiveTemplate',
    //   payload: STEP_PRE_SETTING_TEMPLATE[templateActive]
    // })
    history.back();
  };

  const showEditText = () => {
    setEditTextBtn(!isEditTextBtn);
  };

  return (
    <>
      <div className={styles.buttonTemplate}>
        <div className={styles.display}>
          <button
            style={{ ...listStyleBtn, ...listStyleText }}
            onClick={showEditText}
          >
            {isEditTextBtn && (
              <input
                value={nameBtn}
                autoFocus
                placeholder={textPlace}
                onChange={e => setNameBtn(e.target.value)}
                onBlur={showEditText}
              />
            )}
            {!isEditTextBtn && <span>{nameBtn ? nameBtn : textPlace}</span>}
          </button>
        </div>
      </div>

      <ToolBoxButton
        valueText={nameBtn}
        onChangeText={setNameBtn}
        styleBtn={listStyleBtn}
        onChangeStyleBtn={setStyleBtn}
        styleText={listStyleText}
        onChangeStyleText={setStyleText}
        onSubmit={onSubmit}
        onPre={onPre}
        typeButtonEmbedSetting={query?.type === '1'}
      />
    </>
  );
};

export default ButtonEmbedTemplate;
