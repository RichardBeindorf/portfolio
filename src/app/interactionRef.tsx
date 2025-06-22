"use client"

interface scrollRefObj {
  current: {
    velocity: number,
    yPos: number,
    lowestQuarter: number,
  }
}

export const pointerDataRef: scrollRefObj = {
  current: { velocity: 0, yPos: 0, lowestQuarter: 0 }
};
