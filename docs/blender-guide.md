# Modeling your room in Blender

This guide takes you from a fresh Blender install to a `room.glb` the portfolio can load. It assumes you've never used Blender. Expect a few evenings of work. The style is **chunky low-poly**: simple shapes, soft baked light, no fine detail. That's what makes it read as cozy instead of unfinished.

You can't break the site by experimenting. The room only goes live once you run `npm run room` and switch `VITE_ROOM` to `model` (step 9).

---

## 0. Install Blender

- Download it from **https://www.blender.org/download/**. Blender is free and open source, with no subscription. Don't download it from any other site.
- Any recent version (4.x or newer) works. The menu names below match current versions. If something has moved, search for the option with **F3**.

**Five shortcuts you'll use constantly** (mouse over the 3D view):

| Do this | Keys |
| --- | --- |
| Orbit / pan / zoom the view | Middle-mouse drag / Shift + middle-mouse / scroll |
| Add an object | Shift + A |
| Move / rotate / scale | G / R / S (then type a number, Enter) |
| Constrain to an axis | press X, Y or Z after G/R/S |
| Edit mode ↔ object mode | Tab |

---

## 1. Set up the scene

1. **File → New → General.** Delete the default cube, light and camera (select each, press X). The site supplies its own camera, and the light gets baked.
2. **Scene Properties → Units:** Unit System **Metric**, Unit Scale **1.0**, Length **Meters**. 1 Blender unit is 1 meter, and the site expects that.
3. **Measure your real room** with a tape measure: floor width and depth, desk width/depth/height, bed length/width, window size and height from the floor. Rough is fine (±5 cm).

**Orientation the site expects.** Blender's front view (numpad 1) looks along +Y. Model it so that, sitting in your chair:

- your **desk is in front of you** (toward −Y in Blender's front view, away from the camera),
- your **window is on your right**,
- your **bed is behind you**.

That's the layout in the design: desk ahead with the monitor in the middle and the system unit beside it, window on the right, bed behind the chair.

---

## 2. Block out the room

Use cubes only (**Shift + A → Mesh → Cube**) and scale them to your measurements (**S**, then **Shift + Z** to keep height, or type exact sizes in the **N** panel → Item → Dimensions).

1. Floor, then two or three walls. Leave the side the camera looks in from open, like a dollhouse.
2. Desk top and legs, chair, bed, window frame.
3. Desk items: monitor, system unit, keyboard, a sheet of paper (your résumé), lamp, a stack of books, a mug, and a plant on the windowsill.

Stop when it reads as your room from a distance. Proportions matter more than detail.

---

## 3. Make each object chunky low-poly

For each object: **Tab** into edit mode and use only:

- **Ctrl + R**: loop cut (adds a line around the object), then G to slide it.
- **E**: extrude a face (pull out legs, a monitor stand, a pillow).
- **Ctrl + B**: bevel edges slightly. A tiny bevel (0.01–0.02 m, 1–2 segments) is the secret to "cozy": edges catch light instead of looking razor-sharp.

Keep it simple: a bed is a box mattress plus a box frame plus a bevelled pillow. A plant is a cylinder pot plus a few squashed icospheres.

**Optional: make it yours.** Swap my placeholder picks (plant, books, mug) for the things actually in your room: a poster (a thin plane), your keyboard, a figure, anything recruiters might remember.

---

## 4. Name the objects. This part is required.

The website finds things **by exact name**. In the **Outliner** (top right), double-click an object to rename it.

**Five clickable objects.** Each one must be a separate object with exactly this name:

| Name | What it is | Opens |
| --- | --- | --- |
| `monitor` | your monitor (screen + frame) | Projects |
| `system_unit` | the PC tower | Skills |
| `window` | the window (glass + frame) | Contact |
| `bed` | the bed | About |
| `resume_paper` | the sheet of paper on the desk | Résumé PDF |

Everything else can be named anything, and you can join the static scenery (floor, walls, desk, chair…) into one object with **Ctrl + J** to keep the file small. **Don't** join the five objects above into anything.

### Camera empties

The site flies the camera to each object. You tell it where to stand with **empties** (**Shift + A → Empty → Plain Axes**). Each spot is a *pair*: where the camera stands, and what it looks at.

| Empty | Put it… |
| --- | --- |
| `cam_start` | behind and above the bed, where the room looks best from |
| `cam_start_target` | on the desk, the point the start view looks at |
| `cam_monitor` / `cam_monitor_target` | in front of the monitor / on the screen |
| `cam_system_unit` / `cam_system_unit_target` | in front of the tower / on it |
| `cam_window` / `cam_window_target` | in the room, facing the window / on the glass |
| `cam_bed` / `cam_bed_target` | above the room facing the bed / on the bed |
| `cam_resume_paper` / `cam_resume_paper_target` | above the desk / on the paper |

**Optional, recommended for phones:** `cam_start_portrait` + `cam_start_portrait_target`. Phones are tall and narrow, so the normal start view crops off the window and bed. Put this pair higher and further back so the whole room fits a tall frame. Without it, phones use `cam_start`.

**Preview a spot:** add a temporary camera (**Shift + A → Camera**), move it onto an empty, and use **Track To** (Object Constraint) pointing at the `_target` empty. Then press **numpad 0** to look through it. For phones, set **Output Properties → Resolution** to 1080 × 2340 while you check `cam_start_portrait`. Delete the temporary camera before exporting.

The site refuses an export that's missing any of the five object names or their camera pairs. It tells you exactly which names are missing (step 8).

---

## 5. Unwrap

Baking needs every mesh to have UVs.

1. Select all the meshes (**A** in object mode), **Tab** into edit mode, **A** to select everything.
2. **UV → Smart UV Project** (Island Margin **0.02**). Done. Low-poly doesn't need careful unwrapping.

If you joined scenery into one object, you can bake everything into **one image** (an atlas). For a beginner, one image of **2048 × 2048** is the sweet spot.

---

## 6. Light it warm, then bake

1. Lighting (temporary, for the bake only):
   - **Desk lamp:** a **Point** light inside the lamp shade, color warm orange (~2700 K, e.g. `#FFB46B`), power ~30–60 W.
   - **Evening window:** an **Area** light just outside the window pointing in, color soft peach (`#FFC48A`), power ~200–400 W.
   - **World** (Shading → World): a dim dusty color so shadows aren't pitch black.
2. **Render Properties → Render Engine: Cycles.** Device: GPU if you have one.
3. For **every** material: open the **Shading** workspace and add an **Image Texture** node (**Shift + A → Texture → Image Texture**). Click **New** to make a 2048 × 2048 image named `room_bake`, and use the **same image** in every material. Leave the node **selected** (click it last). Don't connect it yet.
4. **Render Properties → Bake:** Bake Type **Combined**, Margin 8 px. Click **Bake**. It can take a few minutes.
5. Save the image: **Image Editor → Image → Save As** → `room_bake.png` (keep it next to your `.blend`).
6. **Connect it:** in each material, plug the `room_bake` Image Texture's **Color** into the **Principled BSDF → Base Color**. The website shows exactly this texture, unlit, so what you see in Blender's Material Preview is what visitors get.

Lights, cameras and the world aren't exported. The look is now inside the texture.

---

## 7. Export

**File → Export → glTF 2.0 (.glb/.gltf)**:

- Format: **glTF Binary (.glb)**
- Include: **Visible Objects** (make sure the empties are visible). Leave **Cameras** and **Punctual Lights** *unchecked*.
- Transform: **+Y Up** (on).
- Mesh: **Apply Modifiers** (on), **UVs** (on).
- Material: **Export**, Images: **Automatic**.

Save it anywhere, e.g. `Documents/room/room.glb`.

---

## 8. Prepare it for the web

From `portfolio-site/`:

```bash
npm run room -- path/to/room.glb
```

This checks every required name, compresses the meshes, converts textures to WebP (max 2048 px) and writes `public/models/room.glb`. It fails with a clear message if:

- `Missing in Blender export: …`: rename those objects or empties (step 4) and export again.
- `room.glb is X MB; budget is 3 MB`: bake at 1024 × 1024 instead of 2048, or join more scenery.

**Also render a still** for phones that can't run 3D: look through a camera at `cam_start`, then **F12** → **Image → Save As** → WebP, 1600 px wide → `public/images/room-still.webp`.

---

## 9. See it on the site

```bash
# in .env.local (not committed)
VITE_ROOM=model
npm run dev
```

Open `http://localhost:5173`. If labels sit in odd places, move the matching `cam_*` empties, re-export, and run `npm run room` again. Check it on your phone with `npx vite --host` (open the "Network" URL on the same Wi-Fi).

Going live (setting `VITE_ROOM=model` for production and deploying) is a separate step you approve.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| The room looks black or flat white on the site | The bake image isn't connected to **Base Color** (step 6.6), or it wasn't saved before export. |
| Ugly seams or dark blotches | Increase the bake **Margin** and the UV **Island Margin**, then bake again. |
| Everything is huge or tiny | Units weren't meters at 1.0 scale (step 1). Select all, **Ctrl + A → Apply Scale**. |
| The room is sideways | Export with **+Y Up** on. |
| A label is missing | That object isn't named exactly right. `npm run room` lists it. |
| Phones crop the window or bed | Add or move `cam_start_portrait` (step 4). |
