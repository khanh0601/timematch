import styles from '../styles.less';
import { QA_ANSWER } from '@/constant';
import doc51_1 from '@/assets/images/doc51-1.png';
import doc51_2 from '@/assets/images/doc51-2.png';
import doc51_3 from '@/assets/images/doc51-3.png';
import doc51_4 from '@/assets/images/doc51-4.png';

export default function Doc51(props) {
  const titleDoc51 = QA_ANSWER.find(ele => ele.id === '51').title;

  return (
    <div className={styles.docDetailsContainer}>
      <h3 className={styles.docDetailTitle}>{titleDoc51}</h3>
      <p>プロフィールでは、お名前や予約ページのURLなどを設定できます。</p>
      <p>設定方法は下記を参照ください。</p>
      <br></br>
      <h3>■ プロフィール</h3>
      <div>
        <img src={doc51_1} alt="1" />
      </div>
      <p>１：「氏名」の欄に、お名前を入力ください。</p>
      <p>２：「会社名」の欄に、お勤めの会社名を入力ください。</p>
      <p>
        ３：カレンダーのURLの欄に、日程調整相手に送る際に使用したいURLを入力してください。
      </p>
      <br></br>
      <p>入力後、「保存」をクリックください。</p>
      <br></br>
      <h3>■ スケジュール簡単設定</h3>
      <div>
        <img src={doc51_2} alt="2" />
      </div>
      <p>
        １：予約を入れたくない曜日や時間帯がある場合は、チェックボックスを外すか日時を設定してください。
      </p>
      <p>
        ２：ボックスをクリックして、予約を入れる時間帯を設定して、「決定する」をクリックください。
      </p>
      <br></br>
      <h3>■ アカウントの連携解除</h3>
      <div>
        <img src={doc51_3} alt="3" />
      </div>
      <p>GoogleアカウントやMicrosoftアカウントとの連携を解除できる機能です。</p>
      <p>１：「解除する」をクリックください。</p>
      <p>２：確認ボタンが表示されるので、「はい」をクリックください。</p>
      <p>以上で連携の解除が完了です。</p>
      <br></br>
      <h3>■ アカウント削除</h3>
      <div>
        <img src={doc51_4} alt="4" />
      </div>
      <p>１：「削除する」をクリックください。</p>
      <p>２：確認ボタンが表示されるので、「はい」をクリックください。</p>
      <p>以上で連携の解除が完了です。</p>
      <br></br>
      <p>一度削除すると復旧はできませんのでご了承ください。</p>
    </div>
  );
}
