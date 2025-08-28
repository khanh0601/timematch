import { useRef, useEffect, useState } from 'react';
import styles from './styles.less';

export default function DropdownMenu({
  dropdownName,
  visible,
  setVisible,
  listCss,
  overlay,
  style,
  isCustomMenuLeft,
}) {
  const dropdownRef = useRef();
  const [removeHover, setRemoveHover] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    //  Add when mounted
    document.addEventListener('mousedown', handleClick);
    // Clean
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleClick = e => {
    // Inside ref
    if (dropdownRef.current.contains(e.target)) {
      const { localName } = e.target;
      if (localName === 'input') {
        return;
      }
      setShowModal(false);
      setRemoveHover(true);
      setVisible(false);
      return;
    }

    // Outside ref
    setShowModal(false);
    setRemoveHover(false);
    setVisible(true);
  };

  useEffect(() => {
    // setRemoveHover(false)
    setTimeout(() => {
      setRemoveHover(false);
    }, 300);
  }, [removeHover]);

  const menuCss = () => {
    let css = styles.dropdownMenu;
    if (listCss) {
      css += ' ' + listCss;
    }

    if (!removeHover) {
      css += ' ' + styles.dropdownHoverMenu;
    }

    if (showModal) {
      css += ' ' + styles.visibleDropdownMenu;
    }

    if (isCustomMenuLeft) {
      css += ' ' + styles.dropDownCustomLeft;
    }
    return css;
  };

  return (
    <div className={menuCss()}>
      <span onClick={() => setShowModal(!showModal)}>
        {dropdownName && dropdownName()}
      </span>
      <div
        ref={dropdownRef}
        className={styles.dropdownContent}
        style={{ ...style }}
      >
        {overlay && overlay()}
      </div>
    </div>
  );
}
