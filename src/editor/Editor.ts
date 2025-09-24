import "@spectrum-web-components/action-button/sp-action-button.js";
import '@spectrum-web-components/dialog/sp-dialog.js';
import "@spectrum-web-components/color-wheel/sp-color-wheel.js";
import "@spectrum-web-components/divider/sp-divider.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-remove";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-add";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-full-screen";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-full-screen-exit";

import "./HandTool.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { css, html, PropertyValues, svg } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { IReactionDisposer } from "mobx";

import { matchesShortcut } from "../components/matchesShortcut.js";
import { Shape, ShapeId } from "../store/Shape.js";
import { Point2D, store, ToolId } from "../store/Store.js";
import "../ui/Breadcrumb.js";
import "../ui/ContextMenu.js";
import "../ui/HeliosProperties.js";
import { HandTool } from "./HandTool.js";
import { SelectTool } from "./SelectTool.js";
import { ShapeCreationTool } from "./ShapeCreationTool.js";
import { ToolBase } from "./ToolBase.js";
import { ZoomTool } from "./ZoomTool.js";


const MIN_ZOOM = 1 / 32;
const MAX_ZOOM = 32;

@customElement("app-editor")
export class Editor extends MobxLitElement {
    static styles = css`
        :host {
            display: flex;
            flex: auto;
            outline: none;
            height: 100%;
            background-color: transparent;
            --spectrum-semantic-cta-background-color-default: #FF9D00;
            --spectrum-semantic-cta-background-color-hover: #E68A00;
            --spectrum-semantic-cta-background-color-down: #CC7A00;
            --spectrum-semantic-emphasized-border-color-default: #FF9D00;
            --spectrum-semantic-emphasized-border-color-hover: #E68A00;
        }

        svg {
            width: 100%;
            height: 100%;
            pointer-events: auto;
        }

        #logo {
            display: block;
            position: absolute;
            left: 20px;
            top: 20px;
            cursor: pointer;
        }

        .help-bubble {
            display: block;
            position: absolute;
            float: left;
            left: 75px;
            top: 85px;
            pointer-events: none;
            transform-origin: top left;
            animation: show-help 0.35s ease-in-out;
        }

        @keyframes show-help {
            0% {
                opacity: 0;
                transform: scale(0.2);
            }
            50% {
                opacity: 1;
                transform: scale(1.6);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        #marquee {
            display: block;
            position: absolute;
            top: 0;
        }

        #cursor-add {
            display: block;
            position: absolute;
            top: 0;
        }

        #message-tryit {
            display: block;
            position: absolute;
        }

        .editor-help-reward {
            display: block;
            position: absolute;
            top: 0;
            pointer-events: none;
        }

        .editor-help-bubble {
            display: block;
            position: absolute;
            top: 0;
            pointer-events: none;
            transform-origin: bottom left;
            animation: show-help 0.25s ease-in-out;
        }

        .editor-zoom {
            display: flex;
            flex-direction: row;
            position: absolute;
            float: right;
            top: 35px;
            right: 20px;
            background: #fff;
            width: 160px;
            height: 32px;
            border-radius: 4px;
        }

        .shadow-under-breadcrumb {
            position: absolute;
            width: 100%;
            height: 130px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
            pointer-events: none;
        }

        .hidden {
            display: none;
        }

        .artboard-hover-rect {
            pointer-events: all;
            cursor: pointer;
        }

        #helios-context-menu {
            position: absolute;
            top: 0;
            left: 0;
        }

        .color-wheel-animated {
            animation: colorWheelFadeIn 0.3s ease-out;
            transform-origin: center;
        }
        
        #alert-dialog-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }

        #alert-dialog {
            background-color: #fff;
            border-radius: 24px;
            position: absolute;
            top: 120px;
            left: 40%;
        }

        #photo-menu {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            background-color: #ffffff;
            border-radius: 24px;
            z-index: 999;
        }

        @keyframes colorWheelFadeIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.1);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    

    private tools: Record<ToolId, ToolBase> = {
        [ToolId.Select]: new SelectTool(this),
        [ToolId.Rectangle]: new ShapeCreationTool(this, ShapeId.Rectangle),
        [ToolId.Ellipse]: new ShapeCreationTool(this, ShapeId.Ellipse),
        [ToolId.Star]: new ShapeCreationTool(this, ShapeId.Star),
        [ToolId.Hand]: new HandTool(this),
        [ToolId.Zoom]: new ZoomTool(this),
    };

    @query("svg")
    private svgElement?: SVGSVGElement;

    @state()
    private rootTranslate: Point2D = { x: 0, y: 0 };

    private reactionDisposer?: IReactionDisposer;

    public override connectedCallback() {
        super.connectedCallback();
        this.addEventListener("pointerdown", this.handlePointerDown, {
            capture: true,
        });
        window.addEventListener("contextmenu", this.handleContextMenuDown);
        window.addEventListener("resize", this.handleResize);
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);

        
    }

    protected override firstUpdated(_changedProperties: PropertyValues) {

        // store.selectedShapes = [ store.shapes[2] ];
        // store.currentDownShape = store.shapes[2];

        super.firstUpdated(_changedProperties);
        this.handleResize();
        
        // Add event listeners to SVG after it's rendered
        setTimeout(() => {
            if (this.svgElement) {
                console.log("Adding event listeners to SVG");
                //const rect = this.svgElement.querySelector('rect.artboard-hover-rect');
                this.svgElement.addEventListener('mouseover', this.handleSVGMouseOver);
                this.svgElement.addEventListener('mouseout', this.handleSVGMouseOut);

                // const photoMenu = this.shadowRoot?.querySelector('#photo-menu') as HTMLElement;
                // if (photoMenu) {
                //     const artwork1 = store.shapes.find(shape => shape.id === "artwork1") as Photo;
                //     console.log("artwork1", artwork1.y);
                //     photoMenu.style.left = artwork1.x + "px";
                //     photoMenu.style.top = (artwork1.height / 2) + 50 + "px";
                // }
            }
        }, 100);
    }



    public override disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("pointerdown", this.handlePointerDown, {
            capture: true,
        });
        window.removeEventListener("contextmenu", this.handleContextMenuDown);
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
        
        // Remove SVG event listeners
        if (this.svgElement) {
            this.svgElement.removeEventListener('mouseover', this.handleSVGMouseOver);
            this.svgElement.removeEventListener('mouseout', this.handleSVGMouseOut);
        }
        
        this.reactionDisposer?.();
    }


//     <svg id="marquee" style="left: ${Math.min(store.pagePos.x, store.startMarqueePoint.x)}px; top: ${Math.min(store.pagePos.y, store.startMarqueePoint.y)}px; pointer-events: none;
//     visibility: ${store.isMarquee ? "visible" : "hidden"}"">
// <rect
// fill=url("#stroke-marquee")
// stroke="black"
// strokeWidth=${3 / zoom}
// width=${Math.max(store.startMarqueePoint.x - store.pagePos.x, store.pagePos.x - store.startMarqueePoint.x)}
// height=${Math.max(store.startMarqueePoint.y - store.pagePos.y, store.pagePos.y - store.startMarqueePoint.y)}
// rx="8" ry="8"
// stroke-dasharray="5,5"
// opacity="0.25"
// />
// </svg>
// <svg id="marquee" style="left: ${Math.min(store.pagePos.x, store.startMarqueePoint.x)}px; top: ${Math.min(store.pagePos.y, store.startMarqueePoint.y)}px; pointer-events: none;
//     visibility: ${store.isMarquee ? "visible" : "hidden"}">
// <linearGradient id="stroke-marquee" x1="-200%" y1="0%" x2="0%" y2="0%" gradientTransform="rotate(45)">
// <stop offset="-200%" stop-color="#d76D69" />
// <stop offset="-150%" stop-color="#A2f3e8" />
// <stop offset="-100%" stop-color="#B19Ee7" />
// <stop offset="-50%" stop-color="#A2f3e8" />
// <stop offset="0%" stop-color="#d76D69" />
// <stop offset="50%" stop-color="#A2f3e8" />
// <stop offset="100%" stop-color="#B19Ee7" />
// <stop offset="150%" stop-color="#A2f3e8" />
// <stop offset="200%" stop-color="#d76D69" />
// <animate attributeType="XML" attributeName="x1" from="-200%" to="0%" dur="1.0s" repeatCount="indefinite"/>
// <animate attributeType="XML" attributeName="x2" from="0%" to="400%" dur="1.0s" repeatCount="indefinite"/>
// </linearGradient>
// <rect
// fill="none";
// stroke=url("#stroke-marquee")
// strokeWidth=${3 / zoom}
// width=${Math.max(store.startMarqueePoint.x - store.pagePos.x, store.pagePos.x - store.startMarqueePoint.x)}
// height=${Math.max(store.startMarqueePoint.y - store.pagePos.y, store.pagePos.y - store.startMarqueePoint.y)}
// rx="8" ry="8"
// stroke-dasharray="5,5"
// opacity="1"
// />
// </svg>  

    protected override render() {
        const rootTransform = `translate(${this.rootTranslate.x},${this.rootTranslate.y})`;
        const { center, zoom } = store;
        const sceneTransform = `scale(${zoom}) translate(${-center.x},${-center.y})`;

        return html`
            <svg>
                <g transform=${rootTransform}>
                    <g transform=${sceneTransform}>
                        ${this.renderArtboard()} ${this.renderTool()}
                    </g>
                </g>
            </svg>

            


            ${store.contextMenuVisibility ? html`
                <div id="helios-context-menu"
                    style="
                        left: ${store.posContextMenu.x}px;
                        top: ${store.posContextMenu.y - 100}px;
                        z-index: 1000;">
                    <app-context-menu></app-context-menu>
                </div>
            ` : ""}

            ${store.HeliosPropertiesVisibility ? html`
                <div id="helios-properties"
                    style="
                        position: absolute;
                        left: ${store.posContextMenu.x}px;
                        top: ${store.posContextMenu.y}px;
                        z-index: 1001;">
                    <app-helios-properties></app-helios-properties>
                </div>
            ` : ""}

            ${store.isColorWheelVisible ? html`
                <sp-color-wheel
                    class="color-wheel-animated"
                    color="#ff0000"
                    format="hex"
                    @input=${this.handleColorWheelChange}
                    @change=${this.handleColorWheelChange}
                    style="
                        position: absolute;
                        left: ${store.posContextMenu.x}px;
                        top: ${store.posContextMenu.y}px;
                        z-index: 1000;"></sp-color-wheel>`
                : ''}

            <img
                id="message-tryit"
                src=${store.tryitMessage}
                alt=""
                height="149"
                width="201"
                style="left: ${this.rootTranslate.x + 80}px; top: ${this.rootTranslate.y + 120}px; visibility: ${store.tryitMessageVisibility};"
            />

            <img
                id="cursor-add"
                src=${store.cursorSrc}
                alt=""
                height="22"
                width="22"
                style="left: ${store.pagePos.x + 7}px; top: ${store.pagePos.y + 7}px; visibility: ${store.cursorModifierVisibility};"
            />

            <!--
            <div id="photo-menu">
                
            </div>
            -->
            ${store.showAlertDialog ? html`
                <div id="alert-dialog-container">
                    <sp-dialog id="alert-dialog" size="s" >
                        <div
                            slot="hero"
                        ></div>
                        <h2 slot="heading">Sorry, this is a prototype.</h2>
                        Not all features are available yet. This connection is not part of the examples we have ready.
                        <sp-button slot="button" @click=${this.handleDialogClose}>Continue</sp-button>
                    </sp-dialog>
                </div>
            ` : ''}


        `;
    }

    // public playReward() {
    //     if (this.shadowRoot) {
    //         const el = this.shadowRoot.getElementById('reward');
    //         if (el as Element) {
    //             el.beginElement();
    //         }
            
    //     }
    // }

    //private indexScan: number = 0;

    private renderArtboard() {
        const { artboard, zoom } = store;
        return svg`
            <defs>
                <pattern id="alienbackground" patternUnits="userSpaceOnUse" width="1342" height="892">
                    <image href=${store.imageAlienBackground} x="0" y="0" width="1342" height="892" />
                </pattern>
            </defs>
            <rect
                fill="transparent"
                stroke="black"
                strokeWidth=${1 / zoom}
                x=${artboard.x - 2000}
                y=${artboard.y - 2000}
                width=${artboard.width + 4000}
                height=${artboard.height + 4000}
                rx="20" ry="20"
                @pointerdown=${this.handleArtboardPointerDown}
            />
           

        `;
    }

    private get activeTool(): ToolBase {
        return this.tools[store.activeToolId];
    }

    private renderTool() {
        return this.activeTool.render();
    }

    private handlePointerDown = () => {
        this.focus();
    };

    private handleArtboardPointerDown = (event: PointerEvent) => {
        console.log("Artboard pointer down", event);
        // Hide context menu when clicking on artboard
        //store.contextMenuVisibility = false;
        // You can add more functionality here
        event.preventDefault();
        event.stopPropagation();
    };

    private handleColorWheelChange = (event: Event) => {

        const target = event.target as any;
        
        // Try multiple ways to get the color
        let color = target.color || 
                   target.value || 
                   (event as any).detail?.color ||
                   (event as any).detail?.value;
        
        // If still no color, try to get it from the element's attributes
        if (!color && target.getAttribute) {
            color = target.getAttribute('color') || target.getAttribute('value');
        }

        if (store.currentDownShape?.id === "wall-back") {
            const wallColor = store.shapes.find(shape => shape.id === "wall-back-color") as Shape;
            if (color && wallColor) {
                wallColor.fill = color;
            }
        }
        if (store.currentDownShape?.id === "ceiling") {
            const ceilingColor = store.shapes.find(shape => shape.id === "ceiling-color") as Shape;
            if (color && ceilingColor) {
                ceilingColor.fill = color;
            }
        }
        

    };

    private handleContextMenuDown = (event: MouseEvent) => {
        //store.activeToolId = ToolId.Hand;
        store.updateMenuItems();
        store.posContextMenu = store.pagePos;

        console.log("Store currentConnections = ", store.currentConnections);

        if (store.currentConnections.length > 0) {
            store.showContextMenu = true;
        }
        
        event.preventDefault();
    };

    private handleDialogClose = (event: Event) => {
        store.showAlertDialog = false;
        // const dialog = this.shadowRoot?.querySelector('#alert-dialog') as any;
        // if (dialog) {
        //     dialog.open = false;
        // }
    };

    private handleSVGMouseOver = (event: MouseEvent) => {
        const target = event.target as Element;
        const svgElement = target.closest('svg');
        if (svgElement) {
            const rect = svgElement.querySelector('rect.artboard-hover-rect');
            if (rect) {
                rect.setAttribute('opacity', '0.5');
            }
        }
    };

    private handleSVGMouseOut = (event: MouseEvent) => {
        const target = event.target as Element;
        const svgElement = target.closest('svg');
        if (svgElement) {
            const rect = svgElement.querySelector('rect.artboard-hover-rect');
            if (rect) {
                rect.setAttribute('opacity', '0.15');
            }
        }
    };

    private handleResize = () => {
        // Find the center of the SVG element.
        const defaultRect = { width: 200, height: 200 };
        const svgRect = this.svgElement
            ? this.svgElement.getBoundingClientRect()
            : defaultRect;
        this.rootTranslate = { x: svgRect.width / 2, y: svgRect.height / 2 };
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode === 32) {
            if (event.metaKey) {
                store.activeToolId = ToolId.Zoom;
            } else {
                store.activeToolId = ToolId.Hand;
            }
        }
        const { key, altKey, ctrlKey, metaKey, shiftKey } = event;
        const modifiers = { altKey, ctrlKey, metaKey, shiftKey };
        let handled = this.activeTool.keyDown(key, modifiers);
        if (!handled) {
            handled = true;
            if (matchesShortcut(event, "shift") || matchesShortcut(event, "cmd")) {
                //store.isShiftDown = true;
                //this.checkSubObjecUnderMouse();
                //store.cursorModifierVisibility = "visible";
            }
            if (matchesShortcut(event, "Delete,Backspace")) {
                //store.deleteSelectedShapes();
            } else if (matchesShortcut(event, "cmdOrCtrl+0")) {
                this.showAll();
            } else if (matchesShortcut(event, "cmd+D") || matchesShortcut(event, "Escape")) {
                store.contextMenuVisibility = false;
                store.HeliosPropertiesVisibility = false;
                store.isColorWheelVisible = false;
                store.isEyedropping = false;
                //store.clearSelectedShapes();
            } else if (matchesShortcut(event, "cmd+A")) {
                store.selectAll();
            } else if (matchesShortcut(event, "cmdOrCtrl+1")) {
                this.centerArtboardAtZoom(1);
            } else if (matchesShortcut(event, "cmdOrCtrl+Space")) {
                store.activeToolId = ToolId.Zoom;
            } else if (matchesShortcut(event, "shift+ArrowLeft")) {
                store.moveBySelectedShapes(-10, 0);
            } else if (matchesShortcut(event, "ArrowLeft")) {
                store.moveBySelectedShapes(-1, 0);
            } else if (matchesShortcut(event, "shift+ArrowRight")) {
                store.moveBySelectedShapes(10, 0);
            } else if (matchesShortcut(event, "ArrowRight")) {
                store.moveBySelectedShapes(1, 0);
            } else if (matchesShortcut(event, "shift+ArrowUp")) {
                store.moveBySelectedShapes(0, -10);
            } else if (matchesShortcut(event, "ArrowUp")) {
                store.moveBySelectedShapes(0, -1);
            } else if (matchesShortcut(event, "shift+ArrowDown")) {
                store.moveBySelectedShapes(0, +10);
            } else if (matchesShortcut(event, "ArrowDown")) {
                store.moveBySelectedShapes(0, 1);
            } else if (matchesShortcut(event, "Tab")) {
                store.tabNext();
                this.requestUpdate();
            } else if (matchesShortcut(event, "shift+Tab")) {
                store.tabPrevious();
                this.requestUpdate();
            } else {
                handled = false;
            }
        }
        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    // private checkSubObjecUnderMouse() {
    //     store.updateCursorModifier();
    // }

    private handleKeyUp = (event: KeyboardEvent) => {
        //if (event.keyCode === 32) {
        store.activeToolId = ToolId.Select;
        //}
        const { key, altKey, ctrlKey, metaKey, shiftKey } = event;
        const modifiers = { altKey, ctrlKey, metaKey, shiftKey };
        store.isShiftDown = false;
        store.cursorModifierVisibility = "hidden";
        if (this.activeTool.keyUp(key, modifiers)) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    public getDocumentPosition(clientPosition: Point2D): Point2D {
        if (this.svgElement) {
            const clientRect = this.svgElement.getBoundingClientRect();
            const { center, zoom } = store;
            const x =
                (clientPosition.x - clientRect.x - this.rootTranslate.x) /
                    zoom +
                center.x;
            const y =
                (clientPosition.y - clientRect.y - this.rootTranslate.y) /
                    zoom +
                center.y;
            return { x, y };
        }
        return { x: 0, y: 0 };
    }

    public updateCursor() {
        // console.log(this.cursorAdd);
        // if (this.cursorAdd) {
        //     this.cursorAdd.style.left = store.mousePos.x.toString() + "px";
        //     this.cursorAdd.style.top = store.mousePos.y.toString() + "px";
        // }

    }

    public zoomBy(zoomFactor: number, documentPosition: Point2D) {
        this.zoomTo(store.zoom * zoomFactor, documentPosition);
    }

    public zoomTo(newZoom: number, documentPosition: Point2D) {
        const { center, zoom } = store;
        if (newZoom < MIN_ZOOM) {
            if (zoom === MIN_ZOOM) {
                return;
            }
            newZoom = MIN_ZOOM;
        }
        if (newZoom > MAX_ZOOM) {
            if (zoom === MAX_ZOOM) {
                return;
            }
            newZoom = MAX_ZOOM;
        }
        store.center = {
            x:
                ((center.x - documentPosition.x) * zoom) / newZoom +
                documentPosition.x,
            y:
                ((center.y - documentPosition.y) * zoom) / newZoom +
                documentPosition.y,
        };
        store.zoom = newZoom;
    }

    private showAll() {
        let zoom = 1;
        if (this.svgElement) {
            const clientRect = this.svgElement.getBoundingClientRect();
            const margin = 20;
            const { artboard } = store;
            const scaleX = (clientRect.width - margin) / artboard.width;
            const scaleY = (clientRect.height - margin) / artboard.height;
            zoom = Math.min(scaleX, scaleY);
        }
        this.centerArtboardAtZoom(zoom);
    }

    private centerArtboardAtZoom(zoom: number) {
        const { artboard } = store;
        store.center = {
            x: artboard.x + artboard.width / 2,
            y: artboard.y + artboard.height / 2,
        };
        store.zoom = zoom;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-editor": Editor;
    }
}
