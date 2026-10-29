# Star Drift — PocketJS FPS demo

A small handheld game demonstrating PocketJS's native view tree, Solid signals, gamepad input, frame driven motion, and a live FPS / frame time HUD.

![Star Drift on the H700 handheld at 60 FPS](assets/device-gameplay.png)

This is a direct 720×480 framebuffer capture. The HUD read 60 FPS and 16.6 ms per frame. The installed runtime profile uses a 360×240 logical viewport at 2× raster density. FPS is an observed cadence snapshot from PocketJS virtual frame ticks; it is not a GPU benchmark or a guaranteed refresh rate.

## Play

- D-pad: move the pilot.
- A / CROSS: boost.
- B / CIRCLE: reset the score.
- Collect the drifting stars.

## Build

Compile with the PocketJS checkout and the H700 runtime profile:

```sh
bun tools/pocket.ts compile \
  --runtime-config programs/linux-kms-h700/pocket.runtime-config.ts \
  --target rocknix-h700-kms \
  --manifest apps/star-drift/pocket.json \
  --output star-drift.pocket
```

`star-drift.pocket` is generated and is not committed. The package was admitted by the installed H700 runtime with profile hash `sha256:85385701f8dde49f563eb578c67de330562c219b2c7924fce09a15801819bcb0`.

## Install and launch

The package is copied to both locations:

- PocketJS app storage: `/storage/pocketjs/apps/star-drift.pocket`
- User game content: `/storage/content/games/misc/star-drift.pocket`

The device's `pocketshell-games` scanner currently indexes ROM file extensions such as `.gba`, `.sfc` and `.chd`; it does not index `.pocket`. The device also has no `/usr/bin/pocketshell-play` launcher installed. As a result, the package is present under the requested games directory but does not appear in Library or launch from it yet. It was manually launched for device verification with:

```sh
/storage/pocketjs/session-run \
  /storage/pocketjs/bin/pocket-linux-kms \
  --package /storage/pocketjs/apps/star-drift.pocket \
  --card /dev/dri/card1
```

The PocketJS demo is manually deployed from `/storage`; it is not part of the ROCKNIX system image.

## Files

- `main.tsx` — game, controls, animation and performance HUD.
- `pocket.json` — PocketJS v2 manifest using the H700 logical viewport.
- `profile.ts`, `pocket.runtime-config.ts` — isolated H700 compiler target configuration.
- `h700-profile.json`, `h700-profile.rs` — H700 profile reference copied from the runtime recipe.
- `assets/device-gameplay.png` — final 720×480 handheld capture.
