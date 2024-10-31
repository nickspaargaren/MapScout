// ResizableImage.ts
import { Image, ImageOptions } from "@tiptap/extension-image";
import { Node } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableImage: {
      setImage: (options: { src: string; width?: string; height?: string }) => ReturnType;
    };
  }
}

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element: HTMLElement) => element.getAttribute("width") || "auto",
        renderHTML: (attributes: Record<string, any>) => {
          return { width: attributes.width };
        },
      },
      height: {
        default: "auto",
        parseHTML: (element: HTMLElement) => element.getAttribute("height") || "auto",
        renderHTML: (attributes: Record<string, any>) => {
          return { height: attributes.height };
        },
      },
    };
  },
  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default ResizableImage;
