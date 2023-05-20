import React from "react";

type props = {
  labelName: string;
  value: string;
  onClick: (...args: any) => any | void;
  inputType?: React.HTMLInputTypeAttribute | undefined;
};

export default function UserInput({
  labelName,
  value,
  onClick,
  inputType = "text",
}: props) {
  return (
    <div className="form-control w-[90%] my-4">
      <label className="label">
        <span className="label-text">{labelName}</span>
      </label>
      <div className="flex gap-4 w-full flex-row md:flex-col">
        <input
          type={inputType}
          className="input input-bordered w-full"
          contentEditable={false}
          defaultValue={value}
          readOnly={true}
        />
        <button
          className="btn bg-btn-cta border-none text-black hover:bg-btn-cta-hover"
          onClick={onClick}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
