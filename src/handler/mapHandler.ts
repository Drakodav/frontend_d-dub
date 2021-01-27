import { Feature, View } from 'ol';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import { circular } from 'ol/geom/Polygon';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { ObjectEvent } from 'ol/Object';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { apiFeatureStyle, positionFeatureStyle } from '../util/geo.util';
import {
    CENTER_LOCATION,
    TRANSITION_DURATION,
    MAP_TRANSITION,
    GeoOptions,
    MaxZoom,
    MinZoom,
    Padding,
} from '../model/constants';

type MapCallbacks = {
    setRotation: (value: React.SetStateAction<boolean>) => void;
    setLocation: (value: React.SetStateAction<string>) => void;
};

export class MapHandler {
    private map: Map;
    private mapElement: React.MutableRefObject<HTMLDivElement>;
    private view: View;
    private tileLayer: TileLayer;

    private featuresLayer: VectorLayer;
    private LocationLayer: VectorLayer;

    private apiFeature: Feature;
    private accuracyFeature: Feature;
    private positionFeature: Feature;

    private currLocation: number[] = [];

    private mapCallbacks: MapCallbacks;

    private id: number = 0;

    constructor(mapElement: React.MutableRefObject<HTMLDivElement>, mapCallbacks: MapCallbacks) {
        this.mapElement = mapElement;
        this.mapCallbacks = mapCallbacks;
        this.map = new Map({});

        this.tileLayer = new TileLayer({
            source: new OSM(),
        });

        // create and add vector source layer
        this.apiFeature = new Feature();
        this.accuracyFeature = new Feature();
        this.positionFeature = new Feature();

        this.apiFeature.setStyle(apiFeatureStyle());
        this.positionFeature.setStyle(positionFeatureStyle());

        this.featuresLayer = new VectorLayer({
            source: new VectorSource({
                features: [this.apiFeature],
            }),
        });

        this.LocationLayer = new VectorLayer({
            source: new VectorSource({
                features: [this.accuracyFeature, this.positionFeature],
            }),
        });

        this.view = new View({
            center: fromLonLat(CENTER_LOCATION),
            zoom: MinZoom,
            maxZoom: MaxZoom,
            minZoom: MinZoom,
        });
    }

    init = (): void => {
        this.map = new Map({
            target: this.mapElement.current,
            layers: [this.tileLayer, this.featuresLayer, this.LocationLayer],
            view: this.view,
            controls: [],
        });

        this.view.on('change:rotation', (e: ObjectEvent) => {
            this.mapCallbacks.setRotation((e.target as View).getRotation() !== 0 ? true : false);
        });

        navigator?.permissions?.query({ name: 'geolocation' }).then(async (result: PermissionStatus) => {
            const { setLocation } = this.mapCallbacks;
            setLocation(() => result.state);
            result.onchange = () => setLocation(() => result.state);
        });
    };

    enableLocation = () => {
        this.id = window.navigator.geolocation.watchPosition(this.updateGeoSuccess, this.updateGeoError, GeoOptions);
    };

    disableLocation = () => {
        window.navigator.geolocation.clearWatch(this.id);
        this.accuracyFeature.setGeometry(undefined);
        this.positionFeature.setGeometry(undefined);
    };

    private updateGeoSuccess = (pos: GeolocationPosition) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        const accuracy = circular(coords, pos.coords.accuracy);

        this.mapCallbacks.setLocation('granted');
        this.currLocation = fromLonLat(coords);
        this.positionFeature.setGeometry(new Point(fromLonLat(coords)));
        this.accuracyFeature.setGeometry(accuracy.transform('EPSG:4326', this.view.getProjection()));
    };

    private updateGeoError = (error: GeolocationPositionError) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mapCallbacks.setLocation(() => 'denied');
                break;
            case error.TIMEOUT:
                this.mapCallbacks.setLocation(() => 'prompt');
                break;
            case error.POSITION_UNAVAILABLE:
                this.mapCallbacks.setLocation(() => 'prompt');
                this.accuracyFeature.setGeometry(undefined);
                this.positionFeature.setGeometry(undefined);
                this.currLocation = [];
                break;
        }
    };

    addFeatures = (features: Feature<Geometry>[]) => {
        this.featuresLayer.getSource().addFeatures(features);
    };

    setApiFeature = (newFeature: Geometry): void => {
        this.apiFeature.setGeometry(newFeature);

        this.view.fit(newFeature.getExtent(), {
            padding: Padding,
            maxZoom: MaxZoom,
            duration: MAP_TRANSITION,
        });
    };

    setSize = (width: number, height: number): void => {
        if (width === 0 && height === 0) return;
        this.map.setSize([width, height]);
    };

    panMapByPixel(x: number, y: number) {
        let newCenterInPx;
        let center = this.view.getCenter();
        if (!!center?.length) {
            let centerInPx = this.map.getPixelFromCoordinate(center);

            if (centerInPx) {
                newCenterInPx = [centerInPx[0] + x, centerInPx[1] + y];

                var newCenter = this.map.getCoordinateFromPixel(newCenterInPx);

                this.gotoCenter(newCenter);
            }
        }
    }

    getCurrentPosition = (): void => {
        window.navigator.geolocation.getCurrentPosition(
            (pos: GeolocationPosition) => {
                this.updateGeoSuccess(pos);
                this.gotoCenter(fromLonLat([pos.coords.longitude, pos.coords.latitude]));
            },
            this.updateGeoError,
            GeoOptions
        );
    };

    gotoCurrentPosition = (): void => {
        this.currLocation.length && this.gotoCenter(this.currLocation);
    };

    resetRotation = (): void => this.view.animate({ rotation: 0, duration: MAP_TRANSITION });

    updateSize = (): void => this.map.updateSize();

    gotoCenter = (coords: number[]) =>
        this.view.animate({
            center: coords,
            duration: TRANSITION_DURATION,
            zoom: MaxZoom,
        });
}
