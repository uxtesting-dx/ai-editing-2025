import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/overlay/overlay-trigger.js";
import "@spectrum-web-components/tooltip/sp-tooltip.js";
import "./TooltipContent.js";

import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import { matchesShortcut } from "./matchesShortcut.js";

/**
 * Displays a Spectrum action button with a tooltip, in a style appropriate for a toolbar.
 *
 * Example:
 *
 *      <sp-action-group vertical selects="single" @change=${this.changeTool}>
 *          <sp-toolbar-button
 *              value="select"
 *              heading="Select Tool"
 *              shortcut="V"
 *              description="Click to select an object."
 *          >
 *              <sp-icon-select slot="icon"></sp-icon-select>
 *          </sp-toolbar-button>
 *          <sp-divider size="s"></sp-divider>
 *          <sp-toolbar-button
 *              value=${ToolId.Rectangle}
 *              heading="Rectangle Tool"
 *              shortcut="R"
 *              description="Click and drag to create a rectangle."
 *          >
 *              <sp-icon-rectangle slot="icon"></sp-icon-rectangle>
 *          </sp-toolbar-button>
 *          ...
 *      </sp-action-group>
 */
@customElement("sp-toolbar-button")
export class ToolbarButton extends LitElement {
    @property()
    public value?: string;

    @property()
    public heading?: string | TemplateResult;

    @property()
    public shortcut?: string;

    @property()
    public additionalAccess?: string | TemplateResult;

    @property()
    public description?: string | TemplateResult;

    @property({ type: Boolean, reflect: true })
    public selected = false;

    override connectedCallback(): void {
        super.connectedCallback();
        if (this.shortcut) {
            window.addEventListener("keydown", this.handleKeyDown);
        }
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (matchesShortcut(event, this.shortcut)) {
            event.preventDefault();
            event.stopPropagation();
            this.click();
        }
    };

    protected override render() {
        return html`
            <overlay-trigger placement="right">
                <sp-action-button
                    slot="trigger"
                    value=${this.value}
                    ?selected=${this.selected}
                    emphasized
                    quiet
                >
                    <slot slot="icon" name="icon"></slot>
                </sp-action-button>
                <sp-tooltip
                    slot="hover-content"
                    delayed
                    variant="info"
                    style="max-width: 500px;"
                >
                    <tooltip-content
                        heading=${this.heading}
                        shortcut=${this.shortcut}
                        additionalAccess=${this.additionalAccess}
                        description=${this.description}
                    ></tooltip-content>
                </sp-tooltip>
            </overlay-trigger>
        `;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "sp-toolbar-button": ToolbarButton;
    }
}
