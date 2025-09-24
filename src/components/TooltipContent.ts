import "./KeyboardShortcutLabel.js";

import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Formats the content of a tooltip.
 *
 * Example:
 *
 *      <overlay-trigger>
 *          <sp-button slot="trigger">Export Model</sp-button>
 *          <sp-tooltip slot="hover-content" variant="info">
 *              <tooltip-content
 *                  heading="Export Model File"
 *                  shortcut="cmdOrCtrl+e"
 *                  description="Download a model file for use in other applications."
 *              ></tooltip-content>
 *          </sp-tooltip>
 *      </overlay-trigger>
 */
@customElement("tooltip-content")
export class TooltipContent extends LitElement {
    @property()
    public heading?: string | TemplateResult;

    @property()
    public shortcut?: string;

    @property()
    public additionalAccess?: string | TemplateResult;

    @property()
    public description?: string | TemplateResult;

    protected override render() {
        const modifiedHeading = this.description
            ? html`<b>${this.heading}</b>`
            : this.heading;
        const modifiedAccess = this.additionalAccess
            ? html`<span>&nbsp;or&nbsp;${this.additionalAccess}</span>`
            : null;
        return html`
            <span>
                ${modifiedHeading}
                <keyboard-shortcut-label
                    shortcut=${this.shortcut}
                ></keyboard-shortcut-label>
                ${modifiedAccess}
                <br />
                ${this.description}
            </span>
        `;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "tooltip-content": TooltipContent;
    }
}
