import styles from '../styles.less';
import { QA_ANSWER } from '@/constant';
import doc52_1 from '@/assets/images/doc52-1.png';
import doc52_2 from '@/assets/images/doc52-2.png';
import doc52_3 from '@/assets/images/doc52-3.png';
import doc52_4 from '@/assets/images/doc52-4.png';
import doc52_5 from '@/assets/images/doc52-5.jpg';
import doc52_6 from '@/assets/images/doc52-6.png';

export default function Doc52(props) {
  const titleDoc52 = QA_ANSWER.find(ele => ele.id === '52').title;

  return (
    <div className={styles.docDetailsContainer}>
      <h3 className={styles.docDetailTitle}>{titleDoc52}</h3>
      <p>アカウントを追加で購入することができます。</p>
      <p>クレジットカード払いか請求書払いが可能です。</p>
      <br></br>
      <h3>■ アカウントを購入する（クレジットカード）</h3>
      <p>１：追加したいアカウント数を選択ください。</p>
      <div>
        <img src={doc52_1} alt="1" />
      </div>
      <p>２：契約種別を選択ください。（※年間契約いただくと、年間で</p>
      <p>2280円お得になります）</p>
      <p>
        ３：カレンダーのURLの欄に、日程調整相手に送る際に使用したいURLを入力してください。
      </p>
      <br></br>
      <p>入力後、「保存」をクリックください。</p>
      <p>スケジュール簡単設定</p>
      <div>
        <img src={doc52_2} alt="2" />
      </div>
      <p>
        ３：クレジットカード情報を入力して、「確認ページへ」をクリックしてく
      </p>
      <p>ださい。</p>
      <div>
        <img src={doc52_3} alt="3" />
      </div>
      <p>（※有効期限は月を２桁、年の下２桁をご入力ください。）</p>
      <br></br>
      <p>４：契約内容に間違いがないか確認し、「決済する」をクリックくださ</p>
      <p>い。</p>
      <div>
        <img src={doc52_4} alt="4" />
      </div>
      <p>５：決済が完了すると、「お支払い完了」のページが表示されます。</p>
      <div>
        <img src={doc52_5} alt="5" />
      </div>
      <p>以上でアカウントの購入が完了しました。</p>
      <p>メンバーを招待する場合は「確認ページへ」をクリックして、メンバーに</p>
      <p>招待メールを送信してください。</p>
      <br></br>
      <h3>■ アカウントを購入する（請求書払い）</h3>
      <div>
        <img src={doc52_6} alt="6" />
      </div>
      <p>１：お問い合わせフォームにて、必要項目を入力後、「送信」をクリッ</p>
      <p>クください。</p>
      <p>２：後ほど運営から、請求方法についてご連絡させていただきます。</p>
    </div>
  );
}
