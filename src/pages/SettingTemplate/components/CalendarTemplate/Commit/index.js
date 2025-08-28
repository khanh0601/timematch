import React, { useEffect, useState } from 'react';
import styles from './index.less';
import {
  convertDataToString,
  convertStringToData,
} from '../../../../../commons/function';
import { useDispatch, useSelector } from 'umi';
import stylesCalendarTemplate from '../index.less';
import ToolboxTemplateAC from '../ToolboxTemplateAC';

// render data commit from store
const Commit = ({ code, isViewB, isEdit }) => {
  // store setting template
  const { dataCalendarTemplate, optionSelected } = useSelector(
    store => store.SETTING_TEMPLATE,
  );
  const { descriptionCalendar } = dataCalendarTemplate;
  const dispatch = useDispatch();

  const [listContent, setDataContent] = useState([]);
  const [isEditTitle, setEditTitle] = useState(false);
  const [isEditComment, setEditComment] = useState(false);

  useEffect(() => {
    const listContent = descriptionCalendar?.content.text.split('\n');
    if (!descriptionCalendar.content.text) {
      setDataContent([]);
    }
    if (descriptionCalendar.content.text) {
      setDataContent(listContent);
    }
  }, [descriptionCalendar]);

  const showEditTitle = () => {
    if (!isEdit) {
      return;
    }
    setEditTitle(!isEditTitle);
  };

  // update to store setting template
  const updatedDataSettingTemplate = data => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateDataCalendarTemplate',
      payload: {
        key: 'descriptionCalendar',
        value: data,
      },
    });
  };

  const isShowToolbox = () => {
    return isEdit && optionSelected && code === optionSelected;
  };

  const onChangeOptionSelect = () => {
    dispatch({
      type: 'SETTING_TEMPLATE/setOptionSelected',
      payload: code,
    });
  };

  const onChangeTitleCommit = e => {
    const { name, value } = e.target;
    let data = {
      ...descriptionCalendar,
      [name]: {
        ...descriptionCalendar[name],
        text: value,
      },
    };
    if (!value) {
      data = {
        ...descriptionCalendar,
        [name]: {
          styles: convertDataToString({
            fontSize: '14px',
          }),
          text: value,
        },
      };
    }

    updateDataDescriptionTemplate(data);
  };

  const updateDataDescriptionTemplate = data => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateDataCalendarTemplate',
      payload: {
        key: 'descriptionCalendar',
        value: data,
      },
    });
  };

  const reRenderComment = () => {
    if (isEditComment) {
      return (
        // <div className={styles.formSettingContent}>
        <textarea
          rows={10}
          // className={styles.inputName}
          placeholder={
            '例) オンライン相談では、OOに関するご相談を受け\n' +
            '付けております。ぜひ気軽にお申し込みください！'
          }
          value={descriptionCalendar?.content.text}
          name="content"
          onChange={onChangeTitleCommit}
          onBlur={() => setEditComment(false)}
        />
        // </div>
      );
    }

    return (
      <>
        {!listContent.length && (
          <>
            <p>
              オンライン相談では、〇〇に関するご相談を受け付けております。ぜひお気
              軽にお申し込みください！
            </p>
            <br />
            <p>
              弊社サービスに関するご不明点などございましたら、オンライン相談時にご
              質問ください！
            </p>
            <br />
            <p>※もちろん、カメラをオフにして音声のみでのご相談も可能です。</p>
          </>
        )}

        {listContent.length > 0 &&
          listContent.map((item, index) => {
            if (item) {
              return <p key={index}>{item}</p>;
            }
            if (!item) {
              return <br key={index} />;
            }
          })}
      </>
    );
  };

  return (
    <>
      <div
        className={`${styles.commit} ${
          isViewB === true ? styles.scrollable : ''
        }`}
        onClick={onChangeOptionSelect}
      >
        <div className={styles.title}>
          <button onClick={showEditTitle}>
            {isEditTitle && (
              <input
                value={descriptionCalendar?.title.text}
                name="title"
                autoFocus
                placeholder="テキストをご入力ください。"
                onChange={onChangeTitleCommit}
                onBlur={showEditTitle}
              />
            )}
            {!isEditTitle && (
              <span
                style={convertStringToData(descriptionCalendar.title.styles)}
              >
                {descriptionCalendar?.title.text
                  ? descriptionCalendar?.title.text
                  : 'テキストをご入力ください。'}
              </span>
            )}
          </button>
        </div>

        <div
          style={convertStringToData(descriptionCalendar.content.styles)}
          className={styles.description}
          onClick={() => setEditComment(true)}
        >
          {reRenderComment()}
        </div>
      </div>

      {isShowToolbox() && (
        <div className={stylesCalendarTemplate.toolBoxSetting1}>
          <ToolboxTemplateAC
            templateSelected={optionSelected}
            // type setting toolbox nameCalendar or descriptionCalendar
            typeToolbox={true}
            valTextTemplate={descriptionCalendar}
            updateData={updatedDataSettingTemplate}
            nameTemplate="descriptionCalendar"
          />
        </div>
      )}
    </>
  );
};

export default React.memo(Commit);
