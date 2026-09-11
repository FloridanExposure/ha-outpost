# Changelog

Every GitHub commit is a backup. If a release breaks, HACS → Outpost Colony → ⋮ → Redownload an older commit, or revert on GitHub (`main` history).

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
