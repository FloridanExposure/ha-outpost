const CARD = "outpost-colony-card";

function mountIframe(host, src) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("allow", "fullscreen; autoplay");
  iframe.src = src;
  iframe.style.cssText =
    "border:0;width:100%;height:100%;display:block;background:#0c1016;border-radius:12px;";
  host.appendChild(iframe);
  return iframe;
}

function pushHass(iframe, hass, options) {
  if (!iframe || !iframe.contentWindow || !hass) return;
  let token = "";
  try {
    token = hass.auth.data.access_token;
  } catch {
    return;
  }
  iframe.contentWindow.postMessage(
    {
      type: "outpost/hass",
      hassUrl: hass.hassUrl || location.origin,
      token,
      options: options || {},
    },
    "*",
  );
}

class OutpostColonyCard extends HTMLElement {
  constructor() {
    super();
    this._config = { height: 480 };
    this._hass = null;
    this._iframe = null;
    this._options = {};
  }

  setConfig(config) {
    this._config = { height: 480, ...config };
    if (this._iframe) {
      this._iframe.src = this._src();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._iframe) this._render();
    pushHass(this._iframe, hass, this._options);
    if (!this._gotConfig) {
      this._gotConfig = true;
      hass.connection
        .sendMessagePromise({ type: "outpost/config" })
        .then((opts) => {
          this._options = opts || {};
          if (!this._config.url && opts && opts.frontend_url) {
            this._iframe.src = this._src(opts.frontend_url);
          }
          pushHass(this._iframe, hass, this._options);
        })
        .catch(() => {});
    }
  }

  _src(frontendUrl) {
    const url = String(this._config.url || frontendUrl || "").trim();
    if (url) {
      const clean = url.replace(/\/+$/, "");
      const sep = clean.includes("?") ? "&" : "?";
      return `${clean}${sep}ha_panel=1`;
    }
    return `${location.origin}/outpost-static/index.html?ha_panel=1`;
  }

  _render() {
    const height = Number(this._config.height) || 480;
    this.style.display = "block";
    this.style.height = Number.isFinite(height) ? `${height}px` : "480px";
    this.innerHTML = "";
    this._iframe = mountIframe(this, this._src());
    this._iframe.addEventListener("load", () => pushHass(this._iframe, this._hass, this._options));
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

window.addEventListener("message", (ev) => {
  if (ev.data && ev.data.type === "outpost/ready") {
    document.querySelectorAll(CARD).forEach((el) => {
      if (el._iframe && el._hass) pushHass(el._iframe, el._hass, el._options);
    });
  }
});
