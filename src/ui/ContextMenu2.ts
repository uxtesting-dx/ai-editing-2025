import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/action-group/sp-action-group.js";
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/color-wheel/sp-color-wheel.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-close.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-chevron-right.js";

import { MobxLitElement }   from "@adobe/lit-mobx";
import { css, html }        from "lit";
import { customElement }    from "lit/decorators.js";

import { Shape } from "../store/Shape.js";
import { Photo } from "../store/Photo.js";
import { store } from "../store/Store.js";

// Interface for item styling information
interface ItemStyle {
    xOffset: number;
    opacity: number;
    scale: number;
    borderRadius: string;
    hideText: boolean;
}

@customElement("app-context-menu2")
export class ContextMenu2 extends MobxLitElement {
    static styles = css`
        :host {
            display: block;
            width: 100px;
            height: 40px;
            position: absolute;
        }

        .menu-container {
            position: absolute;
            display: flex;
            flex-direction: column;
            flex-flow: column;
            justify-content: flex-start;
            width: 200px;
            height: auto;
            padding: 12px;
            background: rgba(255, 255, 255, 1.0);
            border-radius: 8px;
        }

        .menu-item {
            display: flex;
            height: 28px;
            width: auto;
            min-width: 28px;
            border-radius: 4px;
            border-width: 0px;
            padding: 0 14px;
            margin-right: 8px;
            pointer-events: none;
        }

        .menu-item-selected-gradient {
            display: block;
            background: #5259D6;
            color: #fff;
            border-radius: 6px;
            pointer-events: none;
            padding: 2px;
            margin-bottom: 1px;
            pointer-events: none;
        }

        .menu-item-trail {
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

        .menu-item-selected {
            display: flex;
            height: 28px;
            width: auto;
            min-width: 28px;
            border-radius: 22px;
            border-image-slice: 1;
            border-image-source: linear-gradient(45deg, #973c4f, #dc7b6d, #9be2d0, #927cc1);
            border-width: 0px;
            background-color: rgba(255, 255, 255, 1.0);
            padding: 0 14px;
            margin-right: 8px;
            margin-left: 3px;
            margin-top: -31px;
            pointer-events: none;
            font-weight: 900;
        }

        .breadcrumb-children {
            display: flex;
            height: 28px;
            width: auto;
            min-width: 28px;
            border-radius: 22px;
            border-color: "gray";
            border-width: 1px;
            border-style: solid;
            padding: 0 14px;
            margin-right: 5px;
            margin-top: 2px;
            margin-left: 2px;
            pointer-events: none;
        }

        .menu-item-container-selected {
            opacity: 1.0;
        }

        .menu-item-container {
            background: #fff;
            border-radius: 4px;
            opacity: 0.8;
        }

        .menu-item-container:hover  {
            background: #e5e5e5;
            color: #2b2b2b;
            opacity: 1.0;
        }

        .menu-label {
            justify-content: center;
            margin-top:3px;
            width: auto;
            pointer-events: none;
        }

        .menu-title {
            font-size: 11px;
            font-weight: 900;
            color: #aaa;
            margin-top:2px;
            margin-left: 4px;
            margin-bottom: 8px;
        }

        .empty {
            pointer-events: none;
        }

        .hidden {
            display: none;
        }

        .white-icon {
            color: white;
            --spectrum-icon-color: white;
        }

        @keyframes expandWidth {
            from {
                width: 0px;
            }
            to {
                width: 110px;
            }
        }

        /* Custom scrollbar styling for property-items-container */
        #property-items-container::-webkit-scrollbar {
            width: 8px;
        }

        #property-items-container::-webkit-scrollbar-track {
            
            border-radius: 8px;
        }

        #property-items-container::-webkit-scrollbar-track::before {
            
        }

        #property-items-container::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 4px;
            min-height: 10px;
            max-height: 10px;
            border-color: #00000070;
            border-style: solid;
            border-width: 1.5px;
            border-color: #00000070;
            height: 10px !important;
        }

        #property-items-container::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.8);
        }
    `;

    //private actionShapes: Array<Shape | Photo> = [];
    private isDragging = false;
    private dragStartPosition = { x: 0, y: 0 };
    private currentMousePosition = { x: 0, y: 0 };
    private showDragLine = false;
    //private dragFromPosition: 'left' | 'right' = 'right';
    private currentScrollTop = 0;
    
    // Circle dragging properties for scroll control
    private isCircleDragging = false;
    private circleDragStartY = 0;
    private initialScrollTop = 0;
    
    private originalConnections: Array<string> = [];
    private isFiltering = false;
    
    // Lifecycle methods
    protected override firstUpdated(): void {
        //super.firstUpdated();
        // Add document-level wheel event listener
        document.addEventListener('wheel', this.handleDocumentWheel, { passive: false });
        
        // Add scroll listener to the property-items-container
        const container = this.shadowRoot?.querySelector('#property-items-container') as HTMLElement;
        if (container) {
            container.addEventListener('scroll', this.handleContainerScroll);
        }
    }
    
    public override connectedCallback(): void {
        super.connectedCallback();
        // Add document-level wheel event listener if component is reconnected
        document.addEventListener('wheel', this.handleDocumentWheel, { passive: false });
        
        // Add scroll listener to the property-items-container if component is reconnected
        const container = this.shadowRoot?.querySelector('#property-items-container') as HTMLElement;
        if (container) {
            container.addEventListener('scroll', this.handleContainerScroll);
        }
    }
    
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        // Remove document-level wheel event listener
        document.removeEventListener('wheel', this.handleDocumentWheel);
        
        // Remove scroll listener from the property-items-container
        const container = this.shadowRoot?.querySelector('#property-items-container') as HTMLElement;
        if (container) {
            container.removeEventListener('scroll', this.handleContainerScroll);
        }
    }
    
    // Public method that Editor can call to control scrolling
    public setScrollTop = (scrollTop: number) => {
        const container = this.shadowRoot?.querySelector('#property-items-container') as HTMLElement;
        if (container) {
            // Ensure scroll value is divisible by item height (40px) for proper alignment
            const itemHeight = 40;
            const quantizedScrollTop = Math.round(scrollTop / itemHeight) * itemHeight;
            
            container.scrollTo({ top: quantizedScrollTop, behavior: 'smooth' });
            this.currentScrollTop = quantizedScrollTop;
            
            // Trigger re-render to update circle position and arc arrangement
            this.requestUpdate();
        }
    };

    // Public method to get current scroll position
    public getScrollTop = (): number => {
        const container = this.shadowRoot?.querySelector('#property-items-container') as HTMLElement;
        return container?.scrollTop || this.currentScrollTop || 0;
    };

    // Public method to scroll by a relative amount
    public scrollByAmount(deltaY: number): void {
        const currentScroll = this.getScrollTop();
        if (currentScroll + deltaY > -1) {
            this.setScrollTop(currentScroll + deltaY);
        }
    }

    // Shared method to calculate item offset and styling based on scroll position and index
    private calculateItemOffset(index: number, scrollTop: number = this.currentScrollTop): ItemStyle {
        // Calculate virtual position based on scroll
        const itemHeight = 24 + 14; // Approximate height including gap
        const containerHeight = 290; // Container height
        const visibleItems = containerHeight / itemHeight; // 10 items visible
        const scrollOffset = Math.floor(scrollTop / itemHeight);
        const virtualIndex = index - scrollOffset;
        
        // Calculate arc offset based on distance from center
        //const centerPosition = (visibleItems - 1) / 2; // Center of visible area (5.0 for 10 items)
        // const distanceFromCenter = Math.abs(virtualIndex - centerPosition); // Currently unused

        // Default styling
        let xOffset = 16;
        let opacity = 1;
        let scale = 1;
        let borderRadius = '4px';
        let hideText = false;

        // Check if item is exiting the bottom of the container
        const bottomThreshold = visibleItems - 1; // Items beyond this are exiting bottom
        
        console.log('virtualIndex:', (virtualIndex - 1) , ' scrollTop:', scrollTop / itemHeight);

        if ((virtualIndex - 1) < 1) {
            scale = 0.3;
            opacity = 1.0;
            borderRadius = '16px';
            hideText = true;
        }

        if (virtualIndex > bottomThreshold) {
            // Item is exiting bottom - animate to circle
            const exitProgress = Math.min((virtualIndex - bottomThreshold) / 2, 1); // Progress from 0 to 1
            
            // Animate to circle
            scale = 1 - (exitProgress * 0.7); // Shrink to 50% size
            opacity = 1; // - (exitProgress * 0.85); // Fade to 30% opacity
            borderRadius = `${4 + (exitProgress * 46)}px`; // Animate from 4px to 50px (circle)
            hideText = exitProgress > 0.3; // Hide text when 30% through animation
            
            // Move item toward center as it becomes a circle
            xOffset = 16 + (exitProgress * 20);
        }

        return {
            xOffset,
            opacity,
            scale,
            borderRadius,
            hideText
        };
    }

    // Scroll event handler for property-items-container
    private handleContainerScroll = (event: Event): void => {
        const container = event.target as HTMLElement;
        if (container && container.id === 'property-items-container') {
            this.currentScrollTop = container.scrollTop;
            
            // Update styling for all visible items
            const items = this.shadowRoot?.querySelectorAll('#property-items-container > div');
            if (items) {
                items.forEach((item, index) => {
                    const htmlItem = item as HTMLElement;
                    const itemStyle = this.calculateItemOffset(index);

                    // Apply all styling properties
                    htmlItem.style.transform = `translateX(${itemStyle.xOffset}px) scale(${itemStyle.scale})`;
                    htmlItem.style.opacity = itemStyle.opacity.toString();
                    htmlItem.style.borderRadius = itemStyle.borderRadius;
                    
                    // Hide/show text content
                    const textElements = htmlItem.querySelectorAll('span, div:not([style*="background"])');
                    textElements.forEach(textEl => {
                        (textEl as HTMLElement).style.opacity = itemStyle.hideText ? '0' : '1';
                    });
                });
            }
            
            // Optional: Add any additional scroll handling logic here
        }
    }

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
        if (store.showPromptInput) {
            store.showPromptInput = false;
            // Restore original connections if filtering
            if (this.originalConnections.length > 0) {
                store.currentConnections = this.originalConnections;
                this.originalConnections = [];
                this.isFiltering = false;
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




    private onCircleMouseMove = (e: MouseEvent) => {
        if (!this.isCircleDragging) return;
        
        e.preventDefault();
        
        // Calculate vertical movement
        const deltaY = e.clientY - this.circleDragStartY;
        
        // Calculate dynamic scroll sensitivity based on circle movement range
        const itemHeight = 20;
        const containerHeight = 300; // Fixed container height
        const totalItems = store.currentConnections.length;
        const maxScrollTop = Math.max(0, (totalItems * 1.8 * itemHeight) - containerHeight);

      
        // Circle moves along an arc with radius 200px, so the vertical range is roughly 400px
        const circleVerticalRange = 400; // Approximate vertical range of circle movement
        const scrollSensitivity = maxScrollTop > 0 ? maxScrollTop / circleVerticalRange : 0;
        
        const newScrollTop = this.initialScrollTop + (deltaY * scrollSensitivity);
        
        // Ensure scroll value is divisible by item height (40px)
        const quantizedScrollTop = Math.round(newScrollTop / itemHeight) * itemHeight;
        
        // Calculate maximum scroll based on number of items (reuse values from above)
        // maxScrollTop is already calculated above
        
        // Ensure scroll doesn't go negative or exceed maximum
        let finalScrollTop = Math.max(0, Math.min(quantizedScrollTop, maxScrollTop));

        if (finalScrollTop > ((totalItems - 5) * itemHeight)) {
            finalScrollTop = ((totalItems - 5) * itemHeight);
        }
        
        // Apply scroll to container
        const container = this.shadowRoot?.querySelector('#property-items-container') as HTMLElement;
        if (container) {
            container.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
            this.currentScrollTop = finalScrollTop;
        }
        
        // Trigger re-render to update circle position
        this.requestUpdate();
    };

    private onCircleMouseUp = () => {
        if (!this.isCircleDragging) return;
        
        this.isCircleDragging = false;
        
        // Remove global event listeners
        document.removeEventListener('mousemove', this.onCircleMouseMove);
        document.removeEventListener('mouseup', this.onCircleMouseUp);
    };

    protected override render() {
        // TODO: Instead of using <input type="color">, we could create a Spectrum-styled color
        // picker from <sp-color-area> and <sp-color-slider>.
        // See https://opensource.adobe.com/spectrum-web-components/components/color-area/
        // and https://opensource.adobe.com/spectrum-web-components/components/color-slider/.

        //const { selectedShapes } = store;
        //const disabled = selectedShapes === undefined;
        return html`
            <div style="position: relative; 
                display: inline-block;
                overflow-x: visible;">

                ${store.showPromptInput ? html`
                    <input type="text" 
                        placeholder="filter list..." 
                        style="position: absolute;
                                top: 79px;
                                left: 224px;
                                width: 100px;
                                height: 42px;
                                padding: 0 21px;
                                border: none;
                                border-radius: 21px;
                                background-color: white;
                                color: #4a4a4a;
                                font-size: 14px;
                                font-family: system-ui, -apple-system, sans-serif;
                                outline: none;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                animation: expandWidth 0.15s ease-out forwards;"
                        @input=${this.handleInputChange}>
                    ` : html``}

                <img src="images/he-button-filter.png" alt="PromptButton"
                              style="position: absolute;
                              top: 80px;
                              left: 200px;
                              width: 40px; 
                              height: 40px;
                              border-radius: 24px;
                              cursor: pointer;
                              z-index: 1000;
                              pointer-events: auto;"
                              @click=${this.handlePromptClick}
                                >

            
                
                <div id="property-items-container" style="display: flex; 
                        flex-direction: column; 
                        flex-flow: column;
                        gap: 14px;
                        width: 180px;
                        height: 300px; 
                        overflow-x: hidden;
                        overflow-y: auto;
                        padding: 0px; 
                        justify-content: flex-start; 
                        align-items: right;
                        align-content: right;
                        margin-top: 0px;
                        margin-left: 0px;
                        /* Custom scrollbar styling */
                        scrollbar-width: auto;
                        ">

                    ${store.currentConnections.map((connectionLabel, index) => {
                        // Calculate styling using shared method
                        const itemStyle = this.calculateItemOffset(index);
                        

                        
                        return html`
                        <div style="display: flex; 
                                    flex-direction: row; 
                                    height: 14px; 
                                    align-items: right; 
                                    justify-content: right;
                                    gap: 6px;
                                    margin-bottom: 8px;
                                    width: 100%;
                                    overflow-x: visible;
                                    margin-left: -26px;
                                    transform: translateX(${itemStyle.xOffset}px) scale(${itemStyle.scale});
                                    transform-origin: center;
                                    transition: transform 0.2s ease, opacity 0.2s ease, border-radius 0.2s ease;
                                    opacity: ${itemStyle.opacity};
                                    border-radius: ${itemStyle.borderRadius};">

                                    
                                ${(connectionLabel != "") ? html`
                                    <sp-button @click=${() => this.onActionButtonClick(connectionLabel)} 
                                            style="border-radius: 24px;
                                                    --spectrum-button-m-accent-fill-texticon-border-color: #00000070;
                                                    ${connectionLabel.includes("!") ? "--spectrum-button-m-accent-fill-texticon-text-color: #333333;--spectrum-semantic-cta-background-color-default: #eeeeee;" : ""}
                                                    ">
                                        <span style="opacity: ${itemStyle.hideText ? '0' : '1'}; transition: opacity 0.2s ease;">
                                            ${connectionLabel.replace("!", "")}
                                        </span>
                                    </sp-button>
                                    ` 
                                    :
                                    html`
                                        <div style="width: 32px; height: 32px;"></div>
                                        `}

                        </div>
                    `;
                    })}
                        
                    <!-- SVG overlay for drag line -->
                    ${this.showDragLine ? html`
                        <svg style="position: fixed; 
                                   top: 0; 
                                   left: 0; 
                                   width: 100vw; 
                                   height: 100vh; 
                                   pointer-events: none; 
                                   z-index: 10000;">
                            <!-- Define circle markers -->
                            <defs>
                                <!-- Black circle marker -->
                                <marker id="blackCircle" markerWidth="10" markerHeight="10" 
                                        refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                                    <circle cx="5" cy="5" r="4" fill="#00000080" />
                                </marker>
                                <!-- Orange circle marker -->
                                <marker id="orangeCircle" markerWidth="9" markerHeight="9" 
                                        refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                                    <circle cx="4" cy="4" r="4" fill="#FF9D00" />
                                </marker>
                            </defs>
                            <!-- Black stroke line (background) -->
                            <line x1="${this.dragStartPosition.x}" 
                                  y1="${this.dragStartPosition.y}" 
                                  x2="${this.currentMousePosition.x}" 
                                  y2="${this.currentMousePosition.y}" 
                                  stroke="#00000080" 
                                  stroke-width="6" 
                                  stroke-dasharray="10,10"
                                  stroke-linecap="round"
                                  marker-end="url(#blackCircle)" />
                            <!-- Orange line (foreground) -->
                            <line x1="${this.dragStartPosition.x}" 
                                  y1="${this.dragStartPosition.y}" 
                                  x2="${this.currentMousePosition.x}" 
                                  y2="${this.currentMousePosition.y}" 
                                  stroke="#FF9D00" 
                                  stroke-width="4" 
                                  stroke-dasharray="10,10"
                                  stroke-linecap="round"
                                  marker-end="url(#orangeCircle)" />
                            <!-- Animated traveling line -->
                            <line x1="${this.dragStartPosition.x}" 
                                  y1="${this.dragStartPosition.y}" 
                                  x2="${this.currentMousePosition.x}" 
                                  y2="${this.currentMousePosition.y}" 
                                  stroke="#ffffff" 
                                  stroke-width="16" 
                                  stroke-dasharray="20,1000"
                                  stroke-linecap="round"
                                  opacity="1.0">
                                <animate attributeName="stroke-dashoffset" 
                                         values=${store.connectionDirection === 'right' ? "0;-1020" : "-1020;0"}
                                         dur="0.7s" 
                                         repeatCount="indefinite" />
                            </line>
                            <!-- Rotating white chevron at line end -->
                            <g transform="translate(${this.currentMousePosition.x}, ${this.currentMousePosition.y}) rotate(${this.calculateLineAngle()})">
                                <polyline points="-6,-5 6,0 -6,5" 
                                          fill="none" 
                                          stroke="white" 
                                          stroke-width="3"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"/>
                            </g>
                        </svg>
                    ` : ''}

                </div>
            </div>
        `;
    }

   

    private resetSofaOrange() {
        const artwork2 = store.shapes.find(shape => shape.id === "artwork2") as Photo;
        const sofaOrange = store.shapes.find(shape => shape.id === "sofa-orange") as Photo;
        if (sofaOrange) {
            sofaOrange.x = artwork2.x + 55; 
            sofaOrange.y = artwork2.y + 114; 
            sofaOrange.isHovered = false;
            sofaOrange.isSelected = false;
            store.clearSelectedShapes();
        }
    }

    private calculateLineAngle(): number {
        const dx = this.currentMousePosition.x - this.dragStartPosition.x;
        const dy = this.currentMousePosition.y - this.dragStartPosition.y;
        // Calculate angle in degrees, add 90 to align chevron with line direction
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return angle;
    }

    // private onDotClick(e: PointerEvent, connectionLabel: string, position: 'left' | 'right') {
    //     e.stopPropagation(); // Prevent event bubbling

    //     store.connectionDirection = position;
    //     store.currentConnectionLabel = connectionLabel;
    //     //this.dragFromPosition = position;
        
    //     // Start dragging
    //     this.isDragging = true;
    //     this.dragStartPosition = { x: e.clientX, y: e.clientY };
    //     this.currentMousePosition = { x: e.clientX, y: e.clientY };
    //     this.showDragLine = true;

    //     store.currentShapes = [];
        
    //     // Add mouse move and mouse up listeners
    //     document.addEventListener('pointermove', this.onMouseMove);
    //     document.addEventListener('pointerup', this.onMouseUp);
        
    //     // Trigger re-render to show the line
    //     this.requestUpdate();
        
    //     // You can add specific logic here based on the dot position and connection
    //     switch (position) {
    //         case 'left':
    //             console.log("Left connection dot clicked");
                
    //             break;
    //         case 'right':
    //             console.log("Right connection dot clicked");
                
    //             break;
    //     }
    // }

    private onMouseMove = (e: PointerEvent) => {
        if (!this.isDragging) return;
        
        // Update current mouse position
        this.currentMousePosition = { x: e.clientX -6, y: e.clientY  };
        
        // Trigger re-render to update the line position
        this.requestUpdate();
    };

    private onMouseUp = () => {
        if (!this.isDragging) return;
        
        store.currentShapes.push(store.currentDownShape?.id.toString() ?? "");
        store.currentShapes.push(store.overShape?.id.toString() ?? "");

        //store.currentShapes = [];
        store.isConnectionVisible = false;

        this.onConnectionClick(store.currentConnectionLabel);
        
        // Hide the drag line
        this.showDragLine = false;
        
        // Clean up dragging state
        this.isDragging = false;
        this.dragStartPosition = { x: 0, y: 0 };
        this.currentMousePosition = { x: 0, y: 0 };
        
        // Remove event listeners
        document.removeEventListener('pointermove', this.onMouseMove);
        document.removeEventListener('pointerup', this.onMouseUp);
        
        // Trigger re-render to hide the line
        this.requestUpdate();
        
    };

    public handlePromptClick = (e?: Event) => {
        console.log("handlePromptClick", e);
        // Determine if invoked by real mouse interaction or programmatically
        const isMouseEvent = !!(e && (e instanceof MouseEvent || 'clientX' in e));

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log("handlePromptClick", isMouseEvent);
        if (isMouseEvent) {
            store.showPromptInput = !store.showPromptInput;
        } else {
            store.showPromptInput = true;
        }

        if (store.showPromptInput) {
            // Focus the input after it's rendered
            this.updateComplete.then(() => {
                const input = this.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
                if (input) {
                    input.focus();
                }
            });
        }

        if (this.originalConnections.length != 0 && !store.showPromptInput) {
            store.currentConnections = this.originalConnections
        }

        // Optional branch if coming from keyboard/other component
        // if (!isMouseEvent) { /* add extra behavior if needed */ }
    };

    private handleInputChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const value = input.value;
        
        // Save original connections if not already saved
        if (!this.isFiltering && this.originalConnections.length === 0) {
            this.originalConnections = [...store.currentConnections];
        }
        
        if (value != "") {
            this.isFiltering = true;

            // Reset scroll position to top when filtering
            const container = this.shadowRoot?.querySelector('#property-items-container') as HTMLElement;
            if (container) {
                container.scrollTop = 0;
            }
            
            // Reset currentScrollTop for proper arc positioning
            this.currentScrollTop = 0;
            
            
            // Filter connections that contain the input value (case-insensitive)
            const filteredConnections = this.originalConnections.filter(connection =>
                connection.toLowerCase().includes(value.toLowerCase())
            );
            
            store.currentConnections = [];

            if (value === "curls") {
                store.currentConnections.push("");
                store.currentConnections.push("");
                store.currentConnections.push("hair color");
                store.currentConnections.push("hair style");
                store.currentConnections.push("hair length");
                store.currentConnections.push("hair texture");
                store.currentConnections.push("hair volume");
                store.currentConnections.push("hair density");
                store.currentConnections.push("hair shine");
                store.currentConnections.push("");
                store.currentConnections.push("");
            }

            if (value.toLowerCase().includes("old") || value.toLowerCase().includes("young")) {
                store.currentConnections.push("");
                store.currentConnections.push("");
                store.currentConnections.push("age");
                store.currentConnections.push("");
                store.currentConnections.push("");
            }

            if (filteredConnections.length > 0) {
                
                store.currentConnections.push("");
                store.currentConnections.push("");
                // Add filtered connections one at a time
                filteredConnections.forEach(connection => {
                    store.currentConnections.push(connection);
                });
                store.currentConnections.push("");
                store.currentConnections.push("");
            }
            
        } else {
            // Restore original connections when input is empty
            this.isFiltering = false;
            store.currentConnections = [...this.originalConnections];
        }

        

    };



    // private handleEyedropperClick = (e: Event, connectionLabel: string) => {
    //     e.stopPropagation();
    //     e.preventDefault();

    //     store.HeliosPropertiesVisibility = false;
    //     store.contextMenuVisibility = false;

    //     store.targetEyedropper = store.currentDownShape?.id ?? "";

    //     store.showContextMenu = false;
    //     store.clearSelectedShapes();

    //     // Hide the cursor globally
    //     document.body.style.cursor = 'none';
        
    //     // Create a floating eyedropper icon that follows the mouse
    //     this.createFloatingEyedropper(e as MouseEvent, connectionLabel);
        
    //     // Add mouse move listener to track mouse position
    //     document.addEventListener('mousemove', this.handleMouseMove);
        
    //     // Add click listener to stop eyedropper mode
    //     this.eyedropperClickHandler = () => this.stopEyedropperMode();
    //     document.addEventListener('click', this.eyedropperClickHandler);

    // }


    private floatingEyedropper: HTMLImageElement | null = null;
    private floatingDiv: HTMLDivElement | null = null;
    private circleDiv: HTMLDivElement | null = null;
    private loupeImg: HTMLImageElement | null = null;
    private eyedropperClickHandler: ((e: MouseEvent) => void) | null = null;
    
    // private createFloatingEyedropper = (e: MouseEvent, connectionLabel: string) => {
    //     // Remove existing floating elements if any
    //     if (this.floatingEyedropper) {
    //         this.floatingEyedropper.remove();
    //     }
    //     if (this.floatingDiv) {
    //         this.floatingDiv.remove();
    //     }

    //     store.currentProperty = connectionLabel ?? "";
        
    //     // Create the original floating eyedropper image
    //     this.floatingEyedropper = document.createElement('img');
    //     this.floatingEyedropper.src = 'images/he-cursor-eyedrop.gif';
    //     this.floatingEyedropper.style.position = 'fixed';
    //     this.floatingEyedropper.style.width = '37px';
    //     this.floatingEyedropper.style.height = '37px';
    //     this.floatingEyedropper.style.pointerEvents = 'none';
    //     this.floatingEyedropper.style.zIndex = '10000'; // Higher than the div
    //     this.floatingEyedropper.style.transform = 'translate(-18.5px, -18.5px) scale(1.25)'; // Center the icon on cursor
    //     this.floatingEyedropper.style.filter = 'drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.6))';
        
    //     // Create the floating div container with loupe design
    //     this.floatingDiv = document.createElement('div');
    //     this.floatingDiv.style.position = 'fixed';
    //     this.floatingDiv.style.display = 'flex';
    //     this.floatingDiv.style.flexDirection = 'column';
    //     this.floatingDiv.style.alignItems = 'center';
    //     this.floatingDiv.style.justifyContent = 'center';
    //     this.floatingDiv.style.width = '300px';
    //     this.floatingDiv.style.height = '89px';
    //     this.floatingDiv.style.pointerEvents = 'none';
    //     this.floatingDiv.style.zIndex = '9995'; // Higher than the eyedropper
    //     this.floatingDiv.style.transform = 'translate(-150px, -100px)'; // Center the div on cursor

        
    //     // Create circle background div that can be filled with color or image
    //     this.circleDiv = document.createElement('div');
    //     this.circleDiv.style.position = 'absolute';
    //     this.circleDiv.style.width = '63px';
    //     this.circleDiv.style.height = '63px';
    //     this.circleDiv.style.borderRadius = '50%';
    //     this.circleDiv.style.top = '3px';
    //     this.circleDiv.style.left = '50%';
    //     this.circleDiv.style.transform = 'translateX(-50%) scale(0)';
    //     this.circleDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    //     this.circleDiv.style.opacity = '0';
    //     this.circleDiv.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
    //     this.circleDiv.style.transformOrigin = 'center bottom';
    //     // Default to a solid color - can be changed to backgroundImage for images
    //     this.circleDiv.style.backgroundColor = store.loupeColor;
    //     this.circleDiv.style.backgroundImage = 'url(' + store.loupeImg + ')';
    //     this.circleDiv.style.backgroundSize = 'cover';
    //     this.circleDiv.style.backgroundPosition = 'center';

    //      // Create the loupe image
    //      this.loupeImg = document.createElement('img');
    //      this.loupeImg.src = 'images/he-loupe.png';
    //      this.loupeImg.style.width = '67px';
    //      this.loupeImg.style.height = '89px';
    //      this.loupeImg.style.position = 'absolute';
    //      this.loupeImg.style.top = '0';
    //      this.loupeImg.style.left = '50%';
    //      this.loupeImg.style.transform = 'translateX(-50%) scale(0)';
    //      this.loupeImg.style.opacity = '0';
    //      this.loupeImg.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
    //      this.loupeImg.style.transformOrigin = 'center bottom';
    //      this.loupeImg.style.filter = 'drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.6))';

    //      // Create the stroke text span
    //     const strokeSpan = document.createElement('span');
    //     strokeSpan.textContent = store.currentProperty;
    //     strokeSpan.style.position = 'absolute';
    //     strokeSpan.style.top = '71px';
    //     strokeSpan.style.left = '50%';
    //     strokeSpan.style.transform = 'translateX(-50%)';
    //     strokeSpan.style.color = '#ffffff';
    //     strokeSpan.style.fontWeight = 'bold';
    //     strokeSpan.style.webkitTextStroke = '4px #ff9d00';
    //     strokeSpan.style.fontSize = '13px';
    //     strokeSpan.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    //     (strokeSpan.style as any).textStroke = '2px #ff9d00';
    //     strokeSpan.style.filter = 'drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.6))';
        
    //     // Create the white text span
    //     const whiteSpan = document.createElement('span');
    //     whiteSpan.textContent = store.currentProperty;
    //     whiteSpan.style.position = 'absolute';
    //     whiteSpan.style.top = '71px';
    //     whiteSpan.style.left = '50%';
    //     whiteSpan.style.transform = 'translateX(-50%)';
    //     whiteSpan.style.color = '#ffffff';
    //     whiteSpan.style.fontSize = '13px';
    //     whiteSpan.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    //     whiteSpan.style.fontWeight = 'bold';
        
    //     // Append elements to the div
    //     this.floatingDiv.appendChild(this.circleDiv);
    //     this.floatingDiv.appendChild(this.loupeImg);
    //     this.floatingDiv.appendChild(strokeSpan);
    //     this.floatingDiv.appendChild(whiteSpan);

       
        
    //     // Add both elements to document body
    //     document.body.appendChild(this.floatingDiv);
    //     document.body.appendChild(this.floatingEyedropper);

    //     window.addEventListener("keydown", this.handleEscape);
        

    //     // Position both elements at cursor
    //     if (this.floatingDiv) {
    //         this.floatingDiv.style.left = `${e.clientX}px`;
    //         this.floatingDiv.style.top = `${e.clientY}px`;
    //     }
    //     if (this.floatingEyedropper) {
    //         this.floatingEyedropper.style.left = `${e.clientX}px`;
    //         this.floatingEyedropper.style.top = `${e.clientY}px`;
    //     }
    // }
    
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
    
    // private stopEyedropperMode = () => {
    //     // Restore normal cursor
    //     document.body.style.cursor = '';

    //     window.removeEventListener("keydown", this.handleEscape);

    //     store.doEyedropping();

    //     // Remove floating elements
    //     if (this.floatingEyedropper) {
    //         this.floatingEyedropper.remove();
    //         this.floatingEyedropper = null;
    //     }
    //     if (this.floatingDiv) {
    //         this.floatingDiv.remove();
    //         this.floatingDiv = null;
    //     }
    //     // Clear references to child elements
    //     this.circleDiv = null;
    //     this.loupeImg = null;
        
    //     // Remove event listeners
    //     document.removeEventListener('mousemove', this.handleMouseMove);
    //     if (this.eyedropperClickHandler) {
    //         document.removeEventListener('click', this.eyedropperClickHandler);
    //         this.eyedropperClickHandler = null;
    //     }
        

    // }

    private onActionButtonClick(actionLabel: string) {
        store.contextMenuVisibility = false;

        if (!actionLabel.includes("!")) {
            // Add "!" to current item
            //store.currentConnections[index] = "!" + actionLabel;
            
            // Check all items in store.menuPeople and add "!" to matching items
            store.menuWalls.forEach((menuItem, menuIndex) => {
                // Only add "!" if the menuItem doesn't already start with "!"
                if (menuItem.length > 0 && menuItem[0] !== "!" && menuItem === actionLabel) {
                    store.menuWalls[menuIndex] = "!" + menuItem;
                }
            });
            store.menuObjects.forEach((menuItem, menuIndex) => {
                // Only add "!" if the menuItem doesn't already start with "!"
                if (menuItem.length > 0 && menuItem[0] !== "!" && menuItem === actionLabel) {
                    store.menuObjects[menuIndex] = "!" + menuItem;
                }
            });
            store.menuPeople.forEach((menuItem, menuIndex) => {
                // Only add "!" if the menuItem doesn't already start with "!"
                if (menuItem.length > 0 && menuItem[0] !== "!" && menuItem === actionLabel) {
                    store.menuPeople[menuIndex] = "!" + menuItem;
                }
            });
        }

        this.onConnectionClick(actionLabel);

        store.currentObject = store.currentDownShape?.id ?? "";
        store.targetEyedropper = store.currentDownShape?.id ?? "";
        store.currentProperty = actionLabel;

        if (!store.wasDragging) {

            store.typeOfProperty = actionLabel;
            store.contextMenuVisibility = false;
            store.HeliosPropertiesVisibility = true;
            store.currentProperty = actionLabel;
           
        }
        this.resetSofaOrange();
    }

    private onConnectionClick(connectionLabel: string) {
        store.contextMenuVisibility = false;

        const artwork1 = store.shapes.find(shape => shape.id === "artwork1") as Photo;
        const artwork2 = store.shapes.find(shape => shape.id === "artwork2") as Photo;
        const sofa = store.shapes.find(shape => shape.id === "sofa") as Shape;
        const sofa2 = store.shapes.find(shape => shape.id === "sofa2") as Shape;
        const sofaGray = store.shapes.find(shape => shape.id === "sofa-gray") as Shape;
        const sofaMaterial = store.shapes.find(shape => shape.id === "sofa-material") as Shape;
        const sofaBack = store.shapes.find(shape => shape.id === "sofa-back") as Shape;
        const sofaColorOrange = store.shapes.find(shape => shape.id === "sofa-color-orange") as Shape;
        const wallBack = store.shapes.find(shape => shape.id === "wall-back") as Shape;
        const wallBack2 = store.shapes.find(shape => shape.id === "wall-back2") as Shape;
        const wallBackColor = store.shapes.find(shape => shape.id === "wall-back-color") as Shape;
        const ceilingColor = store.shapes.find(shape => shape.id === "ceiling-color") as Shape;
        const ceilingMaterial = store.shapes.find(shape => shape.id === "ceiling-material") as Shape;

       
        if (store.currentShapes.length > 0) {
            const shape1 = store.currentShapes[0];
            const shape2 = store.currentShapes[1];
            if ((shape1 === "sofa-orange" && shape2 === "sofa") ||
                (shape1 === "sofa-orange" && shape2 === "sofa-material")
            ) {
                
                switch (connectionLabel) {
                    case "add object":
                        store.showAlertDialog = true;
                        break;
                    case "replace":
                    case "replace object":
                    case "replace couch":
                        if (sofa) {
                            sofa.visible = false;
                        }
                        if (sofaMaterial) {
                            sofaMaterial.visible = false;
                        }
                        if (sofa2) {
                            sofa2.visible = true;
                            sofa2.x = artwork1.x + 680;
                            sofa2.y = artwork1.y + 650;
                        }
                        break;
                    case "color":
                        store.showAlertDialog = true;
                        break;
                    case "material":
                        if (sofa) {
                            sofa.visible = false;
                        }
                        if (sofaMaterial) {
                            sofaMaterial.visible = true;
                            sofaMaterial.x = artwork1.x + 620;
                            sofaMaterial.y = artwork1.y + 610;
                        }
                        break;
                    case "shape":
                        break;
                    default:
                }
            }

            if (store.currentShapes.length > 0) {
                const shape1 = store.currentShapes[0];
                const shape2 = store.currentShapes[1];
                if ((shape2 === "sofa-orange" && shape1 === "sofa") ||
                    (shape2 === "sofa-orange" && shape1 === "sofa-material") 
                ) {
                    
                    switch (connectionLabel) {
                        case "replace":
                        case "replace object":
                        case "replace couch":
                            if (sofa) {
                                sofa.visible = false;
                            }
                            if (sofaMaterial) {
                                sofaMaterial.visible = false;
                            }
                            if (sofa2) {
                                sofa2.visible = true;
                                sofa2.x = artwork1.x + 680;
                                sofa2.y = artwork1.y + 650;
                            }
                            break;
                        case "color":
                            if (sofaColorOrange) {
                                sofaColorOrange.visible = false;
                            }
                            if (sofaGray) {
                                sofaGray.visible = true;
                                sofaGray.x = artwork2.x + 73;
                                sofaGray.y = artwork2.y + 150;
                            }
                            break;
                        case "material":
                            if (sofa) {
                                sofa.visible = false;
                            }
                            if (sofaMaterial) {
                                sofaMaterial.visible = true;
                                sofaMaterial.x = artwork1.x + 620;
                                sofaMaterial.y = artwork1.y + 610;
                            }
                            break;
                        case "shape":
                            break;
                        default:
                    }
                }
            }

            if ( ((shape1 === "sofa-orange" || shape1 === "sofa2") && (shape2 === "wall-back" || shape2 === "wall-back2")) ||
                 (shape1 === "sofa-material" && (shape2 === "wall-back" || shape2 === "wall-back2") )
                ) {
                switch (connectionLabel) {
                    case "add couch":
                    case "add object":
                        if (sofaBack) {
                            sofaBack.visible = true;
                            sofaBack.x = artwork1.x + 230;
                            sofaBack.y = artwork1.y + 580;
                        }
                        break;
                    case "color":
                        wallBackColor.fill = "#b55100";
                        break;
                    case "material":
                        if (wallBack) {
                            wallBack.visible = false;
                        }
                        if (wallBack2) {
                            wallBack2.visible = true;
                            wallBack2.x = artwork1.x;
                            wallBack2.y = artwork1.y;
                        }
                        break;
                    default:
                }
            }

            if (((shape1 === "sofa-orange" || shape1 === "sofa2") && shape2 === "ceiling" && store.connectionDirection === 'right') ||
                (shape1 === "ceiling" && (shape1 === "sofa-orange" || shape1 === "sofa2") && store.connectionDirection === 'left') ||
                (shape1 === "sofa-material" && shape2 === "ceiling" && store.connectionDirection === 'right') ||
                (shape1 === "ceiling" && shape2 === "sofa-material" && store.connectionDirection === 'left')) {
                switch (connectionLabel) {
                    case "color":
                        ceilingColor.fill = "#b55100";
                        break;
                    case "material":
                        if (ceilingMaterial) {
                            ceilingMaterial.visible = true;
                            ceilingMaterial.x = artwork1.x + 16;
                            ceilingMaterial.y = artwork1.y + 7;
                        }
                        break;
                    default:
                }
            }

            if (((shape1 === "sofa-orange" || shape1 === "sofa2") && shape2 === "ceiling" && store.connectionDirection === 'right') ||
                (shape1 === "ceiling" && (shape1 === "sofa-orange" || shape1 === "sofa2") && store.connectionDirection === 'left')) {
                switch (connectionLabel) {
                    case "color":
                        ceilingColor.fill = "#b55100";
                        break;
                    case "material":
                        if (ceilingMaterial) {
                            ceilingMaterial.visible = true;
                            ceilingMaterial.x = artwork1.x + 16;
                            ceilingMaterial.y = artwork1.y + 7;
                        }
                        break;
                    default:
                }
            }
        }

        this.resetSofaOrange();
        
        
    }

    private handleDocumentWheel = (e: WheelEvent) => {
        // Check if the wheel event should be handled by this component
        const container = this.shadowRoot?.querySelector('#property-items-container') as HTMLElement;
        if (!container) return;
        
        // Check if the mouse is over the container or the component
        const rect = container.getBoundingClientRect();
        const isOverContainer = (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );
        
        // Also check if mouse is over the component itself
        const componentRect = this.getBoundingClientRect();
        const isOverComponent = (
            e.clientX >= componentRect.left &&
            e.clientX <= componentRect.right &&
            e.clientY >= componentRect.top &&
            e.clientY <= componentRect.bottom
        );
        
        if (!isOverContainer && !isOverComponent) return;
        
        e.preventDefault();
        
        // Reduced sensitivity: smaller scroll amount per wheel tick
        const scrollSensitivity = 0.4; // Adjust this value (0.1 = very slow, 1.0 = normal speed)
        const scrollAmount = e.deltaY * scrollSensitivity;
        
        const currentScrollTop = container.scrollTop;
        let newScrollTop = currentScrollTop + scrollAmount; 

        // Ensure scroll stays within bounds
        const maxScroll = container.scrollHeight - container.clientHeight;
        newScrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));

        this.currentScrollTop = newScrollTop;

        container.scrollTo({
            top: newScrollTop,
            behavior: 'auto'
        });
        
        // Trigger re-render to update arc positions
        this.requestUpdate();
    };
    
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-context-menu2": ContextMenu2;
    }
}
