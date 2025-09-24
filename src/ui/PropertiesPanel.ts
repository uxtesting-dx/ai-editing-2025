import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/action-group/sp-action-group.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/divider/sp-divider.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-close.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-delete.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-duplicate.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-ungroup.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-layers-backward";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-layers-forward";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-reorder.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-flip-horizontal.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-flip-vertical.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-transparency.js";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-color-wheel";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-light";
import "@spectrum-web-components/icons-workflow/icons/sp-icon-contrast";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/menu/sp-menu-item.js";
import "@spectrum-web-components/number-field/sp-number-field.js";
import "@spectrum-web-components/picker/sp-picker.js";
import "@spectrum-web-components/slider/sp-slider.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { Slider } from "@spectrum-web-components/bundle";
import { css, html } from "lit";
import { customElement } from "lit/decorators.js";

//import { Shape } from "../store/Shape.js";
import { store } from "../store/Store.js";

// type NumericPropertyNames<T> = {
//     [K in keyof T]: T[K] extends number ? K : never;
// }[keyof T];

@customElement("app-properties-panel")
export class PropertiesPanel extends MobxLitElement {
  static styles = css`
    :host {
      display: block;
      width: 600px;
      min-width: 600px;
      height: 60px;
      border-radius: 45px;
      position: absolute;
      bottom: 28px;
      float: left;
      left: calc(50% - (490px / 2));
      z-index: 10;
    }

    .panel {
      display: flex;
      flex-direction: row;
      width: 592px;
      height: 54px;
      padding: 8px;
      padding-left: 0px;
      margin-right: 14px;
      border-radius: 14px;

      animation: fade-in 0.12s ease-out;
    }

    .box-property {
      align-content: center;
      position: absolute;
      display: flex;
      border-radius: 14px;
      background: rgba(255, 255, 255, 1);
      width: 578px;
      height: 46px;
      padding: 0px;
      top: 2px;
      left: 2px;
      padding-left: 18px;
    }

    @keyframes fade-in {
      0% {
        opacity: 0;
        transform: scale(0.85);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .bg-dark {
      align-content: center;
      position: absolute;
      display: flex;
      border-radius: 14px;
      background: rgba(255, 255, 255, 1);
      width: 462px;
      height: 56px;
      padding: 0px;
      top: 2px;
      left: 2px;
      padding-left: 18px;
      filter: drop-shadow(0 0 5px #00000030);
    }

    .breadcrumb {
      padding-bottom: 0px;
    }

    .left-label {
      margin-top: 4px;
      font-size: 13px;
    }

    .space-above {
      display: block;
      margin-top: 4px;
    }

    .parent-tag {
      margin-right: -2px;
    }

    .sub-object-tag {
      margin-right: 0px;
      opacity: 0.6;
    }

    .prop-group {
      display: flex;
      flex-direction: row;
      align-items: top;
      margin-top: 12px;
      margin-left: 4px;
      margin-right: 4px;
    }

    .prop-label {
      position: relative;
      width: 64px;
      justify-content: center;
      top: 28px;
      text-align: center;
      margin-left: -64px;
    }

    .prop-group-single {
      display: flex;
      flex-direction: row;
      align-items: top;
      justify-content: center;
      margin-top: 8px;
      margin-left: 24px;
      margin-right: 4px;
    }

    .prop-label-single {
      position: relative;
      width: 36px;
      justify-content: center;
      top: 28px;
      text-align: center;
      margin-left: -36px;
    }

    .just-button {
      align-self: center;
    }

    .icon-button {
      margin-top: -4px;
      margin-bottom: -4px;
      padding-right: 4px;
    }

    .hidden {
      display: none;
    }
  `;

  protected override render() {
    // TODO: Instead of using <input type="color">, we could create a Spectrum-styled color
    // picker from <sp-color-area> and <sp-color-slider>.
    // See https://opensource.adobe.com/spectrum-web-components/components/color-area/
    // and https://opensource.adobe.com/spectrum-web-components/components/color-slider/.

    //const { selectedShapes } = store;
    //const disabled = selectedShapes === undefined;
    //<div class=${store.selectedShapes.length > 0 ? "panel" : "hidden"}>
    return html`
            <div class="hidden">
                <div class="bg-dark">
                    <div class="prop-group">
                        <sp-action-button quiet>
                            <img
                                class="icon-button"
                                src="images/InsertObject.svg"
                                alt=""
                                width="18"
                                height="18"
                            />
                            Replace
                        </sp-action-button>
                        <sp-action-button quiet>
                            Duplicate
                            <sp-icon-duplicate slot="icon"></sp-icon-duplicate>
                        </sp-action-button>
                        <sp-action-button quiet>
                            Flip
                            <sp-icon-flip-horizontal slot="icon"></sp-icon-flip-horizontal>
                        </sp-action-button>
                        <sp-action-button quiet>
                            Reorder
                            <sp-icon-reorder slot="icon"></sp-icon-icon-chevron-right>
                        </sp-action-button>
                        <sp-action-button quiet @mousedown=${this.onDelete}>
                            Delete
                            <sp-icon-delete slot="icon"></sp-icon-delete>
                        </sp-action-button>
                    </div>
                          
                </div>
                <div
                    class=${
                      store.isPropertySliderOn ? "box-property" : "hidden"
                    }
                >
                    <sp-action-button quiet class="just-button">
                        <sp-icon-transparency
                            slot="icon"
                        ></sp-icon-transparency>
                    </sp-action-button>
                    <sp-slider
                        class="space-above"
                        style="padding-left: 20px; padding-right: 20px; width: 454px;"
                        label="Opacity"
                        variant="filled"
                        min="0"
                        max="1"
                        step="0.01"
                        format-options='{
                            "style": "percent"
                        }'
                        value=${store.opacity}
                        @pointerup=${PropertiesPanel.stopSliding}
                        @input=${PropertiesPanel.setOpacity}
                    ></sp-slider>
                    <sp-action-button
                        quiet
                        class="just-button"
                        @mousedown=${this.closePropertySlider}
                    >
                        <sp-icon-close slot="icon"></sp-icon-close>
                    </sp-action-button>
                </div>
                <div class=${store.isPropertyHueOn ? "box-property" : "hidden"}>
                    <sp-action-button quiet class="just-button">
                        <sp-icon-color-wheel
                            slot="icon"
                        ></sp-icon-color-whell>
                    </sp-action-button>
                    <sp-slider
                        class="space-above"
                        style="padding-left: 20px; padding-right: 20px; width: 454px;"
                        label="Color"
                        variant="filled"
                        min="0"
                        max="360"
                        step="1.0"
                        format-options='{
                            "style": "value"
                        }'
                        value=${store.hue}
                        @pointerup=${PropertiesPanel.stopSliding}
                        @input=${PropertiesPanel.setHue}
                    ></sp-slider>
                    <sp-action-button
                        quiet
                        class="just-button"
                        @mousedown=${this.closePropertyHue}
                    >
                        <sp-icon-close slot="icon"></sp-icon-close>
                    </sp-action-button>
                </div>
                <div class=${
                  store.isPropertyBrightnessOn ? "box-property" : "hidden"
                }>
                    <sp-action-button quiet class="just-button">
                        <sp-icon-light
                            slot="icon"
                        ></sp-icon-light>
                    </sp-action-button>
                    <sp-slider
                        class="space-above"
                        style="padding-left: 20px; padding-right: 20px; width: 454px;"
                        label="Bright."
                        variant="filled"
                        min="0"
                        max="3"
                        step="0.05"
                        format-options='{
                            "style": "value"
                        }'
                        value=${store.brightness}
                        @pointerup=${PropertiesPanel.stopSliding}
                        @input=${PropertiesPanel.setBrightness}
                    ></sp-slider>
                    <sp-action-button
                        quiet
                        class="just-button"
                        @mousedown=${this.closePropertyBright}
                    >
                        <sp-icon-close slot="icon"></sp-icon-close>
                    </sp-action-button>
                </div>
            </div>
        `;
  }

  private onDelete() {
    store.deleteSelectedShapes();
  }

  //   private openPropertySlider() {
  //     store.isPropertySliderOn = true;
  //   }
  private closePropertySlider() {
    store.isPropertySliderOn = false;
  }
  //   private openPropertyHue() {
  //     store.isPropertyHueOn = true;
  //   }
  private closePropertyHue() {
    store.isPropertyHueOn = false;
  }
  // private openPropertyBright() {
  //     store.isPropertyBrightnessOn = true;
  // }
  private closePropertyBright() {
    store.isPropertyBrightnessOn = false;
  }

  private static stopSliding() {
    store.isSliding = false;
  }

  // private static hideAdorners() {
  //     // How to hide adorner? Need to create a store.isDragging.
  //     //ToolBase.isDragging = true;
  // }

  // private static setFill(event: Event) {
  //     store.fill = (event.target as HTMLInputElement).value;
  // }

  // private static setStroke(event: Event) {
  //     store.stroke = (event.target as HTMLInputElement).value;
  // }

  // private static setStrokeWidth(event: Event) {
  //     const numberField = event.target as NumberField;
  //     const value = numberField.value;
  //     if (isNaN(value)) {
  //         numberField.value = store.strokeWidth;
  //     } else {
  //         store.strokeWidth = value;
  //     }
  // }

  private static setOpacity(event: Event) {
    store.isSliding = true;
    store.opacity = (event.target as Slider).value;
  }

  private static setHue(event: Event) {
    store.isSliding = true;
    store.hue = (event.target as Slider).value;
  }

  private static setBrightness(event: Event) {
    store.isSliding = true;
    store.brightness = (event.target as Slider).value;
  }

  // private static setX(event: Event) {
  //     PropertiesPanel.setShapeProperty(event, "x");
  // }

  // private static setY(event: Event) {
  //     PropertiesPanel.setShapeProperty(event, "y");
  // }

  // private static setWidth(event: Event) {
  //     PropertiesPanel.setShapeProperty(event, "width");
  // }

  // private static setHeight(event: Event) {
  //     PropertiesPanel.setShapeProperty(event, "height");
  // }

  // private static setShapeProperty(
  //     event: Event,
  //     _propName: NumericPropertyNames<Shape>
  // ) {
  //     if (store.selectedShapes.length > 0) {
  //         const numberField = event.target as NumberField;
  //         const value = numberField.value;
  //         if (isNaN(value)) {
  //             //numberField.value = store.selectedShapes[propName];
  //         } else {
  //             //store.selectedShapes[propName] = value;
  //         }
  //     }
  // }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
  interface HTMLElementTagNameMap {
    "app-properties-panel": PropertiesPanel;
  }
}
