import styles from './styles.less';
import { history } from 'umi';

export default function MenuItem({ icon, name, onClick, path }) {
  const handleClick = () => {
    const currentPath = history.location.pathname;

    if (path) {
      if (currentPath === path) {
        window.location.reload();
        return;
      }
      history.replace(path);
      return;
    }
    onClick?.();
  };
  return (
    <div className={styles.menuItem} onClick={handleClick}>
      <img src={icon} alt={name} className={styles.icMenu} />
      <span className={styles.menuText}>{name}</span>
    </div>
  );
}
