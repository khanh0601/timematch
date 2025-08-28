import styles from '../styles.less';
import { QA_ANSWER } from '@/constant';
import doc56_1 from '@/assets/images/doc56-1.png';
import doc56_2 from '@/assets/images/doc56-2.png';
import doc56_3 from '@/assets/images/doc56-3.png';
import doc56_4 from '@/assets/images/doc56-4.png';
import doc56_5 from '@/assets/images/doc56-5.png';
import doc56_6 from '@/assets/images/doc56-6.png';
import doc56_7 from '@/assets/images/doc56-7.png';
import doc56_8 from '@/assets/images/doc56-8.png';
import doc56_9 from '@/assets/images/doc56-9.png';

export default function Doc6(props) {
  const titleDoc56 = QA_ANSWER.find(ele => ele.id === '56').title;

  return (
    <div className={styles.docDetailsContainer}>
      <h3 className={styles.docDetailTitle}>{titleDoc56}</h3>
      <p>
        アカウント状況ページでは、購入済みのアカウント数や登録済みのアカウン
      </p>
      <p>トの情報が確認できます。</p>
      <div>
        <img src={doc56_1} alt="1" />
      </div>
      <h3>■ 契約アカウント数</h3>
      <p>契約しているアカウントの数が確認できます。</p>
      <div>
        <img src={doc56_2} alt="2" />
      </div>
      <h3>■ アクティブ数</h3>
      <p>現在使用しているアカウントの数が確認できます。</p>
      <div>
        <img src={doc56_3} alt="3" />
      </div>
      <br></br>
      <h3>■ 使用可能数</h3>
      <p>購入済みで、まだ使用していないアカウント数が確認できます。</p>
      <div>
        <img src={doc56_4} alt="4" />
      </div>
      <br></br>
      <h3>■ 権限・契約種別の変更</h3>
      <p>１：変更したいアカウントの⚙ボタンをクリックしてください。</p>
      <div>
        <img src={doc56_5} alt="5" />
      </div>
      <br></br>
      <p>
        ２：「契約種別」もしくは「権限」から変更したい項目をクリックしてください。
      </p>
      <p>① 契約種別の場合</p>
      <div>
        <img src={doc56_6} alt="6" />
      </div>
      <p>契約種別をクリックすると、下に「年契約　月契約」が表示されます。</p>
      <p>年契約をクリックすると年契約に変更されます。月契約をクリックする</p>
      <p>と月契約に変更されます。</p>
      <br></br>
      <p>② 権限の場合</p>
      <div>
        <img src={doc56_7} alt="7" />
      </div>
      <p>権限をクリックすると、下に「管理者　メンバー」が表示されます。</p>
      <p>管理者をクリックすると管理者に権限が変更されます。メンバーをクリ</p>
      <p>ックするとメンバーに権限が変更されます。</p>
      <br></br>
      <p>３：変更したい項目をクリックしてください。</p>
      <br></br>
      <h3>■ メンバーの削除</h3>
      <div>
        <img src={doc56_8} alt="8" />
      </div>
      <p>「削除」をクリックしてください。</p>
      <p>確認画面が出てくるので、「はい」をクリックしてください。</p>
      <div>
        <img src={doc56_9} alt="9" />
      </div>
    </div>
  );
}
