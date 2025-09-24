import { Platform } from "./Platform";

const EDITABLE_ELEMENTS = ["INPUT", "SELECT", "TEXTAREA"];

const ALL_MODIFIER_KEYS: (keyof KeyboardEvent)[] = [
    "altKey",
    "ctrlKey",
    "metaKey",
    "shiftKey",
];

const ALL_MODIFIER_ALIASES: Record<string, keyof KeyboardEvent> = {
    alt: "altKey",
    option: "altKey",
    control: "ctrlKey",
    ctrl: "ctrlKey",
    meta: "metaKey",
    cmd: "metaKey",
    command: "metaKey",
    shift: "shiftKey",
    cmdOrCtrl: Platform.IS_MAC ? "metaKey" : "ctrlKey",
};

export function matchesShortcut(
    event: KeyboardEvent,
    shortcut: string | undefined
): boolean {
    if (!shortcut) {
        return false;
    }

    const path = event.composedPath();
    if (
        path.length > 0 &&
        EDITABLE_ELEMENTS.includes((path[0] as Node)?.nodeName)
    ) {
        return false;
    }

    const keyCombos = shortcut.split(",");
    return keyCombos.some((keyCombo) => matchesKeyCombo(event, keyCombo));
}

function matchesKeyCombo(event: KeyboardEvent, keyCombo: string): boolean {
    const keyAndModifierAliases = keyCombo.split("+").map((key) => key.trim());
    const expectedKeys = keyAndModifierAliases
        .filter((key) => !(key in ALL_MODIFIER_ALIASES))
        .map((key) => key.toLowerCase());
    if (expectedKeys.length > 1) {
        throw new Error(
            `Shortcut "${keyCombo}" has more than one non-modifier key: "${expectedKeys.join(
                '", "'
            )}".`
        );
    }
    const keyMatches =
        expectedKeys.length === 0 ||
        event.key.toLowerCase() === expectedKeys[0];

    const expectedModifierKeys = keyAndModifierAliases
        .filter((key) => key in ALL_MODIFIER_ALIASES)
        .map((key) => ALL_MODIFIER_ALIASES[key])
        .sort();
    const actualModifierKeys = ALL_MODIFIER_KEYS.filter((key) => event[key]);
    const modifiersMatch =
        expectedModifierKeys.length === actualModifierKeys.length &&
        expectedModifierKeys.every((key, i) => actualModifierKeys[i] === key);

    return keyMatches && modifiersMatch;
}
