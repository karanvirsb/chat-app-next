import React from "react";

type props = {
    children?: JSX.Element;
    editable?: boolean;
    errorMsg?: string;
    formClass?: string;
    inputClass?: string;
    inputId: string;
    labelClass?: string;
    labelName: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute | undefined;
    value?: any;
};

export default function ModalInput({
    children,
    editable = true,
    errorMsg = "",
    formClass = "",
    inputClass = "",
    inputId = "",
    labelClass = "",
    labelName = "",
    onChange,
    placeholder = "Type Here",
    type = "",
    value,
}: props) {
    return (
        <div className={`form-control w-full ${formClass}`}>
            <label
                className={`label flex gap-4 ${labelClass}`}
                htmlFor={inputId}
            >
                <span className={`label-text text-white ${labelClass}`}>
                    {labelName}
                </span>
                <span className='text-red-400'>{errorMsg}</span>
            </label>
            <input
                id={inputId}
                type={type}
                placeholder={placeholder}
                className={`input input-bordered bg-[#2A303C] w-full ${inputClass} ${
                    errorMsg && "outline outline-2 outline-red-400"
                }`}
                contentEditable={editable}
                readOnly={!editable}
                onChange={onChange ?? undefined}
                value={value}
            />
            {children}
        </div>
    );
}
