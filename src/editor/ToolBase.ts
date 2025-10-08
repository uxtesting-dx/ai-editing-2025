import "./renderShape.js";

import { css, svg, TemplateResult } from "lit";
import { configure } from "mobx";

import { Shape, ShapeId } from "../store/Shape.js";
//import { Shape, ShapeId } from "../store/Shape.js";
import { Point2D, store } from "../store/Store.js";
import { Editor } from "./Editor.js";
import { renderShape } from "./renderShape.js";
import { Photo } from "../store/Photo.js";

const DRAG_TOLERANCE = 2;
const OUTLINE_FILL = "none";
const OUTLINE_STROKE = "#FF9D00";
const ADORNER_FILL = "#FF9D00";
const ADORNER_STROKE = "rgb(66, 66, 66)";

configure({
  enforceActions: "never",
});

export interface Modifiers {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export abstract class ToolBase {
  static styles = css`
    :host {
    }
  `;
  constructor(protected editor: Editor) {
    window.addEventListener("pointermove", this.handlePointerMove);
  }

  private pointerId?: number;

  protected overClientPos: Point2D = { x: 0, y: 0 };
  protected dragStartClientPos: Point2D = { x: 0, y: 0 };
  protected dragCurrentClientPos: Point2D = { x: 0, y: 0 };
  protected dragStartShapePos: Point2D = { x: 0, y: 0 };
  protected dragStartShapeSize: Point2D = { x: 0, y: 0 };
  protected dragStartShape?: Shape | Photo;
  protected dragStartScale: number = 1;
  protected dragStartRotation: number = 0;
  protected dragStartAngle: number = 0;

  private _cursor = "default";


  protected get cursor(): string {
    return this._cursor;
  }

  protected set cursor(value: string) {
    this._cursor = value;
    this.editor.requestUpdate();
  }

  public render(): TemplateResult {
    const shape = store.currentDownShape;
    let centerX = 0;
    let centerY = 0;
    if (shape) {
      // const shapeRotation = store.currentDownShape?.rotation
      // const { shapeId, x, y, width, height, scale } = shape;
      const { x, y, width, height, scale } = shape;
      centerX = x + (width / 2) * scale;
      centerY = y + (height / 2) * scale;
    }
    return svg`
            <g>
                ${this.renderBackdrop()}
                ${this.renderShapes()}
                <g
                    transform-origin="${centerX} ${centerY}"
                    transform="rotate(${store.currentDownShape?.rotation})"
                >
                    ${this.renderAdorners()}
                </g>
            </g>
        `;

    // ${this.renderOver()}
    // ${this.renderAdorners()}
  }

  private renderBackdrop(): TemplateResult {
    return svg`
            <rect
                x="-100000"
                y="-100000"
                width="200000"
                height="200000"
                fill="transparent"
                stroke="none"
                @pointerdown=${this.handlePointerDown}
            />
        `;
  }

  private renderShapes(): TemplateResult[] {
    return store.shapes.map((shape) => {
      const handlePointerOver = (e: PointerEvent) => {
        this.handlePointerOver(e, shape);
      };
      const handlePointerOut = () => {
        this.handlePointerOut(shape);
      };
      const handlePointerDown = (e: PointerEvent) => {
        this.handlePointerDown(e, shape);
      };
      const handleClick = (e: PointerEvent) => {
        this.handleClick(e);
      };
      const handleDoubleClick = (e: PointerEvent) => {
        this.handleDoubleClick(e, shape);
      };
      const handleWheel = (e: WheelEvent) => {
        this.handleWheel(e, shape);
      };
      return renderShape(
        shape,
        handlePointerOver,
        handlePointerOut,
        handlePointerDown,
        handleClick,
        handleDoubleClick,
        handleWheel
      );
    }).filter((result): result is TemplateResult => result !== undefined);
  }

  //   private renderOver(): TemplateResult[] | null {
  // const { overShape, zoom } = store;
  // if (overShape && !store.isDragging) {
  //     const { shapeId, x, y, width, height, stroke, pathData } =
  //         overShape;
  //     const props = {
  //         id: "over",
  //         x,
  //         y,
  //         width,
  //         height,
  //         fill: OUTLINE_FILL,
  //         stroke,
  //         strokeWidth: 2 / zoom,
  //         pathData,
  //     };
  //     let newShapeId = shapeId;
  //     if (newShapeId === "image") {
  //         newShapeId = ShapeId.ImageOver;
  //     }
  //     const outlineShape = new Shape(newShapeId, props);
  //     //const boundingBoxShape = new Shape(ShapeId.Rectangle, props);
  //     const shapes = [
  //         outlineShape,
  //         //boundingBoxShape,
  //         // this.createAdornerShape(x, y, zoom),
  //         // this.createAdornerShape(x + width, y, zoom),
  //         // this.createAdornerShape(x, y + height, zoom),
  //         // this.createAdornerShape(x + width, y + height, zoom),
  //     ];
  //     return shapes.map((shape) => renderShape(shape));
  // }
  // return null;
  //   }

  private renderAdorners(): TemplateResult[] | null {
    const { selectedShapes, zoom } = store;
    const selectedShape = selectedShapes.length > 0 ? selectedShapes[0] : null;
    
    if (selectedShape) {
      
      const { x, y, width, height, scale } = selectedShape;
      const shapeId = 'shapeId' in selectedShape ? selectedShape.shapeId : null;
      const photoId = 'photoId' in selectedShape ? selectedShape.photoId : null;
      const props = {
        x,
        y,
        width,
        height,
        fill: OUTLINE_FILL,
        stroke: OUTLINE_STROKE,
        strokeWidth: 1 / zoom,
      };
      const propsBoxShadow = {
        x: x - 6,
        y: y - 6,
        width: width * scale + 12,
        height: height * scale + 12,
        fill: OUTLINE_FILL,
        stroke: "white",
        strokeWidth: 2.5 / zoom,
      };
      const propsBox = {
        x: x - 6,
        y: y - 6,
        width: width * scale + 12,
        height: height * scale + 12,
        fill: OUTLINE_FILL,
        stroke: "#FF9D00",
        strokeWidth: 1.5 / zoom,
      };
      const outlineShape = new Shape('shapeId' in selectedShape ? shapeId as ShapeId : ShapeId.Rectangle, props);
      const boundingBoxShadow = new Shape(ShapeId.Rectangle, propsBoxShadow);
      const boundingBoxShape = new Shape(ShapeId.Rectangle, propsBox);

      let shapes: any[] = [];

      if (shapeId) {

        shapes = [
          this.createAdornerRotateShapeNW("rotateAdorner", x - 6, y - 6, zoom),
          this.createAdornerRotateShapeNE(
            "rotateAdorner",
            x + width * scale + 6,
            y - 6,
            zoom
          ),
          this.createAdornerRotateShapeSW(
            "rotateAdorner",
            x - 6,
            y + height * scale + 6,
            zoom
          ),
          this.createAdornerRotateShapeSE(
            "rotateAdorner",
            x + width * scale + 6,
            y + height * scale + 6,
            zoom
          ),
          outlineShape,
          boundingBoxShadow,
          boundingBoxShape,
          this.createAdornerScaleShape("scaleAdornerNW", x - 6, y - 6, zoom),
          this.createAdornerScaleShape(
            "scaleAdornerNE",
            x + width * scale + 6,
            y - 6,
            zoom
          ),
          this.createAdornerScaleShape(
            "scaleAdornerSW",
            x - 6,
            y + height * scale + 6,
            zoom
          ),
          this.createAdornerScaleShape(
            "scaleAdornerSE",
            x + width * scale + 6,
            y + height * scale + 6,
            zoom
          ),
        ];

      } else if (photoId) {

        shapes = [
          // this.createAdornerScaleShape("scaleAdornerNW", x - 1, y - 1, zoom),
          // this.createAdornerScaleShape(
          //   "scaleAdornerNE",
          //   x + width * scale + 1,
          //   y - 1,
          //   zoom
          // ),
          // this.createAdornerScaleShape(
          //   "scaleAdornerSW",
          //   x - 1,
          //   y + height * scale + 1,
          //   zoom
          // ),
          // this.createAdornerScaleShape(
          //   "scaleAdornerSE",
          //   x + width * scale + 1,
          //   y + height * scale + 1,
          //   zoom
          // ),
        ];

      }
      return shapes.map((shape) => {
        const handlePointerOver = (_e: PointerEvent) => {
          //this.handlePointerOver(e, shape);
        };
        const handlePointerOut = () => {
          //this.handlePointerOut(shape);
        };
        const handlePointerDown = (e: PointerEvent) => {
          this.handlePointerDownAdorner(e, shape);
        };
        const handleClick = (e: PointerEvent) => {
          this.handleClick(e);
        };
        const handleDoubleClick = (e: PointerEvent) => {
          this.handleDoubleClick(e, shape);
        };
        const handleWheel = (_e: WheelEvent) => {
          //this.handleWheel(e, shape);
        };
        return renderShape(
          shape,
          handlePointerOver,
          handlePointerOut,
          handlePointerDown,
          handleClick,
          handleDoubleClick,
          handleWheel
        );
      }).filter((result): result is TemplateResult => result !== undefined);
    }
    return null;
  }

  private createAdornerScaleShape(
    id: string,
    x: number,
    y: number,
    zoom: number
  ): Shape {
    const strokeWidth = 1 / zoom;
    const adornerSize = 14 * strokeWidth;
    const props = {
      id: id,
      x: x - adornerSize / 2,
      y: y - adornerSize / 2,
      width: adornerSize,
      height: adornerSize,
      fill: ADORNER_FILL,
      stroke: ADORNER_STROKE,
      strokeWidth,
    };
    return new Shape(ShapeId.Scale, props);
  }

  private createAdornerRotateShapeNW(
    id: string,
    x: number,
    y: number,
    zoom: number
  ): Shape {
    const strokeWidth = 1 / zoom;
    const adornerSize = 14 * strokeWidth;
    const props = {
      id: id,
      x: x - adornerSize / 2,
      y: y - adornerSize / 2,
      width: adornerSize,
      height: adornerSize,
      fill: ADORNER_FILL,
      stroke: ADORNER_STROKE,
      strokeWidth,
    };
    const shape = new Shape(ShapeId.RotateNW, props);
    return shape;
  }

  private createAdornerRotateShapeNE(
    id: string,
    x: number,
    y: number,
    zoom: number
  ): Shape {
    const strokeWidth = 1 / zoom;
    const adornerSize = 14 * strokeWidth;
    const props = {
      id: id,
      x: x - adornerSize / 2,
      y: y - adornerSize / 2,
      width: adornerSize,
      height: adornerSize,
      fill: ADORNER_FILL,
      stroke: ADORNER_STROKE,
      strokeWidth,
    };
    const shape = new Shape(ShapeId.RotateNE, props);
    return shape;
  }

  private createAdornerRotateShapeSW(
    id: string,
    x: number,
    y: number,
    zoom: number
  ): Shape {
    const strokeWidth = 1 / zoom;
    const adornerSize = 14 * strokeWidth;
    const props = {
      id: id,
      x: x - adornerSize / 2,
      y: y - adornerSize / 2,
      width: adornerSize,
      height: adornerSize,
      fill: ADORNER_FILL,
      stroke: ADORNER_STROKE,
      strokeWidth,
    };
    const shape = new Shape(ShapeId.RotateSW, props);
    return shape;
  }

  private createAdornerRotateShapeSE(
    id: string,
    x: number,
    y: number,
    zoom: number
  ): Shape {
    const strokeWidth = 1 / zoom;
    const adornerSize = 14 * strokeWidth;
    const props = {
      id: id,
      x: x - adornerSize / 2,
      y: y - adornerSize / 2,
      width: adornerSize,
      height: adornerSize,
      fill: ADORNER_FILL,
      stroke: ADORNER_STROKE,
      strokeWidth,
    };
    const shape = new Shape(ShapeId.RotateSE, props);
    return shape;
  }

  // --- Methods for subclasses to override ---

  protected startOver(clientPos: Point2D, modifiers: Modifiers, shape?: Shape | Photo) {
    // Refer to unused parameters to avoid build errors.
    clientPos;
    modifiers;
    shape;
  }

  protected endOver(clientPos: Point2D, modifiers: Modifiers, shape?: Shape) {
    // Refer to unused parameters to avoid build errors.
    clientPos;
    modifiers;
    shape;
  }

  protected startClick(
    clientPos: Point2D,
    modifiers: Modifiers,
    shape?: Shape | Photo
  ) {
    // Refer to unused parameters to avoid build errors.
    clientPos;
    modifiers;
    shape;
  }

  protected endClick(clientPos: Point2D, modifiers: Modifiers) {
    // Refer to unused parameters to avoid build errors.
    clientPos;
    modifiers;
  }

  protected startDrag(clientPos: Point2D, modifiers: Modifiers, shape?: Shape | Photo) {
    // Refer to unused parameters to avoid build errors.
    clientPos;
    modifiers;
    shape;
  }

  protected continueDrag(clientPos: Point2D, modifiers: Modifiers) {
    // Refer to unused parameters to avoid build errors.
    clientPos;
    modifiers;
  }

  protected endDrag(clientPos: Point2D, modifiers: Modifiers) {
    // Refer to unused parameters to avoid build errors.
    clientPos;
    modifiers;
  }

  public keyDown(key: string, modifiers: Modifiers): boolean {
    // Refer to unused parameters to avoid build errors.
    key;
    modifiers;
    return false;
  }

  public keyUp(key: string, modifiers: Modifiers): boolean {
    // Refer to unused parameters to avoid build errors.
    key;
    modifiers;
    return false;
  }

  // --- Event handlers ---

  // private currentOverPointer: PointerEvent = new PointerEvent("", undefined);

  private handlePointerOver = (e: PointerEvent, shape?: Shape | Photo) => {
    store.currentOverPointer = e;
    store.currentOverShape = shape;
    const { altKey, ctrlKey, metaKey, shiftKey, clientX: x, clientY: y } = e;
    const modifiers = { altKey, ctrlKey, metaKey, shiftKey };
    this.overClientPos = { x, y };
    if (shape) {
      shape.isHovered = true;
      if (shape.children) {
        if (shape.children?.length > 0) {
          if (!store.hasDoneHelp) {
            store.isHelpDiscover = true;
          }
        }
      }
    }
    this.startOver(this.overClientPos, modifiers, shape);
    if (this.isWheeling && shape) {
      this.isWheeling = false;
      if (shape.isHovered) {
        store.overLockedShape = shape;
      }
    }

    // let topMostShape: Shape = new Shape(ShapeId.Ellipse, undefined);
    // store.selectedShapes.map(selectedShape => {
    //     const pos: Point2D = {
    //         x: selectedShape.x,
    //         y: selectedShape.y,
    //     };
    //     const size: Point2D = {
    //         x: selectedShape.width,
    //         y: selectedShape.height,
    //     };
    //     if (this.isPointerOverBox(pos, size)) {
    //         topMostShape = selectedShape;
    //     }
    // });

    // if (topMostShape.id !== ShapeId.Ellipse) {  // Mouse is over a selected object, get the topmost selected
    //     this.turnOverOff();
    //     store.cursorSrc = "images/cursor-remove.svg";
    //     topMostShape.isHovered = true;
    //     console.log("==>", topMostShape.id);
    // } else {                                    // If it's not over selected, then change to Add cursor
    //     store.cursorSrc = "images/cursor-add.svg";
    // }

    let isMouseOverSelected = false;
    if (store.selectedShapes.length > 0) {
      store.selectedShapes.map((selectedShape) => {
        if (shape === selectedShape) {
          isMouseOverSelected = true;
        }
      });
      store.cursorSrc = isMouseOverSelected
        ? "images/cursor-remove.svg"
        : "images/cursor-add.svg";
    }
  };

  private turnOverOff() {
    store.shapes.map((shape) => {
      shape.isHovered = false;
    });
  }

  private handlePointerOut = (shape: Shape | Photo) => {
    store.isHelpDiscover = false;
    if (shape) {
      shape.isHovered = false;
    }
    store.deleteOverShape(shape);
    if (this.isWheeling) {
      //this.isWheeling = false;
    } else {
      if (store.overLockedShape) {
        if (store.overLockedShape.id === shape.id) {
          store.overLockedShape = undefined;
          store.previousParents = [];
          store.buildHierarchy();
        }
      }
    }
    store.cursorSrc = "images/cursor-add.svg";
  };

  private currentAdornerPressedId: string = "";

  private handlePointerDownAdorner = (e: PointerEvent, shape: Shape | Photo | undefined) => {

    if (shape) {
      store.currentDownShape = store.selectedShapes[0];

      this.currentAdornerPressedId = shape.id;

      if (this.currentAdornerPressedId === "rotateAdorner") {
        const centerX =
          store.selectedShapes[0].x +
          (store.selectedShapes[0].width * store.selectedShapes[0].scale) / 2;
        const centerY =
          store.selectedShapes[0].y +
          (store.selectedShapes[0].height * store.selectedShapes[0].scale) / 2;
        const xx = centerX - store.mousePos.x;
        const yy = centerY - store.mousePos.y;
        this.dragStartAngle = (Math.atan2(yy, xx) * 180) / Math.PI;
        this.dragStartRotation = store.selectedShapes[0].rotation;
      }

      switch (this.currentAdornerPressedId) {
        case "scaleAdornerNE":
        case "scaleAdornerSE":
        case "scaleAdornerNW":
        case "scaleAdornerSW":
          const { clientX: x, clientY: y } = e;

          this.dragStartClientPos = { x, y };
          this.dragCurrentClientPos = { x, y };
          this.dragStartShapePos.x = store.selectedShapes[0].x;
          this.dragStartShapePos.y = store.selectedShapes[0].y;
          this.dragStartShapeSize.x =
            store.selectedShapes[0].width * store.selectedShapes[0].scale;
          this.dragStartShapeSize.y =
            store.selectedShapes[0].height * store.selectedShapes[0].scale;
          this.dragStartScale = store.selectedShapes[0].scale;
          break;
        default:
          break;
      }

      if (e.isPrimary && (e.pointerType !== "mouse" || e.buttons === 1)) {
        this.pointerId = e.pointerId;
        store.isDragging = true;
        window.addEventListener("pointerup", this.handlePointerUp);
        window.addEventListener(
          "lostpointercapture",
          this.handleLostPointerCapture
        );
        const {
          // altKey,
          // ctrlKey,
          // metaKey,
          // shiftKey,
          clientX: x,
          clientY: y,
        } = e;
        //const modifiers = { altKey, ctrlKey, metaKey, shiftKey };
        this.dragStartClientPos = { x, y };
        this.dragCurrentClientPos = { x, y };
        this.dragStartShape = store.currentDownShape;

        //this.startClick(this.dragStartClientPos, modifiers, store.currentDownShape);

        // Capture subsequent pointer events.
        (e.target as Element).setPointerCapture(e.pointerId);
        e.preventDefault();
        e.stopPropagation();
      }
    };

  //   private handlePointerUpAdorner = (e: PointerEvent) => {
  //     store.isMarquee = false;
  //     store.isDragging = false;
  //     this.editor.requestUpdate();
  //   };
  }

  private handlePointerDown = (e: PointerEvent, shape: Shape | Photo | undefined) => {

    store.contextMenuVisibility = false;
    store.HeliosPropertiesVisibility = false;
    store.isColorWheelVisible = false;

    if (shape) {
      store.tryitMessageVisibility = "hidden";

      store.currentDownShape = shape;
      console.log("Store currentDownShape = " + store.currentDownShape?.id);
      store.currentConnections = [ store.currentDownShape.id ];

      this.currentAdornerPressedId = "";

      store.showContextMenu = false;

      if (e.isPrimary && (e.pointerType !== "mouse" || e.buttons === 1)) {
        this.pointerId = e.pointerId;
        store.isDragging = false;
        store.wasDragging = false;
        window.addEventListener("pointerup", this.handlePointerUp);
        window.addEventListener(
          "lostpointercapture",
          this.handleLostPointerCapture
        );
        const { altKey, ctrlKey, metaKey, shiftKey, clientX: x, clientY: y } = e;
        const modifiers = { altKey, ctrlKey, metaKey, shiftKey };
        this.dragStartClientPos = { x, y };
        this.dragCurrentClientPos = { x, y };
        this.dragStartShape = store.currentDownShape;

        this.startClick(
          this.dragStartClientPos,
          modifiers,
          store.currentDownShape
        );

        // Capture subsequent pointer events.
        (e.target as Element).setPointerCapture(e.pointerId);
        e.preventDefault();
        e.stopPropagation();
      }
    } else {
      // Clicked on backdrop (no shape) - hide context menu, deselect all shapes, and clear hover states
      console.log("Clicked on backdrop - hiding context menu, deselecting all shapes, and clearing hover states");
      store.contextMenuVisibility = false;
      store.HeliosPropertiesVisibility = false;
      store.showContextMenu = false;
      store.clearSelectedShapes();
      this.turnOverOff();
    }
  };

  private handlePointerMove = (e: PointerEvent) => {

    store.mousePos = this.editor.getDocumentPosition({
      x: e.clientX,
      y: e.clientY,
    });
    store.pagePos = {
      x: e.pageX,
      y: e.pageY,
    };

    store.showLoupe = false;

    if ((store.currentDownShape?.id === "person-man") || (store.currentDownShape?.id === "person-boy") || (store.currentDownShape?.id === "person-old")) {

      if (store.currentProperty === "age") {
        switch (store.overShape?.id) {
          case "boy-right":
            store.showLoupe = true;
            store.loupeImg = "images/he-thumb-age.jpg";
            store.loupeColor = "";
            break;
          case "sofa-orange":
          case "sofa-material":
          case "sofa-color":
          case "sofa2":
          case "sofa":
          case "fluffy-texture":
          case "wall-back":
          case "wall-back2":
          case "wall-back3":
            store.showLoupe = true;
            store.loupeImg = "images/he-thumb-what.jpg";
            store.loupeColor = "";
            break;
          case "old-woman":
            store.showLoupe = true;
            store.loupeImg = "images/he-thumb-old.jpg";
            store.loupeColor = "";
            break;
        }
      }

    }

    if ((store.currentDownShape?.id === "wall-back") || (store.currentDownShape?.id === "wall-back2") || (store.currentDownShape?.id === "wall-back3")) {

      if (store.currentProperty === "material") {
        switch (store.overShape?.id) {
          case "sofa-orange":
          case "sofa-material":
            store.loupeImg = "images/he-mat2.png";
            store.loupeColor = "";
            store.showLoupe = true;
            break;
          case "fluffy-texture":
            store.loupeImg = "images/he-mat3.png";
            store.loupeColor = "";
            store.showLoupe = true;
            break;
        }
      }

      if (store.currentProperty === "color") {
        switch (store.overShape?.id) {
          case "sofa-orange":
          case "sofa-material":
          case "sofa-color":
            store.showLoupe = true;
            store.loupeImg = "";
            store.loupeColor = "#bc602d";
            break;
          case "sofa":
            store.showLoupe = true;
            store.loupeImg = "";
            store.loupeColor = "#9e978f";
            break;
          case "fluffy-texture":
            store.showLoupe = true;
            store.loupeImg = "";
            store.loupeColor = "#ada49b";
            break;
        }
      }

    }

    if ((store.currentDownShape?.id === "sofa") || (store.currentDownShape?.id === "sofa-material") || (store.currentDownShape?.id === "sofa-color")) {

      if (store.currentProperty === "color") {
        switch (store.overShape?.id) {
          case "sofa-orange":
            store.showLoupe = true;
            store.loupeImg = "";
            store.loupeColor = "#bc602d";
            break;
        }
      } 

      if (store.currentProperty === "material") {
        switch (store.overShape?.id) {
          case "sofa-orange":
            store.loupeImg = "images/he-mat2.png";
            store.loupeColor = "";
            store.showLoupe = true;
            break;
          case "fluffy-texture":
            store.loupeImg = "images/he-mat3.png";
            store.loupeColor = "";
            store.showLoupe = true;
            break;
        }
      } 

      if (store.currentProperty === "replace object") {
        switch (store.overShape?.id) {
          case "sofa-orange":
            store.loupeImg = "images/he-thumb-sofa2.jpg";
            store.loupeColor = "";
            store.showLoupe = true;
            break;
        }
      } 

    }

    // ------------------------------------------
    // ROTATE

    // const selectedShape = store.currentDownShape;

    // const screenWindowRatioX = 1.2;
    // const screenWindowRatioY = 2.4;

    // if (this.currentAdornerPressedId === "rotateAdorner") {
    //   if (selectedShape) {
    //     const centerX =
    //       selectedShape.x + (selectedShape.width * selectedShape.scale) / 2;
    //     const centerY =
    //       selectedShape.y + (selectedShape.height * selectedShape.scale) / 2;
    //     const x = centerX - store.mousePos.x;
    //     const y = centerY - store.mousePos.y;
    //     const deltaAngle =
    //       (this.dragStartAngle - (Math.atan2(y, x) * 180) / Math.PI) * -1;
    //     selectedShape.rotation = this.dragStartRotation + deltaAngle;
    //   }
    //   return;
    // }

    // // ------------------------------------------
    // // SCALE

    // if (this.currentAdornerPressedId === "scaleAdornerSE") {
    //   if (selectedShape) {
    //     const deltaX =
    //       (this.dragStartClientPos.x - e.clientX) * selectedShape.scale;
    //     const deltaY =
    //       (this.dragStartClientPos.y - e.clientY) * selectedShape.scale;
    //     const newScale = 
    //       this.dragStartScale -
    //         (deltaX + deltaY) /
    //           ((selectedShape.width / screenWindowRatioX) * selectedShape.scale * screenWindowRatioY);
    //     if (newScale > 0.015) {
    //       selectedShape.scale = newScale;
    //     }
    //   }
    //   return;
    // }

    // if (this.currentAdornerPressedId === "scaleAdornerNE") {
    //   if (selectedShape) {
    //     const deltaX =
    //       (this.dragStartClientPos.x - e.clientX) * selectedShape.scale;
    //     const deltaY =
    //       (this.dragStartClientPos.y - e.clientY) * selectedShape.scale * -1;
    //     const offset =
    //       (deltaX + deltaY) /
    //       ((selectedShape.width / screenWindowRatioX) * selectedShape.scale * screenWindowRatioY);
    //     const newScale = this.dragStartScale - offset;
    //     if (newScale > 0.015) {
    //       selectedShape.scale = newScale;
    //       const deltaPosY =
    //         selectedShape.height * selectedShape.scale -
    //         this.dragStartShapeSize.y;
    //       selectedShape.y = this.dragStartShapePos.y - deltaPosY;
    //     }
    //   }
    //   return;
    // }

    // if (this.currentAdornerPressedId === "scaleAdornerSW") {
    //   if (selectedShape) {
    //     const deltaX =
    //       (this.dragStartClientPos.x - e.clientX) * selectedShape.scale;
    //     const deltaY =
    //       (this.dragStartClientPos.y - e.clientY) * selectedShape.scale * -1;
    //     const offset =
    //       (deltaX + deltaY) /
    //       ((selectedShape.width / screenWindowRatioX) * selectedShape.scale * screenWindowRatioY);
    //     const newScale = this.dragStartScale + offset;
    //     if (newScale > 0.015) {
    //       selectedShape.scale = newScale;
    //       const deltaPosX =
    //         selectedShape.width * selectedShape.scale - this.dragStartShapeSize.x;
    //       selectedShape.x = this.dragStartShapePos.x - deltaPosX;
    //     }
    //   }
    //   return;
    // }

    // if (this.currentAdornerPressedId === "scaleAdornerNW") {
    //   if (selectedShape) {
    //     const deltaX =
    //       (this.dragStartClientPos.x - e.clientX) * selectedShape.scale;
    //     const deltaY =
    //       (e.clientY - this.dragStartClientPos.y) * selectedShape.scale * -1;
    //     const offset =
    //       (deltaX + deltaY) /
    //       ((selectedShape.width / screenWindowRatioX) * selectedShape.scale * screenWindowRatioY);
    //     const newScale = this.dragStartScale + offset;
    //     if (newScale > 0.015) {
    //       selectedShape.scale = newScale;
    //       const deltaPosX =
    //         selectedShape.width * selectedShape.scale - this.dragStartShapeSize.x;
    //       selectedShape.x = this.dragStartShapePos.x - deltaPosX;
    //       const deltaPosY =
    //         selectedShape.height * selectedShape.scale -
    //         this.dragStartShapeSize.y;
    //       selectedShape.y = this.dragStartShapePos.y - deltaPosY;
    //     }
    //   }
    //   return;
    // }

    if (store.selectedShapes.length > 0) {

      if ((store.selectedShapes[0].id === "artwork1") || (store.selectedShapes[0].id === "artwork2") || (store.selectedShapes[0].id === "artwork3") || (store.selectedShapes[0].id === "artwork4")) {

        store.selectedShapes.map((selectedShape) => {
          console.log("selectedShape", selectedShape.id);
          const pos: Point2D = {
            x: selectedShape.x,
            y: selectedShape.y,
          };
          const size: Point2D = {
            x: selectedShape.width,
            y: selectedShape.height,
          };
          if (this.isPointerOverBox(pos, size)) {
            if (!store.isDragging) {
              this.turnOverOff();
              selectedShape.isHovered = true;
              store.overShape = selectedShape;
              selectedShape.visible = true;
              store.cursorSrc = "images/cursor-remove.svg";
            }
          }
        });

        if (!store.isShiftDown) {
          if (e.pointerId === this.pointerId) {
            this.dragCurrentClientPos = this.getClientPosition(e);
            const { altKey, ctrlKey, metaKey, shiftKey } = e;
            const modifiers = { altKey, ctrlKey, metaKey, shiftKey };
            if (!store.isDragging && this.exceedsDragTolerance) {
              store.isDragging = true;
              this.turnOverOff();
              if (this.dragStartShape) {
                console.log(this.dragStartShape.id);
                this.startDrag(
                  this.dragStartClientPos,
                  modifiers,
                  this.dragStartShape
                );
              }
            }
            if (store.isMarquee) {
              //this.selectShapesInsideMarquee();
            } else {
              if (store.isDragging) {
                this.turnOverOff();

                this.continueDrag(this.dragCurrentClientPos, modifiers);

                // Hit test with shapes under current mouse position
                let topMostShape: Shape | Photo | null = null;
                let highestZIndex = -1;
                
                store.shapes.forEach((shape: Shape | Photo) => {
                  if (shape.id !== this.dragStartShape?.id) {
                    const pos: Point2D = { x: shape.x, y: shape.y };
                    const size: Point2D = { x: shape.width * shape.scale, y: shape.height * shape.scale };
                    if (this.isPointerOverBox(pos, size)) {
                      // Check if this shape has a higher zIndex
                      if (shape.zindex > highestZIndex) {
                        // Clear previous top shape
                        if (topMostShape) {
                          topMostShape.isHovered = false;
                        }
                        topMostShape = shape;
                        highestZIndex = shape.zindex;
                      }
                    }
                  }
                });
                
                // Set hover state only for the topmost shape
                if (topMostShape) {
                  (topMostShape as Shape | Photo).isHovered = true;
                  store.overShape = topMostShape;
                }
              }
            }
          }
        } else {
          //this.selectShapesInsideMarquee();
        }


      }
    }

    this.editor.requestUpdate();
    e.preventDefault();
    e.stopPropagation();
  };

  // private selectShapesInsideMarquee() {
  //     store.shapes.map(shape => {
  //         const docPos = this.editor.getDocumentPosition( { x: shape.x, y: shape.y} );
  //         const sx1 = Math.trunc( docPos.x * store.zoom * (-1) + (shape.x / store.zoom) * 2 );
  //         const sy1 = Math.trunc( docPos.y * store.zoom * (-1) + (shape.y / store.zoom) * 2 );
  //         const sx2 = Math.trunc( sx1 + shape.width * store.zoom );
  //         const sy2 = Math.trunc( sy1 + shape.height * store.zoom );
  //         const mx = Math.trunc( store.startMarqueePoint.x );
  //         const my = Math.trunc( store.startMarqueePoint.y );
  //         const mw = Math.trunc( Math.max(store.startMarqueePoint.x - store.pagePos.x, store.pagePos.x - store.startMarqueePoint.x) );
  //         const mh = Math.trunc( Math.max(store.startMarqueePoint.y - store.pagePos.y, store.pagePos.y - store.startMarqueePoint.y) );

  //         // console.log('shape id = ', shape.id);
  //         // console.log("marqu = ", mx, (mx+mw), my, (my+mh));
  //         // console.log("shape = ", sx1, sx2, sy1, sy2);

  //         if ((sx1 > mx) && (sy1 > my) && (sx2 < (mx+mw)) && (sy2 < (my+mh))) {
  //             if (shape.isFirstLevel) {
  //                 shape.isHovered = false;
  //                 store.selectedShapes.push(shape);
  //                 store.updateProperties(shape);
  //                 shape.isSelected = true;
  //                 this.editor.requestUpdate();
  //             }
  //         }
  //     });
  // }

  private isPointerOverBox(pos: Point2D, size: Point2D): boolean {
    let state = false;
    const left = pos.x;
    const top = pos.y;
    const right = left + size.x;
    const bottom = top + size.y;
    const mx = store.mousePos.x;
    const my = store.mousePos.y;
    if (mx >= left && mx <= right && my >= top && my <= bottom) {
      state = true;
    }
    return state;
  }

  private handlePointerUp = (e: PointerEvent) => {
    //store.showContextMenu = false;

    store.wasDragging = store.isDragging;

    this.currentAdornerPressedId = "";
    store.currentConnections = [];
    store.currentShapes = [];

    if (store.isDragging) {
      store.isConnectionVisible = false;
    } else {

      if ((store.currentOverShape?.id !== "sofa-orange") && (store.currentOverShape?.id !== "fluffy-texture") && (store.currentOverShape?.id !== "old-woman")) {

        store.isConnectionVisible = true;
        // Standard connection for single click on object
        switch (store.currentOverShape?.id) {
          case "person-boy":
          case "person-man":
          case "person-old":
          case "boy-right":
          case "old-woman":
            store.currentConnections.push("");
            store.currentConnections.push("");
            store.currentConnections.push("replace object");
            store.currentConnections.push("age");
            store.currentConnections.push("body posing");
            store.currentConnections.push("body type");
            store.currentConnections.push("clothes");
            store.currentConnections.push("eye direction");
            store.currentConnections.push("eye (red eye)");
            store.currentConnections.push("expression");
            store.currentConnections.push("face direction");
            store.currentConnections.push("facial hair");
            store.currentConnections.push("gender");
            store.currentConnections.push("hair color");
            store.currentConnections.push("hair style");
            store.currentConnections.push("hair length");
            store.currentConnections.push("hair texture");
            store.currentConnections.push("hair volume");
            store.currentConnections.push("hair density");
            store.currentConnections.push("hair shine");
            store.currentConnections.push("lips fullness");
            store.currentConnections.push("nose type");
            store.currentConnections.push("nose size");
            store.currentConnections.push("");
            store.currentConnections.push("");
            break;
          case "ceiling":
          case "wall-back":
            store.currentConnections.push("");
            store.currentConnections.push("");
            store.currentConnections.push("artist wallpaper");
            store.currentConnections.push("artistic style");
            store.currentConnections.push("brilliancy");
            store.currentConnections.push("color");
            store.currentConnections.push("interior style");
            store.currentConnections.push("lighting");
            store.currentConnections.push("material");
            store.currentConnections.push("");
            store.currentConnections.push("");
            break;
          case "sofa-orange":
            store.currentConnections.push("");
            store.currentConnections.push("");
            store.currentConnections.push("add object");
            store.currentConnections.push("replace object");
            store.currentConnections.push("color");
            store.currentConnections.push("material");
            store.currentConnections.push("");
            store.currentConnections.push("");
            break;
          default:
            store.currentConnections.push("");
            store.currentConnections.push("");
            store.currentConnections.push("replace object");
            store.currentConnections.push("color");
            store.currentConnections.push("material");
            store.currentConnections.push("style");
            store.currentConnections.push("");
            store.currentConnections.push("");
            break;
        }

      }
    }
    // const connection = store.currentDownShape?.id.toString() + "->" + store.overShape?.id.toString();
    // store.currentShapes.push(store.currentDownShape?.id.toString() ?? "");
    // store.currentShapes.push(store.overShape?.id.toString() ?? "");
    // switch (connection) {
    //   case "sofa-orange->sofa":
    //     store.currentConnections.push("replace couch");
    //     store.currentConnections.push("color");
    //     store.currentConnections.push("material");
    //     break;
    //   case "sofa-orange->wall-back":
    //     store.currentConnections.push("add couch");
    //     store.currentConnections.push("color");
    //     store.currentConnections.push("material");
    //     break;
    //   case "sofa-orange->sofa-material":
    //     store.currentConnections.push("replace couch");
    //     store.currentConnections.push("color");
    //     break;
    //   default:
        //store.isConnectionVisible = false;
    //}

    if (
      e.pointerId === this.pointerId &&
      (e.pointerType !== "mouse" || e.button === 0)
    ) {
      if (store.isShiftDown) {
        if (store.currentDownShape) {
          if (store.currentDownShape.isSelected) {
            store.removeSelectedShape(store.currentDownShape);
            store.currentDownShape.isSelected = false;
            if (!store.currentDownShape.isFirstLevel) {
              store.currentDownShape.visible = false;
            }
          } else {
            store.selectThis(store.currentDownShape);
          }
        }
      } else {
        if (store.currentDownShape?.isSelected) {
          if (!store.currentDownShape?.isFirstLevel && !store.isDragging) {
            store.clearSelectedShapes();
            if (store.currentDownShape?.parents) {
              store.selectThis(store.currentDownShape?.parents[0]);
            }
          } else {
            if (store.isDragging) {
              store.isDragging = false;
            }
            if (!store.isDragging) {
              if (store.currentDownShape?.children) {
                if (store.currentDownShape?.children?.length > 0) {
                  this.handleDoubleClick(e, store.currentDownShape);
                }
              }
            }
          }
        } else {
          if (!store.isDragging) {
            if (store.currentDownShape) {
              store.clearSelectedShapes();
              store.selectThis(store.currentDownShape);
            }
          }
        }
      }
      (e.target as Element).releasePointerCapture(e.pointerId);
      this.endInteraction(e);
    }
    store.lastSelectedShapes = store.selectedShapes;
    store.isMarquee = false;
    
    // Capture dragging state before resetting it
    store.isDragging = false;
    this.editor.requestUpdate();
  };


  private handleClick = (e: PointerEvent) => {

    if ((store.currentDownShape?.id != "artwork1")
        && (store.currentDownShape?.id != "artwork2") 
        && (store.currentDownShape?.id != "artwork3")
        && (!store.isEyedropping)
        && (store.currentOverShape?.id !== "sofa-orange")
        && (store.currentOverShape?.id !== "fluffy-texture")
        && (store.currentOverShape?.id !== "old-woman")
      ) {
      if (!store.wasDragging) {
        store.contextMenuVisibility = true;
      }
    }

 

    // Set context menu position to mouse position
    store.posContextMenu = {
      x: e.clientX,
      y: e.clientY
    };
    
    // store.showContextMenu = false;

    // store.currentDownShape = shape;
    
    // this.handlePointerDown(e, shape);
    // this.handlePointerDownAdorner(e, shape);

  }

  private handleDoubleClick = (e: PointerEvent, shape?: Shape | Photo) => {
    store.showContextMenu = false;


    this.currentAdornerPressedId = "";

    // if (store.isHelpDoubleClick && !store.hasDoneHelp) {
    //     store.isHelpDoubleClick = false;
    //     store.hasDoneHelp = true;
    //     store.showHelpIconBubble = true;
    //     store.showRewardDouble = true;
    //     this.rewardSound.play();
    //     setInterval(this.closeHelpBubble, 7000);
    // }

    let hasChildren = false;
    let lastShapeFound: Shape | Photo = new Shape(ShapeId.Ellipse, undefined);

    if (shape?.children) {
      if (shape?.children.length > 0) {
        shape.children.map((level2) => {
          const pos: Point2D = {
            x: level2.x,
            y: level2.y,
          };
          const size: Point2D = {
            x: level2.width,
            y: level2.height,
          };
          if (this.isPointerOverBox(pos, size)) {
            lastShapeFound = level2;
          }
          if (level2.children) {
            level2.children.map((level3) => {
              const pos: Point2D = {
                x: level3.x,
                y: level3.y,
              };
              const size: Point2D = {
                x: level3.width,
                y: level3.height,
              };
              if (this.isPointerOverBox(pos, size)) {
                lastShapeFound = level3;
              }
            });
          }
        });
        if (lastShapeFound) {
          lastShapeFound.visible = true;
          //store.previousParents.push(shape);
          hasChildren = true;
          store.overLockedShape = lastShapeFound;
          // if (store.selectedShapes.length > 0) { // Why need this?
          if (!store.isShiftDown) {
            store.clearSelectedShapes();
            store.selectThis(lastShapeFound);
            // store.selectedShapes.push(lastShapeFound);
            // store.updateProperties(lastShapeFound);
            // lastShapeFound.isSelected = true;
          } else {
            store.selectThis(lastShapeFound);
            // store.selectedShapes.push(lastShapeFound);
            // store.updateProperties(lastShapeFound);
            // lastShapeFound.isSelected = true;
          }
        }
      }
    }

    if (hasChildren) {
      //store.selectedShapes = undefined;
      store.isPropertySliderOn = false;
      store.isPropertyHueOn = false;
      store.isPropertyBrightnessOn = false;
    }

    e.stopPropagation();
  };

  private isWheeling = false;
  private isWaitingWheel = false;

  private handleWheel = (e: WheelEvent, shape?: Shape | Photo) => {
    this.isWheeling = true;
    if (!this.isWaitingWheel) {
      this.isWaitingWheel = true;
      setTimeout(this.waitForNetWheel.bind(this), 500);
      const delta = e.deltaY === 0 ? e.deltaX : e.deltaY;
      if (delta > 0) {
        if (!shape?.isSelected) {
          store.clearSelectedShapes();
          if (shape) {
            store.selectThis(shape);
          }
        } else {
          if (shape?.children) {
            shape.children.map((nextLevelShape) => {
              const pos: Point2D = {
                x: nextLevelShape.x,
                y: nextLevelShape.y,
              };
              const size: Point2D = {
                x: nextLevelShape.width,
                y: nextLevelShape.height,
              };

              if (this.isPointerOverBox(pos, size)) {
                store.moveToNextSubObject();
              }
            });
          }
        }
        this.editor.requestUpdate();
      } else {
        if (store.selectedShapes.length === 1) {
          const shape = store.selectedShapes[0];
          store.clearSelectedShapes();
          if (shape.parents) {
            if (shape.parents?.length > 0) {
              store.selectThis(shape.parents[shape.parents.length - 1]);
            }
          }
        }
      }
    }
    this.editor.requestUpdate();
  };

  private waitForNetWheel = () => {
    this.isWheeling = false;
    this.isWaitingWheel = false;
  };

  private handleLostPointerCapture = (e: PointerEvent) => {
    this.currentAdornerPressedId = "";
    //store.showContextMenu = false;
    store.isMarquee = false;
    //window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener(
      "lostpointercapture",
      this.handleLostPointerCapture
    );
    this.endInteraction(e);
  };

  private endInteraction(e: PointerEvent) {
    this.currentAdornerPressedId = "";
    //store.showContextMenu = false;
    store.isMarquee = false;
    if (this.pointerId !== undefined) {
      this.dragCurrentClientPos = this.getClientPosition(e);
      const { altKey, ctrlKey, metaKey, shiftKey } = e;
      const modifiers = { altKey, ctrlKey, metaKey, shiftKey };
      if (store.isDragging) {
        this.endDrag(this.dragCurrentClientPos, modifiers);
      } else {
        this.endClick(this.dragCurrentClientPos, modifiers);
      }
      this.pointerId = undefined;
      store.isDragging = false;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  // --- Helpers ---

  private getClientPosition(e: PointerEvent): Point2D {
    return { x: e.clientX, y: e.clientY };
  }

  private get exceedsDragTolerance(): boolean {
    const deltaX = this.dragCurrentClientPos.x - this.dragStartClientPos.x;
    const deltaY = this.dragCurrentClientPos.y - this.dragStartClientPos.y;
    const squaredDistance = deltaX * deltaX + deltaY * deltaY;
    return squaredDistance > DRAG_TOLERANCE * DRAG_TOLERANCE;
  }
}
