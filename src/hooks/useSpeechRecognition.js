
import { useState, useRef, useEffect, useCallback } from 'react';

export function useSpeechRecognition({ onResult, lang = 'en-US' } = {}) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);
  const onResultRef = useRef(onResult);

  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    setSupported(true);
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
      }
      if (final.trim() && onResultRef.current) onResultRef.current(final.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => { try { rec.abort(); } catch {} };
  }, [lang]);

  const toggle = useCallback(() => {
    if (!recRef.current) return;
    if (listening) {
      try { recRef.current.stop(); } catch {}
      setListening(false);
    } else {
      try { recRef.current.start(); setListening(true); } catch {}
    }
  }, [listening]);

  return { listening, supported, toggle };
}

