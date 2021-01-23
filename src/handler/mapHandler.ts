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
import { CENTER_LOCATION, TRANSITION_DURATION } from '../model/constants';
import { apiFeatureStyle, positionFeatureStyle } from '../util/geo.util';

// const Projection: string = 'EPSG:3857'
const MAP_TRANSITION = TRANSITION_DURATION * 2;
const MaxZoom: number = 18;
const MinZoom: number = 11;
const Padding: number[] = [10, 10, 10, 10];

type MapCallbacks = {
    rotation: (e: ObjectEvent) => void;
    location: (result: PermissionStatus) => void;
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

    constructor(mapElement: React.MutableRefObject<HTMLDivElement>) {
        this.mapElement = mapElement;
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

        window.navigator.geolocation.watchPosition(this.updateGeoSuccess, this.updateGeoError, {
            enableHighAccuracy: true,
            timeout: 2000,
            maximumAge: 1000,
        });
    };

    setMapCallbacks = ({ rotation, location }: MapCallbacks) => {
        this.view.on('change:rotation', rotation);

        navigator.permissions.query({ name: 'geolocation' }).then(location);
    };

    private updateGeoSuccess = (pos: GeolocationPosition) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        const accuracy = circular(coords, pos.coords.accuracy);

        this.currLocation = fromLonLat(coords);

        this.positionFeature.setGeometry(new Point(fromLonLat(coords)));
        this.accuracyFeature.setGeometry(accuracy.transform('EPSG:4326', this.view.getProjection()));
    };

    private updateGeoError = (e: GeolocationPositionError) => {
        this.accuracyFeature.setGeometry(undefined);
        this.positionFeature.setGeometry(undefined);
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

                this.view.animate({
                    center: newCenter,
                    duration: MAP_TRANSITION,
                });
            }
        }
    }

    gpsClick = () => {
        this.currLocation.length &&
            this.view.animate({
                center: this.currLocation,
                duration: TRANSITION_DURATION,
                zoom: MaxZoom,
            });
    };

    resetRotation = (): void => this.view.animate({ rotation: 0, duration: MAP_TRANSITION });

    updateSize = (): void => this.map.updateSize();
}
