import React, { useState } from "react";

type props = {
  components: Map<string, JSX.Element>;
  tabs: string[];
};

export default function Tabs({ components, tabs }: props) {
  // TODO fix over flow, along with tab color
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <div className={`flex w-full max-w-[400px] p-[1px] overflow-auto`}>
        {tabs.map((tab, index) => {
          if (index === activeIndex) {
            return (
              <button
                className="btn border-b-2 border-b-red-400 flex-grow rounded-none"
                onClick={() => {
                  setTab(index);
                }}
                key={tab + index}
              >
                {tab}
              </button>
            );
          } else {
            return (
              <button
                className="btn flex-grow rounded-none"
                onClick={() => {
                  setTab(index);
                }}
                key={tab + index}
              >
                {tab}
              </button>
            );
          }
        })}
      </div>
      <article>{components.get(tabs[activeIndex].toLowerCase())}</article>
    </>
  );

  function setTab(index: number) {
    setActiveIndex(() => index);
  }
}
