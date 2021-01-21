import { Feature, View } from 'ol';
import Geometry from 'ol/geom/Geometry';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { CENTER_LOCATION, TRANSITION_DURATION } from '../model/constants';

// const Projection: string = 'EPSG:3857'
const MaxZoom: number = 14;
const Padding: number[] = [10, 10, 10, 10];

export class MapHandler {
    private map: Map;
    private mapElement: React.MutableRefObject<HTMLDivElement>;
    private featuresLayer: VectorLayer;
    private view: View;
    private tileLayer: TileLayer;

    constructor(mapElement: React.MutableRefObject<HTMLDivElement>) {
        this.mapElement = mapElement;
        this.map = new Map({});

        this.tileLayer = new TileLayer({
            source: new OSM(),
        });

        // create and add vector source layer
        this.featuresLayer = new VectorLayer({
            source: new VectorSource(),
        });

        this.view = new View({
            center: fromLonLat(CENTER_LOCATION),
            zoom: 11,
        });
    }

    init = (): void => {
        this.map = new Map({
            target: this.mapElement.current,
            layers: [this.tileLayer, this.featuresLayer],
            view: this.view,
            controls: [],
        });
    };

    setFeature = (newFeature: Feature<Geometry>): void => {
        this.featuresLayer.setSource(
            new VectorSource({
                features: [newFeature],
            })
        );

        this.view.fit(this.featuresLayer.getSource().getExtent(), {
            padding: Padding,
            maxZoom: MaxZoom,
            duration: TRANSITION_DURATION,
        });
    };

    setSize = (width: number, height: number): void => {
        if (width === 0 && height === 0) return;
        this.map.setSize([width, height]);

        if (this.featuresLayer.getSource().getFeatures().length)
            this.view.fit(this.featuresLayer.getSource().getExtent(), {
                padding: Padding,
                maxZoom: MaxZoom,
                duration: TRANSITION_DURATION,
            });
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
                    duration: 400,
                });
            }
        }
    }

    resetRotation = (): void => this.view.setRotation(0);

    updateSize = (): void => this.map.updateSize();
}
