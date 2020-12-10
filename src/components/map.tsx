import React, { useState, useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { Pixel } from 'ol/pixel';

interface Props {
  features: [];
}

export const MapWrapper = (props: Props) => {
  const [map, setMap] = useState({} as Map);
  const [featuresLayer, setFeaturesLayer] = useState({} as VectorLayer);
  const [selectedCoord, setSelectedCoord] = useState<Coordinate>();

  const mapElement = useRef() as React.MutableRefObject<HTMLDivElement>;
  const mapRef = useRef({} as Map);
  mapRef.current = map;

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect(() => {
    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
    });

    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        initalFeaturesLayer,
      ],
      view: new View({
        center: fromLonLat([-6.249999, 53.416665]),
        zoom: 10,
      }),
      controls: [],
    });

    initialMap.on('click', handleMapClick);

    // save map and vector layer references to state
    setMap(initialMap);
    setFeaturesLayer(initalFeaturesLayer);
  }, []);

  // update map if features prop changes - logic formerly put into componentDidUpdate
  useEffect(() => {
    if (props.features?.length) {
      // set features to map
      featuresLayer.setSource(
        new VectorSource({
          features: props.features, // make sure features is an array
        })
      );

      // fit map to feature extent (with 100px of padding)
      map.getView().fit(featuresLayer.getSource().getExtent(), {
        padding: [100, 100, 100, 100],
      });
    }
  }, [props.features]);

  // map click handler
  const handleMapClick = (event: { pixel: Pixel }) => {
    const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);
    const transormedCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326');
    setSelectedCoord(transormedCoord);
    console.log(transormedCoord);
  };

  return (
    <div
      ref={mapElement}
      className='map-container'
      style={{ width: '100%', height: '800px' }}
    ></div>
  );
};
