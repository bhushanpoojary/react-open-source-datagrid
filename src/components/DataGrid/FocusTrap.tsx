import React from 'react';
import { useFocusTrap } from './useFocusTrap';

export interface FocusTrapProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  enabled?: boolean;
  initialFocus?: 'first' | 'last' | HTMLElement | null;
  returnFocus?: boolean;
  escapeDeactivates?: boolean;
  onEscape?: () => void;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  className,
  style,
  ...options
}) => {
  const trapRef = useFocusTrap(options);

  return (
    <div ref={trapRef as React.RefObject<HTMLDivElement>} className={className} style={style}>
      {children}
    </div>
  );
};
