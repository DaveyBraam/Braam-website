"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode, RefObject } from "react";
import * as THREE from "three";
import { OPENING_ASSETS, OPENING_BEATS, OPENING_DURATION, sampleCvOpening } from "./cv-opening-motion";

const subscribe = () => () => {};
type Control = { progress: number; invalidate?: () => void };

function Installation({ control }: { control: RefObject<Control> }) {
  const boiler = useGLTF(OPENING_ASSETS.boiler);
  const flue = useGLTF(OPENING_ASSETS.flue);
  const root = useRef<THREE.Group>(null);
  const flueRoot = useRef<THREE.Group>(null);
  const assets = useMemo(() => {
    const prepare = (source: THREE.Group) => {
      const scene = source.clone(true);
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) { node.castShadow = true; node.receiveShadow = true; }
      });
      return scene;
    };
    return { boiler: prepare(boiler.scene), flue: prepare(flue.scene) };
  }, [boiler.scene, flue.scene]);
  const { invalidate } = useThree();
  useEffect(() => { invalidate(); }, [assets, invalidate]);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const frame = sampleCvOpening(control.current.progress);
    if (!root.current || !flueRoot.current) return;
    root.current.position.set(frame.x, frame.y, frame.z);
    root.current.rotation.set(0, frame.rotationY, frame.rotationZ);
    flueRoot.current.position.set(OPENING_ASSETS.flueSeat[0],
      OPENING_ASSETS.flueSeat[1] + frame.flueLift,
      OPENING_ASSETS.flueSeat[2] + frame.flueBack);
    camera.position.fromArray(frame.camera);
    camera.lookAt(lookAt.fromArray(frame.target));
  });
  return <>
    <color attach="background" args={["#f3f0e9"]} />
    <ambientLight intensity={.38} color="#fff7eb" />
    <directionalLight position={[-3, 5, 4]} intensity={2.0} color="#fff8ef" />
    <Environment resolution={256} frames={1} environmentIntensity={.72}>
      <Lightformer position={[-3, 3, 3]} scale={[3, 5, 1]} intensity={3} target={[0, .7, 0]} />
      <Lightformer position={[3, 1, 2]} scale={[2, 4, 1]} intensity={.8} target={[0, .7, 0]} />
      <Lightformer position={[1, 4, -2]} scale={[3, 3, 1]} intensity={2} target={[0, .7, 0]} />
    </Environment>
    <group ref={root}>
      <primitive object={assets.boiler} dispose={null} />
      <group ref={flueRoot}>
        <group rotation={[0, -Math.PI / 2, 0]} scale={OPENING_ASSETS.flueScale}>
          <group rotation={[-Math.PI / 2, 0, 0]}><primitive object={assets.flue} dispose={null} /></group>
        </group>
      </group>
    </group>
    <ContactShadows position={[.4, -.14, 0]} scale={8} blur={3.5}
      far={3} resolution={512} opacity={.25} color="#625a4d" />
  </>;
}

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert">De 3D-preview kon niet laden. Vernieuw de pagina om opnieuw te proberen.</p> : this.props.children; }
}

export function CvOpeningPreviz() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const control = useRef<Control>({ progress: 0 });
  useEffect(() => { control.current.progress = progress; control.current.invalidate?.(); }, [progress]);
  useEffect(() => {
    if (!playing) return;
    let last = 0, frame = 0;
    const tick = (time: number) => {
      if (last) {
        const next = Math.min(1, control.current.progress + Math.min(time - last, 100) / (OPENING_DURATION * 1000));
        control.current.progress = next;
        control.current.invalidate?.();
        setProgress(next);
        if (next === 1) { setPlaying(false); return; }
      }
      last = time; frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const seek = (value: number) => { setPlaying(false); setProgress(value); };
  return <main className="cv-previz">
    <div className="cv-previz__viewport" aria-label="Warme architecturale studio met de originele cv-ketel en losse rookgasafvoer">
      <PreviewBoundary>
        {mounted && <Canvas camera={{ position: [.38, .665, .67], fov: 28, near: .05, far: 18 }}
          onCreated={({ invalidate }) => { control.current.invalidate = invalidate; }}
          frameloop="demand" shadows dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
          fallback={<p>Deze browser ondersteunt de 3D-weergave niet.</p>}>
          <Suspense fallback={null}><Installation control={control} /></Suspense>
        </Canvas>}
      </PreviewBoundary>
    </div>
    <section className="cv-previz__controls" aria-label="Bediening van de previz">
      <div className="cv-previz__toolbar">
        <div><h1>CV-installatie — openingsstudie</h1><p>Twee originele modellen · één camera · 20 seconden</p></div>
        <button type="button" onClick={() => { if (progress >= 1) setProgress(0); setPlaying(!playing); }}>{playing ? "Pauzeren" : "Afspelen"}</button>
      </div>
      <label className="cv-previz__scrub">Tijdlijn <output>{(progress * OPENING_DURATION).toFixed(1)} s / {OPENING_DURATION} s</output>
        <input type="range" min="0" max="1000" step="1" value={Math.round(progress * 1000)}
          onChange={(event) => seek(Number(event.target.value) / 1000)} aria-label="Positie in de openingsanimatie" />
      </label>
      <div className="cv-previz__beats">{OPENING_BEATS.map((beat) => <button key={beat.label} type="button" onClick={() => seek(beat.position)}>{beat.label}</button>)}</div>
      <p className="cv-previz__note">Sleep door de tijdlijn om iedere compositie te beoordelen. De lege ruimte links is gereserveerd voor latere HTML-typografie. Alleen de ketel en de aangeleverde rookgasafvoer zijn opgenomen.</p>
    </section>
  </main>;
}
