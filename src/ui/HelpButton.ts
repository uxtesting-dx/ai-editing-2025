import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-help.js";
import "@spectrum-web-components/popover/sp-popover.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { html } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * The application help button and popover.
 */
@customElement("app-help-button")
export class HelpButton extends MobxLitElement {
    protected override render() {
        return html`
            <overlay-trigger>
                <sp-action-button slot="trigger" quiet>
                    <sp-icon-help slot="icon" title="Help"></sp-icon-help>
                </sp-action-button>
                <sp-popover slot="click-content" tip>
                    <sp-dialog>
                        <h2 slot="heading">Application Help</h2>
                        <div>Here is some useless help text.</div>
                    </sp-dialog>
                </sp-popover>
            </overlay-trigger>
        `;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-help-button": HelpButton;
    }
}
