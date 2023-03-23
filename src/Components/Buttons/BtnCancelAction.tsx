import React from "react";

type props = {
    text: string;
    onClick: (...args: any) => any;
    classname?: string;
};

export default function BtnCancelAction({ text, onClick, classname }: props) {
    return (
        <button
            className={`btn border-none bg-transparent text-white hover:outline hover:outline-2 hover:outline-btn-cta hover:bg-transparent ${classname}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}
