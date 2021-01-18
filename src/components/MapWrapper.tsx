import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApiResult } from '../model/api.model';
import { selectApiResults } from '../store/reducers/apiQuery';
import { getGeoObjFeature } from '../util/api.util';

interface Props {}

export const MapWrapper = (props: Props) => {
    const [map, setMap] = useState<Map>(new Map({}));
    const [featuresLayer, setFeaturesLayer] = useState<VectorLayer>(new VectorLayer());
    const [dimensions, setDimensions] = useState<{ height: number; width: number }>({
        height: window.innerHeight,
        width: window.innerWidth,
    });

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
        const newFeature = !!apiResult && getGeoObjFeature(apiResult);
        if (newFeature) {
            featuresLayer.setSource(
                new VectorSource({
                    features: [newFeature],
                })
            );

            map.getView().fit(featuresLayer.getSource().getExtent(), {
                padding: [100, 100, 100, 100],
                maxZoom: 11,
            });
        }
    }, [apiResult, featuresLayer, map]);

    // resize map every time the window size changes
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            ref={mapElement}
            className='map-container'
            style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        ></div>
    );
};
