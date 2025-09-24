import { Shape, ShapeId } from "../store/Shape.js";
import { Point2D, store } from "../store/Store.js";
import { Editor } from "./Editor.js";
import { Modifiers, ToolBase } from "./ToolBase.js";

export interface ShapeCreationToolProps {
    shapeId: ShapeId;
}

export class ShapeCreationTool extends ToolBase {
    public constructor(editor: Editor, private shapeId: ShapeId) {
        super(editor);
    }

    private dragStartPosition: Point2D = { x: 0, y: 0 };

    protected override startDrag(clientPos: Point2D) {
        this.dragStartPosition = this.editor.getDocumentPosition(clientPos);

        const shape = new Shape(this.shapeId);
        shape.x = this.dragStartPosition.x;
        shape.y = this.dragStartPosition.y;

        shape.fill = store.fill;
        shape.stroke = store.stroke;
        shape.strokeWidth = store.strokeWidth;
        shape.opacity = store.opacity;
        shape.hue = store.hue;
        shape.brightness = store.brightness;

        store.addShape(shape);
    }

    protected override continueDrag(clientPos: Point2D, modifiers: Modifiers) {
        this.updateShape(clientPos, modifiers);
    }

    protected override endDrag(clientPos: Point2D, modifiers: Modifiers) {
        this.updateShape(clientPos, modifiers);
        // const { selectedShapes } = store;
        // if (
        //     selectedShapes &&
        //     (selectedShapes.width === 0 || selectedShapes.height === 0)
        // ) {
        //     store.deleteSelectedShapes();
        // }
    }

    public override keyDown(key: string, modifiers: Modifiers) {
        if (store.isDragging && key === "Shift") {
            this.updateShape(this.dragCurrentClientPos, modifiers);
            return true;
        }
        return false;
    }

    public override keyUp(key: string, modifiers: Modifiers) {
        if (store.isDragging && key === "Shift") {
            this.updateShape(this.dragCurrentClientPos, modifiers);
            return true;
        }
        return false;
    }

    private updateShape(clientPos: Point2D, modifiers: Modifiers) {
        const documentPos = this.editor.getDocumentPosition(clientPos);
        const modifiedPosition = this.getModifiedPosition(
            documentPos,
            modifiers
        );
        const x = Math.min(this.dragStartPosition.x, modifiedPosition.x);
        const y = Math.min(this.dragStartPosition.y, modifiedPosition.y);
        const width = Math.abs(this.dragStartPosition.x - modifiedPosition.x);
        const height = Math.abs(this.dragStartPosition.y - modifiedPosition.y);
        store.updateSelectedShapes( [{ x: x, y: y}], width, height);
    }

    private getModifiedPosition(documentPos: Point2D, modifiers: Modifiers) {
        let { x, y } = documentPos;
        if (modifiers.shiftKey && this.dragStartPosition) {
            const deltaX = x - this.dragStartPosition.x;
            const deltaY = y - this.dragStartPosition.y;
            const size = Math.max(Math.abs(deltaX), Math.abs(deltaY));
            x = this.dragStartPosition.x + Math.sign(deltaX) * size;
            y = this.dragStartPosition.y + Math.sign(deltaY) * size;
        }
        return { x, y };
    }
}
