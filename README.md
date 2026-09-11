# Outpost Colony

A Bot Crossing–style 3D map of your Home Assistant house. Areas become hex plots. Devices become astronauts. Crew wave when something needs you.

This is a **HACS integration**, not a Supervisor add-on. It adds **Outpost** to the sidebar, as a Lovelace **card**, or as a **full dashboard**. Your HA session loads every area and device. No long-lived token. No entity paste.

## Install

1. Publish / host the Outpost 3D app (the Grok Share page works). Copy that `https://…` URL.
2. [HACS](https://hacs.xyz) → ⋮ → Custom repositories → add  
   `https://github.com/FloridanExposure/ha-outpost` as **Integration**.
3. HACS → Integrations → **Outpost Colony** → Download.
4. Restart Home Assistant.
5. Settings → Devices & services → Add integration → **Outpost Colony**.
6. Configure → paste the Outpost web URL from step 1.
7. Use it three ways:

### Sidebar
Sidebar → **Outpost**.

### Card on any dashboard
Add a card in YAML:

```yaml
type: custom:outpost-colony-card
url: https://YOUR-PUBLISHED-OUTPOST
height: 520
```

If the card type is missing, add a Lovelace resource: `/outpost-static/outpost-card.js` as **module**, then refresh.

### Whole dashboard
New view, enable **Panel mode**, one card:

```yaml
title: Outpost
path: outpost
icon: mdi:rocket-launch-outline
panel: true
cards:
  - type: custom:outpost-colony-card
    url: https://YOUR-PUBLISHED-OUTPOST
    height: 900
```

## Customize

Inside Outpost → gear:

- **Colony** — domains, one-per-device, hidden/diagnostics, battery wave, max crew per room
- **Crew** — turn individual devices on/off (or “Hide from colony” on a selected astronaut)
- **Look** — Luna / Orbit (moon + stars) / Mars / Terra, plus sky / ground / fog colors and star density

Same filters live under HA → Outpost Colony → Configure.

## License

MIT for the integration code. Astronaut / base models are Kay Lousberg CC0.
