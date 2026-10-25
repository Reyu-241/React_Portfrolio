declare module "animated-backgrounds" {
  import type { CSSProperties, ReactElement } from "react";

  interface AnimatedBackgroundProps {
    animationName: string;
    theme?: string;
    interactive?: boolean;
    interactionConfig?: {
      effect?: "attract" | "repel" | "follow" | "burst";
      strength?: number;
      radius?: number;
      continuous?: boolean;
    };
    adaptivePerformance?: boolean;
    fps?: number;
    style?: CSSProperties;
    blendMode?: string;
  }

  export function AnimatedBackground(
    props: AnimatedBackgroundProps,
  ): ReactElement | null;
}
