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
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
}

export const FlexibleTextarea: React.VFC<FlexibleTextareaProps> = ({
  intialValue,
  value,
  placeholder,
  onBlur,
  onFocus,
  additionalClassName,
  disabled,
  minRows = 1,
  maxRows = 25,
  maxLength,
  onChange: onChangeText,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = useContext(ThemeContext);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rows = event.target.value.split('\n').length;
    if (textareaRef.current !== null && rows <= maxRows)
      textareaRef.current.rows = rows;
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
      value={value === '' ? undefined : value}
      className={`bg-${theme.theme} ${additionalClassName}`}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      disabled={disabled}
      defaultValue={intialValue}
      maxLength={maxLength}
      rows={minRows}
    />
  );
};
