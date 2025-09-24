import "@spectrum-web-components/button-group/sp-button-group.js";
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/dialog/sp-dialog-wrapper.js";
import "@spectrum-web-components/link/sp-link.js";
import "@spectrum-web-components/overlay/overlay-trigger.js";
import "@spectrum-web-components/toast/sp-toast.js";
import "../components/openFile.js";

import { MobxLitElement } from "@adobe/lit-mobx";
import { DialogWrapper } from "@spectrum-web-components/bundle";
import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import { openFile } from "../components/openFile.js";
import { AppMode, store } from "../store/Store.js";

@customElement("app-home-tab")
export class HomeTab extends MobxLitElement {
    static styles = css`
        :host {
            display: flex;
            font-weight: 400;
            gap: 32px;
            padding: 0 16px;
            background-color: transparent;
        }

        #button-column {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            margin-top: 32px;
        }

        #main-column {
            margin-top: 8px;
            max-width: 512px;
        }

        #title {
            font-size: 40px;
            font-weight: 100;
            line-height: 1.3;
            color: var(--spectrum-global-color-static-blue-500);
            margin: 8px 0 0;
        }

        #contributors {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--spectrum-global-color-gray-600);
            margin: 8px 0;
        }

        #toast {
            position: fixed;
            bottom: 16px;
            right: 16px;
        }
    `;

    @state()
    private selectedFile?: File;

    // <file-opener accept="image/*" @selected=${this.openProject}>
    //     <sp-button variant="primary" quiet>
    //         Open Project...
    //     </sp-button>
    // </file-opener>

    protected override render() {
        return html`
            <div id="button-column">
                <overlay-trigger type="modal" placement="none">
                    <sp-dialog-wrapper
                        slot="click-content"
                        headline="Create New Project"
                        confirm-label="OK"
                        cancel-label="Cancel"
                        underlay
                        @confirm=${this.createNewProject}
                        @cancel=${this.closeDialog}
                    >
                        Let&rsquo;s get started!
                    </sp-dialog-wrapper>
                    <sp-button slot="trigger" variant="primary" quiet>
                        Create New Project
                    </sp-button>
                </overlay-trigger>
                <sp-button
                    variant="primary"
                    quiet
                    @click=${openFile(this.openProject, "image/*")}
                >
                    Open Project...
                </sp-button>
            </div>
            <div id="main-column">
                <h1 id="title">Welcome to [Project Name]</h1>
                <h5 id="contributors">Name Contributor1, Name Contributor2</h5>
                <p>
                    Please provide a brief description of your project. Explain
                    the technology involved, as well as how to use this
                    application. Provide relevant links to GitHub repositories,
                    university pages, or your papers. This is also a good place
                    to introduce yourself and mention how you can be reached in
                    order to provide feedback or get more information.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam tincidunt ligula placerat, malesuada lacus tincidunt,
                    maximus dui. Aenean luctus tristique lectus, et commodo quam
                    vestibulum vel. In elementum eu odio eu pellentesque. Proin
                    eget odio sed justo lacinia efficitur in sed arcu.
                </p>
                <p>
                    <sp-link href="https://git.corp.adobe.com/" target="_blank">
                        GitHub Project
                    </sp-link>
                    <br />
                    <sp-link href="https://git.corp.adobe.com/" target="_blank">
                        Personal Web Page
                    </sp-link>
                    <br />
                    <sp-link href="https://git.corp.adobe.com/" target="_blank">
                        Related Papers
                    </sp-link>
                </p>
            </div>
            <sp-toast
                id="toast"
                ?open=${!!this.selectedFile}
                variant="positive"
                timeout="6000"
                @close=${this.toastClosed}
            >
                You selected ${this.selectedFile?.name}.
            </sp-toast>
        `;
    }

    private createNewProject() {
        store.appMode = AppMode.Edit;
    }

    private closeDialog(event: Event) {
        (event.target as DialogWrapper).close();
    }

    private openProject = (event: CustomEvent<File>) => {
        this.selectedFile = event.detail;
    };

    private toastClosed() {
        this.selectedFile = undefined;
    }
}

// See https://lit.dev/docs/components/defining/#typescript-typings
declare global {
    interface HTMLElementTagNameMap {
        "app-home-tab": HomeTab;
    }
}
