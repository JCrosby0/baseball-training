import { basesLoaded } from "./bl-default";
import { hitRightCentre } from "./hit-to-right-centre";
import { zrDefault } from "./zr-default";
//https://probaseballinsider.com/baseball-instruction/outfield/outfield-backing-up-plays/
import { zrBaseHitToRF } from "./zr-base-hit-to-rf";
import { zrBaseHitToCF } from "./zr-base-hit-to-cf";
import { zrBaseHitToLF } from "./zr-base-hit-to-lf";
import { zrXBHitToRF } from "./zr-xb-hit-to-rf";
import { zrXBHitToRCGap } from "./zr-xb-hit-to-rcgap";
import { zrXBHitToLF } from "./zr-xb-hit-to-lf";
import { zrXBHitToLCGap } from "./zr-xb-hit-to-lcgap";

export default [
  zrDefault,
  basesLoaded,
  hitRightCentre,
  zrBaseHitToRF,
  zrBaseHitToCF,
  zrBaseHitToLF,
  zrXBHitToRF,
  zrXBHitToRCGap,
  zrXBHitToLCGap,
  zrXBHitToLF,
];
