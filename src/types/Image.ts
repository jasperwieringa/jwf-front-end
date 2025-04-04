const POSITION_GROUPS = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'] as const;
export type PositionGroup = typeof POSITION_GROUPS[number];

export type Image = {
  alt: string;
  positionGroup: PositionGroup;
  gridIndex: number;
  rowIndex: number;
  asset: {
    _ref: string;
    _type: string;
  };
  crop: {
    bottom: number;
    left: number;
    right: number;
    top: number;
    _type: string;
  };
  hotspot: {
    height: number;
    width: number;
    x: number;
    y: number;
    _type: string;
  };
  height: number;
  width: number;
  _type: string;
};
