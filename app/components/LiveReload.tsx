import { LiveReload as RemixLiveReload } from "@remix-run/react";
import React from "react";

export const LiveReload =
  process.env.NODE_ENV === "development"
    ? () => {
        const BlogLiveReload = React.createElement("script", {
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
        return (
          <>
            <RemixLiveReload />
            {BlogLiveReload}
          </>
        );
      }
    : () => null;
