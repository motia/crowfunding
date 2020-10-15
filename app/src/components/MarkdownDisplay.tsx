// @ts-ignore
import DOMPurify from 'dompurify';
import useScript from "../utils/useScript";
import React, {useState} from "react";

let marked: null | ((md: string) => string) = null;

export function MarkdownDisplay({
                                  markdownSrc
                                }: any) {
  const [isReady, setReady] = useState(false);
  useScript(
    'marked-js',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    () => {
      // @ts-ignore
      marked = window.marked || null;
      setReady(true);
    }
  );

  const markdownContent = () => ({__html: DOMPurify.sanitize(marked!(markdownSrc))});

  return isReady
    ? (
      marked
        ? <div className="content" dangerouslySetInnerHTML={markdownContent()}/>
        : <div>Markdown lib could not be loaded</div>
    )
    : <div/>;
}
