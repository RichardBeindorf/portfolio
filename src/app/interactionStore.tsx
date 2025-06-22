"use client"

type PointerData = {
  x: number;
  y: number;
  velocityY: number;
};

let data: PointerData = { x: 0, y: 0, velocityY: 0 };
const listeners = new Set<() => void>();

export function setPointerData(newData: PointerData) {
  data = newData;
  listeners.forEach(listener => listener());
}

export function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getSnapshot(): PointerData {
  return data;
}