import { Shape } from "../store/Shape.js";
import { Point2D, store } from "../store/Store.js";
import { Modifiers, ToolBase } from "./ToolBase.js";

export class SelectTool extends ToolBase {
    private shapeOffset: Array<Point2D> = [];

    protected override startOver(
        _clientPos: Point2D,
        _modifiers: Modifiers,
        shape?: Shape
    ) {
        store.overShape = shape;
    }

    protected override startClick(
        clientPos: Point2D,
        _modifiers: Modifiers,
        shape?: Shape
    ) {
        if (store.selectedShapes.length > 0) { // There is already at least one selection
            if (store.isShiftDown) {
                if (shape) {
                    if (shape.isSelected) {

                        store.removeSelectedShape(shape); 
                        shape.isSelected = false;

                        store.cursorSrc = "images/cursor-add.svg";
                    } else {

                        store.selectedShapes.push(shape);
                        store.updateProperties(shape);
                        shape.isSelected = true;

                        store.cursorSrc = "images/cursor-remove.svg";
                    }
                }
            } else { 
                if (shape) {
                    
                    if (!shape.isSelected) {
                        store.clearSelectedShapes();
                    }

                    store.selectedShapes.push(shape);
                    store.updateProperties(shape);
                    shape.isSelected = true;

                    store.cursorSrc = "images/cursor-add.svg";
                }
            }
        } else {  // Nothing is selected, so add new shape
            store.cursorSrc = "images/cursor-remove.svg";
            if (shape) {

                store.selectedShapes.push(shape);
                store.updateProperties(shape);
                shape.isSelected = true;

            }
        }
        this.shapeOffset = [];
        if (store.selectedShapes.length > 0) {
            store.selectedShapes.map((selectedShape) => {
                const documentPos = this.editor.getDocumentPosition(clientPos);
                this.shapeOffset.push({
                    x: selectedShape.x - documentPos.x,
                    y: selectedShape.y - documentPos.y,
                });
            });
        } else {
            const documentPos = this.editor.getDocumentPosition(clientPos);
            if (store.currentDownShape) {
                this.shapeOffset.push({
                    x: store.currentDownShape.x - documentPos.x,
                    y: store.currentDownShape.y - documentPos.y,
                });
            }
        }
        if (!shape) {
            // ====================
            // Click on the background or canvas.
            // ====================
            store.isMarquee = true;
            store.startMarqueePoint = store.pagePos;
            store.clearSelectedShapes();
            store.turnOverOff();
            store.isPropertySliderOn = false;
            store.isPropertyHueOn = false;
            store.isPropertyBrightnessOn = false;
            store.currentDownShape = undefined;
        } else {
            if (store.isShiftDown) {
                store.isMarquee = true;
                store.startMarqueePoint = store.pagePos;
            }
        }

        if (store.selectedShapes.length === 0) {
            store.buildHierarchy();
        }
    }

    protected override continueDrag(clientPos: Point2D) {
        if (store.selectedShapes.length > 0) {
            const documentPos = this.editor.getDocumentPosition(clientPos);
            let tempOffset: Array<Point2D> = [];
            this.shapeOffset.map((offset) => {
                tempOffset.push( { x: (documentPos.x + offset.x), y: (documentPos.y + offset.y) } );
                // documentPos.y + this.shapeOffset.y
            });
            store.updateSelectedShapes( tempOffset );
        } else {
            const documentPos = this.editor.getDocumentPosition(clientPos);
            let tempOffset: Array<Point2D> = [];
            this.shapeOffset.map((offset) => {
                tempOffset.push( { x: (documentPos.x + offset.x), y: (documentPos.y + offset.y) } );
            });
            console.log(tempOffset.length);
            store.updateSingleShape( tempOffset );
        }
    }
}
