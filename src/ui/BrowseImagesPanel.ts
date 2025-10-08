import "@spectrum-web-components/action-button/sp-action-button.js";
import "@spectrum-web-components/theme/sp-theme.js";

import "@spectrum-web-components/icons-workflow/icons/sp-icon-close.js";

import { MobxLitElement }   from "@adobe/lit-mobx";
import { css, html }        from "lit";
import { customElement }    from "lit/decorators.js";


//import { Shape } from "../store/Shape.js";
import { store } from "../store/Store.js";



@customElement("app-browse-images-panel")
export class BrowseImagesPanel extends MobxLitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: #000000aa;
    }

    #browse-images-panel {
      width: calc(100% - 240px);
      height: calc(100% - 240px);
      margin-left: 120px;
      margin-top: 100px;
      border-radius: 12px;
      background-color: #333333;
    }

    #browse-images-panel-title {
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
    }

    #browse-images-panel-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 40px;
      padding-top: 32px;
      width: calc(100% - 70px);
    }

    #browse-images-panel-header-icon {
      width: 17px;
      height: 17px;
      margin-top: 3px;
      margin-right: 12px;
    }

      #browse-images-panel-content {
        display: flex;
        width: calc(100% - 40px);
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        align-content: flex-start;
        margin-left: 40px;
        margin-top: 38px;
        gap: 16px;
        overflow-y: auto;
        height: calc(100% - 130px);
      }

    #image-thumbnail {
      width: 240px;
      height: 240px;
      border-radius: 8px;
      align-content: top;
    }

  `;

  protected override render() {
    return html`
            <sp-theme style="width: 100%; height: 100%;" theme="dark" color="dark">
              <div id="browse-images-panel">

                <div id="browse-images-panel-header">
                  <img id="browse-images-panel-header-icon" src="images/he-icon-refimg.png" alt="add reference" />
                  <span id="browse-images-panel-title">
                    Add reference image
                  </span>
                  <img src="images/he-search.png" alt="search" style="margin-left: 24px; height:42px;"/>
                  <sp-action-button quiet style="margin-left: auto; margin-right: 0px;"
                        @click=${this.handleCloseClick}>
                    <sp-icon-close slot="icon"></sp-icon-close>
                  </sp-action-button>
                  
                </div>

                <div id="browse-images-panel-content">

                ${store.typeOfProperty === "color" ? html`
                  
                  <img id="image-thumbnail" src="images/he-ref-green2.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>  
                  <img id="image-thumbnail" src="images/he-ref-bobois.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>  
                  <img id="image-thumbnail" src="images/he-ref-green.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>  
                  <img id="image-thumbnail" src="images/he-ref-red.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>
                  <img id="image-thumbnail" src="images/he-ref-01.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>  
                  <img id="image-thumbnail" src="images/he-ref-02.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>
                  <img id="image-thumbnail" src="images/he-ref-03.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>
                  <img id="image-thumbnail" src="images/he-ref-04.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>
                  <img id="image-thumbnail" src="images/he-ref-05.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>
                  <img id="image-thumbnail" src="images/he-ref-06.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>
                ` : ""}

                ${store.typeOfProperty === "material" ? html`
                  <img id="image-thumbnail" src="images/he-ref-green2.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>  
                  <img id="image-thumbnail" src="images/he-ref-bobois.jpg" alt="image thumbnail" @click=${this.handleImageClick}/>  
                ` : ""}


                </div>

              </div>
            </sp-theme>
        `;
  }

  private handleImageClick = async (e: Event) => {
    e.stopPropagation();
    e.preventDefault();

    const img = e.target as HTMLImageElement;
    const imageSrc = img.src;

    // Extract colors from the selected image using local Canvas method
    try {
      console.log('Extracting colors from image:', imageSrc);
      
      const colors = await this.extractColorsFromImage(imageSrc);
      console.log('Colors extracted locally:', colors);
      
      // Store the extracted colors in the store for use in HeliosProperties
      store.extractedColors = colors;
      console.log('Stored extracted colors:', store.extractedColors);
      
    } catch (error) {
      console.error('Error extracting colors from image:', error);
      // Fallback to default colors if extraction fails
      store.extractedColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    }

    if (store.typeOfProperty === "color") {
      store.currentColorReference = imageSrc.split("/").pop() ?? "";
    } else if (store.typeOfProperty === "material") {
      store.currentMaterialReference = imageSrc.split("/").pop() ?? "";
    }

    store.showBrowseImagesPanel = false;
  };

  private handleCloseClick = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    store.showBrowseImagesPanel = false;
  };

  private async extractColorsFromImage(imageSrc: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Set canvas size (smaller for performance)
          canvas.width = 100;
          canvas.height = 100;
          
          // Draw image to canvas
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Get image data
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (!imageData) {
            reject(new Error('Failed to get image data'));
            return;
          }
          
          // Extract dominant colors
          const colors = this.getDominantColors(imageData.data, 5);
          resolve(colors);
          
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageSrc;
    });
  }

  private getDominantColors(imageData: Uint8ClampedArray, numColors: number): string[] {
    const colorData: { [key: string]: { count: number, r: number, g: number, b: number } } = {};
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < imageData.length; i += 16) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const alpha = imageData[i + 3];
      
      // Skip transparent pixels and very dark/light pixels
      if (alpha < 128) continue;
      
      // Skip colors that are too close to white, black, or gray
      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 225) continue;
      
      // Check if color is too gray (low saturation)
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      if (saturation < 0.2) continue; // Skip low saturation colors
      
      // Quantize colors to reduce noise (less aggressive for vibrant colors)
      const quantizeLevel = saturation > 0.5 ? 16 : 32; // Less quantization for vibrant colors
      const quantizedR = Math.floor(r / quantizeLevel) * quantizeLevel;
      const quantizedG = Math.floor(g / quantizeLevel) * quantizeLevel;
      const quantizedB = Math.floor(b / quantizeLevel) * quantizeLevel;
      
      const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
      
      if (!colorData[colorKey]) {
        colorData[colorKey] = { count: 0, r: quantizedR, g: quantizedG, b: quantizedB };
      }
      colorData[colorKey].count++;
    }
    
    // Calculate vibrancy score for each color
    const colorScores = Object.entries(colorData).map(([colorKey, data]) => {
      const { count, r, g, b } = data;
      
      // Calculate HSV values for vibrancy scoring
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const value = max / 255;
      
      // Vibrancy score: prioritize high saturation and moderate brightness
      const vibrancyScore = saturation * value * (1 - Math.abs(value - 0.6)); // Peak at 60% brightness
      
      // Color diversity bonus (prefer colors that are different from common colors)
      const diversityBonus = this.getColorDiversityBonus(r, g, b);
      
      // Combined score: frequency + vibrancy + diversity
      const frequencyScore = Math.log(count + 1); // Logarithmic to reduce frequency dominance
      const totalScore = frequencyScore + (vibrancyScore * 3) + diversityBonus;
      
      return {
        colorKey,
        r, g, b,
        count,
        saturation,
        vibrancyScore,
        totalScore
      };
    });
    
    // Sort by total score (vibrancy-weighted) and take top colors
    const sortedColors = colorScores
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, numColors)
      .map(({ r, g, b }) => this.rgbToHex(r, g, b));
    
    return sortedColors;
  }

  private getColorDiversityBonus(r: number, g: number, b: number): number {
    // Bonus for colors that are not common/boring
    const commonColors = [
      [128, 128, 128], // Gray
      [255, 255, 255], // White
      [0, 0, 0],       // Black
      [139, 69, 19],   // Brown
      [160, 160, 160], // Light gray
    ];
    
    let minDistance = Infinity;
    for (const [cr, cg, cb] of commonColors) {
      const distance = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
      minDistance = Math.min(minDistance, distance);
    }
    
    // Higher bonus for colors further from common colors
    return Math.min(minDistance / 100, 1);
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  
}

declare global {
  interface HTMLElementTagNameMap {
    "app-browse-images-panel": BrowseImagesPanel;
  }
}
