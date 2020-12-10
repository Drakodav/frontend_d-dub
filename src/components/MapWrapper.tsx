import Feature from 'ol/Feature';
import { GeoJSONMultiLineString } from 'ol/format/GeoJSON';
import MultiLineString from 'ol/geom/MultiLineString';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApiResult } from '../model/api';
import { selectApiResults } from '../store/reducers/apiQuery';

interface Props {}

export const MapWrapper = (props: Props) => {
  const [map, setMap] = useState<Map>(new Map({}));
  const [featuresLayer, setFeaturesLayer] = useState<VectorLayer>(
    new VectorLayer()
  );

  const mapElement = useRef() as React.MutableRefObject<HTMLDivElement>;
  const mapRef = useRef({} as Map);
  mapRef.current = map;

  useEffect(() => {
    // create and add vector source layer
    const initFeatLayers = new VectorLayer({
      source: new VectorSource(),
    });

    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        initFeatLayers,
      ],
      view: new View({
        center: fromLonLat([-6.249999, 53.416665]),
        zoom: 10,
      }),
      controls: [],
    });
    setMap(initialMap);
    setFeaturesLayer(initFeatLayers);
  }, []);

  const apiResult: ApiResult = useSelector(selectApiResults);

  useEffect(() => {
    const geoObj = apiResult && (apiResult?.geometry as GeoJSONMultiLineString);
    const newFeature =
      geoObj?.coordinates &&
      new Feature({
        geometry: new MultiLineString(geoObj.coordinates).transform(
          'EPSG:4326',
          'EPSG:3857'
        ),
      });

    if (newFeature) {
      featuresLayer.setSource(
        new VectorSource({
          features: [newFeature],
        })
      );

      map.getView().fit(featuresLayer.getSource().getExtent(), {
        padding: [100, 100, 100, 100],
      });
    }
  }, [apiResult, featuresLayer, map]);

  return (
    <div
      ref={mapElement}
      className='map-container'
      style={{ width: '100%', height: '500px' }}
    ></div>
  );
};
