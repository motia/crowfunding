import {useEffect} from "react";

export default (elementId: string, src: string, callback: () => void) => {
  useEffect(() => {
    const existingScript = document.getElementById(elementId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = src;
      script.id = elementId;
      script.async = false;
      document.body.appendChild(script);

      script.onload = () => {
        if (callback) callback();
      };
    }

    if (existingScript && callback) callback();
  },[])
};
