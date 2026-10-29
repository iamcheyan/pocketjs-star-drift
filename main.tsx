import { mount } from "@pocketjs/framework/solid";
import { Text, View } from "@pocketjs/framework/solid/components";
import { BTN } from "@pocketjs/framework/input";
import { onButtonPress, onFrame } from "@pocketjs/framework/lifecycle";
import { virtualNow } from "@pocketjs/framework/clock";
import { createSignal, For, onCleanup, onMount } from "solid-js";

type Star = { phase: number; size: number; lane: number };
const seed: Star[] = Array.from({ length: 24 }, (_, i) => ({ phase: i * 0.91, size: 3 + i % 4, lane: i % 7 }));
function StarDrift() {
  const [ship, setShip] = createSignal({ x: 0, y: 0 });
  const [stars, setStars] = createSignal(seed);
  const [score, setScore] = createSignal(0);
  const [fps, setFps] = createSignal(0);
  const [frameMs, setFrameMs] = createSignal(0);
  const [elapsed, setElapsed] = createSignal(0);
  const [boost, setBoost] = createSignal(false);
  let previous = 0, frames = 0, sampleStart = 0, started = 0, lastFrame = 0, phase = 0, tick = 0;
  onMount(() => {
    onButtonPress(BTN.CIRCLE, () => setScore(0));
    onFrame((snapshot: number) => {
      const now = virtualNow() * 1000;
      if (!started) { started = now; sampleStart = now; lastFrame = now; }
      const dt = Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000));
      lastFrame = now;
      const pressed = snapshot & ~previous;
      previous = snapshot;
      const isBoosting = Boolean(snapshot & BTN.CROSS);
      setBoost(isBoosting);
      if (pressed & BTN.CIRCLE) setScore(0);
      const speed = isBoosting ? 1.8 : 1.1;
      const dx = Number(Boolean(snapshot & BTN.RIGHT)) - Number(Boolean(snapshot & BTN.LEFT));
      const dy = Number(Boolean(snapshot & BTN.DOWN)) - Number(Boolean(snapshot & BTN.UP));
      const p = ship();
      const next = { x: Math.max(-72, Math.min(72, p.x + dx * speed * dt * 30)), y: Math.max(-22, Math.min(22, p.y + dy * speed * dt * 30)) };
      setShip(next);
      tick++;
      if (tick % 4 !== 0) return;
      phase += dt * (isBoosting ? 4 : 1.5) * 4;
      let collected = 0;
      setStars(current => current.map((s, i) => {
        const x = Math.sin(phase + s.phase) * (230 + (i % 3) * 18);
        const y = Math.cos(phase * 0.7 + s.phase) * (110 + s.lane * 3);
        return { ...s, phase: s.phase + dt * (isBoosting ? 4 : 1.5) + (Math.hypot(x - next.x, y - next.y) < 22 ? 12.4 : 0) };
      }));
      if (collected) setScore(n => n + collected);
      setElapsed((now - started) / 1000);
      if (now - sampleStart >= 1000) { const measured = tick * 1000 / (now - started); setFps(Math.round(measured)); setFrameMs(1000 / Math.max(measured, 1)); sampleStart = now; }
    });
  });
  onCleanup(() => { previous = 0; });
  return <View class="w-full h-full flex-col bg-slate-950 p-1">
    <View class="h-[22] flex-row items-center justify-between">
      <View class="flex-col"><Text class="text-xs text-cyan-300">POCKETJS · LIVE FRAME LOOP</Text><Text class="text-2xl text-white font-bold">STAR DRIFT</Text></View>
      <View class="flex-row gap-2">
        <View class="w-[56] flex-col items-center rounded-lg bg-slate-900 p-1"><Text class="text-xs text-slate-400">FRAME RATE</Text><Text class="text-base text-emerald-300 font-bold">{fps()} FPS</Text></View>
        <View class="w-[56] flex-col items-center rounded-lg bg-slate-900 p-1"><Text class="text-xs text-slate-400">FRAME TIME</Text><Text class="text-base text-cyan-300 font-bold">{frameMs().toFixed(1)} ms</Text></View>
      </View>
    </View>
    <View class="flex-1 flex-col rounded-xl bg-slate-900 p-1">
      <View class="h-[9] flex-row items-center justify-between"><Text class="text-xs text-slate-400">SECTOR 07 · NEBULA FIELD</Text><Text class="text-xs text-amber-300">STAR ENERGY  {score()}</Text></View>
      <View class="flex-1 flex-col items-center justify-center">
        <View class="w-full h-[82] flex-col items-center justify-center rounded-lg bg-slate-950">
          <View class="flex-row items-center justify-center gap-2"><For each={stars()}>{(star, i) => <View class={i() % 2 ? "w-[6] h-[6] rounded-full bg-cyan-300" : "w-[4] h-[4] rounded-full bg-amber-300"} style={{ translateX: Math.sin(phase + star.phase) * (78 + (i() % 3) * 8), translateY: Math.cos(phase * 0.7 + star.phase) * (22 + star.lane * 1.5) }} />}</For></View>
          <View class="h-[6]" />
          <View class="flex-row items-center justify-center gap-3"><For each={stars().slice(8, 16)}>{(star, i) => <View class={i() % 3 ? "w-[5] h-[5] rounded-full bg-cyan-300" : "w-[7] h-[7] rounded-full bg-amber-300"} style={{ translateX: Math.sin(phase + star.phase) * (70 + (i() % 3) * 8), translateY: Math.cos(phase * 0.7 + star.phase) * (20 + star.lane * 1.2) }} />}</For></View>
          <View class="h-[9]" />
          <View class="flex-row items-center justify-center gap-2"><For each={stars().slice(16)}>{(star, i) => <View class={i() % 2 ? "w-[4] h-[4] rounded-full bg-cyan-300" : "w-[6] h-[6] rounded-full bg-amber-300"} style={{ translateX: Math.sin(phase + star.phase) * (76 + (i() % 3) * 7), translateY: Math.cos(phase * 0.7 + star.phase) * (23 + star.lane * 1.2) }} />}</For></View>
          <View class="h-[20]" />
          <View class={boost() ? "w-[30] h-[30] rounded-full bg-amber-300" : "w-[24] h-[24] rounded-full bg-cyan-300"} style={{ translateX: ship().x, translateY: ship().y }} />
          <Text class="text-xs text-slate-500">{`PILOT X ${Math.round(ship().x)}  Y ${Math.round(ship().y)}`}</Text>
        </View>
      </View>
      <View class="h-[16] flex-row items-center justify-between"><Text class="text-xs text-slate-400">{`RUN TIME  ${elapsed().toFixed(1)} s`}</Text><Text class="text-xs text-slate-400">B / CIRCLE  RESET SCORE</Text></View>
    </View>
    <View class="h-[18] flex-row items-center justify-between"><Text class="text-xs text-slate-400">D-PAD MOVE · A BOOST</Text><Text class="text-xs text-slate-500">60 HZ TARGET</Text></View>
  </View>;
}
mount(() => <StarDrift />);
