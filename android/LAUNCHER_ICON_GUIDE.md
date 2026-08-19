# CareerPilot AI — Android Launcher Icon Guide

This guide describes how the custom **CareerPilot AI** adaptive launcher icon is configured for Android devices.

---

## 🚀 1. Architecture Overview (Android 8.0+ / API 26+)

Modern Android uses **Adaptive Icons** composed of two distinct 108dp × 108dp layers:

1. **Background Layer (`res/drawable/ic_launcher_background.xml`)**:
   - Deep cyber-navy gradient (`#020617` → `#0F172A`) with a subtle radial glow.
2. **Foreground Layer (`res/drawable/ic_launcher_foreground.xml`)**:
   - Custom aerodynamic flight curves (royal blue, sky blue, and luminous white).
   - Luminous 4-point AI compass star node at `(75, 34)` indicating upward career trajectory.
   - All visual elements are strictly positioned within the **66dp Safe Zone** (inner circular mask area) to avoid clipping across OEM launchers (Samsung One UI, Pixel Launcher, Xiaomi MIUI, etc.).
3. **Adaptive Icon Definitions (`res/mipmap-anydpi-v26/`)**:
   - `ic_launcher.xml`: Configures standard adaptive icons.
   - `ic_launcher_round.xml`: Configures circular icons on supporting Android launchers.

---

## 📐 2. Density Reference Chart (For Legacy Raster Icons)

If you need to generate pre-rendered PNG bitmaps for legacy Android versions (API < 26) or legacy OEM home screens:

| Density Folder | Total Size (108dp canvas) | Safe Zone (66dp center) | Legacy Icon Size (48dp) |
| :--- | :--- | :--- | :--- |
| `mipmap-mdpi` (1.0x) | 108 × 108 px | 66 × 66 px | 48 × 48 px |
| `mipmap-hdpi` (1.5x) | 162 × 162 px | 99 × 99 px | 72 × 72 px |
| `mipmap-xhdpi` (2.0x) | 216 × 216 px | 132 × 132 px | 96 × 96 px |
| `mipmap-xxhdpi` (3.0x) | 324 × 324 px | 198 × 198 px | 144 × 144 px |
| `mipmap-xxxhdpi` (4.0x) | 432 × 432 px | 264 × 264 px | 192 × 192 px |

---

## 🛠️ 3. Generating New Icons from `logo-final.svg` in Android Studio

1. Open the project in **Android Studio**.
2. In the Project pane, right-click on the `app/src/main/res/` directory.
3. Select **New → Image Asset**.
4. Choose **Launcher Icons (Adaptive and Legacy)**.
5. In **Foreground Layer**:
   - Source Asset: **Image** or **SVG**.
   - Path: Select `logo-final.svg` from the project root.
   - Resize / Scaling: Set slider between **70% - 80%** so the logo stays inside the black safe zone circle.
6. In **Background Layer**:
   - Asset Type: **Color** (choose `#020617`) or **Image** (select `ic_launcher_background.xml`).
7. Click **Next** and **Finish**. Android Studio will generate all density buckets automatically.

---

## 📱 4. Manifest Verification

In `android/app/src/main/AndroidManifest.xml`, ensure your `<application>` tag specifies:

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:label="@string/app_name"
    ... >
```
