import { Feature, Geolocation, View } from 'ol';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { CENTER_LOCATION, TRANSITION_DURATION } from '../model/constants';
import { apiFeatureStyle, positionFeatureStyle } from '../util/geo.util';

// const Projection: string = 'EPSG:3857'
const MaxZoom: number = 18;
const MinZoom: number = 11;
const Padding: number[] = [10, 10, 10, 10];

export class MapHandler {
    private map: Map;
    private mapElement: React.MutableRefObject<HTMLDivElement>;
    private featuresLayer: VectorLayer;
    private view: View;
    private tileLayer: TileLayer;
    private geoLocation: Geolocation;

    private apiFeature: Feature;

    constructor(mapElement: React.MutableRefObject<HTMLDivElement>) {
        this.mapElement = mapElement;
        this.map = new Map({});

        this.tileLayer = new TileLayer({
            source: new OSM(),
        });

        // create and add vector source layer
        this.apiFeature = new Feature();
        this.apiFeature.setStyle(apiFeatureStyle());

        this.featuresLayer = new VectorLayer({
            source: new VectorSource({
                features: [this.apiFeature],
            }),
        });

        this.view = new View({
            center: fromLonLat(CENTER_LOCATION),
            zoom: MinZoom,
            maxZoom: MaxZoom,
            minZoom: MinZoom,
        });

        this.geoLocation = new Geolocation({
            trackingOptions: {
                enableHighAccuracy: true,
                // timeout: 500,
                // maximumAge: 1500,
            },
            projection: this.view.getProjection(),
            tracking: true,
        });
    }

    init = (): void => {
        this.map = new Map({
            target: this.mapElement.current,
            layers: [this.tileLayer, this.featuresLayer],
            view: this.view,
            controls: [],
        });
        this.enableGeo();
    };

    private enableGeo = () => {
        const accuracyFeature = new Feature();
        this.geoLocation.on('change:accuracyGeometry', () => {
            accuracyFeature.setGeometry(this.geoLocation.getAccuracyGeometry());
        });

        const positionFeature = new Feature();
        positionFeature.setStyle(positionFeatureStyle());

        this.geoLocation.on('change:position', () => {
            const coordinates = this.geoLocation.getPosition();
            positionFeature.setGeometry(coordinates ? new Point(coordinates) : undefined);
        });

        this.addFeatures([accuracyFeature, positionFeature]);
    };

    addFeatures = (features: Feature<Geometry>[]) => {
        this.featuresLayer.getSource().addFeatures(features);
    };

    setApiFeature = (newFeature: Geometry): void => {
        this.apiFeature.setGeometry(newFeature);

        this.view.fit(this.featuresLayer.getSource().getExtent(), {
            padding: Padding,
            maxZoom: MaxZoom,
            duration: TRANSITION_DURATION,
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
                    duration: TRANSITION_DURATION,
                });
            }
        }
    }

    resetRotation = (): void => this.view.setRotation(0);

    updateSize = (): void => this.map.updateSize();
}
