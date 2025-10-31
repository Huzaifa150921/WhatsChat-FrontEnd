import "./globals.css";
import React from "react";
import { SocketProvider } from "@/app/context/SocketContext";

export const metadata = {
  title: "WhatsChat",
  description: "A user friendly chatting app with JWT authentication.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="description" content="A user friendly chatting app with JWT authentication." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />


      </head>
      <body>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
