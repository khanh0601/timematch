import styles from '../styles.less';
import { QA_ANSWER } from '@/constant';
import doc55_1 from '@/assets/images/doc55-1.jpg';
import doc55_2 from '@/assets/images/doc55-2.jpg';
import doc55_3 from '@/assets/images/doc55-3.png';
import doc55_4 from '@/assets/images/doc55-4.jpg';

export default function Doc55(props) {
  const titleDoc55 = QA_ANSWER.find(ele => ele.id === '55').title;

  return (
    <div className={styles.docDetailsContainer}>
      <h3 className={styles.docDetailTitle}>{titleDoc55}</h3>
      <p>
        契約内容確認ページでは、お支払いの履歴や契約中のアカウントの情報を確認できます。
      </p>
      <br></br>
      <h3>■ 契約内容</h3>
      <div>
        <img src={doc55_1} alt="1" />
      </div>
      <p>契約しているアカウントの数と契約種別が確認できます。</p>
      <p>
        変更・追加したい場合は「変更」または「追加」ボタンをクリックください。
      </p>
      <br></br>
      <p>次回請求</p>
      <div>
        <img src={doc55_2} alt="2" />
      </div>
      <p>次回請求させていただく金額が表示されます。</p>
      <br></br>
      <h3>■ お支払い方法</h3>
      <div>
        <img src={doc55_3} alt="3" />
      </div>
      <p>現在設定しているお支払い方法が表示されます。</p>
      <p>
        請求書払いに変更をご希望の場合は「変更」ボタンをクリックしてください。
      </p>
      <p>
        また、カード番号を変更されたい場合は「カード変更」をクリックしてください。
      </p>
      <br></br>
      <h3>■ お支払い履歴</h3>
      <p>これまでのお支払いの履歴が確認できます。</p>
      <div>
        <img src={doc55_4} alt="4" />
      </div>
    </div>
  );
}
