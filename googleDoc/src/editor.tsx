import React, { useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
// TypeScript users only add this code
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { initialValue } from "./initialValue";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000/*");

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface editorProps {}

export const Editor: React.FC<editorProps> = ({}) => {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable />
    </Slate>
  );
};
