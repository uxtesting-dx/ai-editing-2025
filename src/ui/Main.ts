import "@spectrum-web-components/theme/scale-medium.js";
import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/theme-dark.js";
import "@spectrum-web-components/theme/theme-light.js";
import "./Header.js";
import "./EditTab.js";
import "./HomeTab.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { when } from "lit/directives/when.js";

import { AppMode, store } from "../store/Store.js";

/**
 * The root component of the application.
 */
@customElement("app-main")
export class Main extends MobxLitElement {
    static styles = css`
        :host {
            --spectrum-semantic-cta-background-color-default: #FF9D00;
        }

        #container {
            display: grid;
            width: 100%;
            height: 100vh;
            grid-template-areas: "header" "content";
            grid-template-rows: auto 1fr;
            background-image: url('images/canvas-grid.png');
            background-repeat: repeat;
            color: #2b2b2b;
            line-height: 1.5;
            overflow: hidden;
        }
    `;

    protected override render() {
        return html`
            <sp-theme color=${store.theme} scale="medium">
                <div id="container">
                    <div id="header">
                        <app-header></app-header>
                    </div>
                    <div id="content">
                    ${when(
                        store.appMode === AppMode.Home,
                        () => html`<app-home-tab></app-home-tab>`,
                        () => html`<app-edit-tab></app-edit-tab>`
                    )}
                </div>
            </sp-theme>
        `;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-main": Main;
    }
}
