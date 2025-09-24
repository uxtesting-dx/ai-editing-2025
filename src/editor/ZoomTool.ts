import { Point2D, store } from "../store/Store.js";
import { Editor } from "./Editor.js";
import { Modifiers, ToolBase } from "./ToolBase.js";

const ZOOM_FACTOR = 2;
const ZOOM_DISTANCE = 200;

export class ZoomTool extends ToolBase {
    private _dragStartDocumentPos: Point2D = { x: 0, y: 0 };
    private _dragStartZoom = 1;

    constructor(editor: Editor) {
        super(editor);
        this.cursor = "zoom-in";
    }

    protected override endClick(clientPos: Point2D, modifiers: Modifiers) {
        // Zoom in or out, depending on whether Alt/Option is pressed.
        const factor = modifiers.altKey ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
        const documentPos = this.editor.getDocumentPosition(clientPos);
        this.editor.zoomBy(factor, documentPos);
    }

    protected override startDrag(clientPos: Point2D) {
        this._dragStartZoom = store.zoom;
        this._dragStartDocumentPos = this.editor.getDocumentPosition(clientPos);
    }

    protected override continueDrag(clientPos: Point2D) {
        // Zoom in or out based on left/right motion.
        const zoom =
            this._dragStartZoom *
            ZOOM_FACTOR **
                ((clientPos.x - this.dragStartClientPos.x) / ZOOM_DISTANCE);
        this.editor.zoomTo(zoom, this._dragStartDocumentPos);
    }

    public override keyDown(key: string) {
        if (key === "Alt") {
            this.cursor = "zoom-out";
            return true;
        }
        return false;
    }

    public override keyUp(key: string) {
        if (key === "Alt") {
            this.cursor = "zoom-in";
            return true;
        }
        return false;
    }
}
