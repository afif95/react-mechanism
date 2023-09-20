import { useState } from "react";
import { act } from "react-dom/test-utils";

const content = [
  {
    summary: "React is a library for building UIs",
    details:
      "Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "State management is like giving state a home",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "We can think of props as the component API",
    details:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export default function App() {
  return (
    <div>
      <Tabbed content={content} />
    </div>
  );
}

// console.log(<DifferentContent test={23} />);
// console.log(DifferentContent());

function Tabbed({ content }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs">
        <Tab num={0} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={1} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={2} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={3} activeTab={activeTab} onClick={setActiveTab} />
      </div>
      {activeTab <= 2 ? (
        // React will call createElement to create a new fiber on which to mount state.
        <TabContent
          item={content.at(activeTab)}
          // different key for different Tab: fiber tree rebuilt
          // without key: diffing: same element same position: DOM element and state are kept
          key={content.at(activeTab).summary}
        />
      ) : (
        <DifferentContent />
      )}
      {/* the state mounts in parent fiber */}
      {/* {TabContent({ item: content.at(0) })} */}
    </div>
  );
}

function Tab({ num, activeTab, onClick }) {
  return (
    <button
      className={activeTab === num ? "tab active" : "tab"}
      onClick={() => onClick(num)}
    >
      Tab {num + 1}
    </button>
  );
}

function TabContent({ item }) {
  const [showDetails, setShowDetails] = useState(true);
  const [likes, setLikes] = useState(0);

  console.log("RENDER");

  function handleInc() {
    // setLikes(likes + 1);
    setLikes((likes) => likes + 1);
  }

  function handleTripleInc() {
    // problems: 1) Updated state variables are not immediately available after setState call, but only after the re-render
    // 2) state updates are batched: only one render + commit
    // setLikes(likes + 1);
    // console.log(likes);
    // setLikes(likes + 1);
    // console.log(likes);
    // setLikes(likes + 1);
    // console.log(likes);
    // updated state value is available in callback function
    // setLikes((likes) => likes + 1);
    // setLikes((likes) => likes + 1);
    // setLikes((likes) => likes + 1);

    // always use callback function
    handleInc();
    handleInc();
    handleInc();
  }

  function handleUndo() {
    // state updates are batched: only one render + commit
    // if new state === current state, no state update, no rerender
    setShowDetails(true);
    setLikes(0);
    // Updated state variables are not immediately available after setState call, but only after the re-render
    // render phase is asynchronous
    // likes will show current value, not updated value = zero
    console.log(likes);
  }

  function handleUndoLater() {
    // react 18: auto batching for state updates happens for setTimeout, promises etc.
    setTimeout(handleUndo, 2000);
  }

  return (
    <div className="tab-content">
      <h4>{item.summary}</h4>
      {showDetails && <p>{item.details}</p>}

      <div className="tab-actions">
        <button onClick={() => setShowDetails((h) => !h)}>
          {showDetails ? "Hide" : "Show"} details
        </button>

        <div className="hearts-counter">
          <span>{likes} ❤️</span>
          <button onClick={handleInc}>+</button>
          <button onClick={handleTripleInc}>+++</button>
        </div>
      </div>

      <div className="tab-undo">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleUndoLater}>Undo in 2s</button>
      </div>
    </div>
  );
}

function DifferentContent() {
  return (
    <div className="tab-content">
      <h4>I'm a DIFFERENT tab, so I reset state 💣💥</h4>
    </div>
  );
}
