# Changelog

Every GitHub commit is a backup. If a release breaks, HACS → Outpost Colony → ⋮ → Redownload an older commit, or revert on GitHub (`main` history).

## 0.5.2

Room pads stay put. Hiding or toggling crew no longer reshuffles the hex map.

## 0.5.1

Turning crew off no longer reloads the Outpost sidebar. Roster saves stay in HA without tearing down the panel.

## 0.5.0

Household admin owns the colony roster. Hide/filter/move crew is saved in Home Assistant and applies to every user. Non-admins can still look around and toggle devices they are allowed to control.

Redownload HACS **and** republish the Outpost page.

## 0.4.0

Frontend (republish the Outpost page):

- Night watch, shift change, storm sky, package crate, rover, chores, lockdown, hum
- Room landmarks and hold-and-drop rooms

HACS wrapper: cache-bust panel/card `?v=0.4.0`.

## 0.3.0

- Parent-session proxy so the sidebar goes live without a token
- Mobile HUD / tap-to-select

## 0.2.0

- Lovelace card, hide crew, themes, Orbit planet
