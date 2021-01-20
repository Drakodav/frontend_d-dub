import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiResult } from '../model/api.model';
import { selectApiResults } from '../store/reducers/apiQuery';
import { getMapDimensions, setMapDimensions } from '../store/reducers/map';
import { getGeoObjFeature } from '../util/geo.util';

interface Props {}

export const MapWrapper = (props: Props) => {
    const dispatch = useDispatch();
    const [map, setMap] = useState<Map>(new Map({}));
    const [featuresLayer, setFeaturesLayer] = useState<VectorLayer>(new VectorLayer());

    const mapElement = useRef() as React.MutableRefObject<HTMLDivElement>;
    const mapRef = useRef({} as Map);
    mapRef.current = map;

    // run once, init ol map
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
                zoom: 11,
            }),
            controls: [],
        });
        setMap(initialMap);
        setFeaturesLayer(initFeatLayers);
    }, []);

    // update whats displayed on the map when a new apiResult comes in
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

    // used for dynamic map width and height resizing
    useEffect(() => {
        let timer: number | null;
        const handleResize = () => {
            timer && window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                timer = null;
                dispatch(setMapDimensions());
            }, 100);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    });

    // resize map every time the window size changes
    const dim = useSelector(getMapDimensions);
    useEffect(() => map.updateSize(), [dim, map]);
    return (
        <div
            ref={mapElement}
            className='map-container'
            style={{ width: `${dim.width}px`, height: `${dim.height}px` }}
        ></div>
    );
};
