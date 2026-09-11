const TAG = "outpost-colony-panel";

class OutpostColonyPanel extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._panel = null;
    this._iframe = null;
    this._unsub = null;
    this._beat = null;
    this.attachShadow({ mode: "open" });
    window.addEventListener("message", (ev) => this._onMsg(ev));
  }

  set hass(hass) {
    this._hass = hass;
    this._push();
  }

  set panel(panel) {
    this._panel = panel;
    this._mount();
    this._push();
  }

  set narrow(_value) {}

  _src() {
    const cfg = this._panel?.config || {};
    const url = String(cfg.frontend_url || "").trim();
    if (url) {
      const clean = url.replace(/\/+$/, "");
      const withScheme = clean.includes("://") ? clean : `https://${clean}`;
      const sep = withScheme.includes("?") ? "&" : "?";
      return `${withScheme}${sep}ha_panel=1`;
    }
    return `${location.origin}/outpost-static/index.html?ha_panel=1`;
  }

  _mount() {
    if (this._iframe) return;
    const root = this.shadowRoot;
    root.innerHTML = `
      <style>
        :host { display: block; height: 100%; background: #0c1016; }
        iframe { border: 0; width: 100%; height: 100%; display: block; background: #0c1016; }
      </style>
    `;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("allow", "fullscreen; autoplay");
    iframe.src = this._src();
    iframe.addEventListener("load", () => this._push());
    root.appendChild(iframe);
    this._iframe = iframe;
    this._beat = window.setInterval(() => this._push(), 1200);
  }

  _target() {
    return this._iframe && this._iframe.contentWindow;
  }

  _push() {
    const win = this._target();
    if (!win || !this._hass) return;
    const cfg = this._panel?.config || {};
    win.postMessage(
      {
        type: "outpost/hass",
        transport: "parent",
        hassUrl: location.origin,
        token: "parent",
        options: cfg,
      },
      "*",
    );
  }

  _onMsg(ev) {
    const win = this._target();
    if (!win || ev.source !== win) return;
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
    if (data.type === "outpost/ha-unsub") {
      this._unsubscribe();
      return;
    }
    if (data.type === "outpost/ha-cmd") {
      this._cmd(data.id, data.payload);
    }
  }

  async _cmd(id, payload) {
    const win = this._target();
    if (!win || !this._hass) return;
    try {
      const result = await this._hass.connection.sendMessagePromise(payload);
      win.postMessage({ type: "outpost/ha-res", id, result }, "*");
    } catch (err) {
      win.postMessage(
        { type: "outpost/ha-res", id, error: err && err.message ? err.message : "Home Assistant call failed" },
        "*",
      );
    }
  }

  async _subscribe() {
    if (this._unsub || !this._hass) return;
    try {
      this._unsub = await this._hass.connection.subscribeEvents((event) => {
        const win = this._target();
        if (win) win.postMessage({ type: "outpost/ha-event", event }, "*");
      }, "state_changed");
    } catch (err) {
      console.warn("outpost subscribe", err);
    }
  }

  _unsubscribe() {
    if (typeof this._unsub === "function") {
      this._unsub();
      this._unsub = null;
    }
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, OutpostColonyPanel);
}
