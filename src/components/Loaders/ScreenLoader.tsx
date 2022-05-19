import React, {CSSProperties} from 'react';

const ScreenLoader: React.FC = () => {
  return (
    <section className={"bg-gradient-to-tr from-[#fff95b] to-[#ff930f] w-full h-full flex justify-center items-center"}>
      <svg
        className={"w-36 h-36 animate-bounce"}
        id="layout1"
        xmlns="http://www.w3.org/2000/svg"
        x={0}
        y={0}
        viewBox="0 0 50 15"
        style={{enableBackground: "new 0 0 50 15"} as CSSProperties}
        xmlSpace="preserve"
      >
        <style>{".st0{fill:#1c1917}"}</style>
        <path
          className="st0"
          d="M4.7 4.7V1.8H7V.2H0v1.7h2.3v2.8h2.4zM9.1 8.1h1V.2H7.8v5.9c.6.5 1 1.2 1.3 2zM13.6 4.6V3.2h.1c0 .1.1.2.1.3 0 .1.1.2.1.3l.4.7h1.6l.2.6 1 2.4V4.7h1.5V.2h-1.9V5.1c0-.1-.1-.2-.1-.3 0-.1-.1-.2-.1-.3L14.3.2h-2.6v4.5h.5l1.4-.1zM24.4 3.4l3-3.2H25l-2.4 2.6V.2h-2.4v4.5h5.2zM30.6 4.7V3.6c0-.7.1-1.2.4-1.5.3-.3.6-.4 1.1-.4s.8.1 1.1.4.4.8.4 1.5v1.1H35.3l.3.5.3.6c0-.4.1-.9.1-1.4v-.5c0-1.3-.4-2.3-1.1-2.9-.7-.6-1.7-1-2.8-1-1.1 0-2.1.3-2.8 1s-1.1 1.6-1.1 2.9v.8h2.4zM39.8 4.7h.9v.5h2V3.6h-3V1.8h3.4V.2h-5.8v4.5h.2zM49.1 5.2h.6V3.6h-3.1V1.8H50V.2h-5.8v4.5c.5-.1 1.1-.2 1.7-.2 1.2 0 2.3.2 3.2.7zM7 6.7c-.9-.8-2-1.1-3.4-1.1H0v9.3h3.6c1.4 0 2.5-.4 3.4-1.1 1-.8 1.4-1.9 1.4-3.3v-.6C8.4 8.5 8 7.4 7 6.7zm-1.4 3.8c0 .8-.2 1.4-.6 1.8-.4.4-.9.6-1.4.6h-.8V7.5h.8c.5 0 1 .1 1.4.5.4.4.6 1 .6 1.8v.7z"
        />
        <path
          className="st0"
          d="m12.1 5.5-3.7 9.3H11l.6-1.7h3.8l.6 1.7h3l-3.8-9.3h-3.1zm.2 5.8.9-2.6c.1-.1.1-.3.1-.4s.1-.3.1-.4h.1c0 .1.1.3.1.4 0 .1.1.3.1.4l1 2.6h-2.4zM18 7.5h2.7v7.3h2.8V7.5h2.6V5.6H18zM27.1 5.6h2.8v9.3h-2.8zM37.5 10.5v.8c0-.2-.1-.3-.1-.4 0-.1-.1-.2-.2-.3l-2.6-5h-3v9.3h2.3V9.2c.1.1.1.2.1.3s.1.2.2.4l2.5 4.9h3.1V5.6h-2.3v4.9zM50 8.5v-.1c.1-.9-.3-1.7-1-2.2s-1.8-.8-3.1-.8c-1.4 0-2.5.4-3.4 1.1s-1.2 1.9-1.2 3.4v.6c0 1.5.4 2.7 1.2 3.4s2 1.1 3.5 1.1c1 0 1.8-.1 2.4-.4s1.2-.6 1.5-1V9.7h-4.1v1.9h1.3v1.1c-.2.1-.4.2-.5.3s-.4.1-.7.1c-.6 0-1-.1-1.4-.5s-.5-.9-.5-1.7V9.5c0-.8.2-1.4.4-1.7.3-.3.7-.5 1.2-.5s.9.1 1.1.3c.2.2.3.5.3.9v.1l3-.1z"
        />
      </svg>
    </section>
  );
};

export default ScreenLoader;