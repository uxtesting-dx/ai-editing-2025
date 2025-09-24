import "@spectrum-web-components/action-group/sp-action-group.js";
import "@spectrum-web-components/divider/sp-divider.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-ellipse.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-hand.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-magnify.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-rectangle.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-select.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-star-outline.js";
import "../components/ToolbarButton.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { ActionGroup } from "@spectrum-web-components/bundle";
import { css, html } from "lit";
import { customElement } from "lit/decorators.js";

import { store, ToolId } from "../store/Store.js";

@customElement("app-toolbar")
export class Toolbar extends MobxLitElement {
    static styles = css`
        :host {
            padding: 0 8px;
            background: var(--spectrum-global-color-gray-100);
        }
    `;

    protected override render() {
        return html`
            <sp-action-group
                vertical
                selects="single"
                @change=${this.changeTool}
            >
                <sp-toolbar-button
                    value=${ToolId.Select}
                    heading="Select Tool"
                    shortcut="V"
                    description="Click to select an object."
                    ?selected=${store.activeToolId === ToolId.Select}
                >
                    <sp-icon-select slot="icon"></sp-icon-select>
                </sp-toolbar-button>
                <sp-divider size="s"></sp-divider>
                <sp-toolbar-button
                    value=${ToolId.Rectangle}
                    heading="Rectangle Tool"
                    shortcut="R"
                    description="Click and drag to create a rectangle."
                    ?selected=${store.activeToolId === ToolId.Rectangle}
                >
                    <sp-icon-rectangle slot="icon"></sp-icon-rectangle>
                </sp-toolbar-button>
                <sp-toolbar-button
                    value=${ToolId.Ellipse}
                    heading="Ellipse Tool"
                    shortcut="E"
                    description="Click and drag to create an ellipse."
                    ?selected=${store.activeToolId === ToolId.Ellipse}
                >
                    <sp-icon-ellipse slot="icon"></sp-icon-ellipse>
                </sp-toolbar-button>
                <sp-toolbar-button
                    value=${ToolId.Star}
                    heading="Star Tool"
                    shortcut="S"
                    description="Click and drag to create a star."
                    ?selected=${store.activeToolId === ToolId.Star}
                >
                    <sp-icon-star-outline slot="icon"></sp-icon-star-outline>
                </sp-toolbar-button>
                <sp-divider size="s"></sp-divider>
                <sp-toolbar-button
                    value=${ToolId.Hand}
                    heading="Hand Tool"
                    shortcut="H"
                    description="Click and drag to pan the canvas up, down, left, and right."
                    ?selected=${store.activeToolId === ToolId.Hand}
                >
                    <sp-icon-hand slot="icon"></sp-icon-hand>
                </sp-toolbar-button>
                <sp-toolbar-button
                    value=${ToolId.Zoom}
                    heading="Zoom Tool"
                    shortcut="Z"
                    description="Click and drag to zoom in and out."
                    ?selected=${store.activeToolId === ToolId.Zoom}
                >
                    <sp-icon-magnify slot="icon"></sp-icon-magnify>
                </sp-toolbar-button>
            </sp-action-group>
        `;
    }

    private changeTool(event: CustomEvent<string>) {
        const actionGroup = event.target as ActionGroup;
        if (actionGroup.selected.length > 0) {
            store.activeToolId = actionGroup.selected[0] as ToolId;
        }
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-toolbar": Toolbar;
    }
}
