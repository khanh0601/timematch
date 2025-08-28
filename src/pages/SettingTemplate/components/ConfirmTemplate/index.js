import React, { useEffect, useRef, useState } from 'react';
import {
  CALENDAR_TEMPLATE_ITEM,
  SETTING_NAVIGATOR,
} from '../../../../constant';
import styles from './index.less';
import stylesToolInfoSetting from '../CalendarTemplate/index.less';
import NavSettingCheckbox from './Navigator/EditCheckbox';
import NavSettingInput from './Navigator/EditInput';
import NavSettingTextArea from './Navigator/EditTextArea';
import NavSettingDefault from './Navigator';
import { connect } from 'dva';
import NameCalendar from '../CalendarTemplate/NameCalendar';
import BackgroundImage from '../CalendarTemplate/BackgroundImage';
import Commit from '../CalendarTemplate/Commit';
import TimeSetting from '../CalendarTemplate/TimeSetting';
import { CloseOutlined } from '@ant-design/icons';
import FormEmbed from './FormEmbed';
import CalendarTemplateChild from '../CalendarTemplate/CalendarTemplateChild';
import { useDispatch, useSelector } from 'umi';

const ConfirmTemplate = props => {
  const navRef = useRef(null);
  const { questionSelected } = props;
  const [isBlur, setIsBlur] = useState(true);
  // store setting template
  const {
    addInputQuestion,
    dataCalendarTemplate,
    listQuestion,
    listValidError,
    optionSelected,
  } = useSelector(store => store.SETTING_TEMPLATE);

  const dispatch = useDispatch();

  // ***************** Start Function UI *********************
  const handleScroll = () => {
    const subMenuDivEle = document.getElementById('submenu');
    if (subMenuDivEle) {
      const subMenuDiv = subMenuDivEle.getBoundingClientRect();
      const positonFixed = subMenuDiv.height + 24;
      const innerNav = document.querySelector('#navigator > div');
      const isOver =
        innerNav?.getBoundingClientRect()?.height > document.body.clientHeight;
      if (window.scrollY > positonFixed) {
        navRef.current.style.position = 'fixed';
        navRef.current.style.top = 0;
        navRef.current.style.right = '24px';
        navRef.current.style.height = '100vh';
        navRef.current.style.paddingRight = isOver ? '0px' : '16px';
      } else {
        navRef.current.style.position = 'relative';
        navRef.current.style.top = 0;
        navRef.current.style.right = 0;
        navRef.current.style.height = 'auto';
        navRef.current.style.paddingRight = '16px';
      }
    }
  };
  // ***************** End Function UI *********************

  const handleRenderNavigator = () => {
    const type = questionSelected ? questionSelected.type : '';
    switch (type) {
      case SETTING_NAVIGATOR.input:
        return <NavSettingInput />;
      case SETTING_NAVIGATOR.checkbox:
        return <NavSettingCheckbox />;
      case SETTING_NAVIGATOR.policy:
        return <NavSettingTextArea />;
      default:
        return <NavSettingDefault />;
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  // // template selected change
  // useEffect(() => {
  //   if (optionSelected === 'b') {
  //     let input = document.createElement('input');
  //     input.setAttribute('type', 'file');
  //     input.setAttribute('accept', 'image/*');
  //     let isFocus = false;
  //     input.onchange = e => {
  //       let files = e.target.files[0];
  //       let linkImage = '';
  //       // // FileReader support
  //       if (FileReader && files) {
  //         let fr = new FileReader();
  //         fr.onload = function() {
  //           linkImage = fr.result;
  //         };
  //         fr.readAsDataURL(files);
  //       }
  //       let urlImage = window.URL.createObjectURL(files);
  //       let img = new Image();
  //       img.src = urlImage;
  //       img.onload = () => {
  //         if (img.width === 550 && img.height === 550) {
  //           setFileImage({
  //             files: files,
  //             urlImage: linkImage,
  //           });
  //           dispatch({
  //             type: 'SETTING_TEMPLATE/setKeyValid',
  //             payload: {
  //               backgroundImage: {
  //                 isValid: false,
  //                 message: '必須項目を入力してください。',
  //               },
  //             },
  //           });
  //         } else {
  //           dispatch({
  //             type: 'SETTING_TEMPLATE/setKeyValid',
  //             payload: {
  //               backgroundImage: {
  //                 isValid: true,
  //                 message:
  //                   '画像のサイズは550×550のみ対応しています。画像サイズ550×550の画像をアップロードください。',
  //               },
  //             },
  //           });
  //         }
  //       };
  //     };
  //     input.addEventListener('click', function(e) {
  //       isFocus = true;
  //     });
  //
  //     input.click();
  //
  //     // window.addEventListener('focus', function(e) {
  //     //   if (isFocus) {
  //     //     isFocus = false;
  //     //     changeOptionSelect('');
  //     //   }
  //     // });
  //   }
  // }, [optionSelected]);

  // template selected change
  // useEffect(() => {
  //   const { files, urlImage } = fileImage;
  //   if (files) {
  //     updatedDataSettingTemplate('backgroundImage', {
  //       files,
  //       urlImage,
  //     });
  //   }
  // }, [fileImage]);

  const onClearSelectTemplate = () => {
    changeOptionSelect('');
  };

  const changeOptionSelect = code => {
    dispatch({
      type: 'SETTING_TEMPLATE/setOptionSelected',
      payload: code,
    });
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

  return (
    <>
      <div className={styles.confirmTemplate}>
        <div className={styles.confirmSetting}>
          {isBlur && <div className={styles.blur} />}

          {isBlur && (
            <div className={styles.iconBlur} onClick={() => setIsBlur(false)}>
              <CloseOutlined />
            </div>
          )}
          <div onClick={() => setIsBlur(true)}>
            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.a}
              validate={listValidError.nameCalendar}
              nameTemplate="nameCalendar"
              isConfirmTemplate
            >
              <NameCalendar
                isEdit={false}
                code={CALENDAR_TEMPLATE_ITEM.a}
                // templateSelect={optionSelected}
              />
            </CalendarTemplateChild>

            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.b}
              validate={listValidError.backgroundImage}
              nameTemplate="backgroundImage"
              isConfirmTemplate
            >
              <BackgroundImage
                code={CALENDAR_TEMPLATE_ITEM.b}
                listCss={styles.imageCustomer}
                isChooseFile={false}
              />
            </CalendarTemplateChild>

            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.c}
              validate={listValidError.descriptionCalendar}
              nameTemplate="descriptionCalendar"
              isConfirmTemplate
            >
              <Commit
                isEdit={false}
                code={CALENDAR_TEMPLATE_ITEM.c}
                // templateSelect={optionSelected}
              />
            </CalendarTemplateChild>

            <CalendarTemplateChild
              code={CALENDAR_TEMPLATE_ITEM.e}
              listCssCustom={stylesToolInfoSetting.timeSettingTemplate}
              templateSelect={optionSelected}
              isConfirmTemplate
            >
              <TimeSetting />
            </CalendarTemplateChild>
          </div>
        </div>
        <div className={styles.formSetting}>
          <CalendarTemplateChild
            code={CALENDAR_TEMPLATE_ITEM.a}
            validate={listValidError.nameCalendar}
            nameTemplate="nameCalendar"
            isConfirmTemplate
            listCssCustom={styles.hideTitleCalendar}
          >
            <NameCalendar
              isEdit={false}
              code={CALENDAR_TEMPLATE_ITEM.a}
              // templateSelect={optionSelected}
            />
          </CalendarTemplateChild>

          <FormEmbed />
        </div>
      </div>

      <div className={styles.toolBox} ref={navRef} id="navigator">
        {handleRenderNavigator()}
      </div>
      {/*/!*focus mark toolbox*!/*/}
      {/*{optionSelected && (*/}
      {/*  <div*/}
      {/*    className={stylesToolInfoSetting.markToolbox}*/}
      {/*    onClick={onClearSelectTemplate}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};
export default connect(({ SETTING_TEMPLATE }) => ({
  questionSelected: SETTING_TEMPLATE.questionSelected,
}))(ConfirmTemplate);
