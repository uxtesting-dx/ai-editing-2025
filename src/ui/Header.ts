import "@spectrum-web-components/icons-workflow/icons/sp-icon-home.js";
import "@spectrum-web-components/tabs/sp-tab.js";
import "@spectrum-web-components/tabs/sp-tabs.js";
import "./HelpButton.js";
import "./SettingsButton.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { css, html } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * The application header.
 */
@customElement("app-header")
export class Header extends MobxLitElement {
    static styles = css`
        :host {
            display: grid;
            grid-template-areas: "left" "center" "right";
            grid-template-columns: 1fr auto 1fr;
            padding: 0 16px;
            padding-top: 6px;
            background-color: transparent;
            color: var(--spectrum-global-color-gray-800);
            font-weight: 700;
            border-bottom: 2px solid transparent;
            background-clip: padding-box;
            /* Hide the rule below tabs and don't round the bar below the selected tab. */
            --spectrum-tabs-rule-color: transparent;
            --spectrum-tabs-m-textonly-divider-border-radius: 0;
        }

        #app-header-left,
        #app-header-center,
        #app-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 12px;
        }

        #app-header-left {
            justify-content: flex-start;
        }

        #app-header-center {
            justify-content: center;
        }

        #app-header-right {
            justify-content: flex-end;
        }

        #app-header-tabs {
            margin-bottom: -2px;
        }

        #app-header-home-icon {
            margin: 0 2px -3px;
        }
    `;

    protected override render() {
        return html`
            <div id="app-header-left">
                <img src="images/logo.png" alt="Logo" width="234" height="45" />
            </div>
            <div id="app-header-center">
            </div>
            <div id="app-header-right">
                <img src="images/he-header-right.png" alt="Profile" width="220" height="36" />
            </div>
        `;
    }

    // private changeAppMode() {
    //     store.appMode = this.tabs.selected as AppMode;
    // }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-header": Header;
    }
}
