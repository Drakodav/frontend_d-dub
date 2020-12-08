import React, { FunctionComponent, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

type Props = {};

export const PublicMap: FunctionComponent<Props> = (Props) => {
  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        }),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
  console.log(map, 'hello');

  useEffect(() => {
    map.setTarget('map');
  });

  return (
    <div id='map' style={{ width: '100%', height: '360px' }}>
      {/* <button onClick={(e) => this.userAction()}>setState on click</button> */}
    </div>
  );
};
