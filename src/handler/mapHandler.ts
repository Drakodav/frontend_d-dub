import { Feature, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { CENTER_LOCATION, TRANSITION_DURATION } from '../model/constants';

export class MapHandler {
    private map: Map;
    private mapElement: React.MutableRefObject<HTMLDivElement>;
    private featuresLayer: VectorLayer;
    private view: View;

    constructor(mapElement: React.MutableRefObject<HTMLDivElement>) {
        this.mapElement = mapElement;
        this.map = new Map({});

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
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                this.featuresLayer,
            ],
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
            padding: [5, 5, 5, 5],
            maxZoom: 13,
        });
    };

    moveMap = (width: number, height: number): void => {
        if (width === 0 && height === 0) return;
        // const coord = this.view.getCenter();
        // if (coord) {
        //     const [lon, lat] = coord as Coordinate;
        //     const zoom = Number(this.view.getZoom());
        //     const calcHeight = Number(height / (zoom * 100));

        //     const newLat = calcHeight - lat;
        //     console.log(this.view.getCenter(), height, newLat, calcHeight);

        //     // this.view.adjustCenter([0, calcHeight]);
        //     this.view.animate({ center: [width, newLat], duration: TRANSITION_DURATION });
        // }
    };

    resetRotation = (): void => this.view.setRotation(0);

    updateSize = (): void => this.map.updateSize();
}
