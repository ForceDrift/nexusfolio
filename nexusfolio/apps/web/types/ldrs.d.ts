declare module 'ldrs/react' {
  import { ComponentType } from 'react';

  interface GridProps {
    size?: string | number;
    speed?: string | number;
    color?: string;
    className?: string;
  }

  export const Grid: ComponentType<GridProps>;
}
