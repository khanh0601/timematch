import styles from '../styles.less';
import { QA_ANSWER } from '@/constant';
import doc54_1 from '@/assets/images/doc54-1.png';

export default function Doc4(props) {
  const titleDoc54 = QA_ANSWER.find(ele => ele.id === '54').title;

  return (
    <div className={styles.docDetailsContainer}>
      <h3 className={styles.docDetailTitle}>{titleDoc54}</h3>
      <div>
        <img src={doc54_1} alt="a" />
      </div>
      <p>
        １：お問い合わせフォームにて、必要項目を入力後、「送信」をクリックください。
      </p>
      <p>２：後ほど運営から、請求方法についてご連絡させていただきます。</p>
    </div>
  );
}
