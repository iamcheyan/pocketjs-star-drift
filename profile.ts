import { defineProfile } from "../../framework/src/profile.ts";
/** Product example; physical modes are deployment facts, not renderer features. */
export default defineProfile({
  id: "rocknix-h700-kms", platform: "linux", form: "embedded", tickHz: 60,
  display: { physicalViewport: [720, 480], logicalViewports: [[360, 240]], rasterDensity: 2, presentations: ["native", "integer-fit"] },
  capabilities: ["input.buttons", "text.glyphs.baked"], roleCapabilities: {},
});
