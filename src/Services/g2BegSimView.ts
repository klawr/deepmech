import { IMecElement } from "./Singletons/mecElement";

// Let g2 beg simulate view (g2.beg does not respect cartesian)
export default function g2BegSimView(ref: IMecElement) {
  const v = ref._interactor.view;
  return {
    matrix() {
      return v.cartesian
        ? [v.scl, 0, 0, -v.scl, v.x, ref._ctx.canvas.height - 1 - v.y]
        : [v.scl, 0, 0, v.scl, v.x, v.y];
    },
  };
}