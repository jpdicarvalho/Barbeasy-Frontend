import { useState } from "react";
import "./widget.css";

const buttonWidth = 64;
const tabWidth = 300;

const tabHeaders = ["Home", "Lock", "Settings"];
const tabContent = ["Tab 1 Content", "Tab 2 Content", "Tab 3 Content"];

const Widget = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <article className="widget">
      <header>
        {tabHeaders.map((tab, index) => (
          <button
            key={tab}
            className={`tab-button ${
              activeIndex === index ? "active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab}
          </button>
        ))}
        <div
          className="underline"
          style={{
            transform: `translate(${activeIndex * buttonWidth}px, 0)`,
          }}
        ></div>
      </header>
      <div className="content">
        <div
          className="content-inner"
          style={{
            transform: `translate(-${activeIndex * tabWidth}px, 0)`,
          }}
        >
          {tabContent.map((content, index) => (
            <div key={index} className="tab-content">
              {content}
            </div>
          ))}
        <h1>teste</h1></div>
      </div>
    </article>
  );
};

export default Widget;