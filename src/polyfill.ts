import { Buffer } from "buffer";

declare global {
    var Buffer: typeof import("buffer").Buffer;
}

if (typeof globalThis.Buffer === "undefined") {
    globalThis.Buffer = Buffer;
}

if (typeof window !== "undefined") {
    // @ts-ignore
    window.Buffer = Buffer;
}
