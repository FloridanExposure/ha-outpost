DOMAIN = "outpost"
PANEL_TITLE = "Outpost"
PANEL_ICON = "mdi:rocket-launch-outline"
PANEL_PATH = "outpost"
STATIC_URL = "/outpost-static"

DEFAULT_DOMAINS = [
    "light",
    "switch",
    "fan",
    "climate",
    "lock",
    "cover",
    "vacuum",
    "media_player",
    "camera",
    "water_heater",
    "lawn_mower",
    "input_boolean",
    "binary_sensor",
    "update",
]

DEFAULT_OPTIONS = {
    "frontend_url": "",
    "sidebar_title": PANEL_TITLE,
    "sidebar_icon": PANEL_ICON,
    "domains": DEFAULT_DOMAINS,
    "one_per_device": True,
    "include_unassigned": True,
    "include_hidden": False,
    "include_diagnostics": False,
    "show_unavailable": True,
    "battery_alert": 20,
    "max_per_area": 18,
    "skip_intro": True,
}
