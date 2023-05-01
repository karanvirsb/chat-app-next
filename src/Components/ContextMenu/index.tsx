import React from "react";

type props = {
  channelId: string;
};
// TODO when component is not clicked, it disappears

export function ContextMenu({ channelId }: props) {
  return (
    <ul
      className={`menu absolute left-[100%] top-0 bg-base-100 w-56 p-2 rounded-box`}
    >
      <li>
        <button className="btn bg-btn-mutations border-none font-bold mb-2 text-btn-mutations-text hover:bg-btn-mutations-hover">
          Delete
        </button>
      </li>
    </ul>
  );
}
