import React from "react";

export const BlogLiveReload =
  process.env.NODE_ENV === "development"
    ? () => {
        return React.createElement("script", {
          suppressHydrationWarning: true,
          dangerouslySetInnerHTML: {
            __html: `
        let ws = new WebSocket('ws://localhost:8081');
        ws.onmessage = async (message) => {
          let event = JSON.parse(message.data);
          if (event.type === "RELOAD") {
            console.log("Blog updated. Reloading window ...");
            window.location.reload();
          }
        }
      `,
          },
        });
      }
    : () => null;
