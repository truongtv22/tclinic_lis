import { LAB } from 'shared/constants';

import { LabConfig } from './LabConfig';
import { BW200Config } from './BW200Config';
import { Access2Config } from './Access2Config';
import { SysmexXP100Config } from './SysmexXP100Config';
import { BioSystemA15Config } from './BioSystemA15Config';

export function getLabConfig(lab: string) {
  if (lab === LAB.BW200) return new BW200Config();
  if (lab === LAB.Access2) return new Access2Config();
  if (lab === LAB.SysmexXP100) return new SysmexXP100Config();
  if (lab === LAB.BioSystemA15) return new BioSystemA15Config();
  return new LabConfig();
}
