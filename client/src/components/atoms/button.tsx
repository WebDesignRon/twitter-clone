import React, { forwardRef, useContext } from 'react';
import { ThemeContext } from '../../contexts/themeContext';

export interface TwitterButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  additionalClassName?: string;
  disabled?: boolean;
}

export const TwitterButton: React.VFC<TwitterButtonProps> = (
  props: TwitterButtonProps,
) => {
  const { children, onClick, additionalClassName, disabled } = props;
  const theme = useContext(ThemeContext);

  return (
    <button
      className={`text-white bg-${theme.color} hover:bg-${theme.color}Hover transition-colors font-bold py-1 px-4 rounded-full ${additionalClassName}`}
      onClick={() => onClick()}
      type="button"
      disabled={disabled ?? false}
    >
      {children}
    </button>
  );
};

export const TwitterButtonWithForwardRef = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements['button'] & TwitterButtonProps
  // eslint-disable-next-line prefer-arrow-callback
>(function TwitterButtonWithForwardRef(props, ref) {
  const { children, onClick, additionalClassName, disabled } = props;
  const theme = useContext(ThemeContext);

  return (
    <button
      className={`text-white bg-${theme.color} hover:bg-${theme.color}Hover transition-colors font-bold py-1 px-4 rounded-full ${additionalClassName}`}
      onClick={() => onClick()}
      type="button"
      ref={ref}
      disabled={disabled ?? false}
    >
      {children}
    </button>
  );
});
