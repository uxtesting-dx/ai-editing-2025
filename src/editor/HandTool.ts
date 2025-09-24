import { Point2D, store } from "../store/Store.js";
import { Editor } from "./Editor.js";
import { ToolBase } from "./ToolBase.js";

export class HandTool extends ToolBase {
    private previousClientPos: Point2D = { x: 0, y: 0 };

    constructor(editor: Editor) {
        super(editor);
        this.cursor = "grab";
    }

    protected override startClick(clientPos: Point2D) {
        this.cursor = "grabbing";
        this.previousClientPos = clientPos;
    }

    override endClick() {
        this.cursor = "grab";
    }

    protected override continueDrag(clientPos: Point2D) {
        const x =
            store.center.x -
            (clientPos.x - this.previousClientPos.x) / store.zoom;
        const y =
            store.center.y -
            (clientPos.y - this.previousClientPos.y) / store.zoom;
        store.center = { x, y };
        this.previousClientPos = clientPos;
    }

    protected override endDrag() {
        this.cursor = "grab";
    }
}
