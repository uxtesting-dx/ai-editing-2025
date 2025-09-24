import { makeAutoObservable } from "mobx";
import type { Photo } from "./Photo.js";

export enum ShapeId {
    Rectangle = "rectangle",
    Ellipse = "ellipse",
    Star = "star",
    Image = "image",
    ImageOver = "imageover",
    ImageSelected = "imageselected",
    RotateNW = "rotatenw",
    RotateSW = "rotatesw",
    RotateNE = "rotatene",
    RotateSE = "rotatese",
    Scale = "scale",
    WallBackColor = "WallBackColor"
}

export interface ShapeProperties {
    blendMode?: string;
    id?: string;
    label?: string;
    isFirstLevel?: boolean;
    x?: number;
    y?: number;
    rotation?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    visible?: boolean;
    interactive?: boolean;
    src?: string;
    pathData?: string;
    parents?: Array<Shape | Photo>;
    children?: Array<Shape | Photo>;
    isHovered?: boolean;
    isSelected?: boolean;
    hue?: number;
    brightness?: number;
    zindex?: number;
    scan?: boolean;
    scale?: number;
}

export class Shape {
    shapeId: ShapeId;
    id: string;
    label: string;
    isFirstLevel?: boolean;
    x: number;
    y: number;
    rotation: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    visible?: boolean;
    interactive: boolean;
    src: string;
    pathData?: string;
    children?: Array<Shape | Photo>;
    parents?: Array<Shape | Photo>;
    isHovered?: boolean;
    isSelected?: boolean;
    hue: number;
    brightness: number;
    zindex: number;
    scan: boolean;
    scale: number;
    blendMode: string;

    constructor(shapeId: ShapeId, properties: ShapeProperties = {}) {
        this.shapeId = shapeId;
        this.id = properties?.id ?? "";
        this.label = properties?.label ?? "";
        this.isFirstLevel= properties.isFirstLevel ?? false;
        this.x = properties?.x ?? 0;
        this.y = properties?.y ?? 0;
        this.rotation = properties?.rotation ?? 0;
        this.width = properties?.width ?? 0;
        this.height = properties?.height ?? 0;
        this.fill = properties?.fill ?? "#cccccc";
        this.stroke = properties?.stroke ?? "#333333";
        this.strokeWidth = properties?.strokeWidth ?? 3;
        this.opacity = properties?.opacity ?? 1;
        this.visible = properties?.visible ?? true;
        this.interactive = properties?.interactive ?? true;
        this.src = properties?.src ?? "";
        this.pathData = properties?.pathData ?? "";
        this.children = properties?.children ?? [];
        this.parents = properties?.parents ?? [];
        this.isHovered = properties?.isHovered ?? false;
        this.isSelected = properties?.isSelected ?? false;
        this.hue = properties?.hue ?? 0;
        this.brightness = properties?.brightness ?? 1;
        this.zindex = properties?.zindex ?? 1;
        this.scan = properties.scan ?? false;
        this.scale = properties.scale ?? 1;
        this.blendMode = properties.blendMode ?? "normal";

        makeAutoObservable(this);
    }
}
