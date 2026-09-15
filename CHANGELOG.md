# Changelog

Every GitHub commit is a backup. If a release breaks, HACS → Outpost Colony → ⋮ → Redownload an older commit, or revert on GitHub (`main` history).

## 0.5.5

Colony (publish the Outpost page, then HACS redownload):

- MQTT / Govee2MQTT lights show as crew (no more “wifi” filter dropping them)
- Lights in a room with a group still appear unless they are actual group members
- Park wait board + football board clustered by the ship, with a ferris-wheel zoom shortcut
- Permanent room names scaled to device count
- Compact desktop scoreboard
- Aircraft within 2 miles of `zone.home` fly over the house with callsign, type, and destination

HACS wrapper: cache-bust panel/card `?v=0.5.5`.

## 0.5.4

Shortcut button is back. Change its icon and tap action in Settings → Look: open a dashboard path, or run an automation, script, or scene.

## 0.5.3

On a phone, Outpost kept the Home Assistant sidebar hidden with no way back. There is now a menu + Home bar on mobile, and a house button in the colony HUD.

## 0.5.2

Room pads stay put. Hiding or toggling crew no longer reshuffles the hex map.

## 0.5.1

Turning crew off no longer reloads the Outpost sidebar. Roster saves stay in HA without tearing down the panel.

## 0.5.0

Household admin owns the colony roster. Hide/filter/move crew is saved in Home Assistant and applies to every user. Non-admins can still look around and toggle devices they are allowed to control.

Redownload HACS **and** republish the Outpost page.

## 0.4.0

Frontend (republish the Outpost page):

- Night watch when the sun slider is in night
- Shift change (crew sit at night, walk at dawn)
- Storm sky + siren pad on smoke/leak alarms
- Package crate at the airlock for mailbox/delivery sensors
- Shark / vacuums / mowers patrol as rovers
- Chore clipboards
- Lockdown button
- Toggleable base hum (extra tone if a media player is on)
- Room-specific landmarks (galley, hangar, reservoir dome, comms)
- Creative area callsigns (Galley, Commons, Hangar…)
- Hold-and-drop crew into other rooms

HACS wrapper: cache-bust panel/card `?v=0.4.0`.

## 0.3.0

- Parent-session proxy so the sidebar goes live without a token
- Mobile HUD / tap-to-select

## 0.2.0

- Lovelace card, hide crew, themes, Orbit planet
