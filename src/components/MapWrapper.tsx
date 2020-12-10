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
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { ApiResult } from '../model/api';
import { GeoJSONMultiLineString, GeoJSONObject } from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import MultiLineString from 'ol/geom/MultiLineString';

interface Props {}

export const MapWrapper = (props: Props) => {
  const [map, setMap] = useState<Map>(new Map({}));
  const [featuresLayer, setFeaturesLayer] = useState<VectorLayer>(
    new VectorLayer({
      source: new VectorSource(),
    })
  );
  // const [selectedCoord, setSelectedCoord] = useState<Coordinate>([0, 0]);

  const mapElement = useRef() as React.MutableRefObject<HTMLDivElement>;
  const mapRef = useRef({} as Map);
  mapRef.current = map;

  useEffect(() => {
    // create and add vector source layer

    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        featuresLayer,
      ],
      view: new View({
        center: fromLonLat([-6.249999, 53.416665]),
        zoom: 10,
      }),
      controls: [],
    });

    // initialMap.on('click', handleMapClick);

    // save map and vector layer references to state
    setMap(initialMap);
  }, []);

  // useEffect(() => {
  //   if (props.features?.length) {
  //     featuresLayer.setSource(
  //       new VectorSource({
  //         features: props.features, // make sure features is an array
  //       })
  //     );

  //     // fit map to feature extent (with 100px of padding)
  //     map.getView().fit(featuresLayer.getSource().getExtent(), {
  //       padding: [100, 100, 100, 100],
  //     });
  //   }
  // }, [props.features]);

  // map click handler
  // const handleMapClick = (event: { pixel: Pixel }) => {
  //   const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);
  //   const transormedCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326');
  //   setSelectedCoord(transormedCoord);
  //   addMarker(transormedCoord);
  // };

  // function addMarker(transormedCoord: Coordinate) {
  //   // var iconFeatures = [];

  //   var iconFeature = new Feature({
  //     geometry: new Point(transform(transormedCoord, 'EPSG:4326', 'EPSG:3857')),
  //   });

  //   featuresLayer.getSource().addFeature(iconFeature);
  // }

  const apiResults: ApiResult[] = useSelector(
    (state: RootState) => state.apiQuery.apiResults
  );

  useEffect(() => {
    const geoObj =
      apiResults && (apiResults[0]?.geometry as GeoJSONMultiLineString);
    const newFeature =
      geoObj &&
      new Feature({
        geometry: new MultiLineString(geoObj.coordinates),
      });

    // console.log(apiResults, geoObj);
    if (newFeature) {
      const newFeatLayer = new VectorLayer({
        source: new VectorSource({
          features: [newFeature], // make sure features is an array
        }),
      });

      featuresLayer.getSource().addFeature(newFeature);

      setFeaturesLayer(newFeatLayer);
    }
  }, [apiResults]);

  return (
    <div
      ref={mapElement}
      className='map-container'
      style={{ width: '100%', height: '800px' }}
    ></div>
  );
};
