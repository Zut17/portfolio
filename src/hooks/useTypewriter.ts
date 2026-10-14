import { useEffect, useState } from "react";

export function useTypewriter(words: string[], speed = 70, pause = 1400) {
  const key = words.join("|");
  const [text, setText] = useState("");

  useEffect(() => {
    const list = key.split("|");
    let w = 0;
    let c = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = list[w];
      c += deleting ? -1 : 1;
      setText(word.slice(0, c));
      let delay = deleting ? speed / 2 : speed;
      if (!deleting && c === word.length) {
        deleting = true;
        delay = pause;
      } else if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % list.length;
        delay = 300;
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [key, speed, pause]);

  return text;
}
