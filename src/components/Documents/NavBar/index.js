import styles from './styles.less';
import { connect } from 'dva';
import { Link, useHistory, useParams } from 'umi';
import { QA_ANSWER } from '@/constant';

function NavBar(props) {
  const { dispatch, documentStore } = props;
  const { isScroll } = documentStore;
  const history = useHistory();
  const handleClickMenu = docID => {
    history.push(`/docs/${docID}`);
    dispatch({ type: 'DOCUMENT/setIsScroll', payload: true });
  };
  const { id } = useParams();

  const listDocs = QA_ANSWER.map(doc => (
    <>
      {doc.id === id ? (
        <li
          key={doc.id}
          className={`${styles.navBarMenu} ${styles.active}`}
          onClick={() => handleClickMenu(doc.id)}
        >
          <Link to={doc.url}>{doc.title}</Link>
        </li>
      ) : (
        <li
          key={doc.id}
          className={styles.navBarMenu}
          onClick={() => handleClickMenu(doc.id)}
        >
          <Link to={doc.url}>{doc.title}</Link>
        </li>
      )}
    </>
  ));
  return (
    <div className={styles.navBarContainer}>
      <h3 className={styles.navBarTitle}>このセクションの記事</h3>
      <ul>{listDocs}</ul>
    </div>
  );
}
export default connect(({ DOCUMENT }) => ({
  documentStore: DOCUMENT,
}))(NavBar);
