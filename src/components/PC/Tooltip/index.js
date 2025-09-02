import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './styles.less';

const Tooltip = ({
  x,
  y,
  visible,
  children,
  placement = 'top',
  maxWidth = 400,
  minWidth = 200,
  backgroundColor = '#234AB6',
  textColor = '#fff',
  arrowSize = 6,
  animationDuration = 200,
}) => {
  const [tooltipRoot, setTooltipRoot] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let root = document.getElementById('tooltip-root');

    if (!root) {
      root = document.createElement('div');
      root.id = 'tooltip-root';
      document.body.appendChild(root);
    }

    setTooltipRoot(root);

    return () => {
      if (root && root.childNodes.length === 0) {
        root.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [visible, animationDuration]);

  if (!isVisible || !tooltipRoot) return null;

  const getArrowStyle = () => {
    const baseStyle = {
      position: 'absolute',
      width: 0,
      height: 0,
      border: `${arrowSize}px solid transparent`,
    };

    switch (placement) {
      case 'top':
        return {
          ...baseStyle,
          bottom: `-${arrowSize * 2}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopColor: backgroundColor,
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: `-${arrowSize * 2}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottomColor: backgroundColor,
        };
      default:
        return {};
    }
  };

  const getPosition = () => {
    const baseStyle = {
      position: 'absolute',
      transform: 'translateX(-50%)',
      background: backgroundColor,
      color: textColor,
      padding: '5px 10px',
      borderRadius: '4px',
      pointerEvents: 'none',
      zIndex: 2000000000000001,
      maxWidth: `${maxWidth}px`,
      minWidth: `${minWidth}px`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      transition: `opacity ${animationDuration}ms ease-in-out`,
      opacity: visible ? 1 : 0,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    switch (placement) {
      case 'top':
        return {
          ...baseStyle,
          top: y - 40,
          left: x,
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: y + 20,
          left: x,
        };
      default:
        return baseStyle;
    }
  };

  return ReactDOM.createPortal(
    <div style={getPosition()} className="tooltip-content">
      {children}
      <div style={getArrowStyle()} />
    </div>,
    tooltipRoot,
  );
};

export default Tooltip;
