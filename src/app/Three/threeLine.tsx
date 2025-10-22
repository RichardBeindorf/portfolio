"use client";

import React, { useRef, useMemo, useImperativeHandle, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import * as THREE from "three";

export interface ThreeLineMethods {
  addPoint: (point: THREE.Vector3) => void;
}

function ThreeLine({
  lineApiRef,
  drawDelay,
}: {
  lineApiRef: React.RefObject<ThreeLineMethods | null>;
  drawDelay: number;
}) {
  const { size, camera } = useThree();
  const line2Ref = useRef<Line2>(null);
  // const startingPos = new THREE.Vector3(0, 250, 0);
  const points = useRef<THREE.Vector3[]>([]);
  const triggerThreshold = useRef<number[]>([]);
  const waveDist = useRef([]);
  const MAX_POINTS = 5000;

  useEffect(() => {
    // old thoughts converted in actual line
    // const thoughtData = ThreeThoughts();
    // thoughtData.forEach((thought) => {
    //   if (thought) {
    //     points.current.push(thought);
    //   }
    // });

    if (points.current) {
      // Logic for setting up line starting position
      const offset = 0.95;
      const topHalfYMidPoint = (size.height / 4) * offset;
      const topHalfXMidPoint = size.width / 2;
      const ndcX = (topHalfXMidPoint / size.width) * 2 - 1;
      const ndcY = -(topHalfYMidPoint / size.height) * 2 + 1;
      const vector = new THREE.Vector3(ndcX, ndcY, 0);
      vector.unproject(camera);
      points.current.push(vector);
    }
  }, []);

  const line2Geometry = useMemo(() => {
    const geom = new LineGeometry();
    geom.setPositions(new Float32Array(MAX_POINTS * 3));
    return geom;
  }, []);

  const line2Material = useMemo(() => {
    const mat = new LineMaterial({
      color: "#F24150",
      linewidth: 2.5,
      resolution: new THREE.Vector2(size.width, size.height),
      dashed: false,
      alphaToCoverage: true,
      transparent: true,
      depthWrite: false,
    });
    return mat;
  }, [size]);

  const line2 = useMemo(
    () => new Line2(line2Geometry, line2Material),
    [line2Geometry, line2Material]
  );
  line2Ref.current = line2;

  useImperativeHandle(lineApiRef, () => ({
    addPoint: (point: THREE.Vector3) => {
      points.current.push(point);
    },
  }));

  useFrame((state) => {
    if (points.current.length < 2) {
      line2Geometry.setDrawRange(0, 0);
      return;
    }

    const worldPoints = points.current;
    const pointsToDraw = worldPoints.slice(
      Math.max(0, worldPoints.length - MAX_POINTS)
    );

    // distances will hold not the distance between sigular points but the overall distance to the point of origin accumulated
    const distances = [0];
    const height = size.height;
    const currentY = worldPoints[worldPoints.length - 1].y;
    const percentNew = (100 / height) * currentY; // higher === smaler value and lower === bigger value
    let diff = 0;

    for (let i = 1; i < pointsToDraw.length; i++) {
      distances.push(
        distances[i - 1] + pointsToDraw[i].distanceTo(pointsToDraw[i - 1])
      );
    }

    // get the difference in height / velocity
    let pastY = currentY; // Default to currentY to get a diff of 0
    if (worldPoints.length >= 5) {
      pastY = worldPoints[worldPoints.length - 5].y;
    }

    const percentLast = (100 / height) * pastY;
    diff = Math.abs(percentNew - percentLast);

    // If the cursor strikes high enough it will cause a wave!
    // When we trigger the wave we want to remember the point where we started
    // and then start counting down, traveling backwarts through the line
    if (diff > 3) {
      triggerThreshold.current = [];
      // remembering when we had the first trigger
      triggerThreshold.current.push(worldPoints.length);
    }

    if (triggerThreshold.current.length > 0) {
      const lastThreshold =
        triggerThreshold.current[triggerThreshold.current.length - 1];

      // Waiting until trigger is fully done
      if (worldPoints.length >= lastThreshold + 5) {
        const lastPointDistance = distances[distances.length - 1] || 0;
        waveDist.current.push(lastPointDistance);
        //resetting the threshold after
        triggerThreshold.current = [];
      }
    }

    let wavedPoints = [];
    if (waveDist.current.length > 0) {
      // Wave Speed heree
      waveDist.current = waveDist.current
        .map((dist) => dist - 2)
        .filter((dist) => dist > -5);

      // console.log(waveDist.current);
      // What is in waveDist:
      // - at the start im checking if a wave should be generate via the threshhold
      // - then we`re adding the newest distance value that passed ( even if we didnt move we will add a new distance to the ref, though that is unlikeley since we passed the threshold )
      // - next Step we reduce the dang thing -> every distance value gets substracted 2
      // - we are also filtering out all values smaller than -5, so we get rid of the waves that are done!
      //

      // Wave generation procedure
      // 1. first taking the current points and start looping through them, only to grab the distance of it
      // 2. then checking the distance of the current point via the index (they have the same length)
      // 3. then we check in our waves ref for each waves current distance
      // 4. Now we check how far away we are from the waves current position and compare both
      // 5. With this comparison we can realize where the wave currently is, when the value of distToWave reaches 0 we hit the waves position!
      // 6. Now we can manipulate the values in that section
      //  6a. First of all we are setting a length of the wave using the distToWave value and set a max point (ex 100)
      //  6b. With this fixed wave distance value i can work to create a nicely shaped wave using math.sin
      //
      // Finally adding the the generated offset to the line
      // Now we just have to use those points to set the ne position for our line geometry! voila a jiggle wiggle effect
      //

      wavedPoints = pointsToDraw.map((p, pointIndex) => {
        let totalWaveOffset = 0;
        const currentPointDistance = distances[pointIndex];

        // For this single point, loop through all active waves and sum their effects
        for (const waveOriginDist of waveDist.current) {
          const distToWave = currentPointDistance - waveOriginDist;

          // Wave properties
          const waveFullLength = 150; // distance the wave travels
          const waveFrequency = 25; // How many ripples
          const maxAmplitude = 15; // max height of the wave

          // this is my wave window
          if (distToWave > 0 && distToWave < waveFullLength) {
            // using math sin to start at 0 height (x value), since math.sin of 0 is 0
            const waveShape = Math.sin(distToWave / waveFrequency);

            // the "fade in/out" part
            // We'll use a simple sin curve for the envelope itself!
            // 'progress' will go from 0 (start) to 1 (end)
            const progress = distToWave / waveFullLength;

            const envelope = Math.sin(progress * Math.PI);

            // 3. Combine them!
            // The final offset is the ripple * max height * envelope
            totalWaveOffset += waveShape * maxAmplitude * envelope;
          }
        }
        // Apply the final summed offset to a clone of the original point
        return p.clone().add(new THREE.Vector3(0, totalWaveOffset, 0));
      });
    }

    let flatWavedPoints;
    wavedPoints.length > 0
      ? (flatWavedPoints = wavedPoints.flatMap((p) => p.toArray()))
      : (flatWavedPoints = pointsToDraw.flatMap((p) => p.toArray()));

    line2Geometry.setPositions(flatWavedPoints);
    line2Geometry.setDrawRange(0, pointsToDraw.length);
    line2.computeLineDistances();
    line2Geometry.computeBoundingBox();
    line2Geometry.computeBoundingSphere();

    if (
      line2Material.resolution.x !== size.width ||
      line2Material.resolution.y !== size.height
    ) {
      line2Material.resolution.set(size.width, size.height);
      line2Material.needsUpdate = true;
    }
  });

  return <primitive object={line2Ref.current} />;
}

export default ThreeLine;
