# PUFC Gallery - How to Add Albums

## Adding a New Album

1. **Create a folder** inside `/gallery/` with a descriptive name (use dashes, no spaces):
   ```
   gallery/my-new-event-2025/
   ```

2. **Add your images** named sequentially:
   ```
   gallery/my-new-event-2025/photo-01.svg
   gallery/my-new-event-2025/photo-02.svg
   gallery/my-new-event-2025/photo-03.svg
   ...
   ```
   Supported formats: `.svg`, `.jpg`, `.png`, `.webp`

3. **Update `albums.json`** — add a new entry to the array:
   ```json
   {
     "folder": "my-new-event-2025",
     "title": "My New Event 2025",
     "count": 10
   }
   ```

That's it! The gallery will automatically display the new album with a tab.

## File Naming Convention

- Photos must be named `photo-XX` where XX is zero-padded (01, 02, 03... 10, 11, etc.)
- The `count` in albums.json tells the gallery how many photos to load

## Recommended Image Sizes

- Aspect ratio: 4:3 (e.g., 800x600, 400x300)
- For web performance, keep images under 200KB each
- SVG files work great for illustrations; use JPG/WebP for photographs

## Album Order

Albums appear in the order listed in `albums.json`. Move entries up or down to reorder tabs.
