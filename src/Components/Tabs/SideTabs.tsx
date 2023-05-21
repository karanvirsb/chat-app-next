import React, { useState } from "react";

type props = {
  components: Map<string, JSX.Element>;
  tabs: string[];
};

export default function SideTabs({ components, tabs }: props) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <div className={`flex flex-col w-full p-[1px] overflow-auto`}>
        {tabs.map((tab, index) => {
          if (index === activeIndex) {
            return (
              <button
                key={tab}
                className="btn flex-grow rounded-none"
                onClick={() => {
                  setTab(index);
                }}
              >
                {tab}
              </button>
            );
          } else {
            return (
              <button
                key={tab}
                className="btn flex-grow rounded-none"
                onClick={() => {
                  setTab(index);
                }}
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
