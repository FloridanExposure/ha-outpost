# Outpost Colony

A Bot Crossing–style 3D map of your Home Assistant house. Areas become hex plots. Devices become astronauts. Crew wave when something needs you.

This is a **HACS integration**, not a Supervisor add-on. It adds **Outpost** to the sidebar and uses your existing HA session. No long-lived access token. No entity paste.

## Install

1. Publish / host the Outpost 3D app (the Grok Share page works). Copy that `https://…` URL.
2. [HACS](https://hacs.xyz) → ⋮ → Custom repositories → add  
   `https://github.com/FloridanExposure/ha-outpost` as **Integration**.
3. HACS → Integrations → **Outpost Colony** → Download.
4. Restart Home Assistant.
5. Settings → Devices & services → Add integration → **Outpost Colony**.
6. Configure → paste the Outpost web URL from step 1. Pick domains, density, battery threshold.
7. Sidebar → **Outpost**.

Manual install: copy `custom_components/outpost` into your HA `config/custom_components/` folder, restart, then add the integration.

## What loads

Outpost reads the area, device, and entity registries plus live states.

- One astronaut per device (toggle off to show every entity)
- Rooms = HA areas; leftover devices go to **Core**
- Hidden / diagnostic entities stay off unless you turn them on
- Cap crew per room so the colony does not melt

Change any of that under **Configure**, or inside Outpost → gear → **Colony**.

Toggles call `hass` services through the websocket (lights, switches, locks, vacuums, media, climate…).

## Why a separate web URL?

The 3D scene (Three.js + astronaut models) is too heavy to ship as a tiny custom element. The integration is the HA bridge: session, registries, sidebar. The published Outpost page is the renderer. Together they are one product.

The chat preview of Outpost cannot be iframed. Use the **published** https page.

## License

MIT for the integration code. Astronaut / base models are Kay Lousberg CC0 (see the Outpost app credits).
