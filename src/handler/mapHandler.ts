import { Feature, View } from 'ol';
import Geometry from 'ol/geom/Geometry';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { CENTER_LOCATION } from '../model/constants';

export class MapHandler {
    private map: Map;
    private mapElement: React.MutableRefObject<HTMLDivElement>;
    private featuresLayer: VectorLayer;
    private view: View;

    constructor(mapElement: React.MutableRefObject<HTMLDivElement>) {
        this.map = new Map({});
        this.mapElement = mapElement;

        // create and add vector source layer
        this.featuresLayer = new VectorLayer({
            source: new VectorSource(),
        });

        this.view = new View({
            center: fromLonLat(CENTER_LOCATION),
            zoom: 11,
        });
    }

    init = () => {
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

    setFeature = (newFeature: Feature<Geometry>) => {
        this.featuresLayer.setSource(
            new VectorSource({
                features: [newFeature],
            })
        );

        this.view.fit(this.featuresLayer.getSource().getExtent(), {
            // padding: [100, 100, 100, 100],
            maxZoom: 13,
        });
    };

    updateSize = () => this.map.updateSize();
}
