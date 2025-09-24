import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-properties.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { css, html } from "lit";
import { customElement } from "lit/decorators.js";

import { store } from "../store/Store.js";

@customElement("app-taskbar")
export class Taskbar extends MobxLitElement {
    static styles = css`
        :host {
            display: flex;
            background: var(--spectrum-global-color-gray-100);
            padding: 8px;
            margin-left: 2px;
        }
    `;

    protected override render() {
        return html`
            <sp-action-button
                quiet
                ?selected=${store.showPropertiesPanel}
                @click=${store.togglePropertiesPanel}
            >
                <sp-icon-properties slot="icon"></sp-icon-properties>
            </sp-action-button>
        `;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-taskbar": Taskbar;
    }
}
