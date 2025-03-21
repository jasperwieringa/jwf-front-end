export type Image = {
  alt: string;
  width: number;
  height: number;
  positionGroup: 'left' | 'right' | 'center';
  gridIndex: number;
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
  _type: string;
};
