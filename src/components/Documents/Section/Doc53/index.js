import styles from '../styles.less';
import { QA_ANSWER } from '@/constant';
import doc53_1 from '@/assets/images/doc53-1.png';
import doc53_2 from '@/assets/images/doc53-2.png';
import doc53_3 from '@/assets/images/doc53-3.png';
import doc53_4 from '@/assets/images/doc53-4.png';

export default function Doc53(props) {
  const titleDoc53 = QA_ANSWER.find(ele => ele.id === '53').title;

  return (
    <div className={styles.docDetailsContainer}>
      <h3 className={styles.docDetailTitle}>{titleDoc53}</h3>
      <p>使用していない購入済みのアカウントがある場合、メンバーを招待す</p>
      <p>ることができます。</p>
      <br></br>
      <h3>■ メンバーを追加する</h3>
      <p>１：アカウント状況にて、「メンバー招待」をクリックください。</p>
      <div>
        <img src={doc53_1} alt="1" />
      </div>
      <br></br>
      <p>２：招待したいメンバーの「メールアドレス」「権限」「契約種別」を選</p>
      <p>択し、「招待メール送信」をクリックください。</p>
      <div>
        <img src={doc53_2} alt="2" />
      </div>
      <br></br>
      <div>
        <img src={doc53_3} alt="3" />
      </div>
      <p>３：メンバーにメールが送信されるので、追加したメンバーが登録完</p>
      <p>了し、連絡があるまでお待ちください。</p>
      <br></br>
      <p>４：メンバーから登録完了の連絡が来ましたら、再度メンバー招待</p>
      <p>ページに戻り、「登録」をクリックしてください。</p>
      <div>
        <img src={doc53_4} alt="4" />
      </div>
      <p>以上でメンバーの追加は完了です。</p>
      <p>※すでにメンバーが有料会員の場合は登録ができません。その際</p>
      <p>は、有料会員の期間が終了次第、再度登録のお手続きをお願いい</p>
      <p>たします。</p>
    </div>
  );
}
