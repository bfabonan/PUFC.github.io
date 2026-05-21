# PUFC Calendar of Activities - How to Update

## Editing Events

Open `data/calendar.json` and add, edit, or remove events.

## Event Format

Each event is a JSON object with these fields:

```json
{
  "date": "2026-07-15",
  "title": "Event Title",
  "description": "Short description of the event.",
  "type": "training"
}
```

### Fields:

| Field | Required | Description |
|-------|----------|-------------|
| `date` | Yes | Date in `YYYY-MM-DD` format (e.g., `2026-07-15`) |
| `title` | Yes | Event name displayed as the heading |
| `description` | Yes | Short description (1-2 sentences) |
| `type` | Yes | Category — determines the color badge |

### Event Types:

| Type | Color | Use for |
|------|-------|---------|
| `training` | Teal | Training sessions, camps, fitness tests |
| `match` | Purple | Friendly matches, league games |
| `event` | Gold | Community days, open sessions, celebrations |
| `tournament` | Red | Tournaments, cup qualifiers, competitions |

## Adding a New Event

Add a new object to the array in `data/calendar.json`:

```json
{
  "date": "2026-08-20",
  "title": "New Event Name",
  "description": "What this event is about.",
  "type": "match"
}
```

## Removing an Event

Delete the entire object (including the curly braces and comma) from the array.

## Notes

- Events are automatically sorted by date (earliest first)
- Only upcoming events are shown (past events are hidden)
- If no upcoming events exist, the most recent 4 events are displayed
- No limit on number of events — add as many as needed
- Make sure the JSON is valid (no trailing commas, proper quotes)

## Example Full File

```json
[
  {
    "date": "2026-06-01",
    "title": "Bootcamp Starts",
    "description": "High-energy training phase begins.",
    "type": "training"
  },
  {
    "date": "2026-07-20",
    "title": "Inter-Club Tournament",
    "description": "Regional tournament participation.",
    "type": "tournament"
  }
]
```
