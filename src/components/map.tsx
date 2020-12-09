import React, { FunctionComponent, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

type Props = {};

export const PublicMap: FunctionComponent<Props> = (Props) => {
  const initMap = () => {
    const myMap = new Map({
      target: 'mapContainer',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });

    myMap.setTarget('mapContainer');
  };

  useEffect(() => {
    initMap();
  });

  return (
    <div id='mapContainer' style={{ width: '100%', height: '800px' }}></div>
  );
};
