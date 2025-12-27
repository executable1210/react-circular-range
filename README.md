# react-circular-range

A compact, touch- and mouse-friendly circular (rotary) range knob React component with CSS-module theming. Supports double-click to reset, and works well inside instrument UIs (pedals, mixers, synth panels).

## Features

* Double-click to reset to mid value
* Themeable via CSS modules

## Install

```bash
npm install react-circular-range
# or
yarn add react-circular-range
```

## Types

```ts
type StyleSlots =
  | 'knob'
  | 'knobRing'
  | 'knobBackground'
  | 'knobBackgroundPath'
  | 'knobIndicator'
  | 'knobCenter'
  | 'active';

export type CircularRangeThemeProps = Partial<Record<StyleSlots, string>>;

export interface CircularRangeProps {
  // defaults: 0 / 100
  min?: number;
  max?: number;

  value?: number;
  step?: number;
  
  onChange?: (value: number) => void;

  // optional CSS module object mapping slot names (knob, knobRing, knobBackground, etc.) to class names
  theme?: CircularRangeThemeProps;
}
```

## Simple example with pedal

```tsx
import { CircularRange } from "react-circular-range";
import React, { useState } from "react";

export const SimplePedal: React.FC = () => {
  const [params, setParams] = useState({
    gain: 50,
    freq: 1000,
    min: 25,
    drive: 0,
  });

  const update = (key: keyof typeof params) => (v: number) => setParams(p => ({ ...p, [key]: v }));

  return (
    <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', padding: '4rem' }}>
      <Knob label="GAIN" value={params.gain} unit="%" onChange={update('gain')}/>
      <Knob label="FREQ" value={params.freq} unit="Hz" onChange={update('freq')} format={f => f >= 1000 ? `${(f/1000).toFixed(1)}k` : f.toString()} />
      <Knob label="MIN"  value={params.min}  unit="%" onChange={update('min')} />
      <Knob label="DRIVE" value={params.drive} unit="dB" onChange={update('drive')} format={d => `${d > 0 ? '+' : ''}${d}`} />
    </div>
  );
};

const Knob: React.FC<{ label: string; value: number; unit: string; onChange: (v: number) => void; format?: (v: number) => string }> = ({ label, value, unit, onChange, format = String }) => (
  <div style={{ textAlign: 'center' }}>
    <CircularRange
      min={unit === 'Hz' ? 20 : unit === 'dB' ? -20 : 0}
      max={unit === 'Hz' ? 20000 : unit === 'dB' ? 20 : 100}
      step={unit === 'Hz' ? 10 : 1}
      value={value}
      onChange={onChange}
    />
    <div style={{ marginTop: '1rem', color: '#fff', fontFamily: 'monospace' }}>
      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{format(value)}{unit}</div>
    </div>
  </div>
);

export const App = () => {
  return <SimplePedal />
}
```

## Example with style override (neon)

```css
/* neon.module.css */
.knob {
    width: 70px;
    height: 70px;
    position: relative;
    cursor: pointer;
}
.knobRing {
    width: 100%;
    height: 100%;
    border: 2px solid #00ffcc;
    border-radius: 50%;
    background: #0a0a0a;
    box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
}
.knobBackground {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    transform: rotate(-135deg);
}
.knobBackgroundPath {
    fill: none;
    stroke: #00ffcc;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 113.1;
    stroke-dashoffset: 113.1;
    filter: drop-shadow(0 0 3px rgba(0, 255, 204, 0.9));
}
.knobIndicator {
    position: absolute;
    width: 4px;
    height: 22px;
    background: linear-gradient(to bottom, #00ffcc, #00b3ff);
    top: 4px;
    left: 50%;
    transform-origin: center 31px;
    transform: translateX(-50%) rotate(-135deg);
    border-radius: 1px;
    box-shadow: 0 0 8px rgba(0, 255, 204, 0.8);
}
.knobCenter {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #000000;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 5px rgba(0, 255, 204, 0.5);
}
/* Hover states */
.knob:hover .knobRing {
    border-color: #00ff88;
    box-shadow: 0 0 15px rgba(0, 255, 204, 0.7);
}
.knob:hover .knobIndicator {
    background: linear-gradient(to bottom, #00ff88, #00ccff);
    box-shadow: 0 0 12px rgba(0, 255, 204, 1);
}
/* Active states */
.knob.active .knobRing {
    border-color: #00ff88;
    box-shadow: 0 0 20px rgba(0, 255, 204, 0.9);
}
.knob.active .knobIndicator {
    background: linear-gradient(to bottom, #00ff88, #00ccff);
    box-shadow: 0 0 15px rgba(0, 255, 204, 1);
}
.knob.active .knobBackgroundPath {
    stroke: #00ff88;
    filter: drop-shadow(0 0 5px rgba(0, 255, 204, 1));
}
```

## Import and pass as a prop

```tsx
import neonStyles from "./neon.module.css"

// ...

<CircularRange
  min={unit === 'Hz' ? 20 : unit === 'dB' ? -20 : 0}
  max={unit === 'Hz' ? 20000 : unit === 'dB' ? 20 : 100}
  step={unit === 'Hz' ? 10 : 1}
  value={value}
  onChange={onChange}

  theme={neonStyles} // <---
/>

```