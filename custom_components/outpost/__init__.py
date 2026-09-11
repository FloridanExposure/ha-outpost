"""Outpost Colony — 3D house map in the Home Assistant sidebar."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DEFAULT_OPTIONS, DOMAIN, PANEL_ICON, PANEL_PATH, PANEL_TITLE, STATIC_URL

_LOGGER = logging.getLogger(__name__)
PLATFORMS: list[str] = []


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.setdefault(DOMAIN, {})
    await _async_register_static(hass)
    await _async_register_panel(hass, entry)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    try:
        frontend.async_remove_panel(hass, PANEL_PATH)
    except Exception:  # noqa: BLE001
        _LOGGER.debug("Panel already gone")
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await _async_register_panel(hass, entry)


async def _async_register_static(hass: HomeAssistant) -> None:
    if hass.data[DOMAIN].get("static"):
        return
    www = Path(__file__).parent / "www"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, str(www), cache_headers=False)]
    )
    hass.data[DOMAIN]["static"] = True


async def _async_register_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    opts = {**DEFAULT_OPTIONS, **entry.options}
    try:
        frontend.async_remove_panel(hass, PANEL_PATH)
    except Exception:  # noqa: BLE001
        pass
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_PATH,
        webcomponent_name="outpost-colony-panel",
        sidebar_title=opts.get("sidebar_title") or PANEL_TITLE,
        sidebar_icon=opts.get("sidebar_icon") or PANEL_ICON,
        module_url=f"{STATIC_URL}/panel.js",
        embed_iframe=False,
        require_admin=False,
        config={
            "frontend_url": opts.get("frontend_url") or "",
            "domains": opts.get("domains") or DEFAULT_OPTIONS["domains"],
            "one_per_device": bool(opts.get("one_per_device", True)),
            "include_unassigned": bool(opts.get("include_unassigned", True)),
            "include_hidden": bool(opts.get("include_hidden", False)),
            "include_diagnostics": bool(opts.get("include_diagnostics", False)),
            "show_unavailable": bool(opts.get("show_unavailable", True)),
            "battery_alert": int(opts.get("battery_alert", 20)),
            "max_per_area": int(opts.get("max_per_area", 18)),
            "skip_intro": bool(opts.get("skip_intro", True)),
        },
    )
