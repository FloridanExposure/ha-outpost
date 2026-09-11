const TAG = "outpost-colony-panel";

class OutpostColonyPanel extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._panel = null;
    this._iframe = null;
    this.attachShadow({ mode: "open" });
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
      const sep = clean.includes("?") ? "&" : "?";
      return `${clean}${sep}ha_panel=1`;
    }
    return `${location.origin}/outpost-static/index.html?ha_panel=1`;
  }

  _mount() {
    if (this._iframe) {
      const next = this._src();
      if (this._iframe.src !== next && !this._iframe.src.startsWith(next.split("?")[0])) {
        this._iframe.src = next;
      }
      return;
    }
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
    window.addEventListener("message", (ev) => {
      if (ev.data && ev.data.type === "outpost/ready") this._push();
    });
  }

  _push() {
    if (!this._iframe || !this._iframe.contentWindow || !this._hass) return;
    const cfg = this._panel?.config || {};
    let token = "";
    try {
      token = this._hass.auth.data.access_token;
    } catch {
      return;
    }
    const hassUrl = this._hass.hassUrl || location.origin;
    this._iframe.contentWindow.postMessage(
      {
        type: "outpost/hass",
        hassUrl,
        token,
        options: cfg,
      },
      "*",
    );
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, OutpostColonyPanel);
}
