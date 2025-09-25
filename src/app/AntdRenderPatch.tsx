"use client";

import { useEffect } from "react";
import { unstableSetRender } from "antd";
import { createRoot } from "react-dom/client";

export default function AntdRenderPatch() {
  useEffect(() => {
    unstableSetRender((node, container) => {
      // attach root once per container
      // @ts-ignore
      container._reactRoot ||= createRoot(container);
      // @ts-ignore
      const root = container._reactRoot;

      root.render(node);

      return async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        root.unmount();
      };
    });
  }, []);

  return null;
}
