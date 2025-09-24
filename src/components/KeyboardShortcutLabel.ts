import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Platform } from "./Platform.js";

/**
 * Provides a label indicating the shortcut keys that can be used to activate some functionality.
 *
 * A shortcut label is usually displayed within a tooltip, as in this example:
 *
 *      <overlay-trigger>
 *          <sp-button slot="trigger">Export Model</sp-button>
 *          <sp-tooltip slot="hover-content" variant="info">
 *              <b>Export Model File</b>
 *              <keyboard-shortcut-label shortcut="cmdOrCtrl+e"></keyboard-shortcut-label>
 *              <br />
 *              Download a model file for use in other applications.
 *          </sp-tooltip>
 *      </overlay-trigger>
 *
 * Also see the `TooltipContent` component, which formats content for a tooltip.
 */
@customElement("keyboard-shortcut-label")
export class KeyboardShortcutLabel extends LitElement {
    static styles = css`
        kbd {
            display: inline-flex;
            justify-content: center;
            font-family: inherit;
            font-weight: 600;
            line-height: 80%;
            border-width: 1px;
            border-style: solid;
            border-color: initial;
            border-radius: 2px;
            min-width: 16px;
            padding: 2px 3px 3px 3px;
            margin-left: 4px;
            box-sizing: border-box;
        }
    `;

    /** An optional comma-separated list of shortcut key combinations. */
    @property()
    public shortcut?: string;

    protected override render(): TemplateResult[] | null {
        if (!this.shortcut) {
            return null;
        }
        return this.shortcut
            .split(",")
            .map((keyCombo) => [
                this.renderKeyCombo(keyCombo),
                html`<span> or</span>`,
            ])
            .flat()
            .slice(0, -1);
    }

    private renderKeyCombo(keyCombo: string): TemplateResult {
        const keys = keyCombo.trim().split("+");
        const joiner = Platform.IS_MAC ? "" : "\u00A0";
        const renderedKeys = keys
            .map((key) => this.renderKey(key))
            .join(joiner);
        return html`<kbd>${renderedKeys}</kbd>`;
    }

    private renderKey(key: string): string {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        const replacements: Record<string, string> = {
            Left: "←",
            Right: "→",
            Up: "↑",
            Down: "↓",
        };
        if (Platform.IS_MAC) {
            Object.assign(replacements, {
                CmdOrCtrl: "⌘",
                Cmd: "⌘",
                Meta: "⌘",
                Alt: "⌥",
                Option: "⌥",
                Ctrl: "⌃",
                Shift: "⇧",
            });
        } else {
            Object.assign(replacements, {
                CmdOrCtrl: "Ctrl",
                Cmd: "Win",
                Meta: "Win",
                Option: "Alt",
            });
        }
        let newKey = capitalizedKey;
        for (const [oldKey, replacement] of Object.entries(replacements)) {
            newKey = newKey.replace(oldKey, replacement);
        }
        return newKey;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "keyboard-shortcut-label": KeyboardShortcutLabel;
    }
}
