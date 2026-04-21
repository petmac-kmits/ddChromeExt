# ddChromeExt

ddChromeExt is a Chrome extension that improves TraceId navigation in Datadog.

It injects action buttons directly next to TraceId values so you can jump to logs faster, either in a new browser tab/window or inside an interactive in-page panel.

## What The Extension Does

- Detects TraceId values in Datadog JSON viewer rows and dashboard table rows.
- Adds quick action buttons next to TraceId fields.
- Builds Datadog Logs URL automatically for the selected TraceId.
- Applies a default time window of the last 14 days (`from_ts` / `to_ts`).
- Works on dynamic pages using mutation observers (buttons are re-injected when DOM changes).

## Features

### 1) Open TraceId logs in a new browser window
- Button with maximize icon opens Datadog logs for the selected TraceId.
- Uses a direct logs query with TraceId pre-filled.

### 2) Open TraceId logs in an in-page panel (iframe window)
- Button with window-restore icon opens logs in a floating panel inside the same page.
- Multiple TraceId panels can be opened at the same time.
- If the same TraceId is opened again, existing panel is focused (no duplicate window).

### 3) Floating panel window management
- Draggable panel (drag by title bar).
- Resizable panel (`resize: both`).
- Minimize / restore.
- Maximize / restore.
- Snap to left half of viewport.
- Snap to right half of viewport.
- Close panel.

### 4) Minimized panel dock behavior
- Minimized panels are placed at the bottom of the page.
- Multiple minimized panels are arranged next to each other and wrap to additional rows if needed.
- Layout is recalculated on browser resize.

### 5) Window stacking and focus
- Panels are brought to front on interaction.
- Re-opening existing TraceId panel brings it to front.

### 6) Smart placement of new panels
- Each new panel opens with a small top/left cascade offset from the previous panel.

### 7) UX enhancements
- Lightweight tooltip shown on button hover/focus.
- Font Awesome icons are loaded automatically for button visuals.

## Scope and Compatibility

- Target host: `https://pluxee.datadoghq.eu/*`
- Chrome Manifest V3 extension.
- Minimum Chrome version: 114.

## Version History

### 1.0.0
- Implemented a button to open TraceId logs in a new browser window.

### 1.1.0
- Added the possibility to open a TraceId window in an in-page panel.
