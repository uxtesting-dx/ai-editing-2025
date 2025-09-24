import { svg, TemplateResult } from "lit";

import { Shape, ShapeId } from "../store/Shape.js";
import { Photo, PhotoId } from "../store/Photo.js";
import { Point2D, store } from "../store/Store.js";

export function renderShape(
shape: Shape | Photo, handlePointerOver?: (e: PointerEvent) => void, handlePointerOut?: (e: PointerEvent) => void, handlePointerDown?: (e: PointerEvent) => void, handleClick?: (e: PointerEvent) => void, handleDoubleClick?: (e: PointerEvent) => void, handleWheel?: (e: WheelEvent) => void): TemplateResult | undefined {
    
    const {
        shapeId,
        photoId,
        id,
        x,
        y,
        rotation,
        width,
        height,
        fill,
        stroke,
        strokeWidth,
        opacity,
        visible,
        src,
        pathData,
        hue,
        brightness,
        isHovered,
        isSelected,
        scan,
        scale,
        blendMode,
    } = shape as any;

    // Return early if shape is not visible
    if (visible === false) {
        return undefined;
    }

    const { zoom } = store;

    switch (photoId) {
        case PhotoId.Image: {
            return svg`
                    <style>
                        .scan-line-start {
                            animation: scan-line-animation-start 0.25s ease-in-out;
                        }
                        .scan-line-end {
                            animation: scan-line-animation-end 0.3s ease-in-out; 
                        }
                
                        @keyframes scan-line-animation-start {
                            0% {
                                opacity: 0;
                            }
                            100% {
                                opacity: 0.6;
                            }
                        }
                        @keyframes scan-line-animation-end {
                            0% {
                                opacity: 0.6;
                            }
                            100% {
                                opacity: 0;
                            }
                        }

                        .hidden {
                            display: none;
                        }
                    </style>
                    <defs>
                        <pattern id=${
                            "fill-image-" + id
                        } patternunits="userSpaceOnUse" width=${width} height=${height} >
                            <image width=${width} height=${height} href=${src} style="pointer-events='none'; mix-blend-mode: ${blendMode || 'normal'};"/>
                        </pattern>
                        <linearGradient id="stroke-selected" x1="-200%" y1="0%" x2="0%" y2="0%" gradientTransform="rotate(45)">
                            <stop offset="-200%" stop-color="#FF9D00" />
                            <stop offset="200%" stop-color="#FF9D00" />
                            <animate attributeType="XML" attributeName="x1" from="-200%" to="0%" dur="1.0s" repeatCount="indefinite"/>
                            <animate attributeType="XML" attributeName="x2" from="0%" to="200%" dur="1.0s" repeatCount="indefinite"/>
                        </linearGradient>
                        <linearGradient id="stroke-scan" x1="-200%" y1="0%" x2="0%" y2="0%" gradientTransform="rotate(45)">
                            <stop offset="-200%" stop-color="#C75D59" />
                            <stop offset="-150%" stop-color="#92E3D8" />
                            <stop offset="-100%" stop-color="#A18ED7" />
                            <stop offset="-50%" stop-color="#92E3D8" />
                            <stop offset="0%" stop-color="#C75D59" />
                            <stop offset="50%" stop-color="#92E3D8" />
                            <stop offset="100%" stop-color="#A18ED7" />
                            <stop offset="150%" stop-color="#92E3D8" />
                            <stop offset="200%" stop-color="#C75D59" />
                            <animate attributeType="XML" attributeName="x1" from="-200%" to="0%" dur="1.0s" repeatCount="indefinite"/>
                            <animate attributeType="XML" attributeName="x2" from="0%" to="200%" dur="1.0s" repeatCount="indefinite"/>
                        </linearGradient>
                        <linearGradient id="fill-scan" x1="-200%" y1="0%" x2="0%" y2="0%" gradientTransform="rotate(45)">
                            <stop offset="-100%" stop-color="white" />
                            <stop offset="-50%" stop-color="gray" />
                            <stop offset="0%" stop-color="black" />
                            <stop offset="50%" stop-color="gray" />
                            <stop offset="100%" stop-color="white" />
                            <animate attributeType="XML" attributeName="x1" from="-100%" to="0%" dur="1.0s" repeatCount="indefinite"/>
                            <animate attributeType="XML" attributeName="x2" from="0%" to="100%" dur="1.0s" repeatCount="indefinite"/>
                        </linearGradient>
                        <linearGradient id="stroke-sub-objects" xlink:href="#Gradient-1" spreadMethod="repeat" />
                    </defs>
                    <g
                        transform-origin="${(width*scale)/2} ${(height*scale)/2}"
                        transform="translate(${x},${y}) rotate(${rotation})"
                        >
                    <rect
                        x="-20"
                        y="-20"
                        width=${width + 40}
                        height=${height + 40}
                        rx="30"
                        ry="30"
                        transform="scale(${scale})"
                        fill="#FF9D00"
                        stroke="${stroke}"
                        stroke-width=${strokeWidth}
                        opacity=0.3
                        pointer-events=${visible ? "auto" : "none"}
                        cursor="move"
                        visibility=${(isHovered && !isSelected) ? "visible" : "hidden"}
                    ></rect>

                    <!-- Drag indicators - Top side -->
                    <g transform="scale(${scale})" visibility=${(isHovered && !isSelected) ? "visible" : "hidden"}>
                        <rect x="${width/2 - 15}" y="-12" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width/2 - 8}" y="-12" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width/2 - 1}" y="-12" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width/2 + 6}" y="-12" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width/2 + 13}" y="-12" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                    </g>

                    <!-- Drag indicators - Bottom side -->
                    <g transform="scale(${scale})" visibility=${(isHovered && !isSelected) ? "visible" : "hidden"}>
                        <rect x="${width/2 - 15}" y="${height + 9}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width/2 - 8}" y="${height + 9}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width/2 - 1}" y="${height + 9}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width/2 + 6}" y="${height + 9}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width/2 + 13}" y="${height + 9}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                    </g>

                    <!-- Drag indicators - Left side -->
                    <g transform="scale(${scale})" visibility=${(isHovered && !isSelected) ? "visible" : "hidden"}>
                        <rect x="-12" y="${height/2 - 15}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="-12" y="${height/2 - 8}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="-12" y="${height/2 - 1}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="-12" y="${height/2 + 6}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="-12" y="${height/2 + 13}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                    </g>

                    <!-- Drag indicators - Right side -->
                    <g transform="scale(${scale})" visibility=${(isHovered && !isSelected) ? "visible" : "hidden"}>
                        <rect x="${width + 9}" y="${height/2 - 15}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width + 9}" y="${height/2 - 8}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width + 9}" y="${height/2 - 1}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width + 9}" y="${height/2 + 6}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                        <rect x="${width + 9}" y="${height/2 + 13}" width="3" height="3" rx="1" fill="white" opacity="0.8"/>
                    </g>

                    

                    <rect
                        x="-20"
                        y="-20"
                        width=${width + 40}
                        height=${height + 40}
                        rx="30"
                        ry="30"
                        transform="scale(${scale})"
                        fill="#FF9D00"
                        stroke="${stroke}"
                        stroke-width=${strokeWidth}
                        opacity=0.7
                        pointer-events=${visible ? "auto" : "none"}
                        cursor="move"
                        visibility=${(isSelected) ? "visible" : "hidden"}
                    ></rect>

                    <rect
                        x="-20"
                        y="-20"
                        width=${width + 40}
                        height=${height + 40}
                        rx="30"
                        ry="30"
                        transform="scale(${scale})"
                        fill="#FF9D00"
                        stroke="${stroke}"
                        stroke-width=${strokeWidth}
                        opacity=0.15
                        pointer-events=${visible ? "auto" : "none"}
                        @pointerover=${handlePointerOver}
                        @pointerout=${handlePointerOut}
                        @pointerdown=${handlePointerDown}
                        @click=${handleClick}
                        @dblclick=${handleDoubleClick}
                        @wheel=${handleWheel}
                    ></rect>

                    <rect
                        x="0"
                        y="0"
                        width=${width}
                        height=${height}
                        rx="20"
                        ry="20"
                        transform="scale(${scale})"
                        fill=url(${"#fill-image-" + id})
                        stroke="${stroke}"
                        stroke-width=${strokeWidth}
                        opacity=${opacity}
                        pointer-events=${visible ? "auto" : "none"}
                        style="filter: brightness(${brightness}) hue-rotate(${hue}deg);"
                    ></rect>

                    <path
                        class=${scan ? "scan-line-start" : "hidden"}
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="scale(${scale})"
                        fill="url("#fill-scan")"
                        stroke=url("#stroke-scan")
                        stroke-width=${4 / zoom}
                        pointer-events="none"
                        style="opacity: 0"
                        pointer-events="none"
                    >
                    </path>
                    

                    
                    </g>
                    `;
        }
    }

    switch (shapeId) {

        case ShapeId.WallBackColor: {
            return svg`
                    <path
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="translate(${x},${y}) scale(${scale})"
                        fill=${fill}
                        stroke="${stroke}"
                        stroke-width="0"
                        opacity=${opacity}
                        style="mix-blend-mode: ${blendMode || 'normal'};"
                        pointer-events="none"
                    >
                    </path>
                `;
        }


        case ShapeId.Rectangle: {
            return svg`
                    <rect
                        x=${x}
                        y=${y}
                        width=${width}
                        height=${height}
                        fill=${fill}
                        stroke=${stroke}
                        stroke-width=${strokeWidth}
                        opacity=${opacity}
                        @pointerdown=${handlePointerDown}
                    ></rect>
                `;
        }

        case ShapeId.Ellipse: {
            const cx = x + width / 2;
            const cy = y + height / 2;
            const rx = width / 2;
            const ry = height / 2;
            return svg`
                    <ellipse
                        cx=${cx}
                        cy=${cy}
                        rx=${rx}
                        ry=${ry}
                        fill=${fill}
                        stroke=${stroke}
                        stroke-width=${strokeWidth}
                        opacity=${opacity}
                        @pointerdown=${handlePointerDown}
                    ></ellipse>
                `;
        }

        case ShapeId.Scale: {
            const cx = x + width / 2;
            const cy = y + height / 2;
            const rx = width / 2;
            const ry = height / 2;
            return svg`
                    <ellipse
                        id=${id}
                        cx=${cx}
                        cy=${cy}
                        rx=${rx}
                        ry=${ry}
                        fill=#FF9D00
                        stroke=white
                        stroke-width=${strokeWidth}
                        opacity=${opacity}
                        @pointerdown=${handlePointerDown}
                    ></ellipse>
                `;
        }

        case ShapeId.RotateNW: {
            const cx = x + width / 2;
            const cy = y + height / 2;
            return svg`
                    <circle
                        id=${id}
                        cx=${cx}
                        cy=${cy}
                        r="15"
                        fill="transparent"
                        stroke="#fff"
                        opacity="0.2"
                        stroke-width="30"
                        stroke-dasharray="70"
                        transform-origin="${x + 7} ${y + 7}"
                        transform="rotate(90)"
                        @pointerdown=${handlePointerDown}
                    ></circle>
                `;
        }

        case ShapeId.RotateNE: {
            const cx = x + width / 2;
            const cy = y + height / 2;
            return svg`
                    <circle
                        id=${id}
                        cx=${cx}
                        cy=${cy}
                        r="15"
                        fill="transparent"
                        stroke="#fff"
                        opacity="0.2"
                        stroke-width="30"
                        stroke-dasharray="70"
                        transform-origin="${x + 7} ${y + 7}"
                        transform="rotate(180)"
                        @pointerdown=${handlePointerDown}
                    ></circle>
                `;
        }

        case ShapeId.RotateSW: {
            const cx = x + width / 2;
            const cy = y + height / 2;
            return svg`
                    <circle
                        id=${id}
                        cx=${cx}
                        cy=${cy}
                        r="15"
                        fill="transparent"
                        stroke="#fff"
                        opacity="0.2"
                        stroke-width="30"
                        stroke-dasharray="70"
                        transform-origin="${x + 9} ${y + 9}"
                        transform="rotate(0)"
                        @pointerdown=${handlePointerDown}
                    ></circle>
                `;
        }

        case ShapeId.RotateSE: {
            const cx = x + width / 2;
            const cy = y + height / 2;
            return svg`
                    <circle
                        id=${id}
                        cx=${cx}
                        cy=${cy}
                        r="15"
                        fill="transparent"
                        stroke="#fff"
                        opacity="0.2"
                        stroke-width="30"
                        stroke-dasharray="70"
                        transform-origin="${x + 7} ${y + 7}"
                        transform="rotate(-90)"
                        cursor="rotate-se"
                        @pointerdown=${handlePointerDown}
                    ></circle>
                `;
        }

        case ShapeId.Star: {
            const d = getStarPathData(x, y, width, height);
            return svg`
                    <path
                        d=${d}
                        fill=${fill}
                        stroke=${stroke}
                        stroke-width=${strokeWidth}
                        opacity=${opacity}
                        @pointerdown=${handlePointerDown}
                    ></path>
                `;
        }

        // ${(scan) ?
        //     svg`
        //         <path
        //             d=${pathData}
        //             width=${width}
        //             height=${height}
        //             transform="translate(${x},${y})"
        //             fill=url("#stroke-scan")
        //             stroke=url("#stroke-scan")
        //             stroke-width=${4 / zoom}
        //             pointer-events="none"
        //         >
        //             <animate attributeName="opacity" begin="0" from="1" to="0" dur="0.6s" repeatCount="indefinite" fill="freeze"/>
        //         </path>`
        //     :
        //     svg``
        //     }

        case ShapeId.Image: {
            return svg`
                    <style>
                        .scan-line-start {
                            animation: scan-line-animation-start 0.25s ease-in-out;
                        }
                        .scan-line-end {
                            animation: scan-line-animation-end 0.3s ease-in-out; 
                        }
                
                        @keyframes scan-line-animation-start {
                            0% {
                                opacity: 0;
                            }
                            100% {
                                opacity: 0.6;
                            }
                        }
                        @keyframes scan-line-animation-end {
                            0% {
                                opacity: 0.6;
                            }
                            100% {
                                opacity: 0;
                            }
                        }

                        .hidden {
                            display: none;
                        }
                    </style>
                    <defs>
                        <pattern id=${
                            "fill-image-" + id
                        } patternunits="userSpaceOnUse" width=${width} height=${height} >
                            <image width=${width} height=${height} href=${src} style="pointer-events='none'; mix-blend-mode: ${blendMode || 'normal'};"/>
                        </pattern>
                        <linearGradient id="stroke-selected" x1="-200%" y1="0%" x2="0%" y2="0%" gradientTransform="rotate(45)">
                            <stop offset="-200%" stop-color="#FF9D00" />
                            <stop offset="200%" stop-color="#FF9D00" />
                            <animate attributeType="XML" attributeName="x1" from="-200%" to="0%" dur="1.0s" repeatCount="indefinite"/>
                            <animate attributeType="XML" attributeName="x2" from="0%" to="200%" dur="1.0s" repeatCount="indefinite"/>
                        </linearGradient>
                        <linearGradient id="stroke-scan" x1="-200%" y1="0%" x2="0%" y2="0%" gradientTransform="rotate(45)">
                            <stop offset="-200%" stop-color="#C75D59" />
                            <stop offset="-150%" stop-color="#92E3D8" />
                            <stop offset="-100%" stop-color="#A18ED7" />
                            <stop offset="-50%" stop-color="#92E3D8" />
                            <stop offset="0%" stop-color="#C75D59" />
                            <stop offset="50%" stop-color="#92E3D8" />
                            <stop offset="100%" stop-color="#A18ED7" />
                            <stop offset="150%" stop-color="#92E3D8" />
                            <stop offset="200%" stop-color="#C75D59" />
                            <animate attributeType="XML" attributeName="x1" from="-200%" to="0%" dur="1.0s" repeatCount="indefinite"/>
                            <animate attributeType="XML" attributeName="x2" from="0%" to="200%" dur="1.0s" repeatCount="indefinite"/>
                        </linearGradient>
                        <linearGradient id="fill-scan" x1="-200%" y1="0%" x2="0%" y2="0%" gradientTransform="rotate(45)">
                            <stop offset="-100%" stop-color="white" />
                            <stop offset="-50%" stop-color="gray" />
                            <stop offset="0%" stop-color="black" />
                            <stop offset="50%" stop-color="gray" />
                            <stop offset="100%" stop-color="white" />
                            <animate attributeType="XML" attributeName="x1" from="-100%" to="0%" dur="1.0s" repeatCount="indefinite"/>
                            <animate attributeType="XML" attributeName="x2" from="0%" to="100%" dur="1.0s" repeatCount="indefinite"/>
                        </linearGradient>
                        <linearGradient id="stroke-sub-objects" xlink:href="#Gradient-1" spreadMethod="repeat" />
                    </defs>
                    <g
                        transform-origin="${(width*scale)/2} ${(height*scale)/2}"
                        transform="translate(${x},${y}) rotate(${rotation})"
                        >
                    <path
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="scale(${scale})"
                        fill=url(${"#fill-image-" + id})
                        stroke="${stroke}"
                        stroke-width=${strokeWidth}
                        opacity=${opacity}
                        pointer-events=${visible ? "auto" : "none"}
                        style="filter: brightness(${brightness}) hue-rotate(${hue}deg); mix-blend-mode: ${blendMode || 'normal'};"
                        @pointerover=${handlePointerOver}
                        @pointerout=${handlePointerOut}
                        @pointerdown=${handlePointerDown}
                        @click=${handleClick}
                        @dblclick=${handleDoubleClick}
                        @wheel=${handleWheel}
                        pointer-events="none"
                    ></path>

                    <path
                        class=${scan ? "scan-line-start" : "hidden"}
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="scale(${scale})"
                        fill=url("#fill-scan")
                        stroke=url("#stroke-scan")
                        stroke-width=${4 / zoom}
                        pointer-events="none"
                        style="opacity: 0"
                        pointer-events="none"
                    >
                    </path>
                    
                    <path
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="scale(${scale})"
                        fill="none"
                        stroke=url("#stroke-selected")
                        stroke-width=${ (3 / scale) / zoom}
                        opacity=${(isSelected && !store.isDragging && !store.isSliding) ? "1" : "0"}
                        pointer-events="none"
                    ></path>
                    <path
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="scale(${scale})"
                        fill="none"
                        stroke="black"
                        stroke-width=${ (3 / scale) / zoom}
                        opacity="0.2"
                        visibility=${(isHovered) ? "visible" : "hidden"}
                        pointer-events="none"
                    >
                    </path>
                    <path
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="scale(${scale})"
                        fill="none"
                        stroke=url("#stroke-selected")
                        stroke-width=${ (4 / scale) / zoom}
                        visibility=${(isHovered && !isSelected) ? "visible" : "hidden"}
                        pointer-events="none"
                    >
                    </path>

                    </g>
                    `;
        }

    //     <path
    //     d=${pathData}
    //     width=${width}
    //     height=${height}
    //     transform="translate(${x},${y})"
    //     fill="none"
    //     stroke="none"
    //     stroke-width=${2 / zoom}
    //     opacity="1"
    //     pointer-events="none"
    // ></path>

        // case ShapeId.ImageOver: {
        //     return svg`
        //             <defs>
        //                 <pattern id=${
        //                     "fill-image-" + id
        //                 } patternunits="userSpaceOnUse" width=${width} height=${height} >
        //                     <image width=${width} height=${height} href=${src} />
        //                 </pattern>
        //             </defs>
        //             <rect
        //                 x=${x}
        //                 y=${y}
        //                 width=${width}
        //                 height=${height}
        //                 fill="none"
        //                 stroke="black"
        //                 stroke-width=${3 / zoom}
        //                 opacity="0.8"
        //             ></rect>
        //             <rect
        //                 x=${x}
        //                 y=${y}
        //                 width=${width}
        //                 height=${height}
        //                 fill="none"
        //                 stroke="white"
        //                 stroke-width=${1 / zoom}
        //                 opacity="1"
        //             ></rect>
        //             `;
        // }

        case ShapeId.ImageOver: {
            return svg`
                    <defs>
                        <filter id="shadow-over" x="-6" y="-6" width=${
                            width + 6
                        } height=${height + 6}>
                            <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                        </filter>
                    </defs>
                    <path
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="translate(${x},${y})"
                        fill="none"
                        stroke="black"
                        stroke-width=${3 / zoom}
                        opacity="0"
                        pointer-events="none"
                    ></path>
                    <path
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="translate(${x - (0.75 / zoom)},${y - (0.75 / zoom)})"
                        fill="none"
                        stroke="white"
                        stroke-width=${1.5 / zoom}
                        opacity="0"
                        pointer-events="none"
                    >
                    </path>
                    `;
        }

        case ShapeId.ImageSelected: {
            return svg`
                    <defs>
                        <pattern id=${
                            "fill-image-" + id
                        } patternunits="userSpaceOnUse" width=${width} height=${height} >
                            <image width=${width} height=${height} href=${src} />
                        </pattern>
                        <linearGradient id=${
                            "stroke-image-" + id
                        } x1="-200%" y1="0%" x2="0%" y2="0%">
                            <stop offset="-200%" stop-color="#C75D59" />
                            <stop offset="-150%" stop-color="#92E3D8" />
                            <stop offset="-100%" stop-color="#A18ED7" />
                            <stop offset="-50%" stop-color="#92E3D8" />
                            <stop offset="0%" stop-color="#C75D59" />
                            <stop offset="50%" stop-color="#92E3D8" />
                            <stop offset="100%" stop-color="#A18ED7" />
                            <stop offset="150%" stop-color="#92E3D8" />
                            <stop offset="200%" stop-color="#C75D59" />
                            <animate attributeType="XML" attributeName="x1" from="-100%" to="0%" dur="1.0s" repeatCount="indefinite"/>
                            <animate attributeType="XML" attributeName="x2" from="0%" to="100%" dur="1.0s" repeatCount="indefinite"/>
                        </linearGradient>
                        <filter id="shadow" x="-6" y="-6" width=${
                            width + 6
                        } height=${height + 6}>
                            <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                        </filter>
                    </defs>
                    <path
                        d=${pathData}
                        width=${width}
                        height=${height}
                        transform="translate(${x},${y})"
                        fill="none"
                        stroke=url(${"#stroke-image-" + id})
                        stroke-width=${strokeWidth}
                        opacity=${opacity}
                        filter=url(#shadow)
                        style="pointer-events: none;"
                        @pointerdown=${handlePointerDown}
                    >
                        <animate attributeName="stroke-width" values="1;5;1" dur="1s" repeatCount="indefinite" />
                    </path>
                    `;
        }
    }

    // Return undefined if no matching case is found
    return undefined;
}

function getStarPathData(
    x: number,
    y: number,
    width: number,
    height: number
): string {
    const points = getStarPoints();
    const bounds = getBounds(points);
    points.forEach((point) => {
        point.x = x + (width * (point.x - bounds.x)) / bounds.width;
        point.y = y + (height * (point.y - bounds.y)) / bounds.height;
    });
    const segments = points.map((p, i) => {
        const command = i === 0 ? "M" : "L";
        return `${command}${p.x},${p.y}`;
    });
    return segments.join("") + "Z";
}

function getBounds(points: Point2D[]): {
    x: number;
    y: number;
    width: number;
    height: number;
} {
    const min = { x: Infinity, y: Infinity };
    const max = { x: -Infinity, y: -Infinity };
    points.forEach((point) => {
        min.x = Math.min(min.x, point.x);
        min.y = Math.min(min.y, point.y);
        max.x = Math.max(max.x, point.x);
        max.y = Math.max(max.y, point.y);
    });
    return {
        x: min.x,
        y: min.y,
        width: max.x - min.x,
        height: max.y - min.y,
    };
}

function getStarPoints(): Point2D[] {
    const count = 5;
    const smoothness = 0.5 * (3 - Math.sqrt(5));
    const points: Point2D[] = [];
    for (let i = 0; i < count; i++) {
        const angle1 = (2 * Math.PI * i) / count;
        const x1 = Math.sin(angle1);
        const y1 = -Math.cos(angle1);
        points.push({ x: x1, y: y1 });
        const angle2 = (2 * Math.PI * (2 * i + 1)) / (2 * count);
        const x2 = smoothness * Math.sin(angle2);
        const y2 = -smoothness * Math.cos(angle2);
        points.push({ x: x2, y: y2 });
    }
    return points;
}
