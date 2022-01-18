/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef } from 'react';

export interface UserInfoInputProps {
  name: string;
  maxLength: number;
  labelName: string;
  type?: 'text' | 'number' | 'password' | 'email' | 'url';
  id?: string;
  spellCheck?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  additionalClassName?: string;
}

export const UserInfoInput: React.FC<UserInfoInputProps> = ({
  id,
  name,
  labelName,
  maxLength,
  type,
  spellCheck,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  additionalClassName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const nameSpanRef = useRef<HTMLSpanElement>(null);
  const charactorCountRef = useRef<HTMLSpanElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const refIsNotNull = () =>
    inputRef.current !== null &&
    labelRef.current !== null &&
    nameRef.current !== null &&
    nameSpanRef.current !== null &&
    charactorCountRef.current !== null &&
    errorRef.current !== null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (refIsNotNull()) {
      charactorCountRef.current!.innerText = `${event.target.value.length} / ${maxLength}`;
      if (inputRef.current!.value.trim().length === 0) {
        labelRef.current!.style.boxShadow = '0 0 0 1px #f4212e';
        labelRef.current!.style.borderColor = '#f4212e';
        nameSpanRef.current!.style.color = '#f4212e';
        errorRef.current!.style.display = 'block';
      } else {
        labelRef.current!.style.boxShadow = '0 0 0 1px #1d9bf0';
        labelRef.current!.style.borderColor = '#1d9bf0';
        nameSpanRef.current!.style.color = '#1d9bf0';
        errorRef.current!.style.display = 'none';
      }
    }
    if (onChange) onChange(event.target.value);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (refIsNotNull()) {
      labelRef.current!.style.boxShadow = '0 0 0 1px #1d9bf0';
      labelRef.current!.style.borderColor = '#1d9bf0';
      nameSpanRef.current!.style.fontSize = '13px';
      nameSpanRef.current!.style.color = '#1d9bf0';
      nameRef.current!.style.paddingTop = '0.2rem';
      charactorCountRef.current!.style.visibility = 'visible';
    }
    if (onFocus) onFocus(event.target.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (refIsNotNull()) {
      if (inputRef.current!.value.length === 0) {
        labelRef.current!.style.boxShadow = '0 0 0 1px #f4212e';
        labelRef.current!.style.borderColor = '#f4212e';
        nameSpanRef.current!.style.fontSize = '1rem';
        nameSpanRef.current!.style.color = 'inherit';
        nameRef.current!.style.paddingTop = '16px';
        charactorCountRef.current!.style.color = 'inherit';
        errorRef.current!.style.display = 'block';
      } else {
        labelRef.current!.style.boxShadow = 'unset';
        labelRef.current!.style.borderColor = 'inherit';
        nameSpanRef.current!.style.color = 'inherit';
        charactorCountRef.current!.style.visibility = 'hidden';
        errorRef.current!.style.display = 'none';
      }
    }
    if (onBlur) onBlur(event.target.value);
  };

  return (
    <div
      className={`bg-transparent border-none border-0 boder-gray-600 ${additionalClassName}`}
    >
      <label
        htmlFor={id ?? name}
        className="border rounded-md border-gray-600 flex flex-row"
        ref={labelRef}
      >
        <div className="flex flex-col w-full relative">
          <div className="flex absolute h-full w-full justify-between">
            <div
              ref={nameRef}
              className="ease-in duration-150 pt-4 px-2 text-gray-300"
            >
              <span
                className="ease-in duration-150 leading-1 text-base text-inherit"
                ref={nameSpanRef}
              >
                {labelName}
              </span>
            </div>
            <div className="pt-[0.2rem] text-gray-300 px-2">
              <span
                className="text-[13px] text-inherit invisible"
                ref={charactorCountRef}
              >
                0 / {maxLength}
              </span>
            </div>
          </div>
          <div className="pb-2 mt-4 px-2 pt-3">
            <input
              id={id ?? name}
              name={name}
              className={`
                w-full outline-none focus:outline-none bg-transparent text-white
              `}
              type={type ?? 'text'}
              maxLength={maxLength}
              spellCheck={spellCheck}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={inputRef}
            />
          </div>
        </div>
      </label>
      <div ref={errorRef} className="text-[#f4212e] text-[13px] px-2 hidden">
        {labelName}を入力してください
      </div>
    </div>
  );
};
