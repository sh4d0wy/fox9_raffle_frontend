import { Buffer } from "buffer";

if (typeof globalThis.Buffer === "undefined") {
    globalThis.Buffer = Buffer;
}

if (typeof window !== "undefined") {
    // @ts-ignore
    window.Buffer = Buffer;
}
