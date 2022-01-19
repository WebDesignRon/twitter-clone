import React, { useContext, useRef } from 'react';
import { ThemeContext } from '../../contexts/themeContext';

export interface FlexibleTextareaProps {
  intialValue?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  additionalClassName?: string;
  disabled?: boolean;
  cols?: number;
  minRows?: number;
  maxLength?: number;
  wrap?: 'soft' | 'hard' | 'off';
}

export const FlexibleTextarea: React.VFC<FlexibleTextareaProps> = ({
  intialValue,
  value,
  placeholder,
  onBlur,
  onFocus,
  additionalClassName,
  disabled,
  cols,
  minRows = 1,
  maxLength,
  wrap,
  onChange: onChangeText,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = useContext(ThemeContext);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current !== null) {
      textareaRef.current.style.height = 'auto'; // reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // set new height
    }
    if (onChangeText) onChangeText(event.target.value);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(textareaRef.current?.value ?? '');
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus(textareaRef.current?.value ?? '');
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      className={`bg-${theme.theme} ${additionalClassName}`}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      disabled={disabled}
      defaultValue={intialValue}
      maxLength={maxLength}
      rows={minRows}
      cols={cols}
      wrap={wrap}
    />
  );
};
