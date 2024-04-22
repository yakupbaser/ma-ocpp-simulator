import React, { useMemo } from 'react';
import { ReactComponent as GlobalEmpty } from '../assets/svg/global/empty.svg';
import { ReactComponent as GlobalChevronDown } from '../assets/svg/global/chevron-down.svg';
import { ReactComponent as GlobalChevronUp } from '../assets/svg/global/chevron-up.svg';

const _memorizedIcon = (SVG: any, props: React.SVGProps<SVGSVGElement>) => useMemo(() => <SVG {...props} />, [props]);
class AppIcons {
  static GlobalEmpty = (props: React.SVGProps<SVGSVGElement>) => _memorizedIcon(GlobalEmpty, props);
  static GlobalChevronDown = (props: React.SVGProps<SVGSVGElement>) => _memorizedIcon(GlobalChevronDown, props);
  static GlobalChevronUp = (props: React.SVGProps<SVGSVGElement>) => _memorizedIcon(GlobalChevronUp, props);
}

export default AppIcons;
