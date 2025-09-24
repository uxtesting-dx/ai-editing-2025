import {
    Directive,
    directive,
    PartInfo,
    PartType,
} from "lit-html/directive.js";

type OpenFileResult = File | FileList;

abstract class OpenFileDirectiveBase<
    T extends OpenFileResult
> extends Directive {
    constructor(partInfo: PartInfo) {
        super(partInfo);
        if (partInfo.type !== PartType.EVENT) {
            throw new Error(
                'The "openFile" and "openFiles" directives can only be assigned to an event.'
            );
        }
    }

    abstract allowMultiselect: boolean;

    override render(onSelected: (event: CustomEvent<T>) => void, accept = "") {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", accept);
        if (this.allowMultiselect) {
            input.setAttribute("multiple", "");
        }
        input.addEventListener(
            "change",
            () => {
                const files = input.files;
                if (!files || files.length === 0) {
                    return;
                }
                const detail = (this.allowMultiselect ? files : files[0]) as T;
                onSelected(new CustomEvent("selected", { detail }));
            },
            { once: true }
        );
        return () => {
            input.click();
        };
    }
}

class OpenFileDirective extends OpenFileDirectiveBase<File> {
    override allowMultiselect = false;
}

class OpenFilesDirective extends OpenFileDirectiveBase<FileList> {
    override allowMultiselect = true;
}

/**
 * A directive that prompts the user to select a single file when the assigned event occurs.
 *
 * This directive is typically assigned to the `click` event of a button or link, as in this
 * example:
 *
 *      <sp-button @click=${openFile(this.imageSelected, "image/*")}>
 *          Open image...
 *      </sp-button>
 *
 *      imageSelected(event: CustomEvent<File>) {
 *          const file = event.detail;
 *          // ...
 *      }
 *
 * @param onSelected An event handler to call when the user selects a file.
 * @param accept A comma-separated list of file types to accept, each of which is either a MIME
 * type or a file extension (e.g. "image/*, .pdf").
 */
export const openFile = directive(OpenFileDirective);

/**
 * A directive that prompts the user to select one or more files when the assigned event occurs.
 *
 * This directive is typically assigned to the `click` event of a button or link, as in this
 * example:
 *
 *      <sp-button @click=${openFiles(this.imagesSelected, "image/*")}>
 *          Open images...
 *      </sp-button>
 *
 *      imagesSelected(event: CustomEvent<FileList>) {
 *          const files = event.detail;
 *          // ...
 *      }
 *
 * @param onSelected An event handler to call when the user selects files.
 * @param accept A comma-separated list of file types to accept, each of which is either a MIME
 * type or a file extension (e.g. "image/*, .pdf").
 */
export const openFiles = directive(OpenFilesDirective);
