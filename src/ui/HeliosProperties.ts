import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/action-group/sp-action-group.js";
import "@spectrum-web-components/button/sp-button.js";
import '@spectrum-web-components/color-slider/sp-color-slider.js';
import '@spectrum-web-components/color-area/sp-color-area.js';
import "@spectrum-web-components/field-label/sp-field-label.js";
import '@spectrum-web-components/thumbnail/sp-thumbnail.js';

import "@spectrum-web-components/icons-workflow/icons/sp-icon-close.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-right.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-drag-handle.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-close.js";


import { MobxLitElement }   from "@adobe/lit-mobx";
import { css, html }        from "lit";
import { customElement, property }    from "lit/decorators.js";
import { store } from "../store/Store";
import { Shape } from "../store/Shape";
import { Editor } from "../editor/Editor";
import { Photo } from "../store/Photo";


@customElement("app-helios-properties")
export class HeliosProperties extends MobxLitElement {
    editor: Editor;

    // @property({ type: Boolean })
    // private isPantone = false;
    
    constructor(editor: Editor) {
        super();
        this.editor = editor;
    }
    static styles = css`
        :host {
            display: block;
            width: 400px;
            height: 400px;
            position: absolute;
            z-index: 9999;
        }

        .prop-container {
            display: flex;
            flex-direction: column;
            position: relative;
            align-items: left;
            color:rgb(255, 255, 255);
            font-size: 16px;
            font-family: system-ui, -apple-system, sans-serif;
            font-weight: 900;
            width: 400px;
            height: max-content;
        }

        .prop-header-label {

        }

        .prop-header-label-container {
            margin-left: 32px;
            margin-top: 5px;
            height: 36px;
            width: max-content;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: left;
            gap: 5px;
        }

        .prop-header-icon {
            margin-top: 3px;
        }

        .prop-panel {
            display: flex;
            flex-direction: column;
            align-items: left;
            justify-content: left;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 300px;
            height: 360px;
            border-radius: 12px;
            background-color: #ffffffee;
            z-index: 0;
        }

         .prop-header {
            position: absolute;
            top: -20px;
            left: -16px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            width: 320px;
            height: 36px;
            border-radius: 20px;
            background-color: #ff9d00;
            z-index: 20;
        }

        .prop-thumbnail-container {
            display: flex;
            flex-direction: row;
            align-items: left;
            justify-content: left;
            position: absolute;
            top: 90px;
            left: 24px;
            width: 100%;
            height: auto;
            gap: 24px;
        }

        .prop-color-slider-container {
            display: flex;
            flex-direction: column;
            align-items: left;
            justify-content: left;
            position: absolute;
            top: 162px;
            left: 20px;
            width: 200px;
            height: auto;
            gap: 24px;
        }

        .prop-color-thumbnail-container {
            display: flex;
            flex-direction: row;
            align-items: left;
            justify-content: left;
            position: absolute;
            top: 0px;
            left: 4px;
            padding-bottom: 6px;
            gap: 12px;
        }

        .color-tile {
            width: 41px;
            height: 41px;
            border-radius: 4px;
            opacity: 1.0;
            cursor: pointer;
            background-color: var(--tile-color, #440000);
        }

        .prop-color-reference-container
            display: flex;
            width: 260px;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: left;
            justify-content: left;
            top: 0px;
            left: 0px;
            gap: 16px;
        }

        .prop-pantone-thumbnail-container {
            display: flex;
            flex-direction: row;
            align-items: left;
            justify-content: left;
            position: absolute;
            top: 8px;
            left: 20px;
            padding-bottom: 12px;
            gap: 24px;
        }

        .gallery-label {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            color: #4a4a4a;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            font-weight: 300;
        }

        .gallery-label-text {
            margin-top: -6px;
            font-size: 12px;
            font-family: system-ui, -apple-system, sans-serif;
            font-weight: 300;
        }

        #reference-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

    `;
    
    @property({ type: Boolean })
    private showPromptInput = false;
    
    private originalConnections: Array<string> = [];
    
    // Container dragging properties
    private isContainerDragging = false;
    private containerDragStart = { x: 0, y: 0 };
    private containerInitialPosition = { x: 0, y: 0 };

    // Public method that Editor can call to handle ESCAPE
    public handleEscape = (event: KeyboardEvent): boolean => {

        // Stop eyedroppeconr mode if active
        if (this.floatingEyedropper || this.floatingDiv) {
            // Restore normal cursor
            document.body.style.cursor = '';

            // Remove floating elements
            if (this.floatingEyedropper) {
                this.floatingEyedropper.remove();
                this.floatingEyedropper = null;
            }
            if (this.floatingDiv) {
                this.floatingDiv.remove();
                this.floatingDiv = null;
            }
            // Clear references to child elements
            this.circleDiv = null;
            this.loupeImg = null;
            
            // Remove event listeners
            document.removeEventListener('mousemove', this.handleMouseMove);
            if (this.eyedropperClickHandler) {
                document.removeEventListener('click', this.eyedropperClickHandler);
                this.eyedropperClickHandler = null;
            }

            // ContextMenu handled the ESCAPE key
            event.stopPropagation();
            event.preventDefault();
            return true; // Indicate that ContextMenu handled it
        }

        // Close prompt input if open
        if (this.showPromptInput) {
            this.showPromptInput = false;
            // Restore original connections if filtering
            if (this.originalConnections.length > 0) {
                store.currentConnections = this.originalConnections;
                this.originalConnections = [];
            }
            // ContextMenu handled the ESCAPE key
            event.stopPropagation();
            event.preventDefault();
            return true; // Indicate that ContextMenu handled it
        }

        console.log("ContextMenu handleEscapeKey - not handled by ContextMenu");

        // ContextMenu doesn't need to handle this ESCAPE, let Editor handle it
        return false; // Indicate that Editor should handle it
    }

    protected override firstUpdated() {
        // You can access DOM elements here
        const colorSlider = this.shadowRoot?.querySelector("#color-slider") as any;
        const colorArea = this.shadowRoot?.querySelector('#color-area') as any;

        if (store.currentDownShape?.id === "wall-back") {
            const wallColor = store.shapes.find(shape => shape.id === "wall-back-color") as Shape;
            if (wallColor) {
                if (colorSlider) {
                    colorSlider.color = wallColor.fill;
                }
                if (colorArea) {
                    colorArea.color = wallColor.fill;
                }
            }
        }
        if (store.currentDownShape?.id === "ceiling") {
            const ceilingColor = store.shapes.find(shape => shape.id === "ceiling-color") as Shape;
            if (ceilingColor) {
                if (colorSlider) {
                    colorSlider.color = ceilingColor.fill;
                }
                if (colorArea) {
                    colorArea.color = ceilingColor.fill;
                }
            }
            
        }
        

        

    }

    protected override render() {

        return html`
            <div class="prop-container">

                <div class="prop-panel">

                    <input type="text" disabled="true"
                        placeholder="enter prompt here (optional)"
                        style="position: absolute;
                                top: 28px;
                                left: 12px;
                                width: calc(100% - 50px);
                                height: 42px;
                                padding: 0 12px;
                                border: none;
                                border-radius: 21px;
                                background-color: white;
                                color: #4a4a4a;
                                font-size: 14px;
                                font-family: system-ui, -apple-system, sans-serif;
                                outline: none;
                                opacity: 0.6;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                animation: expandWidth 0.15s ease-out forwards;"
                        @input=${this.handlePromptInputChange}/>

                    <img src="images/he-button-prompt-disabled.png" alt="PromptButton"
                              style="position: absolute;
                              top: 30px;
                              left: 245px;
                              width: 38px; 
                              height: 38px;
                              border-radius: 24px;
                              opacity: 1.0;">


                ${store.typeOfProperty === "color" ? html`

                    <div style="display: flex;
                                flex-direction: row;
                                align-items: left;
                                position: absolute;
                                top: 84px;
                                left: 15px;
                                width: 260px;
                                height: 50px;
                                justify-content: left;
                                gap: 12px;
                                background-color: #cccccc;
                                border-radius: 6px;
                                padding: 6px;
                                ">

                        ${store.currentColorReference === "" ? html`
                            <img style="
                                width: 48px; 
                                height: 48px;
                                opacity: 1.0;
                                margin-top: 2px;
                                cursor: pointer;"
                                src="images/he-icon-addref.png" alt="add reference"
                                @click=${() => store.showBrowseImagesPanel = true}>
                                </img>
                            <span style="
                                font-size: 12px;
                                font-family: system-ui, -apple-system, sans-serif;
                                font-weight: 600;
                                color: #666666;
                                left: 90px;
                                margin-top: 6px;"
                                >Add your own<br>reference images.</span>
                            ` : 
                            html`
                            <div id="reference-container" style="display: flex; align-items: center; gap: 10px;">

                                <img src="images/${store.currentColorReference}" alt="reference image"
                                    style="width: 48px; height: 48px; border-radius: 4px; opacity: 1.0; cursor: pointer;"
                                    @click=${() => store.showBrowseImagesPanel = true}>
                                </img>
                                <img src="images/he-icon-close.png" alt="close"
                                    style="margin-left: -25px; margin-top: -26px; width: 14px; height: 14px; opacity: 1.0; cursor: pointer;"
                                    @click=${this.handleRemoveImageReference}>
                                </img>

                                    <div class="color-tile" style="--tile-color: ${store.extractedColors[0]};" @click=${(e: Event) => this.handleColorTileClick(e)}></div>
                                    <div class="color-tile" style="--tile-color: ${store.extractedColors[1]};" @click=${(e: Event) => this.handleColorTileClick(e)}></div>
                                    <div class="color-tile" style="--tile-color: ${store.extractedColors[2]};" @click=${(e: Event) => this.handleColorTileClick(e)}></div>
                                    <div class="color-tile" style="--tile-color: ${store.extractedColors[4]};" @click=${(e: Event) => this.handleColorTileClick(e)}></div>

                            </div>
                            `}

                        
                    </div>

                     <div class="prop-color-slider-container">

                        <div class="prop-color-thumbnail-container">
                            <sp-thumbnail size="m" @click=${(e: Event) => this.handleColorClick(1, e)}>
                                <img src="images/he-color1.png" alt="color 1" />
                            </sp-thumbnail>
                            <sp-thumbnail size="m" @click=${(e: Event) => this.handleColorClick(2, e)}>
                                <img src="images/he-color2.png" alt="color 2" />
                            </sp-thumbnail>
                            <sp-thumbnail size="m" @click=${(e: Event) => this.handleColorClick(3, e)}>
                                <img src="images/he-color3.png" alt="color 3" />
                            </sp-thumbnail>
                            <sp-thumbnail size="m" @click=${(e: Event) => this.handleColorClick(4, e)}>
                                <img src="images/he-color4.png" alt="color 4" />
                            </sp-thumbnail>
                            <sp-thumbnail size="m" @click=${(e: Event) => this.handleColorClick(5, e)}>
                                <img src="images/he-color5.png" alt="color 5" />
                            </sp-thumbnail>
                        </div>

                        <sp-color-slider id="color-slider"
                            style="min-width: 260px;
                                    margin-top: 56px;"
                            label="Color"
                            variant="filled"
                            format="hex"
                            color="#ff0000"
                            @input=${this.handleColorWheelChange}
                            @change=${this.handleColorWheelChange}
                        ></sp-color-slider>

                        <sp-color-area id="color-area"
                            style="
                                margin-top: -2px;
                                width: 260px; 
                                height: 72px;"
                            label="Color"
                            variant="filled"
                            format="hex"
                            color="#ff0000"
                            
                            @input=${this.handleColorWheelChange}
                            @change=${this.handleColorWheelChange}
                        ></sp-color-area>

                     </div>
                     ` : ""}


                ${(store.typeOfProperty === "material" && store.currentDownShape?.id.toLocaleLowerCase().includes("wall")) ? html`


                    <div style="display: flex;
                                flex-direction: row;
                                align-items: left;
                                position: absolute;
                                top: 84px;
                                left: 17px;
                                width: 256px;
                                height: 46px;
                                justify-content: left;
                                gap: 12px;
                                background-color: #dddddd;
                                border-radius: 6px;
                                padding: 4px;
                                ">

                        ${store.currentMaterialReference === "" ? html`
                            <img style="
                                width: 48px; 
                                height: 48px;
                                opacity: 1.0;
                                cursor: pointer;"
                                src="images/he-icon-addref.png" alt="add reference"
                                @click=${() => store.showBrowseImagesPanel = true}>
                                </img>
                            <span style="
                                font-size: 12px;
                                font-family: system-ui, -apple-system, sans-serif;
                                font-weight: 600;
                                color: #666666;
                                left: 90px;
                                margin-top: 3px;"
                                >Add your own<br>reference images.</span>
                            ` : 
                            html`
                            <div id="reference-container" style="display: flex; align-items: center; gap: 10px;">

                                <img src="images/${store.currentMaterialReference}" alt="reference image"
                                    style="width: 48px; height: 48px; border-radius: 4px; opacity: 1.0; cursor: pointer;"
                                    @click=${() => store.showBrowseImagesPanel = true}>
                                </img>
                                <img src="images/he-icon-close.png" alt="close"
                                    style="margin-left: -25px; margin-top: -26px; width: 14px; height: 14px; opacity: 1.0; cursor: pointer;"
                                    @click=${this.handleRemoveImageReference}>
                                </img>

                                ${store.currentMaterialReference.includes("bobois") ? html`
                                    <sp-thumbnail size="m" @click=${(e: Event) => this.handleMaterialClick(1, e)}>
                                        <img src="images/he-mat2.png" alt="color 1" />
                                    </sp-thumbnail>
                                ` : ""}
                                ${store.currentMaterialReference.includes("green2") ? html`
                                    <sp-thumbnail size="m" @click=${(e: Event) => this.handleMaterialClick(1, e)}>
                                        <img src="images/he-mat4.jpg" width="48px" height="48px" alt="color 1" />
                                    </sp-thumbnail>
                                ` : ""}

                                    

                            </div>
                            `}

                        
                    </div>

                    <div class="prop-color-slider-container">
                        <div class="prop-color-thumbnail-container">
                                <sp-thumbnail size="m" @click=${(e: Event) => this.handleMaterialClick(1, e)}>
                                    <img src="images/he-mat-01.png" alt="eggshell white" />
                                </sp-thumbnail>
                                <sp-thumbnail size="m" @click=${(e: Event) => this.handleMaterialClick(1, e)}>
                                    <img src="images/he-mat-02.png" alt="bubbles orange" />
                                </sp-thumbnail>
                                <sp-thumbnail size="m" @click=${(e: Event) => this.handleMaterialClick(1, e)}>
                                    <img src="images/he-mat-03.png" alt="fluffy white" />
                                </sp-thumbnail>
                                <sp-thumbnail size="m" @click=${(e: Event) => this.handleMaterialClick(1, e)}>
                                    <img src="images/he-mat-04.png" alt="fluffy white" />
                                </sp-thumbnail>
                                <sp-thumbnail size="m" @click=${(e: Event) => this.handleMaterialClick(1, e)}>
                                    <img src="images/he-mat-05.png" alt="fluffy white" />
                                </sp-thumbnail>
                        </div>

                        ` : ""}
                    </div>

                ${(store.typeOfProperty === "material" && store.currentDownShape?.id === "sofa") ? html`
                    <div class="prop-thumbnail-container">
                        <sp-thumbnail size="l" ?focused=${store.materialCouchVisible === 1} @click=${(e: Event) => this.handleMaterialCouchClick(1, e)}>
                            <img src="images/he-mat1.png" alt="eggshell white" />
                        </sp-thumbnail>
                        <sp-thumbnail size="l" ?focused=${store.materialCouchVisible === 2} @click=${(e: Event) => this.handleMaterialCouchClick(2, e)}>
                            <img src="images/he-mat2.png" alt="bubbles orange" />
                        </sp-thumbnail>
                        <sp-thumbnail size="l" ?focused=${store.materialCouchVisible === 3} @click=${(e: Event) => this.handleMaterialCouchClick(3, e)}>
                            <img src="images/he-mat3.png" alt="fluffy white" />
                        </sp-thumbnail>
                    </div>
                    ` : ""}


                    ${(store.typeOfProperty === "replace object") ? html`
                        <div class="prop-thumbnail-container">
                                <sp-thumbnail size="l" ?focused=${store.sofaVisible === 1} @click=${(e: Event) => this.handleReplaceObjectClick(1, e)}>
                                    <img src="images/he-room-sofa.png" alt="eggshell white" />
                                </sp-thumbnail>
                                <sp-thumbnail size="l" ?focused=${store.sofaVisible === 2} @click=${(e: Event) => this.handleReplaceObjectClick(2, e)}>
                                    <img src="images/he-room-orange-sofa.png" alt="bubbles orange" />
                                </sp-thumbnail>
                            </div>
                        ` : ""}


                ${store.typeOfProperty === "age" ? html`
                    <div class="prop-thumbnail-container">
                        <sp-thumbnail size="l" ?focused=${store.personVisible === 1} @click=${(e: Event) => this.handleThumbnailClick(1, e)}>
                            <img src="images/he-person-01.png" alt="person boy" />
                        </sp-thumbnail>
                        <sp-thumbnail size="l" ?focused=${store.personVisible === 2} @click=${(e: Event) => this.handleThumbnailClick(2, e)}>
                            <img src="images/he-person-02.png" alt="person young" />
                        </sp-thumbnail>
                        <sp-thumbnail size="l" ?focused=${store.personVisible === 3} @click=${(e: Event) => this.handleThumbnailClick(3, e)}>
                            <img src="images/he-person-03.png" alt="person old" />
                        </sp-thumbnail>
                    </div>
                    <sp-slider id="age-slider" label="Age" variant="ramp" value="30" style="
                                        position: absolute;
                                        top: 160px;
                                        left: 20px;
                                        width: 230px;
                                        height: auto;"
                                        @input=${this.handleAgeSliderChange}
                                        @change=${this.handleAgeSliderChange}></sp-slider>
                    ` : ""}

                <div class="prop-header" @pointerdown=${this.onContainerDragStart} style="cursor: move;">

                    <div style="position: absolute;
                                        top: 2px;
                                        left: 0px;
                                        width: 32px;
                                        height: 32px;
                                        z-index: 99;
                                        background-color: #ff9d00;
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;">
                        <sp-icon-drag-handle slot="icon"></sp-icon-drag-handle>
                    </div>
                    <div class="prop-header-label-container">
                        <span class="prop-header-label">${store.currentObject}</span>
                        <sp-icon-chevron-right class="prop-header-icon" size="l"></sp-icon-chevron-right>
                        <span class="prop-header-label">${store.currentProperty}</span>
                    </div>

                </div>


                <!--
                <img src="images/he-icon-eyedrop.png" alt="background" 
                        style="position: absolute; 
                                top: -20px; 
                                left: 278px; 
                                width: 40px; 
                                height: 40px; 
                                z-index: 99;
                                cursor: pointer;"
                        @click=${this.handleEyedropperClick}>
                -->


                        <div style="position: absolute;
                                        top: -18px;
                                        left: 270px;
                                        width: 32px;
                                        height: 32px;
                                        z-index: 99;
                                        cursor: pointer;
                                        background-color: #ff9d00;
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;"
                                @click=${this.handleClosePanelClick}>
                            <sp-icon-close slot="icon"></sp-icon-close>
                        </div>
                
            </div>
        `;
    }
    
    private handleClosePanelClick = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        store.HeliosPropertiesVisibility = false;
        store.contextMenuVisibility = false;
    }

    private handleRemoveImageReference = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        switch (store.typeOfProperty) {
            case "color":
                store.currentColorReference = "";
                break;
            case "material":
                store.currentMaterialReference = "";
                break;
            default:
                break;
        }

    }

    // Container dragging methods
    private onContainerDragStart = (e: PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        this.isContainerDragging = true;
        this.containerDragStart = { x: e.clientX, y: e.clientY };
        
        // Get current position from store
        this.containerInitialPosition = { 
            x: store.posContextMenu.x, 
            y: store.posContextMenu.y 
        };
        
        // Add global event listeners
        document.addEventListener('pointermove', this.onContainerDragMove);
        document.addEventListener('pointerup', this.onContainerDragEnd);
    };

    private onContainerDragMove = (e: PointerEvent) => {
        if (!this.isContainerDragging) return;
        
        const deltaX = e.clientX - this.containerDragStart.x;
        const deltaY = e.clientY - this.containerDragStart.y;
        
        // Update store position
        store.posContextMenu.x = this.containerInitialPosition.x + deltaX;
        store.posContextMenu.y = this.containerInitialPosition.y + deltaY;
    };

    private onContainerDragEnd = () => {
        if (!this.isContainerDragging) return;
        
        this.isContainerDragging = false;
        
        // Remove global event listeners
        document.removeEventListener('pointermove', this.onContainerDragMove);
        document.removeEventListener('pointerup', this.onContainerDragEnd);
    };

    private handlePromptInputChange = () => {
        //const input = e.target as HTMLInputElement;
        //const value = input.value;
        
        // if (value.toLowerCase().includes("pantone")) {
        //     this.isPantone = true;
        // } else {
        //     this.isPantone = false;
        // }
        
        // Add your prompt input change logic here
        // For example, you could:
        // - Update store properties based on the input
        // - Trigger search or AI processing
        // - Validate the input
        // - Update UI state
        
        // Example: Update a store property
        // store.currentPrompt = value;
    }

    private handleEyedropperClick = (e: Event) => {
        
        e.stopPropagation();
        e.preventDefault();

        store.HeliosPropertiesVisibility = false;
        store.contextMenuVisibility = false;

        store.targetEyedropper = store.currentDownShape?.id ?? "";

        store.showContextMenu = false;
        store.clearSelectedShapes();

        // Hide the cursor globally
        document.body.style.cursor = 'none';
        
        // Create a floating eyedropper icon that follows the mouse
        this.createFloatingEyedropper(e as MouseEvent);
        
        // Add mouse move listener to track mouse position
        document.addEventListener('mousemove', this.handleMouseMove);
        
        // Add click listener to stop eyedropper mode
        this.eyedropperClickHandler = () => this.stopEyedropperMode();
        document.addEventListener('click', this.eyedropperClickHandler);


    }


    private floatingEyedropper: HTMLImageElement | null = null;
    private floatingDiv: HTMLDivElement | null = null;
    private circleDiv: HTMLDivElement | null = null;
    private loupeImg: HTMLImageElement | null = null;
    private eyedropperClickHandler: ((e: MouseEvent) => void) | null = null;
    
    private createFloatingEyedropper = (e: MouseEvent) => {
        // Remove existing floating elements if any
        if (this.floatingEyedropper) {
            this.floatingEyedropper.remove();
        }
        if (this.floatingDiv) {
            this.floatingDiv.remove();
        }

        // Create the original floating eyedropper image
        this.floatingEyedropper = document.createElement('img');
        this.floatingEyedropper.src = 'images/he-cursor-eyedrop.gif';
        this.floatingEyedropper.style.position = 'fixed';
        this.floatingEyedropper.style.width = '37px';
        this.floatingEyedropper.style.height = '37px';
        this.floatingEyedropper.style.pointerEvents = 'none';
        this.floatingEyedropper.style.zIndex = '10000'; // Higher than the div
        this.floatingEyedropper.style.transform = 'translate(-18.5px, -18.5px) scale(1.25)'; // Center the icon on cursor
        this.floatingEyedropper.style.filter = 'drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.6))';
        
        // Create the floating div container with loupe design
        this.floatingDiv = document.createElement('div');
        this.floatingDiv.style.position = 'fixed';
        this.floatingDiv.style.display = 'flex';
        this.floatingDiv.style.flexDirection = 'column';
        this.floatingDiv.style.alignItems = 'center';
        this.floatingDiv.style.justifyContent = 'center';
        this.floatingDiv.style.width = '300px';
        this.floatingDiv.style.height = '89px';
        this.floatingDiv.style.pointerEvents = 'none';
        this.floatingDiv.style.zIndex = '9995'; // Higher than the eyedropper
        this.floatingDiv.style.transform = 'translate(-150px, -100px)'; // Center the div on cursor

        
        // Create circle background div that can be filled with color or image
        this.circleDiv = document.createElement('div');
        this.circleDiv.style.position = 'absolute';
        this.circleDiv.style.width = '63px';
        this.circleDiv.style.height = '63px';
        this.circleDiv.style.borderRadius = '50%';
        this.circleDiv.style.top = '3px';
        this.circleDiv.style.left = '50%';
        this.circleDiv.style.transform = 'translateX(-50%) scale(0)';
        this.circleDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        this.circleDiv.style.opacity = '0';
        this.circleDiv.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
        this.circleDiv.style.transformOrigin = 'center bottom';
        // Default to a solid color - can be changed to backgroundImage for images
        this.circleDiv.style.backgroundColor = store.loupeColor;
        this.circleDiv.style.backgroundImage = 'url(' + store.loupeImg + ')';
        this.circleDiv.style.backgroundSize = 'cover';
        this.circleDiv.style.backgroundPosition = 'center';

         // Create the loupe image
         this.loupeImg = document.createElement('img');
         this.loupeImg.src = 'images/he-loupe.png';
         this.loupeImg.style.width = '67px';
         this.loupeImg.style.height = '89px';
         this.loupeImg.style.position = 'absolute';
         this.loupeImg.style.top = '0';
         this.loupeImg.style.left = '50%';
         this.loupeImg.style.transform = 'translateX(-50%) scale(0)';
         this.loupeImg.style.opacity = '0';
         this.loupeImg.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
         this.loupeImg.style.transformOrigin = 'center bottom';
         this.loupeImg.style.filter = 'drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.6))';

         // Create the stroke text span
        const strokeSpan = document.createElement('span');
        strokeSpan.textContent = store.currentProperty;
        strokeSpan.style.position = 'absolute';
        strokeSpan.style.top = '71px';
        strokeSpan.style.left = '50%';
        strokeSpan.style.transform = 'translateX(-50%)';
        strokeSpan.style.color = '#ffffff';
        strokeSpan.style.fontWeight = 'bold';
        strokeSpan.style.webkitTextStroke = '4px #ff9d00';
        strokeSpan.style.fontSize = '13px';
        strokeSpan.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        (strokeSpan.style as any).textStroke = '2px #ff9d00';
        strokeSpan.style.filter = 'drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.6))';
        
        // Create the white text span
        const whiteSpan = document.createElement('span');
        whiteSpan.textContent = store.currentProperty;
        whiteSpan.style.position = 'absolute';
        whiteSpan.style.top = '71px';
        whiteSpan.style.left = '50%';
        whiteSpan.style.transform = 'translateX(-50%)';
        whiteSpan.style.color = '#ffffff';
        whiteSpan.style.fontSize = '13px';
        whiteSpan.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        whiteSpan.style.fontWeight = 'bold';
        
        // Append elements to the div
        this.floatingDiv.appendChild(this.circleDiv);
        this.floatingDiv.appendChild(this.loupeImg);
        this.floatingDiv.appendChild(strokeSpan);
        this.floatingDiv.appendChild(whiteSpan);

       
        
        // Add both elements to document body
        document.body.appendChild(this.floatingDiv);
        document.body.appendChild(this.floatingEyedropper);

        window.addEventListener("keydown", this.handleEscape);
        

        // Position both elements at cursor
        if (this.floatingDiv) {
            this.floatingDiv.style.left = `${e.clientX}px`;
            this.floatingDiv.style.top = `${e.clientY}px`;
        }
        if (this.floatingEyedropper) {
            this.floatingEyedropper.style.left = `${e.clientX}px`;
            this.floatingEyedropper.style.top = `${e.clientY}px`;
        }
    }
    
    private handleMouseMove = (e: MouseEvent) => {
        if (this.floatingEyedropper) {
            this.floatingEyedropper.style.left = `${e.clientX}px`;
            this.floatingEyedropper.style.top = `${e.clientY}px`;
        }
        if (this.floatingDiv) {
            this.floatingDiv.style.left = `${e.clientX}px`;
            this.floatingDiv.style.top = `${e.clientY}px`;
        }
        // Update loupe visibility based on store property
        this.updateLoupeVisibility();
    }

    private updateLoupeVisibility = () => {
        const isVisible = store.showLoupe;
        
        if (this.circleDiv) {
            // Update the background color reactively
            this.circleDiv.style.backgroundColor = store.loupeColor;
            this.circleDiv.style.backgroundImage = 'url(' + store.loupeImg + ')';
            this.circleDiv.style.backgroundSize = 'cover';
            this.circleDiv.style.backgroundPosition = 'center';
            
            if (isVisible) {
                this.circleDiv.style.opacity = '1';
                this.circleDiv.style.transform = 'translateX(-50%) scale(1)';
            } else {
                this.circleDiv.style.opacity = '0';
                this.circleDiv.style.transform = 'translateX(-50%) scale(0)';
            }
        }
        
        if (this.loupeImg) {
            if (isVisible) {
                this.loupeImg.style.opacity = '1';
                this.loupeImg.style.transform = 'translateX(-50%) scale(1)';
            } else {
                this.loupeImg.style.opacity = '0';
                this.loupeImg.style.transform = 'translateX(-50%) scale(0)';
            }
        }
    }
    
    private stopEyedropperMode = () => {
        // Restore normal cursor
        document.body.style.cursor = '';

        window.removeEventListener("keydown", this.handleEscape);

        store.doEyedropping();

        // Remove floating elements
        if (this.floatingEyedropper) {
            this.floatingEyedropper.remove();
            this.floatingEyedropper = null;
        }
        if (this.floatingDiv) {
            this.floatingDiv.remove();
            this.floatingDiv = null;
        }
        // Clear references to child elements
        this.circleDiv = null;
        this.loupeImg = null;
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        if (this.eyedropperClickHandler) {
            document.removeEventListener('click', this.eyedropperClickHandler);
            this.eyedropperClickHandler = null;
        }
        

    }

    private handleColorWheelChange = (event: Event) => {

        const target = event.target as any;
        
        // Log everything to see what's available
        console.log('Full event object:', event);
        console.log('Target object:', target);
        console.log('Target properties:', {
            value: target.value,
            color: target.color,
            hue: target.hue,
            saturation: target.saturation,
            lightness: target.lightness,
            hex: target.hex,
            rgb: target.rgb,
            hsl: target.hsl
        });
        console.log('Event detail:', (event as any).detail);
        
        // For sp-color-slider with format="hex", the color should be in target.color
        let color = target.color;
        
        // If color is still "No color format applied", try other properties
        if (!color || color === "No color format applied.") {
            color = target.hex || 
                   target.value ||
                   target.rgb ||
                   target.hsl ||
                   (event as any).detail?.value ||
                   (event as any).detail?.color ||
                   (event as any).detail?.hex;
        }
        
        console.log('Final color value:', color);

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

    private handleColorTileClick = (event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        let color = "";

        const wallBackColor = store.shapes.find(shape => shape.id === "wall-back-color") as Shape;
        const wallBack2 = store.shapes.find(shape => shape.id === "wall-back2") as Shape;
        const wallBack3 = store.shapes.find(shape => shape.id === "wall-back3") as Shape;
        const wallBack4 = store.shapes.find(shape => shape.id === "wall-back4") as Shape;
        wallBack2.visible = false;
        wallBack3.visible = false;
        wallBack4.visible = false;
        wallBackColor.visible = true;

        const colorTile = event.target as HTMLElement;
        if (colorTile) {
            // Method 1: Get the CSS custom property value
            const customPropertyValue = colorTile.style.getPropertyValue('--tile-color');
            
            // Method 2: Get the computed background-color (the actual rendered color)
            const computedStyle = window.getComputedStyle(colorTile);
            const computedBackgroundColor = computedStyle.backgroundColor;
            
            // Use the custom property value if available, otherwise use computed style
            color = customPropertyValue || computedBackgroundColor;
        }

        console.log("Color tile clicked: ", color);

        const colorSlider = this.shadowRoot?.querySelector("#color-slider") as any;
        if (colorSlider) {
            colorSlider.color = color;
        }
        const colorArea = this.shadowRoot?.querySelector("#color-area") as any;
        if (colorArea) {
            colorArea.color = color;
        }
        
        if ((store.currentDownShape?.id === "wall-back") ||
            (store.currentDownShape?.id === "wall-back2") ||
            (store.currentDownShape?.id === "wall-back3") ||
            (store.currentDownShape?.id === "wall-back4")) {
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

    }

    private handleColorClick = (thumbnailNumber: number, event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        let color = "";

        const wallBackColor = store.shapes.find(shape => shape.id === "wall-back-color") as Shape;
        const wallBack2 = store.shapes.find(shape => shape.id === "wall-back2") as Shape;
        const wallBack3 = store.shapes.find(shape => shape.id === "wall-back3") as Shape;
        const wallBack4 = store.shapes.find(shape => shape.id === "wall-back4") as Shape;
        wallBack2.visible = false;
        wallBack3.visible = false;
        wallBack4.visible = false;
        wallBackColor.visible = true;

        switch (thumbnailNumber) {
            case 1:
                color = "#C0BEB9";
                break;
            case 2:
                color = "#989188";
                break;
            case 3:
                color = "#85613E";
                break;
            case 4:
                color = "#40515E";
                break;
            case 5:
                color = "#6F8DAC";
                break;
        }

        const colorSlider = this.shadowRoot?.querySelector("#color-slider") as any;
        if (colorSlider) {
            colorSlider.color = color;
        }
        const colorArea = this.shadowRoot?.querySelector("#color-area") as any;
        if (colorArea) {
            colorArea.color = color;
        }
        
        if ((store.currentDownShape?.id === "wall-back") ||
            (store.currentDownShape?.id === "wall-back2") ||
            (store.currentDownShape?.id === "wall-back3") ||
            (store.currentDownShape?.id === "wall-back4")) {
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


    }

    // private handlePantoneClick = (thumbnailNumber: number, event: Event) => {
    //     event.stopPropagation();
    //     event.preventDefault();

    //     let color = "";

    //     switch (thumbnailNumber) {
    //         case 1:
    //             color = "#a47864";
    //             break;
    //         case 2:
    //             color = "#ffbe98";
    //             break;
    //         case 3:
    //             color = "#bb2649";
    //             break;
    //     }
        
    //     if (store.currentDownShape?.id === "wall-back") {
    //         const wallColor = store.shapes.find(shape => shape.id === "wall-back-color") as Shape;
    //         if (color && wallColor) {
    //             wallColor.fill = color;
    //         }
    //     }
    //     if (store.currentDownShape?.id === "ceiling") {
    //         const ceilingColor = store.shapes.find(shape => shape.id === "ceiling-color") as Shape;
    //         if (color && ceilingColor) {
    //             ceilingColor.fill = color;
    //         }
    //     }


    // }


    private handleReplaceObjectClick = (thumbnailNumber: number, event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        const clickedThumbnail = this.shadowRoot?.querySelector(`sp-thumbnail:nth-child(${thumbnailNumber})`);
        if (clickedThumbnail) {
            clickedThumbnail.setAttribute('focused', '');
        }
        
        const artwork1 = store.shapes.find(shape => shape.id === "artwork1") as Photo;
        const sofa = store.shapes.find(shape => shape.id === "sofa") as Shape;
        const sofa2 = store.shapes.find(shape => shape.id === "sofa2") as Shape;
        const sofaMaterial = store.shapes.find(shape => shape.id === "sofa-material") as Shape;
        
        // Example: Update store or trigger specific actions based on thumbnail
        switch (thumbnailNumber) {
            case 1:
                store.sofaVisible = 1;
                sofa.visible = true;
                sofa2.visible = false;
                break;
            case 2:
                store.sofaVisible = 2;
                if (sofaMaterial) {
                    sofaMaterial.visible = false;
                }
                if (sofa) {
                    sofa.visible = false;
                }
                if (sofa2) {
                    sofa2.visible = true;
                    sofa2.x = artwork1.x + 620;
                    sofa2.y = artwork1.y + 670;
                }
                break;
            case 3:
                store.sofaVisible = 3;

                break;
        }

        store.selectedShapes = [];
        store.currentOverShape = undefined;
        store.lastSelectedShapes = store.selectedShapes;
        store.isMarquee = false;
        store.currentConnections = [];
        store.currentShapes = [];
        store.currentDownShape = undefined;
        store.isDragging = false;
        store.clearSelectedShapes();
        store.shapes.map((shape) => {
            shape.isSelected = false;
            shape.isHovered = false;
          });
        this.editor.requestUpdate();
        
        return thumbnailNumber;
    }



    private handleMaterialClick = (thumbnailNumber: number, event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        const clickedThumbnail = this.shadowRoot?.querySelector(`sp-thumbnail:nth-child(${thumbnailNumber})`);
        if (clickedThumbnail) {
            clickedThumbnail.setAttribute('focused', '');
        }
        
        const artwork1 = store.shapes.find(shape => shape.id === "artwork1") as Photo;
        const wallBack2 = store.shapes.find(shape => shape.id === "wall-back2") as Shape;
        const wallBack3 = store.shapes.find(shape => shape.id === "wall-back3") as Shape;
        const wallBack4 = store.shapes.find(shape => shape.id === "wall-back4") as Shape;

        if (store.currentMaterialReference.includes("bobois")) {
//            store.materialVisible = 1;
                if (wallBack2) {
                    wallBack2.visible = true;
                    wallBack2.x = artwork1.x;
                    wallBack2.y = artwork1.y;
                }
                if (wallBack3) {
                    wallBack3.visible = false;
                }
                if (wallBack4) {
                    wallBack4.visible = false;
                }
        }
        if (store.currentMaterialReference.includes("green2")) {
            //store.materialVisible = 2;
            if (wallBack4) {
                wallBack4.visible = true;
                wallBack4.x = artwork1.x;
                wallBack4.y = artwork1.y;
            }
            if (wallBack2) {
                wallBack2.visible = false;
            }
            if (wallBack3) {
                wallBack3.visible = false;
            }
        }
        
        // Example: Update store or trigger specific actions based on thumbnail
        // switch (thumbnailNumber) {
        //     case 1:
        //         store.materialVisible = 1;
        //         if (wallBack2) {
        //             wallBack2.visible = false;
        //         }
        //         if (wallBack3) {
        //             wallBack3.visible = false;
        //         }
        //         break;
        //     case 2:
                
        //         break;
        //     case 3:
        //         store.materialVisible = 3;
        //         if (wallBack2) {
        //             wallBack2.visible = false;
        //         }
        //         if (wallBack3) {
        //             wallBack3.visible = true;
        //             wallBack3.x = artwork1.x;
        //             wallBack3.y = artwork1.y;
        //         }
        //         break;
        // }

        //store.selectedShapes = [];
        // store.currentOverShape = undefined;
        // store.lastSelectedShapes = store.selectedShapes;
        // store.isMarquee = false;
        // store.currentConnections = [];
        // store.currentShapes = [];
        // store.currentDownShape = undefined;
        // store.isDragging = false;
        // store.clearSelectedShapes();
        // store.shapes.map((shape) => {
        //     shape.isSelected = false;
        //     shape.isHovered = false;
        //   });
        //this.editor.requestUpdate();
        
        return thumbnailNumber;
    }

    private handleMaterialCouchClick = (thumbnailNumber: number, event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        const clickedThumbnail = this.shadowRoot?.querySelector(`sp-thumbnail:nth-child(${thumbnailNumber})`);
        if (clickedThumbnail) {
            clickedThumbnail.setAttribute('focused', '');
        }
        
        const artwork1 = store.shapes.find(shape => shape.id === "artwork1") as Photo;
        const sofa = store.shapes.find(shape => shape.id === "sofa") as Shape;
        const sofaMaterial = store.shapes.find(shape => shape.id === "sofa-material") as Shape;
        
        // Example: Update store or trigger specific actions based on thumbnail
        switch (thumbnailNumber) {
            case 1:
                store.materialCouchVisible = 1;
                if (sofa) {
                    sofa.visible = true;
                    sofa.x = sofa.x + 1000;
                }
                if (sofaMaterial) {
                    sofaMaterial.visible = false;
                }
                break;
            case 2:
                store.materialCouchVisible = 2;
                if (sofa) {
                    sofa.visible = false;
                }
                if (sofaMaterial) {
                    sofaMaterial.visible = true;
                    sofaMaterial.x = artwork1.x + 620;
                    sofaMaterial.y = artwork1.y + 610;
                }
                break;
            case 3:
                store.materialCouchVisible = 3;
                
                break;
        }

        store.selectedShapes = [];
        store.currentOverShape = undefined;
        store.lastSelectedShapes = store.selectedShapes;
        store.isMarquee = false;
        store.currentConnections = [];
        store.currentShapes = [];
        store.currentDownShape = undefined;
        store.isDragging = false;
        store.clearSelectedShapes();
        store.shapes.map((shape) => {
            shape.isSelected = false;
            shape.isHovered = false;
          });
        this.editor.requestUpdate();
        
        return thumbnailNumber;
    }


    private handleThumbnailClick = (thumbnailNumber: number, event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        // Check if event was triggered by click or slider value changed
        const isClickEvent = event.type === 'click' || event instanceof MouseEvent || event instanceof PointerEvent;
        const isSliderEvent = event.type === 'input' || event.type === 'change';
        
        console.log('Event triggered by:', isClickEvent ? 'Click' : isSliderEvent ? 'Slider' : 'Other', 'Event type:', event.type);

        const clickedThumbnail = this.shadowRoot?.querySelector(`sp-thumbnail:nth-child(${thumbnailNumber})`);
        const ageSlider = this.shadowRoot?.querySelector("#age-slider") as any;
        if (clickedThumbnail) {
            clickedThumbnail.setAttribute('focused', '');
        }

        
        
        const boy = store.shapes.find(shape => shape.id === "person-boy") as Shape;
        const man = store.shapes.find(shape => shape.id === "person-man") as Shape;
        const old = store.shapes.find(shape => shape.id === "person-old") as Shape;
        
        // Example: Update store or trigger specific actions based on thumbnail
        switch (thumbnailNumber) {
            case 1:
                store.personVisible = 1;
                if (boy) {
                    boy.visible = true;
                    man.visible = false;
                    old.visible = false;
                }
                if (ageSlider && isClickEvent) {
                    ageSlider.value = 10;
                }
                break;
            case 2:
                store.personVisible = 2;
                if (man) {
                    man.visible = true;
                    boy.visible = false;
                    old.visible = false;
                }
                if (ageSlider && isClickEvent) {
                    ageSlider.value = 30;
                }
                break;
            case 3:
                store.personVisible = 3;
                if (old) {
                    old.visible = true;
                    boy.visible = false;
                    man.visible = false;
                }
                if (ageSlider && isClickEvent) {
                    ageSlider.value = 80;
                }
                break;
        }

        // store.selectedShapes = [];
        // store.currentOverShape = undefined;
        // store.lastSelectedShapes = store.selectedShapes;
        // store.isMarquee = false;
        // store.currentConnections = [];
        // store.currentShapes = [];
        // store.currentDownShape = undefined;
        // store.isDragging = false;
        // store.clearSelectedShapes();
        // store.shapes.map((shape) => {
        //     shape.isSelected = false;
        //     shape.isHovered = false;
        //   });
        // this.editor.requestUpdate();
        
        return thumbnailNumber;
    }

    private handleAgeSliderChange = (event: Event) => {
        const slider = event.target as any;
        const ageValue = slider.value;
        
        if (ageValue >= 80) {
            this.handleThumbnailClick(3, event);
        } else if (ageValue >= 30) {
            this.handleThumbnailClick(2, event);
        } else {
            this.handleThumbnailClick(1, event);
        }
        
        this.editor.requestUpdate();
        
        // You can add specific logic here based on the age value
        // For example, update store properties or modify shapes based on age
        
        // Example: Update a store property if it exists
        // store.currentAge = ageValue;
        
        // Example: Modify person shapes based on age
        // const person = store.shapes.find(shape => shape.id.includes("person"));
        // if (person) {
        //     // Apply age-related changes to the person shape
        // }
    };
    
    
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-helios-properties": HeliosProperties;
    }
}
