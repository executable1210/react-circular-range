import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./CircularRange.module.css";

export type StyleSlots =
  | 'knob'
  | 'knobRing'
  | 'knobBackground'
  | 'knobBackgroundPath'
  | 'knobIndicator'
  | 'knobCenter'
  | 'active'

export type CircularRangeThemeProps = Partial<Record<StyleSlots, string>>;

export interface CircularRangeProps {
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  onChange?: (value: number) => void;

  // override styles with css module
  theme?: CircularRangeThemeProps;
}

const ARC_LENGTH = 113.1; // 270°

export const CircularRange: React.FC<CircularRangeProps> = ({
  min = 0,
  max = 100,
  value = 0,
  step = 0.01,
  onChange,
  theme = styles
}) => {
  const knobRef = useRef<HTMLDivElement | null>(null);

  const [internalValue, setInternalValue] = useState(value);
  const [isActive, setIsActive] = useState(false);

  const startY = useRef(0);
  const startValue = useRef(0);
  const sensitivity = 0.01;
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const getNormalizedValue = useCallback(
    (v: number) => {
      return (v - min) / (max - min);
    },
    [min, max],
  );

  const setValue = useCallback(
    (v: number) => {
      let next = clamp(v);
      if (step > 0) {
        next = Math.round(next / step) * step;
      }
      setInternalValue(next);
      onChange?.(next);
    },
    [min, max, step, onChange],
  );

  const handleStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsActive(true);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    startValue.current = internalValue;
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isActive) return;
    e.preventDefault();

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaY = startY.current - clientY;
    const deltaValue = deltaY * sensitivity * (max - min);

    setValue(startValue.current + deltaValue);
  };

  const handleEnd = () => {
    setIsActive(false);
  };

  const handleDoubleClick = () => {
    setValue((min + max) / 2);
  };

  useEffect(() => {
    const el = knobRef.current;
    if (!el) return;

    el.addEventListener("mousedown", handleStart);
    el.addEventListener("touchstart", handleStart);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);

    el.addEventListener("dblclick", handleDoubleClick);

    return () => {
      el.removeEventListener("mousedown", handleStart);
      el.removeEventListener("touchstart", handleStart);

      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);

      el.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [handleMove, isActive]);

  const normalized = getNormalizedValue(internalValue);
  const rotation = normalized * 270 - 135;
  const dashOffset = ARC_LENGTH - normalized * ARC_LENGTH;

  return (
    <div
      ref={knobRef}
      className={`${theme.knob} ${isActive ? theme.active : ""}`}
    >
      <div className={`${theme.knobRing}`}>
        <svg
          className={`${theme.knobBackground}`}
          viewBox="0 0 60 60"
        >
          <path
            className={`${theme.knobBackgroundPath}`}
            d="M 30 6 A 24 24 0 1 1 6 30"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={dashOffset}
          />
        </svg>

        <div
          className={`${theme.knobIndicator}`}
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
          }}
        />

        <div
          className={`${theme.knobCenter}`}
        />
      </div>
    </div>
  );
};
