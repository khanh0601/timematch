import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'umi';
import ToolboxTemplateD from './ToolboxTemplateD';
import NameCalendar from './NameCalendar';
import BackgroundImage from './BackgroundImage';
import Commit from './Commit';
import TimeSetting from './TimeSetting';
import BookingEmbed from './BookingEmbed';
import { CALENDAR_TEMPLATE_ITEM } from '../../../../constant';
import CalendarTemplateChild from './CalendarTemplateChild';
import { notify, notifyInfoTemplateError } from '../../../../commons/function';

const listToolBox = [
  {
    key: 'a',
    title: 'タイトル',
    description: 'ここをクリックして、タイトルをご入力ください。',
  },
  {
    key: 'b',
    title: 'イメージバナー',
    description: 'ここをクリックして、画像をアップロードください。',
  },
  {
    key: 'c',
    title: 'サービス説明文',
    description: 'ここをクリックして、説明文をご記入ください。',
  },
  {
    key: 'd',
    title: 'カレンダーの選択',
    description: 'ここをクリックして、使用するカレンダーを選択ください。',
  },
  {
    key: 'e',
    title: '内容',
    description: 'こちらは編集できません。',
  },
];

const CalendarTemplate = ({ listTimeBooking }) => {
  // store account team
  const { tabLoading } = useSelector(store => store.ACCOUNT_TEAM);
  // store event
  const { isLoading } = useSelector(store => store.EVENT);

  // store setting template
  const { dataCalendarTemplate, listValidError, optionSelected } = useSelector(
    store => store.SETTING_TEMPLATE,
  );

  const { descriptionCalendar, nameCalendar } = dataCalendarTemplate;

  const dispatch = useDispatch();

  const [isDataUndefined, setDataUndefined] = useState(false);

  // file background
  const [fileImage, setFileImage] = useState({
    files: null,
    urlImage: '',
  });

  useEffect(() => {
    if (listTimeBooking.length) {
      const listDateBooking = listTimeBooking.reduce((preItem, nextItem) => {
        const { listBlockTime } = nextItem;
        return preItem.concat(listBlockTime);
      }, []);
      setDataUndefined(!listDateBooking.length);
      return;
    }
    setDataUndefined(true);
  }, [listTimeBooking]);

  // template selected change
  useEffect(() => {
    if (optionSelected === 'b') {
      let input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      let isFocus = false;
      input.onchange = e => {
        let files = e.target.files[0];
        let linkImage = '';
        // // FileReader support
        if (FileReader && files) {
          let fr = new FileReader();
          fr.onload = function() {
            linkImage = fr.result;
          };
          fr.readAsDataURL(files);
        }
        let urlImage = window.URL.createObjectURL(files);
        let img = new Image();
        img.src = urlImage;
        img.onload = () => {
          if (img.width === 550 && img.height === 550) {
            setFileImage({
              files: files,
              urlImage: linkImage,
            });
            dispatch({
              type: 'SETTING_TEMPLATE/setKeyValid',
              payload: {
                backgroundImage: {
                  isValid: false,
                  message: '必須項目を入力してください。',
                },
              },
            });
          } else {
            dispatch({
              type: 'SETTING_TEMPLATE/setKeyValid',
              payload: {
                backgroundImage: {
                  isValid: true,
                  message:
                    '画像のサイズは550×550のみ対応しています。画像サイズ550×550の画像をアップロードください。',
                },
              },
            });
          }
        };
      };
      input.addEventListener('click', function(e) {
        isFocus = true;
      });

      input.click();

      window.addEventListener('focus', function(e) {
        if (isFocus) {
          isFocus = false;
          changeOptionSelect('');
        }
      });
    }
  }, [optionSelected]);

  // template selected change
  useEffect(() => {
    const { files, urlImage } = fileImage;
    if (files) {
      updatedDataSettingTemplate('backgroundImage', {
        files,
        urlImage,
      });
    }
  }, [fileImage]);

  // valTextTemplateC
  // render components toolbox with template select
  const renderToolbox = () => {
    if (optionSelected === CALENDAR_TEMPLATE_ITEM.d) {
      return <ToolboxTemplateD />;
    }
    return null;
  };

  const onChangeNameCalendar = data => {
    updatedDataSettingTemplate('nameCalendar', data);
  };

  const onDescriptionCalendar = data => {
    updatedDataSettingTemplate('descriptionCalendar', data);
  };

  // update to store setting template
  const updatedDataSettingTemplate = (key, data) => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateDataCalendarTemplate',
      payload: {
        key,
        value: data,
      },
    });
  };

  const changeOptionSelect = code => {
    dispatch({
      type: 'SETTING_TEMPLATE/setOptionSelected',
      payload: code,
    });
  };

  const onSubmit = () => {
    if (tabLoading || isLoading) {
      return;
    }
    changeOptionSelect('');
  };

  const onSelectTemplate = key => {
    //remove error style when active
    let templateKey = null;
    switch (key) {
      case CALENDAR_TEMPLATE_ITEM.a:
        templateKey = 'nameCalendar';
        break;
      case CALENDAR_TEMPLATE_ITEM.b:
        templateKey = 'backgroundImage';
        break;
      case CALENDAR_TEMPLATE_ITEM.c:
        templateKey = 'descriptionCalendar';
        break;
    }
    if (templateKey) {
      dispatch({
        type: 'SETTING_TEMPLATE/setKeyValid',
        payload: {
          [templateKey]: {
            isValid: false,
            message: '必須項目を入力してください。',
          },
        },
      });
    }
    changeOptionSelect(key);
  };

  const onClearSelectTemplate = () => {
    if (
      optionSelected === CALENDAR_TEMPLATE_ITEM.a &&
      notifyInfoTemplateError(optionSelected, nameCalendar)
    ) {
      return;
    }

    if (
      optionSelected === CALENDAR_TEMPLATE_ITEM.c &&
      notifyInfoTemplateError(optionSelected, descriptionCalendar)
    ) {
      return;
    }
    let keyValid;
    if (optionSelected === CALENDAR_TEMPLATE_ITEM.a) {
      keyValid = 'nameCalendar';
    }

    if (optionSelected === CALENDAR_TEMPLATE_ITEM.c) {
      keyValid = 'descriptionCalendar';
    }

    if (keyValid) {
      dispatch({
        type: 'SETTING_TEMPLATE/setKeyValid',
        payload: {
          [keyValid]: {
            isValid: false,
            message: '必須項目を入力してください。',
          },
        },
      });
    }

    changeOptionSelect('');
  };

  return (
    <>
      <div className={styles.calendarTemplate}>
        <div className={styles.headerCalendar}>
          <div className={styles.nameCalendar}>
            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.a}
              templateSelect={optionSelected}
              validate={listValidError.nameCalendar}
              nameTemplate="nameCalendar"
            >
              <NameCalendar
                isEdit
                code={CALENDAR_TEMPLATE_ITEM.a}
                templateSelect={optionSelected}
              />
            </CalendarTemplateChild>
          </div>
          <div className={styles.empty} />
        </div>

        <div className={styles.bodyCalendar}>
          <div className={styles.settingCalendar}>
            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.b}
              templateSelect={optionSelected}
              validate={listValidError.backgroundImage}
              nameTemplate="backgroundImage"
            >
              <BackgroundImage
                code={CALENDAR_TEMPLATE_ITEM.b}
                isChooseFile
                listCss={styles.imageCustomer}
              />
            </CalendarTemplateChild>

            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.c}
              templateSelect={optionSelected}
              validate={listValidError.descriptionCalendar}
              nameTemplate="descriptionCalendar"
            >
              <Commit
                isEdit
                code={CALENDAR_TEMPLATE_ITEM.c}
                templateSelect={optionSelected}
              />
            </CalendarTemplateChild>

            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.e}
              listCssCustom={styles.timeSettingTemplate}
              templateSelect={optionSelected}
            >
              <TimeSetting />
            </CalendarTemplateChild>
          </div>

          <div className={styles.calendarBooking}>
            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.d}
              templateSelect={optionSelected}
              validate={listValidError.calendar}
              nameTemplate="calendar"
            >
              <Spin spinning={tabLoading || isLoading}>
                <BookingEmbed
                  isPreview
                  code={CALENDAR_TEMPLATE_ITEM.d}
                  dataUndefined={isDataUndefined}
                  listDateBooking={listTimeBooking}
                />
              </Spin>
            </CalendarTemplateChild>
          </div>
        </div>
      </div>

      <div className={styles.toolBox}>
        {listToolBox.map((item, index) => (
          <div
            key={index}
            className={styles.toolBoxItem}
            onClick={() => onSelectTemplate(item.key)}
          >
            <div className={styles.code}>
              <span>{item.key}</span>
            </div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.description}>{item.description}</div>
          </div>
        ))}
      </div>

      {/*focus mark toolbox*/}
      {optionSelected && (
        <div className={styles.markToolbox} onClick={onClearSelectTemplate} />
      )}

      {/*open dialog toolbox*/}
      {[CALENDAR_TEMPLATE_ITEM.d].includes(optionSelected) && (
        <div className={styles.toolBoxSetting}>
          {/*return toolbox with the select template*/}
          {renderToolbox()}

          <div className={styles.btnSubmit}>
            <button onClick={() => onSubmit(optionSelected)}>保存</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarTemplate;
