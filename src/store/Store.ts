import { makeAutoObservable, observable, reaction } from "mobx";

import { Artboard } from "./Artboard.js";
import { Shape, ShapeId } from "./Shape.js";
import { Photo, PhotoId } from "./Photo.js";

export enum Theme {
    Dark = "dark",
    Light = "light",
}

export enum AppMode {
    Home = "home",
    Edit = "edit",
}

export enum ToolId {
    Select = "select",
    Rectangle = "rectangle",
    Ellipse = "ellipse",
    Star = "star",
    Hand = "hand",
    Zoom = "zoom",
}

export interface Point2D {
    x: number;
    y: number;
}

export class Store {
    constructor() {
        // Use autoBind to ensure that methods like toggleTheme() can be used as event handlers
        // directly within UI components.
        makeAutoObservable(this, {}, { autoBind: true });

        this.buildHierarchy();
        this.setupRelativePositioning();
    }

    private setupRelativePositioning() {
        // Set up reactive relationship between artwork1 and sofa
        reaction(
            () => {
                const artwork1 = this.shapes.find(shape => shape.id === "artwork1") as Photo;
                return artwork1 ? { x: artwork1.x, y: artwork1.y } : null;
            },
            (artwork1Position) => {
                if (artwork1Position) {

                    const overlayPhoto = this.shapes.find(shape => shape.id === "overlay-photo") as Shape;

                    const sofa = this.shapes.find(shape => shape.id === "sofa") as Shape;
                    const sofa2 = this.shapes.find(shape => shape.id === "sofa2") as Shape;
                    const sofaBack = this.shapes.find(shape => shape.id === "sofa-back") as Shape;
                    
                    const sofaMaterial = this.shapes.find(shape => shape.id === "sofa-material") as Shape;
                    const wallBack = this.shapes.find(shape => shape.id === "wall-back") as Shape;
                    const ceiling = this.shapes.find(shape => shape.id === "ceiling") as Shape;
                    const ceilingMaterial = this.shapes.find(shape => shape.id === "ceiling-material") as Shape;
                    const ceilingColor = this.shapes.find(shape => shape.id === "ceiling-color") as Shape;
                    const wallBackColor = this.shapes.find(shape => shape.id === "wall-back-color") as Shape;
                    const wallBack2 = this.shapes.find(shape => shape.id === "wall-back2") as Shape;
                    const wallBack3 = this.shapes.find(shape => shape.id === "wall-back3") as Shape;

                    const personBoy = this.shapes.find(shape => shape.id === "person-boy") as Shape;
                    const personMan = this.shapes.find(shape => shape.id === "person-man") as Shape;
                    const personOld = this.shapes.find(shape => shape.id === "person-old") as Shape;
                    const boyRight = this.shapes.find(shape => shape.id === "boy-right") as Shape;

                    if (personBoy) {
                        personBoy.x = artwork1Position.x + 105;
                        personBoy.y = artwork1Position.y + 605;
                    }
                    if (personMan) {
                        personMan.x = artwork1Position.x + 106;
                        personMan.y = artwork1Position.y + 576;
                    }
                    if (personOld) {
                        personOld.x = artwork1Position.x + 94;
                        personOld.y = artwork1Position.y + 572;
                    }
                    if (boyRight) {
                        boyRight.x = artwork1Position.x + 440;
                        boyRight.y = artwork1Position.y + 632;
                    }


                    if (sofaBack) {
                        if (sofaBack.visible) {
                            sofaBack.x = artwork1Position.x + 230;
                            sofaBack.y = artwork1Position.y + 580;
                        }
                    }
                    if (ceilingColor) {
                        ceilingColor.x = artwork1Position.x + 15;
                        ceilingColor.y = artwork1Position.y + 0;
                    }
                    if (sofa) {
                        sofa.x = artwork1Position.x + 630; // 822 is the relative offset
                        sofa.y = artwork1Position.y + 610; // 490 is the relative offset
                    }
                    if (sofa2) {
                        if (sofa2.visible) {
                        sofa2.x = artwork1Position.x + 620; // 801 is the relative offset
                        sofa2.y = artwork1Position.y + 670; // 485 is the relative offset
                        }
                    }
                    if (sofaMaterial) {
                        if (sofaMaterial.visible) {
                            sofaMaterial.x = artwork1Position.x + 620; // 801 is the relative offset
                            sofaMaterial.y = artwork1Position.y + 610; // 485 is the relative offset
                        }
                    }

                    if (wallBackColor) {
                        wallBackColor.x = artwork1Position.x + 2;
                        wallBackColor.y = artwork1Position.y + 0;
                    }
                    if (wallBack) {
                        wallBack.x = artwork1Position.x + 1;
                        wallBack.y = artwork1Position.y + 0;
                    }
                    if (ceiling) {
                        ceiling.x = artwork1Position.x + 17;
                        ceiling.y = artwork1Position.y + 1;
                    }
                    if (ceilingMaterial) {
                        ceilingMaterial.x = artwork1Position.x + 16;
                        ceilingMaterial.y = artwork1Position.y + 7;
                    }
                    if (wallBack2) {
                        if (wallBack2.visible) {
                            wallBack2.x = artwork1Position.x + 0;
                            wallBack2.y = artwork1Position.y + 0;
                        }
                    }
                    if (wallBack3) {
                        if (wallBack3.visible) {
                            wallBack3.x = artwork1Position.x + 0;
                            wallBack3.y = artwork1Position.y + 0;
                        }
                    }
                }
            }
        );
        reaction(
            () => {
                const artwork2 = this.shapes.find(shape => shape.id === "artwork2") as Photo;
                return artwork2 ? { x: artwork2.x, y: artwork2.y } : null;
            },
            (artwork2Position) => {
                if (artwork2Position) {
                    const sofaOrange = this.shapes.find(shape => shape.id === "sofa-orange") as Shape;
                    const sofaGray = this.shapes.find(shape => shape.id === "sofa-gray") as Shape;
                    if (sofaOrange) {
                        sofaOrange.x = artwork2Position.x + 55; 
                        sofaOrange.y = artwork2Position.y + 114; 
                    }
                    if (sofaGray) {
                        sofaGray.x = artwork2Position.x + 73;
                        sofaGray.y = artwork2Position.y + 160;
                    }
                }
            }
        );
        reaction(
            () => {
                const artwork3 = this.shapes.find(shape => shape.id === "artwork3") as Photo;
                return artwork3 ? { x: artwork3.x, y: artwork3.y } : null;
            },
            (artwork3Position) => {
                if (artwork3Position) {
                    const fluffyTexture = this.shapes.find(shape => shape.id === "fluffy-texture") as Shape;
                    if (fluffyTexture) {
                        fluffyTexture.x = artwork3Position.x + 17; 
                        fluffyTexture.y = artwork3Position.y + 20; 
                    }
                }
            }
        );
        reaction(
            () => {
                const artwork4 = this.shapes.find(shape => shape.id === "artwork4") as Photo;
                return artwork4 ? { x: artwork4.x, y: artwork4.y } : null;
            },
                (artwork4Position) => {
                if (artwork4Position) {
                    const oldWoman = this.shapes.find(shape => shape.id === "old-woman") as Shape;
                    if (oldWoman) {
                        oldWoman.x = artwork4Position.x + 5; 
                        oldWoman.y = artwork4Position.y + 5; 
                    }
                }
            }
        );
    }

    private getShapeById(id: string): Shape | Photo {
        let s: Shape | Photo = new Shape(ShapeId.Ellipse, undefined);
        this.shapes.map((shape) => {
            if (shape.id === id) {
                s = shape;
            }
        });
        return s;
    }

    // --- Relation among object's connections ---

    public currentShapes: Array<String> = [];
    public currentConnections: Array<string> = [];
    public currentConnectionLabel: string = "";

    // --- Groups ---

    public currentDownShape?: Shape | Photo | undefined = new Shape(ShapeId.Ellipse, undefined);

    public previousParents: Array<Shape | Photo> = [];

    private _currentOverPointer?: PointerEvent = undefined;

    private _isHoveringArtboard?: Boolean = false;

    public showAlertDialog = false;

    public get isHoveringArtboard(): Boolean | undefined {
        return this._isHoveringArtboard;
    }

    public set isHoveringArtboard(isHovering: Boolean | undefined) {
        this._isHoveringArtboard = isHovering;
    }

    public isMarquee = false;

    public get currentOverPointer(): PointerEvent | undefined {
        return this._currentOverPointer;
    }

    public set currentOverPointer(shape: PointerEvent | undefined) {
        this._currentOverPointer = shape;
    }

    private _currentOverShape?: Shape | Photo = new Shape(ShapeId.Ellipse, undefined);

    public get currentOverShape(): Shape | Photo | undefined {
        return this._currentOverShape;
    }

    public set currentOverShape(shape: Shape | Photo | undefined) {
        this._currentOverShape = shape;
    }

    private _overLockedShape?: Shape | Photo = undefined;

    public get overLockedShape(): Shape | Photo | undefined {
        return this._overLockedShape;
    }

    public set overLockedShape(shape: Shape | Photo | undefined) {
        this._overLockedShape = shape;
    }

    public nextGroupLevel() {
        this.currentLevel++;
    }

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

    //private rewardSound = undefined; // = new Audio('media/reward.mp3');

    private currentTabShapeFocus: Shape | Photo | undefined;

    public tabNext() {
        if (this.selectedShapes.length > 0) {
            if (this.currentTabShapeFocus) {
                this.clearSelectedShapes();
                let index = this.shapes.indexOf(this.currentTabShapeFocus, 0);
                index = (index < this.shapes.length - 1) ? index+1 : index = 0;
                this.currentTabShapeFocus = this.shapes[index];
                this.selectThis(this.currentTabShapeFocus);
            }
        } else {
            this.clearSelectedShapes();
            this.currentTabShapeFocus = this.shapes[0];
            this.selectThis(this.currentTabShapeFocus);
        }
    }
    public tabPrevious() {
        if (this.selectedShapes.length > 0) {
            if (this.currentTabShapeFocus) {
                this.clearSelectedShapes();
                let index = this.shapes.indexOf(this.currentTabShapeFocus, 0);
                index = (index > 0) ? index-1 : index = this.shapes.length-1;
                this.currentTabShapeFocus = this.shapes[index];
                this.selectThis(this.currentTabShapeFocus);
            }

        } else {
            this.currentTabShapeFocus = this.shapes[this.shapes.length-1];
            this.selectThis(this.currentTabShapeFocus);
        }
    }

    public selectThis(shape: Shape | Photo) {
        this.selectedShapes.push(shape);
        this.updateProperties(shape);
        shape.isSelected = true;1
        this.currentTabShapeFocus = shape;
    }

    public moveToNextSubObject() {
        if (store.isHelpDiscover && !store.hasDoneHelp) {
            store.showRewardDiscover = true;
            store.isHelpDiscover = false;
            store.isHelpDoubleClick = true;
            //this.rewardSound.play();
        }
        const shape = this.currentOverShape;
        let hasChildren = false;
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
                    this.clearSelectedShapes();
                    nextLevelShape.visible = true;
                    store.previousParents.push(shape);
                    hasChildren = true;
                    store.overLockedShape = nextLevelShape;
                    this.selectThis(nextLevelShape);
                }
            });
        }
        if (hasChildren) {
            //this.selectedShapes = undefined;
            store.isPropertySliderOn = false;
            store.isPropertyHueOn = false;
            store.isPropertyBrightnessOn = false;
            //this.handlePointerMove(this.currentOverPointer);
        }
        if (this.overLockedShape) {
            //console.log(this.overLockedShape.id);
        }
    }

    public buildHierarchy() {
        this.shapes.map((shape) => {
            // if (shape.id === "mug-big") {
            //     shape.children = [];
            //     shape.children?.push(this.getShapeById("mug-big-logo"));
            // }
            if (shape.id === "man-main") {
                shape.children = [];
                shape.children?.push(this.getShapeById("man-head"));
                this.getShapeById("man-head").parents = []; this.getShapeById("man-head").parents?.push(shape);
                shape.children?.push(this.getShapeById("man-shirt"));
                this.getShapeById("man-shirt").parents = []; this.getShapeById("man-shirt").parents?.push(shape);
                shape.children?.push(this.getShapeById("man-cup-right"));
                this.getShapeById("man-cup-right").parents = []; this.getShapeById("man-cup-right").parents?.push(shape);
                shape.children?.push(this.getShapeById("man-cup-left"));
                this.getShapeById("man-cup-left").parents = []; this.getShapeById("man-cup-left").parents?.push(shape);
                shape.children?.push(this.getShapeById("man-hand-right"));
                this.getShapeById("man-hand-right").parents = []; this.getShapeById("man-hand-right").parents?.push(shape);
                shape.children?.push(this.getShapeById("man-hand-left"));
                this.getShapeById("man-hand-left").parents = []; this.getShapeById("man-hand-left").parents?.push(shape);
            }
            if (shape.id === "man-shirt") {
                shape.children = [];
                shape.children?.push(this.getShapeById("man-shirt-logo"));
                this.getShapeById("man-shirt-logo").parents = [];
                this.getShapeById("man-shirt-logo").parents?.push(this.getShapeById("man-main"));
                this.getShapeById("man-shirt-logo").parents?.push(shape);
            }

            if (shape.id === "woman-main") {
                shape.children = [];
                shape.children?.push(this.getShapeById("woman-shirt"));
                this.getShapeById("woman-shirt").parents = []; this.getShapeById("woman-shirt").parents?.push(shape);
                shape.children?.push(this.getShapeById("woman-cup-left"));
                this.getShapeById("woman-cup-left").parents = []; this.getShapeById("woman-cup-left").parents?.push(shape);
                shape.children?.push(this.getShapeById("woman-cup-right"));
                this.getShapeById("woman-cup-right").parents = []; this.getShapeById("woman-cup-right").parents?.push(shape);
            }
            if (shape.id === "woman-cup-left") {
                shape.children = [];
                shape.children?.push(this.getShapeById("woman-cup-left-logo"));
                this.getShapeById("woman-cup-left-logo").parents = [];
                this.getShapeById("woman-cup-left-logo").parents?.push(this.getShapeById("woman-main"));
                this.getShapeById("woman-cup-left-logo").parents?.push(shape);
            }
            if (shape.id === "woman-cup-right") {
                shape.children = [];
                shape.children?.push(this.getShapeById("woman-cup-right-logo"));
                this.getShapeById("woman-cup-right-logo").parents = [];
                this.getShapeById("woman-cup-right-logo").parents?.push(this.getShapeById("woman-main"));
                this.getShapeById("woman-cup-right-logo").parents?.push(shape);
            }

            if (shape.children) {
                if (shape.children?.length > 0) {
                    shape.children.map((child) => {
                        child.visible = false;
                    });
                }
            }
        });

    }

    public updateCursorModifier() {
        this.cursorSrc = "images/cursor-add.svg";
        this.selectedShapes.map(shape => {
            if (shape.isSelected) {
                const pos: Point2D = {
                    x: shape.x,
                    y: shape.y,
                };
                const size: Point2D = {
                        x: shape.width,
                        y: shape.height,
                    };
                if (this.isPointerOverBox(pos, size)) {
                    this.cursorSrc = "images/cursor-remove.svg";
                }
            }
        });
    }

    // --- Input ---

    public isSliding = false;
    private _isShiftDown = false;

    public get isShiftDown(): boolean {
        return this._isShiftDown;
    }

    public set isShiftDown(isKeyDown: boolean) {
        this._isShiftDown = isKeyDown;
    }

    // --- Theme ---

    private _theme: Theme = Theme.Light;

    public get theme(): Theme {
        return this._theme;
    }

    public toggleTheme() {
        this._theme = this._theme === Theme.Dark ? Theme.Light : Theme.Dark;
    }

    // --- App Mode ---

    private _appMode: AppMode = AppMode.Edit;

    public get appMode(): AppMode {
        return this._appMode;
    }

    public set appMode(appMode: AppMode) {
        this._appMode = appMode;
    }

    // --- Tools ---

    private _activeToolId: ToolId = ToolId.Select;

    public get activeToolId(): ToolId {
        return this._activeToolId;
    }

    public set activeToolId(toolId: ToolId) {
        this._activeToolId = toolId;
    }

    // --- Properties ---

    private _showPropertiesPanel = true;

    public get showPropertiesPanel(): boolean {
        return this._showPropertiesPanel;
    }

    public togglePropertiesPanel() {
        this._showPropertiesPanel = !this._showPropertiesPanel;
    }

    private _isPropertySliderOn = false;

    public get isPropertySliderOn(): boolean {
        return this._isPropertySliderOn;
    }

    public set isPropertySliderOn(value: boolean) {
        this._isPropertySliderOn = value;
    }

    public isPropertyBrightnessOn = false;

    private _isPropertyHueOn = false;

    public get isPropertyHueOn(): boolean {
        return this._isPropertyHueOn;
    }

    public set isPropertyHueOn(value: boolean) {
        this._isPropertyHueOn = value;
    }

    // --- Appearance ---

    private _fill = "#598c6b";

    public get fill(): string {
        return this._fill;
    }

    public set fill(value: string) {
        this._fill = value;
        this._selectedShapes.map((shape) => {
            shape.fill = value;
        });
    }

    private _stroke = "#333333";

    public get stroke(): string {
        return this._stroke;
    }

    public set stroke(value: string) {
        this._stroke = value;
        this._selectedShapes.map((shape) => {
            shape.stroke = value;
        });
    }

    private _strokeWidth = 3;

    public get strokeWidth(): number {
        return this._strokeWidth;
    }

    public set strokeWidth(value: number) {
        this._strokeWidth = value;
        this._selectedShapes.map((shape) => {
            shape.strokeWidth = value;
        });
    }

    private _opacity = 1;

    public get opacity(): number {
        return this._opacity;
    }

    public set opacity(value: number) {
        this._opacity = value;
        this._selectedShapes.map((shape) => {
            shape.opacity = value;
            if (shape.children) {
                shape.children.map(level2 => {
                    level2.opacity = value;
                    if (level2.children) {
                        level2.children.map(level3 => {
                            level3.opacity = value;
                        });
                    }
                });
            }
        });
    }

    private _hue = 0;

    public get hue(): number {
        return this._hue;
    }

    public set hue(value: number) {
        this._hue = value;
        this._selectedShapes.map((shape) => {
            shape.hue = value;
            if (shape.children) {
                shape.children.map(level2 => {
                    level2.hue = value;
                    if (level2.children) {
                        level2.children.map(level3 => {
                            level3.hue = value;
                        });
                    }
                });
            }
        });
    }

    private _brightness = 0;

    public get brightness(): number {
        return this._brightness;
    }

    public set brightness(value: number) {
        this._brightness = value;
        this._selectedShapes.map((shape) => {
            shape.brightness = value;
            if (shape.children) {
                shape.children.map(level2 => {
                    level2.brightness = value;
                    if (level2.children) {
                        level2.children.map(level3 => {
                            level3.brightness = value;
                        });
                    }
                });
            }
        });
    }

    private _visible = true;

    public get visible(): boolean {
        return this._visible;
    }

    public set visible(value: boolean) {
        this._visible = value;
        this._selectedShapes.map((shape) => {
            shape.visible = value;
        });
    }

    // --- Sub-Objects Navigation

    //public currentGroup: number = 0;

    public currentLevel = 0;

    // --- Shapes ---

    public readonly artboard: Artboard = new Artboard();

    public readonly shapes = observable<Shape | Photo>([

        new Photo(PhotoId.Image, {
            id: "artwork1",
            label: "Artwork1",
            isFirstLevel: true,
            x: 100,
            y: -50,
            rotation: 0,
            width: 1002,
            height: 975,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-bg.jpg",
            zindex: 99,
            pathData:
            "M0,0 L1002,0 L1002,975 L0,975 Z",
        }),

        new Shape(ShapeId.WallBackColor, {
            id: "ceiling-color",
            label: "Ceiling Color",
            isFirstLevel: true,
            x: 115,
            y: -51,
            rotation: 0,
            width: 1002,
            height: 858,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            zindex: 105,
            opacity: 0.7,
            pathData:
            "M973.14.5H1.15l179.02,193.06h607.55L973.14.5Z",
        }),

        new Shape(ShapeId.Image, {
            id: "ceiling",
            label: "Ceiling",
            isFirstLevel: true,
            x: 116,
            y: -50,
            rotation: 0,
            width: 973,
            height: 195,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-ceiling.png",
            zindex: 106,
            blendMode: "multiply",
            pathData:
            "M973.14.5H1.15l179.02,193.06h607.55L973.14.5Z",
        }),

        new Shape(ShapeId.WallBackColor, {
            id: "wall-back-color",
            label: "Wall Back Color",
            isFirstLevel: true,
            x: 101,
            y: -51,
            rotation: 0,
            width: 1002,
            height: 858,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            zindex: 111,
            opacity: 0.9,
            pathData:
            "M1000.43,857.11h0l-203.54-134.63H193.17L0,857.11V0h15.04l178.13,193.03h611.43L987.16,0h13.27v857.11h0ZM356.86,574.44v5.84l6.16,3.75,1.53,5.12,1.54,2.52,266.44-.58,3.82-9.23,3.09-2.29v-6.6h-5.98l-5.82-.99c.02-3.22,1.71-321.75,1.17-321.8s-1.78-1.31-1.8-1.32l-258.5.99-1.98.94,1.12,319.67v3.98h-10.78Z",
        }),
       
        new Shape(ShapeId.Image, {
            id: "wall-back",
            label: "Wall Back",
            isFirstLevel: true,
            x: 100,
            y: -51,
            rotation: 0,
            width: 1002,
            height: 858,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-wall-back.png",
            zindex: 112,
            blendMode: "multiply",
            pathData:
            "M15.04,0H0v859.11l193.16-134.63h603.72l203.54,134.63V0h-13.27l-182.56,195.03H193.16L15.04,0Z",
        }),

        new Shape(ShapeId.Image, {
            id: "wall-back2",
            label: "Wall Back2",
            isFirstLevel: true,
            x: 5300,
            y: -51,
            rotation: 0,
            width: 1002,
            height: 858,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-wall-back2.png",
            zindex: 113,
            visible: false,
            pathData:
            "M15.04,0H0v859.11l193.16-134.63h603.72l203.54,134.63V0h-13.27l-182.56,195.03H193.16L15.04,0Z",
        }),


        new Shape(ShapeId.Image, {
            id: "wall-back3",
            label: "Wall Back3",
            isFirstLevel: true,
            x: 5100,
            y: -51,
            rotation: 0,
            width: 1002,
            height: 858,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-wall-fluffy.png",
            zindex: 114,
            visible: false,
            pathData:
            "M15.04,0H0v859.11l193.16-134.63h603.72l203.54,134.63V0h-13.27l-182.56,195.03H193.16L15.04,0Z",
        }),


        new Shape(ShapeId.Image, {
            id: "ceiling-material",
            label: "Ceiling Material",
            isFirstLevel: true,
            x: 5316,
            y: -43,
            rotation: 0,
            width: 971,
            height: 194,
            scale: 1.02,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-ceiling-material.png",
            zindex: 115,
            visible: false,
            pathData:
            "M0,1V.04c1.5-.04,3-.04,4.5-.04h963.5c0,.33.12.73-.02.98-2.21,4.07-4.23,8.26-6.78,12.1-1.38,2.08-2.42,4.44-4.17,6.25-3.34,3.69-6.9,7.19-10.65,10.47-2.36,1.93-5.3,3.29-7.81,5.09-5.19,3.73-10.53,7.29-15.08,11.86-3.32,3.49-6.41,7.19-9.25,11.09-4.86,6.38-11.59,10.9-17.94,15.65-3.02,2.09-5.89,4.41-8.57,6.93-6.55,6.6-13.6,12.77-18.65,20.67-1.77,2.77-3.7,4.26-7.11,4.55-1.54.13-3.4,1.2-5.04,2.22-2.93,1.8-5.74,3.79-8.42,5.94-3.36,2.61-6.29,5.72-8.7,9.22-3.34,5.2-7.74,9.64-12.9,13.03-3.17,2.03-6.13,4.4-9.4,6.25-2.77,1.57-4.18,3.99-5.58,6.61-3.8,7.14-6.8,9.38-15.17,12.3-2.82.99-6.17,1.86-7.16,5.14-.5,1.68-1.79,2.56-2.55,3.92-1.36,2.55-3.21,4.8-5.45,6.62-1.16.68-2.08,1.69-2.67,2.9-.96,2.44-2.72,4.49-5,5.79-2.57,1.4-4.02,3.77-6.36,5.43-1.69,0-3.52.06-5.34-.02-1.79-.08-3.19,1.24-5.09,1.07-5.84-.55-11.8.92-17.56-1.05-2.5.69-5.05-.29-6.97-1.21-2.28-1.08-4.95.26-6.8-1.7-2.96.51-5.58-1.34-8.55-1.17-1.53.09-2.51,1.21-4.08,1.16-5.32-.17-10.65-.02-15.98-.08-5.38-.05-10.64,1.65-16.07,1.04-1.66-.18-3.33-.18-4.99,0-3.66.33-7.34-.48-10.53-2.32-1.37-.81-3.06-.86-4.47-.12-4.26,1.81-8.86,2.66-13.48,2.48-4.64-.29-9.32.06-13.98-.1-4.7-.16-9.31-1.2-14.07-1.09-2.66,0-5.27-.69-7.58-2-1.81-1.02-3.82-1.33-5.06-.67-1.25.74-2.73,1-4.16.73-1.71-.39-2.6,1.25-4.1,1.09-6.9-.73-13.69,1.03-20.56.99-3.99-.02-7.99,0-11.98,0-1,0-2.29.4-2.94-.07-2.28-1.66-4.8-.97-7.12-.81-2.53.17-4.59-1.2-7.09-1.18-20.64.14-41.28.08-61.92.08s-40.95.18-61.42-.05c-20.5-.23-41.02.87-61.52-.84-7.93-.66-15.97-.11-23.96-.11h-72.4c-7.99,0-15.99.29-23.97-.08-7.91-.36-15.68,1.32-23.56,1.09-3.33-.1-6.65-.09-9.99.01-1.72.05-3.66-.73-5.08.96-3.43-.42-6.61,1.2-10.08,1.13-3.27-.07-6.37-1.01-9.57-1.1-3.66-.22-7.32-.2-10.98.05-4.18.43-7.73-1.47-11.52-2.44-1.38-.43-2.6-1.25-3.52-2.37-1.36-1.68-2.9-3.2-4.6-4.54-2.07-1.49-4.11-2.69-5.3-5.22-1.07-2.27-3.68-3.46-4.94-5.91-1.38-2.69-4.86-3.85-5.95-7.01-.13-.38-1.21-.35-1.62-.75-1.94-1.88-4.5-3.64-4.14-6.68.31-2.56-.84-4.38-2.14-6.12-1.85-2.7-4.23-4.99-7-6.72-.75-.43-1.66-.95-1.79-1.5-.56-2.31-2.39-3.71-4.03-4.73-3.36-2.08-5.85-5.23-9.56-6.95-1.85-.85-3.36-2.91-4.61-4.92-2.39-3.82-4.72-7.66-6.93-11.58-2.86-4.85-6.73-9.03-11.34-12.26-3.74-2.78-8.54-4.53-10.56-9.29-5.13-4.91-7.82-11.81-13.42-16.35-2.15-4.85-7.01-7.03-10.64-10.37-1.5-1.4-3.14-2.64-4.89-3.71-2.64-1.58-5.16-3.04-6.32-6.42-.75-1.87-1.78-3.61-3.06-5.17-4.18-5.47-8.6-10.75-13.01-16.04-2.07-2.48-4.7-4.41-6.44-7.27-1.11-1.62-2.56-2.97-4.26-3.95C5.91,14.37,5.8,13.9,2.92,5.96c-.63-1.74-1.12-3.8-2.92-4.96z",
        }),

        new Shape(ShapeId.Image, {
            id: "sofa-back",
            label: "Sofa Back",
            isFirstLevel: true,
            x: 5530,
            y: 535,
            rotation: 0,
            width: 554,
            height: 235,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-sofa-back.png",
            zindex: 120,
            visible: false,
            pathData:
            "M0,0 554,0 554,235 L0,235Z",
        }),

        new Shape(ShapeId.Image, {
            id: "sofa",
            label: "Sofa",
            isFirstLevel: true,
            x: 730,
            y: 560,
            rotation: 0,
            width: 376,
            height: 337,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-sofa.png",
            zindex: 121,
            visible: true,
            pathData:
            "M159.49,0h3.99c1.4.47,2.83.86,4.27,1.16,23.27,3.67,46.57,7.13,69.81,11,20.95,3.49,41.84,7.39,62.74,11.2,8.8,1.61,17.67,3.02,26.31,5.31,15.72,4.17,20.16,11.51,17.72,27.44-.53,3.62-.81,7.26-.82,10.92-.07,8.13,1.06,9.12,8.99,11,3.67.9,7.2,2.29,10.5,4.12,7.7,4.21,9.12,12.2,9.74,19.67,1.04,12.7,1.22,25.5,1.14,38.25-.18,28.23-.76,56.46-1.14,84.7-.35,25.64-8.26,48.07-26.88,66.44-4.25,4.19-5.89,10.17-4.43,16.64,1.15,5.18,1.87,10.45,2.15,15.76.1,1.65-1.69,4.82-2.72,4.87-4.54.2-9.8.82-13.53-1.13-9.67-5.08-18.97-10.84-27.82-17.24-12.02-8.64-25.3-11.86-39.78-11.84-6.6.01-13.22-.31-19.8-.86-6.75-.57-13.45-2.2-20.19-2.3-8.94-.12-17.92.63-26.85,1.32-13.23,1.02-26.48,1.99-39.62,3.72-3.8.5-7.79,2.92-10.8,5.5-7.02,6.04-13.73,12.43-20.09,19.16-5.21,5.51-11.98,7.63-18.68,9.9-5.97,2.02-8.57-.33-7.83-6.61,1.13-9.55,1.94-19.18,3.84-28.59,1.32-6.53.83-11.19-6.16-13.5-.88-.47-1.69-1.06-2.4-1.76-16.79-12.27-30.56-27.66-43.63-43.56-6.12-7.63-11.23-16.02-15.2-24.97-3.8-8.33-10.41-14.06-15.73-20.98-.66-.73-1.55-1.2-2.52-1.36-5.69-.98-6.4-2.13-5.27-8.05,1.15-6.02,1.73-12.17,3.2-18.1,1.63-6.57-.89-11.23-5.39-15.5C2.29,147.8-.12,142.18,0,136.33c.07-18.1.06-36.2.14-54.3.02-5.64-.12-11.32.41-16.93.97-10.25,6.6-15.88,16.89-16.02,35.06-.48,70.12-.72,105.19-.72,3.53,0,4.76-1.03,6.09-4.08,4.3-9.86,8.83-19.64,13.72-29.23,3.64-7.14,9.03-12.7,17.06-15.06z",
        }),

        

        new Shape(ShapeId.Image, {
            id: "sofa-color",
            label: "Sofa Color",
            isFirstLevel: true,
            x: 5730,
            y: 566,
            rotation: 0,
            width: 404,
            height: 348,
            scale: 0.93,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-sofa-color.png",
            zindex: 122,
            visible: false,
            pathData:
            "M0,0 404,0 404,348 L0,348 Z",
        }),


        new Shape(ShapeId.Image, {
            id: "sofa-material",
            label: "Sofa Material",
            isFirstLevel: true,
            x: 5720,
            y: 560,
            rotation: 0,
            width: 399,
            height: 357,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-sofa-material.png",
            zindex: 123,
            visible: false,
            pathData:
            "M0,0 399,0 399,357 L0,357 Z",
        }),

        new Shape(ShapeId.Image, {
            id: "sofa-fluffy",
            label: "Sofa Fluffy",
            isFirstLevel: true,
            x: 5704,
            y: 564,
            rotation: 0,
            width: 399,
            height: 357,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-sofa-fluffy.png",
            zindex: 124,
            visible: false,
            pathData:
            "M0,0 399,0 399,357 L0,357 Z",
        }),

        new Shape(ShapeId.Image, {
            id: "sofa2",
            label: "Sofa2",
            isFirstLevel: true,
            x: 5720,
            y: 620,
            rotation: 0,
            width: 501,
            height: 361,
            scale: 0.8,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-sofa2.png",
            zindex: 125,
            visible: false,
            pathData:
            "M87.82,8.1c4.76-4.01,10.81-6.16,17.03-6.05,3.32.02,6.65.04,9.98,0,4.17-.06,8.02,1.79,12.14,2.06.52.03.97.8,1.5,1.15,1.76,1.17,2.86,1.06,4.76-.18,3.41-2.21,7.26-3.64,11.28-4.18,3.55-.54,7.05-.65,10.58-.87,2.79-.18,5.23,1.49,8.08,1.1,2.69-.37,5.19.94,7.76,1.64,2.27.62,4.63.88,6.96,1.28,1.75.24,3.53-.13,5.05-1.03.84-.44,1.5-1.1,2.6-.98,3.41.37,6.56-1.46,10.07-1.06,3.45.39,7.02-.27,10.46.16,6.22.79,12.58,1.09,18.48,3.49.74.28,1.53.42,2.32.4,1.66.09,3.33.09,4.99,0,8.44-.7,16.32,1.91,24.21,4.22.85.25,1.68.88,2.65.77,4.75-.52,9.42.38,14.04,1.12,2.63.26,5.18,1.01,7.53,2.22,4.06,2.46,8.71,3.77,13.45,3.8,4.38.12,8.68,1.22,12.57,3.24,4.08,1.96,8.46,3.21,12.96,3.68,5.58.6,10.91,2.63,15.47,5.9,1.79,1.32,3.95,2.04,6.18,2.05,5.18.26,10.22,1.09,14.87,3.81,2.78,1.63,6.07,2.4,8.52,4.67.37.31.84.46,1.32.45,6.1.58,11.83,2.59,17.6,4.47.44.14.9.54,1.28.47,3.51-.64,6.52,1.18,9.61,2.16,2.89.91,5.53,2.76,8.11,4.45,3.11,2.06,6.32,3.94,9.63,5.65,1.38.7,2.63,1.97,3.93,2.58,1.98.92,3.26,3.37,5.67,3.08,2.48-.3,4.02,1.6,6.15,2.12,3.64.98,6.96,2.92,9.62,5.6,4.34,4.35,9.02,8.37,13.97,12.01,4.19,2.94,7.28,8.32,9.96,14.77,1.2,2.84,2.61,5.59,4.23,8.21,3.18,5.2,4.82,10.97,6.71,16.67,1.34,4.01,1.88,8.18,2.88,12.25,1.05,4.29,2.47,8.58,2.06,13.12,1.7,2.69.8,5.69.99,8.56.3,4.68,1.59,9.3,1.01,14.04,1.7,3.39.3,7.14,1.1,10.53,1.73,7.34.36,14.71.95,22.04.16,2.03-.75,3.71-1.07,5.57s.9,3.96-.89,5.63c-.25.24,0,.96-.1,1.44-.37,1.85.6,3.74-.86,5.67-.91,1.2.6,3.56-1.12,4.98.18,5.3-1.74,10.27-3.18,15.15-2.48,8.37-4.37,16.99-8.72,24.79-3.88,6.96-6.16,10.84-10.37,15.14-5.98,6.11-11.38,12.76-17.62,18.64-4.48,4.22-9.36,7.96-13.94,12.04-3.5,3.11-7.43,5.64-10.8,8.82-1.62,1.53-3.98,1.11-5.32,3.03-1.21,1.74-3.38,1.99-5.35,2.66-2.14.86-4.21,1.88-6.21,3.04-6.99,3.63-14.62,5.64-21.81,8.77-4.17-.08-7.99,1.77-12.14,2.09-4.08.21-8.12,1-11.98,2.33-2.46.92-5.28-.57-7.33,1.57-3.94-.72-7.64,1.74-11.55.96-2.39-.48-4.24,1.25-6.58,1.12-2.18-.12-4.58-.86-6.58.89-.19.16-.65.05-.98.02-4.74-.48-9.29,1.76-14.05,1-6.93,1.98-14.04.44-21.03,1.05-5.11.44-10-1.21-15.06-1.08-4.98.13-10.09.69-14.93-.16-4.74-.83-9.5-.06-14.06-.94-5.8-1.13-11.97-.77-17.35-3.81-3.86.16-7.32-1.72-11.11-2.19-4.38-.55-8.73-1.46-13.13-2.04-2.18-.29-4.37-.9-6.59-.77-2.15.14-3.91-1.11-6.07-1.2-2.52-.11-5.08-1.26-7.47-2.29-6.69-2.92-13.01-6.63-18.83-11.03-5.65-4.43-10.45-9.84-14.17-15.98-1.47-2.63-3.26-5.07-5.33-7.26-6.27-6.01-10.97-13.18-15.74-20.38-4.08-6.38-7.59-13.11-10.48-20.11-2.55-5.91-5.1-12.25-4.43-19.11.09-.93.27-1.92-.7-2.73-.38-.53-.47-1.21-.23-1.82,1.86-3.41.58-7.06.94-10.58-.05-.94-.31-1.85-.77-2.66-1.81-4.87-5.02-8.9-7.54-13.33-.47-.83-1.28-1.88-2.1-2.05-3.03-.64-5.07-2.96-7.72-4.26-6.12-2.99-11.85-6.76-17.72-10.24-3.48-2.06-7.1-3.84-10.39-6.29-2.98-2.12-5.85-4.4-8.59-6.83-3.79-3.49-7.22-7.37-11-10.86-4.8-4.43-8.68-9.64-12.57-14.79-3.39-4.29-6.41-8.86-9.02-13.67-1.04-2.02-.94-4.24-2.01-6.16-1.5-2.7-2.58-5.7-4.44-8.1-3.91-5.02-5.84-10.9-7.79-16.73-.97-2.45-1.79-4.96-2.48-7.5-.64-2.9-1.09-5.85-1.78-8.71-1.44-5.88-.54-11.73-.8-17.57-.17-3.9,2.14-13.13,4.95-17.87,1.01-1.96,2.28-3.79,3.76-5.42,2.89-2.85,4.9-6.15,5.22-10.3.02-.47.15-.93.4-1.34,2.52-4.16,4.44-8.68,8.12-12.1,4.1-3.82,7.77-8.08,13.21-10.3,1.94-.79,3.66-1.76,5.83-1.6,2.24.16,4.51-.73,5.26-2.59,1.45-3.57,4.6-5.01,7.52-6.04,3.32-1.16,6.39-3.32,10.1-3.35,1.06-1.61,2.7-.77,4.09-.97,2.03-.28,4.02.2,6.14-.86s4.61.69,6.88,1.21c2.28.42,4.43,1.34,6.31,2.7z",
        }),

        new Shape(ShapeId.Image, {
            id: "person-boy",
            label: "Person Boy",
            isFirstLevel: true,
            x: 205,
            y: 555,
            rotation: 0,
            width: 271,
            height: 297,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-person-01.png",
            zindex: 130,
            visible: false,
            pathData:
            "M0,0 271,0 271,297 L0,297Z",
        }),

        new Shape(ShapeId.Image, {
            id: "person-man",
            label: "Person Man",
            isFirstLevel: true,
            x: 206,
            y: 526,
            rotation: 0,
            width: 308,
            height: 333,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-person-02.png",
            zindex: 131,
            visible: true,
            pathData:
            "M0,0 308,0 308,333 L0,333Z",
        }),

        new Shape(ShapeId.Image, {
            id: "person-old",
            label: "Person Old",
            isFirstLevel: true,
            x: 194,
            y: 522,
            rotation: 0,
            width: 339,
            height: 362,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-person-03.png",
            zindex: 132,
            visible: false,
            pathData:
            "M0,0 339,0 339,362 L0,362Z",
        }),

        new Shape(ShapeId.Image, {
            id: "boy-right",
            label: "Boy Right",
            isFirstLevel: true,
            x: 540,
            y: 582,
            rotation: 0,
            width: 262,
            height: 261,
            scale: 1.0,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-boy-right.png",
            zindex: 133,
            visible: true,
            pathData:
            "M0,0 262,0 262,261 L0,261Z",
        }),


        


        


        // PHOTO 2 with Bobois orange sofa

        new Photo(PhotoId.Image, {
            id: "artwork2",
            label: "Artwork2",
            isFirstLevel: true,
            x: 860,
            y: 160,
            rotation: 0,
            width: 456,
            height: 418,
            scale: 0.75,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-bubble-couch.jpg",
            zindex: 199,
            pathData:
            "M0,0 L456,0 L456,418 L0,418 Z",
        }),

        new Shape(ShapeId.Image, {
            id: "sofa-orange",
            label: "Sofa Orange",
            isFirstLevel: true,
            x: 915,
            y: 274,
            rotation: 0,
            width: 327,
            height: 139,
            scale: 0.75,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-room-orange-sofa.png",
            zindex: 200,
            pathData:
            "M207.366.993h8.973c2.633-.568,4.993.84,7.5,1.186,4.263.588,4.2.957,7.752.03A7.826,7.826,0,0,1,233.985,2c6.213.365,12.121,1.6,16.862,6.051a6.522,6.522,0,0,0,5.185,1.888c9.258-.7,16.913,3.565,24.527,7.933a1.233,1.233,0,0,1,.372.293c2.811,3.675,6.983,5.118,10.953,7.108,5.331,2.671,10.616,5.7,13.651,11.331a6.563,6.563,0,0,0,2.986,2.237c7.162,3.593,10.681,8.368,13.573,16.423C323.327,58.7,324.9,62.029,326,65.529V80.422c-1.086,4.032-1.659,8.171-2.928,12.181-1.7,5.381-3.993,10.605-7.774,14.586-4.307,4.534-9.631,8.27-16.519,7.937a15.323,15.323,0,0,0-6.534,1.113,10.084,10.084,0,0,1-5.094.893c-2.47-.308-4.513,1.492-7.075,1.1a17.744,17.744,0,0,0-7.421.054,24.444,24.444,0,0,1-8.59.791c-1.578-.1-2.422,1.435-4.091,1.154-1.3-.219-2.971-.726-4.137.737-.144.18-.6.168-.913.154-5.545-.251-10.945,1.6-16.531,1.051-2.259-.22-4.958-.582-6.759.4-1.973,1.069-4.426-.671-5.891,1.519-.1.153-.634.019-.967.02-2.322.007-4.97-.688-6.884.2-2.477,1.143-4.789.563-7.153.756a64.059,64.059,0,0,1-6.971.029,29.585,29.585,0,0,0-10.7,1.831,2.066,2.066,0,0,1-.925.154c-4.093-.568-8.059.756-12.017,1.23-5.708.683-11.417.221-17.028.943-2.688.346-5.693.007-7.991,1.016-2.831,1.241-5.6-.043-8.116.87-4.494,1.633-9.051.788-13.565.857-5.308.082-10.545.316-15.613,2.047-3.615-.717-6.962,1.137-10.548,1.037-5.808-.164-11.744-.779-17.4.146-6.725,1.1-13.39.264-20.038.867-3.808.346-7.334-1.2-11.051-1.043a22.019,22.019,0,0,1-10.633-2c-4.338.7-7.69-2.389-11.7-3.038-2.576-.416-3.91-3.021-6.167-4.256a52.79,52.79,0,0,1-5.891-3.793c-2.439-1.8-3.963-4.448-5.5-7.1-2.713-4.682-4.5-9.724-6.526-14.684A102.92,102.92,0,0,1,6.929,83.546C6.365,81,5.434,78.53,4.793,75.975c-.887-3.534-1.821-6.981-1.805-10.64.013-2.977.458-6.048-.138-8.9a25.539,25.539,0,0,1-.834-7.059A30.341,30.341,0,0,1,9.265,31.057c4.749-5.425,10.783-9.523,15.833-14.691,3.1-3.171,11.04-5.425,15.622-5.444,1.328-.005,2.657.02,3.985-.005,3.018-.055,5.828.009,8.739-1.825,3.338-2.1,15.9-2.809,19.5-2.153.8.147,1.276.8,2.043,1.089a9.168,9.168,0,0,0,7.991-.556,23.366,23.366,0,0,1,10.9-2.523c3.7.124,7.453-.334,11.05.994a3.034,3.034,0,0,0,.991.014h8.81c3.013-1.2,6.184-1.9,9.287-2.811a6.994,6.994,0,0,1,3.9-.1c3.119,1.026,6.523.826,9.507,2.28,2.037.993,3.766.606,5.838-.28a33.437,33.437,0,0,1,16.651-2.975,35.983,35.983,0,0,1,8.458,2.364,4.974,4.974,0,0,0,4.467-.192A31.662,31.662,0,0,1,186.425.91C188.146.888,189.389,2,190.995,2a9.965,9.965,0,0,1,4.131.844c1.935.825,4.134,1.341,6.435-.318a7.986,7.986,0,0,1,5.8-1.528z",

        }),


        // PHOTO 3 with fluffy texture

        new Photo(PhotoId.Image, {
            id: "artwork3",
            label: "Artwork3",
            isFirstLevel: true,
            x: 1160,
            y: 320,
            rotation: 0,
            width: 500,
            height: 469,
            scale: 0.6,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-text-fluffy.png",
            zindex: 199,
            pathData:
            "M0,0 500,0 L500,469 L0,469 Z",
        }),


       new Shape(ShapeId.Image, {
            id: "fluffy-texture",
            label: "Fluffy Texture",
            isFirstLevel: true,
            x: 1177,
            y: 340,
            rotation: 0,
            width: 443,
            height: 408,
            scale: 0.6,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-fluffy-obj.jpg",
            zindex: 200,
            visible: true,
            pathData:
            "M0,0 443,0 443,408 L0,408 Z",
        }),


        // PHOTO 4 with fluffy texture

        new Photo(PhotoId.Image, {
            id: "artwork4",
            label: "Artwork4",
            isFirstLevel: true,
            x: 1160,
            y: 650,
            rotation: 0,
            width: 421,
            height: 385,
            scale: 0.5,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-old-woman.jpg",
            zindex: 400,
            pathData:
            "M0,0 421,0 421,385 L0,385 Z",
        }),

        new Shape(ShapeId.Image, {
            id: "old-woman",
            label: "Old Woman",
            isFirstLevel: true,
            x: 1165,
            y: 655,
            rotation: 0,
            width: 421,
            height: 385,
            scale: 0.48,
            fill: "white",
            strokeWidth: 0,
            src: "images/he-old-woman.jpg",
            zindex: 400,
            pathData:
            "M0,0 421,0 421,385 L0,385 Z",
        }),


        // new Shape(ShapeId.Image, {
        //     id: "sofa-gray",
        //     label: "Sofa Gray",
        //     isFirstLevel: true,
        //     x: 5013,
        //     y: 670,
        //     rotation: 0,
        //     width: 327,
        //     height: 139,
        //     scale: 1.0,
        //     fill: "white",
        //     strokeWidth: 0,
        //     src: "images/he-room-gray-sofa.png",
        //     zindex: 201,
        //     visible: false,
        //     pathData:
        //     "M207.366.993h8.973c2.633-.568,4.993.84,7.5,1.186,4.263.588,4.2.957,7.752.03A7.826,7.826,0,0,1,233.985,2c6.213.365,12.121,1.6,16.862,6.051a6.522,6.522,0,0,0,5.185,1.888c9.258-.7,16.913,3.565,24.527,7.933a1.233,1.233,0,0,1,.372.293c2.811,3.675,6.983,5.118,10.953,7.108,5.331,2.671,10.616,5.7,13.651,11.331a6.563,6.563,0,0,0,2.986,2.237c7.162,3.593,10.681,8.368,13.573,16.423C323.327,58.7,324.9,62.029,326,65.529V80.422c-1.086,4.032-1.659,8.171-2.928,12.181-1.7,5.381-3.993,10.605-7.774,14.586-4.307,4.534-9.631,8.27-16.519,7.937a15.323,15.323,0,0,0-6.534,1.113,10.084,10.084,0,0,1-5.094.893c-2.47-.308-4.513,1.492-7.075,1.1a17.744,17.744,0,0,0-7.421.054,24.444,24.444,0,0,1-8.59.791c-1.578-.1-2.422,1.435-4.091,1.154-1.3-.219-2.971-.726-4.137.737-.144.18-.6.168-.913.154-5.545-.251-10.945,1.6-16.531,1.051-2.259-.22-4.958-.582-6.759.4-1.973,1.069-4.426-.671-5.891,1.519-.1.153-.634.019-.967.02-2.322.007-4.97-.688-6.884.2-2.477,1.143-4.789.563-7.153.756a64.059,64.059,0,0,1-6.971.029,29.585,29.585,0,0,0-10.7,1.831,2.066,2.066,0,0,1-.925.154c-4.093-.568-8.059.756-12.017,1.23-5.708.683-11.417.221-17.028.943-2.688.346-5.693.007-7.991,1.016-2.831,1.241-5.6-.043-8.116.87-4.494,1.633-9.051.788-13.565.857-5.308.082-10.545.316-15.613,2.047-3.615-.717-6.962,1.137-10.548,1.037-5.808-.164-11.744-.779-17.4.146-6.725,1.1-13.39.264-20.038.867-3.808.346-7.334-1.2-11.051-1.043a22.019,22.019,0,0,1-10.633-2c-4.338.7-7.69-2.389-11.7-3.038-2.576-.416-3.91-3.021-6.167-4.256a52.79,52.79,0,0,1-5.891-3.793c-2.439-1.8-3.963-4.448-5.5-7.1-2.713-4.682-4.5-9.724-6.526-14.684A102.92,102.92,0,0,1,6.929,83.546C6.365,81,5.434,78.53,4.793,75.975c-.887-3.534-1.821-6.981-1.805-10.64.013-2.977.458-6.048-.138-8.9a25.539,25.539,0,0,1-.834-7.059A30.341,30.341,0,0,1,9.265,31.057c4.749-5.425,10.783-9.523,15.833-14.691,3.1-3.171,11.04-5.425,15.622-5.444,1.328-.005,2.657.02,3.985-.005,3.018-.055,5.828.009,8.739-1.825,3.338-2.1,15.9-2.809,19.5-2.153.8.147,1.276.8,2.043,1.089a9.168,9.168,0,0,0,7.991-.556,23.366,23.366,0,0,1,10.9-2.523c3.7.124,7.453-.334,11.05.994a3.034,3.034,0,0,0,.991.014h8.81c3.013-1.2,6.184-1.9,9.287-2.811a6.994,6.994,0,0,1,3.9-.1c3.119,1.026,6.523.826,9.507,2.28,2.037.993,3.766.606,5.838-.28a33.437,33.437,0,0,1,16.651-2.975,35.983,35.983,0,0,1,8.458,2.364,4.974,4.974,0,0,0,4.467-.192A31.662,31.662,0,0,1,186.425.91C188.146.888,189.389,2,190.995,2a9.965,9.965,0,0,1,4.131.844c1.935.825,4.134,1.341,6.435-.318a7.986,7.986,0,0,1,5.8-1.528z",

        // }),

        

    ]);

    private _overShape?: Shape | Photo = undefined;

    public get overShape(): Shape | Photo | undefined {
        return this._overShape;
    }

    public set overShape(shape: Shape | Photo | undefined) {
        this._overShape = shape;
    }

    private _selectedShapes: Array<Shape | Photo> = [];

    public get selectedShapes(): Array<Shape | Photo> {
        return this._selectedShapes;
    }

    public set selectedShapes(shapes: Array<Shape | Photo>) {
        const shape = shapes[0];
        shape.isSelected = true;
        console.log('? ' + shape.id + " isSelected = " + shape.isSelected)
        // if (this.isShiftDown && this._selectedShapes.length > 0) {
        //     // Deselect when click over selected - need to check if is clicking over the right shape selected
        //     //this._selectedShapes = [];
        //     store.isPropertySliderOn = false;
        //     store.isPropertyHueOn = false;
        //     store.isPropertyBrightnessOn = false;
        // } else {
            this.clearSelectedShapes();
            if (shapes.length > 0) {
                shapes.map((shape) => {
                    this._selectedShapes.push(shape);
                    shape.isSelected = true;
                    this._fill = shape.fill;
                    this._stroke = shape.stroke;
                    this._strokeWidth = shape.strokeWidth;
                    this._opacity = shape.opacity;
                    this._hue = shape.hue;
                    this._brightness = shape.brightness;
                });
            }
        // }
    }

    public lastSelectedShapes: Array<Shape | Photo> = [];

    public updateProperties(shape: Shape | Photo) {
        if (shape) {
            this._opacity = shape.opacity;
            this._hue = shape.hue;
            this._brightness = shape.brightness;
        }
    }

    public selectAll() {
        this.clearSelectedShapes();
        this.shapes.map(shape => {
            if (shape.isFirstLevel) {
                shape.isSelected = true;
                this.selectedShapes.push(shape);
            }
        });
    }

    public clearSelectedShapes() {
        this._selectedShapes.map((shape) => {
            shape.isSelected = false;
            if (!shape.isFirstLevel) {
                shape.visible = false;
            }
        });
        this._selectedShapes = [];
    }

    public addShape(shape: Shape) {
        this.shapes.push(shape);
        this.selectedShapes.push(shape);
        shape.isSelected = true;
    }

    public moveBySelectedShapes(offsetX: number, offsetY: number) {
        if (this.selectedShapes.length > 0) {
            this.selectedShapes.map((selectedShape) => {
                selectedShape.x += offsetX;
                selectedShape.y += offsetY;
                if (selectedShape.children) {
                    if (selectedShape.children) {
                        selectedShape.children.map((level2) => {
                            level2.x += offsetX;
                            level2.y += offsetY;
                            if (level2.children) {
                                level2.children.map((level3) => {
                                    level3.x += offsetX;
                                    level3.y += offsetY;
                                });
                            }
                        });
                    }
                }
            });
           
        }
    }

    public updateSingleShape(
        point: Point2D[],
        width?: number,
        height?: number
    ) {
        let index = 0;
        const shape = store.currentDownShape;
        
        if (shape) {
            console.log('MOVE DOWN ==== ' + shape.id )
            const deltaX = shape.x - point[index].x;
            const deltaY = shape.y - point[index].y;
            shape.x = point[index].x;
            shape.y = point[index].y;
            if (width !== undefined) {
                shape.width = width;
            }
            if (height !== undefined) {
                shape.height = height;
            }
            if (shape.children) {
                if (shape.children) {
                    shape.children.map((level2) => {
                        level2.x -= deltaX;
                        level2.y -= deltaY;
                        if (level2.children) {
                            level2.children.map((level3) => {
                                level3.x -= deltaX;
                                level3.y -= deltaY;
                            });
                        }
                    });
                }
            }
            index++;
        }

    }

    public updateSelectedShapes(
        point: Point2D[],
        width?: number,
        height?: number
    ) {
        let index = 0;
        this.selectedShapes.map((shape) => {
            const deltaX = shape.x - point[index].x;
            const deltaY = shape.y - point[index].y;
            shape.x = point[index].x;
            shape.y = point[index].y;
            if (width !== undefined) {
                shape.width = width;
            }
            if (height !== undefined) {
                shape.height = height;
            }
            if (shape.children) {
                if (shape.children) {
                    shape.children.map((level2) => {
                        level2.x -= deltaX;
                        level2.y -= deltaY;
                        if (level2.children) {
                            level2.children.map((level3) => {
                                level3.x -= deltaX;
                                level3.y -= deltaY;
                            });
                        }
                    });
                }
            }
            index++;
        });
    }

    public deleteSelectedShapes() {
        this.selectedShapes.map((shape) => {
            if (shape) {
                if (shape.children) {
                    shape.children.map((level2) => {
                        if (level2.children) {
                            level2.children.map((level3) => {
                                this.deleteShape(level3);
                            });
                        }
                        this.deleteShape(level2);
                    });
                }
                this.deleteAsChild(shape);
                this.deleteShape(shape);
                this.clearSelectedShapes();
                store.isPropertySliderOn = false;
                store.isPropertyHueOn = false;
                store.isPropertyBrightnessOn = false;
            }
        });
    }

    public removeSelectedShape(shape: Shape | Photo) {
        if (this.selectedShapes.length > 1) {
            let indexCount = 0;
            let removeIndex = 0;
            this.selectedShapes.map((selectedShape) => {
                if (shape === selectedShape) {
                    removeIndex = indexCount;
                }
                indexCount++;
            });
            this.selectedShapes.splice(removeIndex, 1);
        } else {
            this.clearSelectedShapes();
        }
    }

    private deleteShape(shape: Shape | Photo) {
        if (shape) {
            shape.isHovered = false;
            store.deleteOverShape(shape);
            this.shapes.remove(shape);
        }
    }

    public deleteOverShape(shape: { id: string }) {
        if (this.overShape) {
            if (this.overShape == shape) {
                this.overShape = undefined;
            }
        }
    }

    private deleteAsChild(shapeToDelete: Shape | Photo) {
        let index2 = 0;
        let index3 = 0;
        this.shapes.map((shape) => {
            if (shape) {
                if (shape.children) {
                    index2 = 0;
                    shape.children.map((level2) => {
                        if (level2.children) {
                            index3 = 0;
                            level2.children.map((level3) => {
                                if(level3 === shapeToDelete) {
                                    level2.children?.splice(index3, 1);
                                }
                                index3++;
                            });
                        }
                        if(level2 === shapeToDelete) {
                            shape.children?.splice(index2, 1);
                        }
                        index2++;
                    });
                }
            }
        });
    }

    public turnOverOff() {
        this.shapes.map(shape => {
            shape.isHovered = false;
        });
    }

    public updateMenuItems() {

        this.currentMenuItems = [];

        store.shapes.map(shape => {

            const pos: Point2D = {
                    x: shape.x,
                    y: shape.y,
                };
            const size: Point2D = {
                    x: shape.width,
                    y: shape.height,
                };
            if (this.isPointerOverBox(pos, size)) {
                this.currentMenuItems.push(shape);
            }
        
        });
    }

    public doEyedropping() {

        store.contextMenuVisibility = false;
        store.HeliosPropertiesVisibility = false;
        store.showContextMenu = false;
        store.clearSelectedShapes();

        const sofa = store.shapes.find(shape => shape.id === "sofa") as Shape;
        const sofa2 = store.shapes.find(shape => shape.id === "sofa2") as Shape;
        const sofaColor = store.shapes.find(shape => shape.id === "sofa-color") as Shape;
        const sofaOrange = store.shapes.find(shape => shape.id === "sofa-orange") as Shape;
        const sofaMaterial = store.shapes.find(shape => shape.id === "sofa-material") as Shape;
        const wallBackColor = store.shapes.find(shape => shape.id === "wall-back-color") as Shape;
        const wallBack2 = store.shapes.find(shape => shape.id === "wall-back2") as Shape;
        const wallBack3 = store.shapes.find(shape => shape.id === "wall-back3") as Shape;
        const personBoy = store.shapes.find(shape => shape.id === "person-boy") as Shape;
        const personMan = store.shapes.find(shape => shape.id === "person-man") as Shape;
        const personOld = store.shapes.find(shape => shape.id === "person-old") as Shape;
        const boyRight = store.shapes.find(shape => shape.id === "boy-right") as Shape;
        const artwork1 = store.shapes.find(shape => shape.id === "artwork1") as Photo;

        this.showAlertDialog = true;

        if (store.targetEyedropper != "") {
            switch (store.targetEyedropper) {
                case "wall-back":
                case "wall-back2":
                case "wall-back3":
                    
                    if (this.currentProperty === "color") {
                        if (store.currentDownShape?.id === "sofa") {
                            this.showAlertDialog = false;
                            wallBackColor.fill = "#bfbbbb";
                        }
                        if ((store.currentDownShape?.id === "sofa-orange") 
                                || (store.currentDownShape?.id === "sofa-material") 
                                || (store.currentDownShape?.id === "sofa-color")
                                || (store.currentDownShape?.id === "sofa2")) { 
                            this.showAlertDialog = false;
                            wallBackColor.fill = "#c96124";
                        }
                        if (store.currentDownShape?.id === "fluffy-texture") {
                            this.showAlertDialog = false;
                            wallBackColor.fill = "#ada49b";
                        }
                    }

                    if (this.currentProperty === "material") {
                        if ((store.currentDownShape?.id === "sofa-orange") || (store.currentDownShape?.id === "sofa-material") || (store.currentDownShape?.id === "sofa2")) {
                            this.showAlertDialog = false;
                            wallBack2.visible = true;
                            wallBack3.visible = false;
                            wallBack2.x = artwork1.x + 0;
                            wallBack2.y = artwork1.y + 0;
                        }
                        if (store.currentDownShape?.id === "fluffy-texture") {
                            this.showAlertDialog = false;
                            wallBack2.visible = false;
                            wallBack3.visible = true;
                            wallBack3.x = artwork1.x + 0;
                            wallBack3.y = artwork1.y + 0;
                        }
                    }

                    break;

                case "person-man":
                case "person-boy":
                case "person-old":

                    if (this.currentProperty === "age") {

                        if (store.currentDownShape?.id === "boy-right") {
                            this.showAlertDialog = false;
                            personMan.visible = false;
                            personOld.visible = false;
                            personBoy.visible = true;
                            personOld.visible = false;
                            personBoy.x = artwork1.x + 105;
                            personBoy.y = artwork1.y + 605;
                        }
                        if (store.currentDownShape?.id === "old-woman") {
                            this.showAlertDialog = false;
                            personMan.visible = false;
                            personBoy.visible = false;
                            personOld.visible = true;
                            personOld.x = artwork1.x + 94;
                            personOld.y = artwork1.y + 572;
                        }
                    }

                    break;

                case "sofa":
                case "sofa-color":
                case "sofa-material":

                    if (this.currentProperty === "color") {
                        if (store.currentDownShape?.id === "sofa-orange") {
                            this.showAlertDialog = false;
                            sofa.visible = false;
                            sofaColor.visible = true;
                            sofaColor.x = artwork1.x + 630;
                            sofaColor.y = artwork1.y + 616;
                        }
                    }

                    if (this.currentProperty === "material") {
                        if ((store.currentDownShape?.id === "sofa-orange") || (store.currentDownShape?.id === "sofa2")) {
                            this.showAlertDialog = false;
                            sofa.visible = false;
                            sofaColor.visible = false;
                            sofaMaterial.visible = true;
                            sofaMaterial.x = artwork1.x + 620;
                            sofaMaterial.y = artwork1.y + 610;
                        }
                    }

                    if (this.currentProperty === "replace object") {
                        if (store.currentDownShape?.id === "sofa-orange") {
                            this.showAlertDialog = false;
                            sofa.visible = false;
                            sofaMaterial.visible = false;
                            sofaColor.visible = false;
                            sofa2.visible = true;
                            sofa2.x = artwork1.x + 620;
                            sofa2.y = artwork1.y + 670;
                        }
                    }
                    
                    break;

                default:
                    
                    break;
            }
        }
    }


    // --- View ---

   
    public posContextMenu: Point2D = { x: 0, y: 0 };
    public showContextMenu = false;
    public currentMenuItems: Array<Shape | Photo> = [];
    public contextMenuVisibility = false;
    public HeliosPropertiesVisibility = false;
    public targetEyedropper = "";
    public isEyedropping = false;
    public showLoupe = false;
    public loupeColor = "#000";
    public loupeImg = "";

    public currentObject = "";
    public currentProperty = "";
    public typeOfProperty = "age"; // color, material

    public personVisible = 2;
    public materialVisible = 1;
    public materialCouchVisible = 1;
    public sofaVisible = 1;

    public isHelpDiscover = false;
    public isHelpDoubleClick = false;
    public hasDoneHelp = true;

    public showRewardDiscover = false;
    public showRewardDouble = false;
    public showHelpIconBubble = false;

    public isDragging = false;
    public wasDragging = false;

    public isConnectionVisible = false;
    public connectionDirection = "right";
    public isColorWheelVisible = false;

    public cursorModifierVisibility: string = "hidden";
    public cursorSrc: string = "images/cursor-add.svg";
    public imageAlienBackground: string = "images/he-room-bg.jpg";
    public tryitMessage: string = "images/tryit.png";
    public tryitMessageVisibility: string = "hidden";

    public startMarqueePoint: Point2D = { x: 0, y: 0 };

    private _mousePos: Point2D = { x: 0, y: 0 };

    public get mousePos(): Point2D {
        return this._mousePos;
    }

    public set mousePos(point: Point2D) {
        this._mousePos = point;
    }

    private _pagePos: Point2D = { x: 0, y: 0 };

    public get pagePos(): Point2D {
        return this._pagePos;
    }

    public set pagePos(point: Point2D) {
        this._pagePos = point;
    }

    private _center: Point2D = {
        x: this.artboard.x + this.artboard.width / 2,
        y: this.artboard.y + this.artboard.height / 2,
    };

    public get center(): Point2D {
        return this._center;
    }

    public set center(center: Point2D) {
        this._center = center;
    }

    private _zoom = 1.0;

    public get zoom(): number {
        return this._zoom;
    }

    public set zoom(zoom: number) {
        this._zoom = zoom;
    }

    private _isFullscreen = false;

    public get isFullscreen(): boolean {
        return this._isFullscreen;
    }

    public set isFullscreen(isIt: boolean) {
        this._isFullscreen = isIt;
    }

}

export const store = new Store();
