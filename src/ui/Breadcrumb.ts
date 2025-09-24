import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/action-group/sp-action-group.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-close.js";


import { MobxLitElement }   from "@adobe/lit-mobx";
import { css, html }        from "lit";
import { customElement }    from "lit/decorators.js";

import { Shape } from "../store/Shape.js";
import { store } from "../store/Store.js";

@customElement("app-breadcrumb")
export class Breadcrumb extends MobxLitElement {
    static styles = css`
        :host {
            display: flex;
            width: 100%;
            height: 40px;
            position: absolute;
            top: 23px;
            align-items: center;
            justify-content: center;
        }

        .breadcrumb-container {
            display: flex;
            flex-direction: row;
            flex-flow: row;
            justify-content: flex-start;
            width: auto;
            height: 30px;
            margin-top: 18px;
            cursor: pointer;
        }

        .breadcrumb-item {
            display: flex;
            height: 25px;
            width: auto;
            border-radius: 22px;
            border-color: #a5a5a5;
            border-width: 1px;
            border-style: solid;
            background-color: rgba(255, 255, 255, 1.0);
            padding: 0 8px;
            margin-right: 8px;
            margin-top: -32px;
            pointer-events: none;
            font-size: 12px;
        }

        .breadcrumb-item-parent {
            display: flex;
            height: 27px;
            width: auto;
            border-radius: 22px;
            border-color: #a5a5a5;
            border-width: 0px;
            border-style: solid;
            background-color: #e5e5e5;
            padding: 0 8px;
            margin-right: 8px;
            margin-top: 0px;
            pointer-events: none;
            font-size: 13px;
            font-weight: 900;
        }

        .breadcrumb-item-trail {
            display: flex;
            height: 16px;
            width: 16px;
            border-radius: 22px;
            border-image-slice: 1;
            border-width: 0px;
            background: linear-gradient(45deg, #973c4f, #dc7b6d, #9be2d0, #927cc1);
            margin-right: 8px;
            margin-left: -2px;
            margin-top: 7px;
        }

        .breadcrumb-item-selected-gradient {
            display: flex;
            background: linear-gradient(
                -45deg,
                #973c4f,
                #dc7b6d,
                #9be2d0,
                #927cc1
            );
            height: 30px;
            width: auto;
            border-radius: 40px;
            padding: 0 12px;
            margin-right: 6px;
            margin-top: -1px;
            margin-left: 0px;
            pointer-events: none;
        }

        .breadcrumb-item-selected {
            display: flex;
            height: 26px;
            width: auto;
            border-radius: 22px;
            border-image-slice: 1;
            border-image-source: linear-gradient(45deg, #973c4f, #dc7b6d, #9be2d0, #927cc1);
            border-width: 0px;
            background-color: rgba(255, 255, 255, 1.0);
            padding: 0 8px;
            margin-right: 8px;
            margin-left: 2px;
            margin-top: -28px;
            pointer-events: none;
            font-size: 12px;
            font-weight: 900;
        }

        .breadcrumb-children {
            display: flex;
            height: 28px;
            width: auto;
            border-radius: 22px;
            border-color: #a5a5a5;
            border-width: 1px;
            border-style: solid;
            background-color: rgba(255, 255, 255, 0.65);
            padding: 0 14px;
            margin-right: 5px;
            margin-top: 2px;
            margin-left: 2px;
            pointer-events: none;
        }

        .breadcrumb-item-container-selected {
            opacity: 1.0;
        }

        .breadcrumb-item-container {
            opacity: 0.6;
        }

        .breadcrumb-item-container:hover  {
            opacity: 1.0;
        }

        .breadcrumb-label {
            justify-content: center;
            margin-top:3px;
            width: auto;
            user-select: none;
            padding: 0 4px;
            white-space: nowrap;
            pointer-events: none;
        }

        .icon-chevron {
            margin-top: 7px;
            margin-right: 6px;
            left: -2px;
        }

        .hidden {
            display: none;
        }
    `;

    private actionShapes: Array<Shape> = [];

    private history: Array<Shape> = [];

    protected override render() {
        // TODO: Instead of using <input type="color">, we could create a Spectrum-styled color
        // picker from <sp-color-area> and <sp-color-slider>.
        // See https://opensource.adobe.com/spectrum-web-components/components/color-area/
        // and https://opensource.adobe.com/spectrum-web-components/components/color-slider/.

        //const { selectedShapes } = store;
        //const disabled = selectedShapes === undefined;
        return html`
            <div class="breadcrumb-container">
                ${this.renderItems()}
            </div>
        `;
    }

    private renderItems() {
        let result: any[] = [];
        let index = 0;
        this.actionShapes = [];
        if (store.selectedShapes.length == 0) { // Nothing selected, show the top level objects
            store.shapes.map(shape => {
                if (shape.isFirstLevel) {
                    this.actionShapes.push(shape);
                    result.push(
                        html`
                        <div class="breadcrumb-item-container"
                            id=${index++}
                            @pointerover=${this.over}
                            @pointerout=${this.out}
                            @pointerdown=${this.onClickItem}
                        >
                            <div class="breadcrumb-children"
                                style="opacity: ${ (shape.children) ? ((shape.children?.length > 0) ? '1' : '0') : '0' }"
                            ></div>
                            <div class="breadcrumb-item">
                                <div class="breadcrumb-label">
                                ${shape.label}
                                </div>
                            </div>
                        </div>
                        `);
                }
            });
        } else if (store.selectedShapes.length == 1) { // Show selected shape and its children
            const shapeSelected = store.selectedShapes[0];
            // result.push(
            //     html`
            //     <div class="breadcrumb-item-container-selected"
            //         @pointerdown=${this.onClickBack}
            //     >
            //         <div class="breadcrumb-item-trail">
            //         </div>
            //     </div>
            //     `);

            //
            // Root or Document top level
            //
                result.push(
                    html`
                    <div class="breadcrumb-item-container"
                        @pointerover=${this.over}
                        @pointerout=${this.out}
                        @pointerdown=${this.onClickRoot}
                    >
                        <div class="breadcrumb-item-parent">
                            <div class="breadcrumb-label">
                            Composition
                            </div>
                        </div>
                    </div>
                    `);
                result.push(
                    html`
                    <img
                        class="icon-chevron"
                        src="images/icon-chevron-right.svg"
                        alt=""
                        width="6"
                        height="12"
                    />
                    `);

            //
            // Parents
            //
            shapeSelected.parents?.map(parent => {
                this.actionShapes.push(parent);
                result.push(
                    html`
                    <div class="breadcrumb-item-container"
                        id=${index++}
                        @pointerover=${this.over}
                        @pointerout=${this.out}
                        @pointerdown=${this.onClickItem}
                    >
                        <div class="breadcrumb-item-parent">
                            <div class="breadcrumb-label">
                            ${parent.label}
                            </div>
                        </div>
                    </div>
                    `);
                result.push(
                    html`
                    <img
                        class="icon-chevron"
                        src="images/icon-chevron-right.svg"
                        alt=""
                        width="6"
                        height="12"
                    />
                    `);
            });
            this.actionShapes.push(shapeSelected);
            result.push(
                html`
                <div class="breadcrumb-item-container-selected"
                    id=${index++}
                    @pointerover=${this.over}
                    @pointerout=${this.out}
                    @pointerdown=${this.onClickItem}
                >
                    <div class="breadcrumb-item-selected-gradient"></div>
                    <div class="breadcrumb-item-selected">
                        <div class="breadcrumb-label">
                        ${shapeSelected.label}
                        </div>
                    </div>
                </div>
                `);
                if (store.selectedShapes[0].children) {
                    result.push(
                            html`
                        <img
                            class=${(store.selectedShapes[0].children?.length > 0) ? "icon-chevron" : "hidden"}
                            src="images/icon-chevron-right.svg"
                            alt=""
                            width="6"
                            height="12"
                        />
                        `);
                }
            store.selectedShapes[0].children?.map(shape => {
                this.actionShapes.push(shape);
                result.push(
                    html`
                    <div class="breadcrumb-item-container"
                        id=${index++}
                        @pointerover=${this.over}
                        @pointerout=${this.out}
                        @pointerdown=${this.onClickItem}
                    >
                        <div class="breadcrumb-children"
                            style="opacity:  ${ (shape.children) ? ((shape.children?.length > 0) ? '1' : '0') : '0' }"
                        ></div>
                        <div class="breadcrumb-item">
                            <div class="breadcrumb-label">
                            ${shape.label}
                            </div>
                        </div>
                    </div>
                    `);
            });
        } else if (store.selectedShapes.length > 1) { // Show selected shape and its children
            result.push(
                html`
                <div class="breadcrumb-item-container-selected">
                    <div class="breadcrumb-item-selected-gradient"></div>
                    <div class="breadcrumb-item-selected">
                        <div class="breadcrumb-label">Multiple Elements</div>
                    </div>
                </div>
                `);
        }
           
        return html`${result}`; 
    }

    private over(e: { target: Element; }) {
        this.turnOverOff();
        const index: number = parseInt( (e.target as Element).id );
        this.actionShapes[index].isHovered = true;
    }

    private out() {
        this.turnOverOff();
    }

    private onClickRoot() {
        this.turnOverOff();
        store.clearSelectedShapes();
        this.turnSelectedOff();
    }

    // private onClickBack() {
    //     // let back: Shape = this.history.pop() as Shape;
    //     // if (store.selectedShapes[0] === back) {
    //     //     back = this.history.pop() as Shape;
    //     // }
    //     this.turnOverOff();
    //     store.clearSelectedShapes();
    //     this.turnSelectedOff();
    //     // if (back) {
    //     //     store.selectedShapes.push(back);
    //     //     store.updateProperties(back);
    //     // }
    // }

    private onClickItem(e: { target: Element; }) {
        this.turnOverOff();
        if (!store.isShiftDown) {
            store.clearSelectedShapes();
            this.turnSelectedOff();
        }
        const index: number = parseInt( (e.target as Element).id );
        store.selectThis(this.actionShapes[index]);
        //this.actionShapes[index].isSelected = true;
        // store.selectedShapes.push(this.actionShapes[index]);
        // store.updateProperties(this.actionShapes[index]);
        this.history.push(this.actionShapes[index]);
    }

    private turnOverOff() {
        this.actionShapes.map(shape => {
            shape.isHovered = false;
        });
    }

    private turnSelectedOff() {
        this.actionShapes.map(shape => {
            shape.isSelected = false;
        });
    }
    
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-breadcrumb": Breadcrumb;
    }
}
