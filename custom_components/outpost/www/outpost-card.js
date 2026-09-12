const CARD = "outpost-colony-card";

function srcFrom(config, frontendUrl) {
  const url = String((config && config.url) || frontendUrl || "").trim();
  if (url) {
    const clean = url.replace(/\/+$/, "");
    const withScheme = clean.includes("://") ? clean : `https://${clean}`;
    const sep = withScheme.includes("?") ? "&" : "?";
    return `${withScheme}${sep}ha_panel=1`;
  }
  return `${location.origin}/outpost-static/index.html?ha_panel=1`;
}

class OutpostColonyCard extends HTMLElement {
  constructor() {
    super();
    this._config = { height: 480 };
    this._hass = null;
    this._iframe = null;
    this._options = {};
    this._unsub = null;
    this._unsubCfg = null;
    this._beat = null;
    window.addEventListener("message", (ev) => this._onMsg(ev));
  }

  setConfig(config) {
    this._config = { height: 480, ...config };
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._iframe) this._render();
    this._push();
    if (!this._gotConfig) {
      this._gotConfig = true;
      hass.connection
        .sendMessagePromise({ type: "outpost/config" })
        .then((opts) => {
          this._options = opts || {};
          if (!this._config.url && opts && opts.frontend_url && this._iframe) {
            this._iframe.src = srcFrom(this._config, opts.frontend_url);
          }
          this._push();
        })
        .catch(() => {});
    }
  }

  _render() {
    const raw = this._config.height;
    const tall = window.matchMedia("(max-width: 720px)").matches;
    let heightPx = Number(raw);
    if (raw === "full" || raw === "100%") {
      this.style.height = "100dvh";
    } else {
      if (!Number.isFinite(heightPx) || heightPx <= 0) {
        heightPx = tall ? Math.round(window.innerHeight * 0.72) : 520;
      }
      if (tall) heightPx = Math.max(320, Math.min(heightPx, Math.round(window.innerHeight * 0.86)));
      this.style.height = `${heightPx}px`;
    }
    this.style.display = "block";
    this.style.touchAction = "none";
    this.style.overflow = "hidden";
    this.style.minHeight = "280px";
    this.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.setAttribute("allow", "fullscreen; autoplay");
    iframe.src = srcFrom(this._config);
    iframe.style.cssText =
      "border:0;width:100%;height:100%;display:block;background:#0c1016;border-radius:12px;";
    iframe.addEventListener("load", () => this._push());
    this.appendChild(iframe);
    this._iframe = iframe;
    this._beat = window.setInterval(() => this._push(), 1200);
  }

  _push() {
    if (!this._iframe || !this._iframe.contentWindow || !this._hass) return;
    this._iframe.contentWindow.postMessage(
      {
        type: "outpost/hass",
        transport: "parent",
        hassUrl: location.origin,
        token: "parent",
        options: {
          ...(this._options || {}),
          is_admin: Boolean(this._hass.user && this._hass.user.is_admin),
        },
      },
      "*",
    );
  }

  _onMsg(ev) {
    if (!this._iframe || ev.source !== this._iframe.contentWindow) return;
    const data = ev.data || {};
    if (data.type === "outpost/ready" || data.type === "outpost/hass-ok") {
      this._push();
      if (data.type === "outpost/hass-ok" && this._beat) {
        window.clearInterval(this._beat);
        this._beat = null;
      }
      return;
    }
    if (data.type === "outpost/ha-sub") {
      this._subscribe();
      return;
    }
    if (data.type === "outpost/ha-cmd") {
      this._cmd(data.id, data.payload);
    }
  }

  async _cmd(id, payload) {
    if (!this._iframe || !this._hass) return;
    try {
      const result = await this._hass.connection.sendMessagePromise(payload);
      this._iframe.contentWindow.postMessage({ type: "outpost/ha-res", id, result }, "*");
    } catch (err) {
      this._iframe.contentWindow.postMessage(
        { type: "outpost/ha-res", id, error: err && err.message ? err.message : "call failed" },
        "*",
      );
    }
  }

  async _subscribe() {
    if (!this._hass) return;
    if (!this._unsub) {
      this._unsub = await this._hass.connection.subscribeEvents((event) => {
        if (this._iframe && this._iframe.contentWindow) {
          this._iframe.contentWindow.postMessage({ type: "outpost/ha-event", event }, "*");
        }
      }, "state_changed");
    }
    if (!this._unsubCfg) {
      this._unsubCfg = await this._hass.connection.subscribeEvents((event) => {
        this._options = { ...(this._options || {}), ...(event.data || {}) };
        if (this._iframe && this._iframe.contentWindow) {
          this._iframe.contentWindow.postMessage(
            { type: "outpost/config-event", options: event.data || {} },
            "*",
          );
        }
      }, "outpost_updated");
    }
  }

  getCardSize() {
    return Math.max(6, Math.round((Number(this._config.height) || 480) / 50));
  }

  static getStubConfig() {
    return { url: "", height: 520 };
  }
}

if (!customElements.get(CARD)) {
  customElements.define(CARD, OutpostColonyCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD,
    name: "Outpost Colony",
    description: "3D house map of your Home Assistant devices",
    preview: false,
  });
}
