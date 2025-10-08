import "../editor/Editor.js";
import "./PropertiesPanel.js";
import "./Taskbar.js";
import "./Toolbar.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { when } from "lit/directives/when.js";

import { store } from "../store/Store.js";

// When need to add toolbar back, here it is!
// <app-toolbar></app-toolbar>;

@customElement("app-edit-tab")
export class EditTab extends MobxLitElement {
    static styles = css`
        :host {
            display: block;
            background-color: transparent;
            height: 100%;
        }

        #toolbar {
            position: absolute;
            top: 90px;
            left: 16px;
            width: 48px;
            height: 270px;
        }
    `;

    protected override render() {
        return html`
            <div id="toolbar">
                <img src="images/he-toolbar.png" />
            </div>
            <app-editor tabindex="0"></app-editor>
            ${when(store.showPropertiesPanel, this.renderPropertiesPanel)}
        `;
    }

    private renderPropertiesPanel = () => {
        return html`<app-properties-panel></app-properties-panel>`;
    };

}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-edit-tab": EditTab;
    }
}
