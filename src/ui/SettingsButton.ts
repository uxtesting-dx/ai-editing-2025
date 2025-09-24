import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/dialog/sp-dialog.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-settings.js";
import "@spectrum-web-components/overlay/overlay-trigger.js";
import "@spectrum-web-components/popover/sp-popover.js";
import "@spectrum-web-components/switch/sp-switch.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { store, Theme } from "../store/Store.js";

/**
 * The application settings button and popover.
 */
@customElement("app-settings-button")
export class SettingsButton extends MobxLitElement {
    protected override render() {
        return html`
            <overlay-trigger>
                <sp-action-button slot="trigger" quiet>
                    <sp-icon-settings
                        slot="icon"
                        title="Settings"
                    ></sp-icon-settings>
                </sp-action-button>
                <sp-popover slot="click-content" direction="bottom" tip>
                    <sp-dialog>
                        <h2 slot="heading">Settings</h2>
                        <sp-switch
                            ?checked=${store.theme === Theme.Dark}
                            @change=${store.toggleTheme}
                            >Use dark theme</sp-switch
                        >
                    </sp-dialog>
                </sp-popover>
            </overlay-trigger>
        `;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-settings-button": SettingsButton;
    }
}
