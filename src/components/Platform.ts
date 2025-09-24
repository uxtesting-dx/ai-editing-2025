/** Properties of the platform on which the application is running. */
export class Platform {
    /**
     * True when running on macOS, false otherwise.
     *
     * Useful for defining keyboard shortcuts using the Command key on macOS and the Control key on
     * Windows.
     */
    static IS_MAC = !!navigator.platform.match(/^Mac/);
}
