import React from 'https://esm.sh/react@18.3.1';

const h = React.createElement;
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Icon({ size = 18, children, ...rest }) {
  return h('svg', { width: size, height: size, viewBox: '0 0 24 24', ...base, ...rest }, children);
}

export function Flame(props) {
  return h(Icon, props, h('path', { d: 'M8.5 14.5A2.5 2.5 0 0011 17a2.5 2.5 0 002.5-2.5c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7.5 7.5 0 11-15 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z' }));
}
export function Clock(props) {
  return h(Icon, props, h('circle', { cx: 12, cy: 12, r: 10 }), h('polyline', { points: '12 6 12 12 16 14' }));
}
export function CheckCircle2(props) {
  return h(Icon, props, h('circle', { cx: 12, cy: 12, r: 10 }), h('path', { d: 'm9 12 2 2 4-4' }));
}
export function Sparkles(props) {
  return h(Icon, props,
    h('path', { d: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1' }));
}
export function ChevronDown(props) {
  return h(Icon, props, h('polyline', { points: '6 9 12 15 18 9' }));
}
export function RotateCcw(props) {
  return h(Icon, props,
    h('path', { d: 'M3 12a9 9 0 1 0 2.6-6.3L3 8' }), h('polyline', { points: '3 3 3 8 8 8' }));
}
export function X(props) {
  return h(Icon, props, h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }), h('line', { x1: 6, y1: 6, x2: 18, y2: 18 }));
}
export function Grid3x3(props) {
  return h(Icon, props,
    h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }),
    h('line', { x1: 3, y1: 9, x2: 21, y2: 9 }), h('line', { x1: 3, y1: 15, x2: 21, y2: 15 }),
    h('line', { x1: 9, y1: 3, x2: 9, y2: 21 }), h('line', { x1: 15, y1: 3, x2: 15, y2: 21 }));
}
export function PenLine(props) {
  return h(Icon, props,
    h('path', { d: 'M12 20h9' }), h('path', { d: 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' }));
}
export function ListChecks(props) {
  return h(Icon, props,
    h('path', { d: 'm3 7 2 2 4-4' }), h('path', { d: 'm3 15 2 2 4-4' }),
    h('line', { x1: 13, y1: 6, x2: 21, y2: 6 }), h('line', { x1: 13, y1: 14, x2: 21, y2: 14 }));
}
export function Lock(props) {
  return h(Icon, props,
    h('rect', { x: 3, y: 11, width: 18, height: 11, rx: 2 }), h('path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' }));
}
export function TrendingUp(props) {
  return h(Icon, props,
    h('polyline', { points: '3 17 9 11 13 15 21 6' }), h('polyline', { points: '15 6 21 6 21 12' }));
}
export function Award(props) {
  return h(Icon, props,
    h('circle', { cx: 12, cy: 8, r: 6 }), h('path', { d: 'M9 13.5 7 22l5-3 5 3-2-8.5' }));
}
export function ArrowLeft(props) {
  return h(Icon, props,
    h('line', { x1: 19, y1: 12, x2: 5, y2: 12 }), h('polyline', { points: '12 19 5 12 12 5' }));
}
export function Flag(props) {
  return h(Icon, props,
    h('path', { d: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' }), h('line', { x1: 4, y1: 22, x2: 4, y2: 3 }));
}
export function BookOpen(props) {
  return h(Icon, props,
    h('path', { d: 'M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z' }), h('path', { d: 'M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z' }));
}
export function ExternalLink(props) {
  return h(Icon, props,
    h('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
    h('polyline', { points: '15 3 21 3 21 9' }), h('line', { x1: 10, y1: 14, x2: 21, y2: 3 }));
}
export function Search(props) {
  return h(Icon, props,
    h('circle', { cx: 11, cy: 11, r: 8 }), h('line', { x1: 21, y1: 21, x2: 16.65, y2: 16.65 }));
}
