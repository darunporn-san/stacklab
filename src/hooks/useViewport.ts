import { useState, useEffect, useCallback } from "react";
import { DEVICE_PRESETS } from "@/lib/breakpoints";

const STORAGE_KEY = "devtoolbox-viewport";

interface ViewportState {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  url: string;
}

const defaults: ViewportState = {
  width: 375,
  height: 812,
  maintainAspectRatio: false,
  url: "",
};

function loadState(): ViewportState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return defaults;
}

function saveState(s: ViewportState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

export function useViewport() {
  const [state, setState] = useState<ViewportState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setWidth = useCallback((w: number) => {
    setState((s) => {
      if (s.maintainAspectRatio && s.width > 0) {
        const ratio = s.height / s.width;
        return { ...s, width: w, height: Math.round(w * ratio) };
      }
      return { ...s, width: w };
    });
  }, []);

  const setHeight = useCallback((h: number) => {
    setState((s) => {
      if (s.maintainAspectRatio && s.height > 0) {
        const ratio = s.width / s.height;
        return { ...s, height: h, width: Math.round(h * ratio) };
      }
      return { ...s, height: h };
    });
  }, []);

  const setUrl = useCallback((url: string) => {
    setState((s) => ({ ...s, url }));
  }, []);

  const toggleAspectRatio = useCallback(() => {
    setState((s) => ({ ...s, maintainAspectRatio: !s.maintainAspectRatio }));
  }, []);

  const rotate = useCallback(() => {
    setState((s) => ({ ...s, width: s.height, height: s.width }));
  }, []);

  const applyPreset = useCallback((index: number) => {
    const p = DEVICE_PRESETS[index];
    if (p) setState((s) => ({ ...s, width: p.width, height: p.height }));
  }, []);

  const reset = useCallback(() => {
    setState({ ...defaults, url: state.url });
  }, [state.url]);

  return {
    ...state,
    setWidth,
    setHeight,
    setUrl,
    toggleAspectRatio,
    rotate,
    applyPreset,
    reset,
  };
}
