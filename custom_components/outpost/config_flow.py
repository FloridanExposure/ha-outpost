"""Config and options for Outpost Colony."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector

from .const import DEFAULT_DOMAINS, DEFAULT_OPTIONS, DOMAIN

DOMAIN_OPTIONS = [
    selector.SelectOptionDict(value=d, label=d.replace("_", " "))
    for d in [
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
        "sensor",
    ]
]


def _options_schema(opts: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(
                "frontend_url",
                default=opts.get("frontend_url", ""),
            ): selector.TextSelector(
                selector.TextSelectorConfig(type=selector.TextSelectorType.URL)
            ),
            vol.Optional(
                "domains",
                default=opts.get("domains", DEFAULT_DOMAINS),
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=DOMAIN_OPTIONS,
                    multiple=True,
                    mode=selector.SelectSelectorMode.LIST,
                )
            ),
            vol.Optional(
                "one_per_device",
                default=opts.get("one_per_device", True),
            ): selector.BooleanSelector(),
            vol.Optional(
                "include_unassigned",
                default=opts.get("include_unassigned", True),
            ): selector.BooleanSelector(),
            vol.Optional(
                "include_hidden",
                default=opts.get("include_hidden", False),
            ): selector.BooleanSelector(),
            vol.Optional(
                "include_diagnostics",
                default=opts.get("include_diagnostics", False),
            ): selector.BooleanSelector(),
            vol.Optional(
                "show_unavailable",
                default=opts.get("show_unavailable", True),
            ): selector.BooleanSelector(),
            vol.Optional(
                "battery_alert",
                default=opts.get("battery_alert", 20),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(min=5, max=50, step=1, mode=selector.NumberSelectorMode.SLIDER)
            ),
            vol.Optional(
                "max_per_area",
                default=opts.get("max_per_area", 18),
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(min=4, max=36, step=1, mode=selector.NumberSelectorMode.SLIDER)
            ),
            vol.Optional(
                "skip_intro",
                default=opts.get("skip_intro", True),
            ): selector.BooleanSelector(),
        }
    )


class OutpostConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="Outpost Colony", data={}, options=DEFAULT_OPTIONS)
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        return OutpostOptionsFlow()


class OutpostOptionsFlow(config_entries.OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)
        opts = {**DEFAULT_OPTIONS, **self.config_entry.options}
        return self.async_show_form(step_id="init", data_schema=_options_schema(opts))
