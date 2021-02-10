import { Dispatch } from '@reduxjs/toolkit';
import { Feature, Overlay, View } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { MultiPoint } from 'ol/geom';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import { circular } from 'ol/geom/Polygon';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { ObjectEvent } from 'ol/Object';
import { fromLonLat, transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { ApiStop } from '../model/api.model';
import {
    CENTER_LOCATION,
    DublinBoundary,
    GeoOptions,
    MapFeatureTypes,
    MAP_TRANSITION,
    MaxZoom,
    MinZoom,
    Padding,
    Projection,
    TRANSITION_DURATION,
} from '../model/constants';
import { setSelectedStop } from '../store/reducers/searchInput';
import { extraTripFeatureStyle, positionFeatureStyle, stopFeatureStyle, tripFeatureStyle } from '../util/geo.util';

type MapCallbacks = {
    setRotation: (value: React.SetStateAction<boolean>) => void;
    setLocation: (value: React.SetStateAction<string>) => void;
    dispatch: Dispatch<any>;
};

export class MapHandler {
    private static instance: MapHandler;
    private map: Map = new Map({});
    private view: View;
    private tileLayer: TileLayer;
    private mapPopup: Overlay = new Overlay({});

    private featuresLayer: VectorLayer;
    private tripFeature: Feature = new Feature();
    private stopsFeature: Feature = new Feature();
    private stopFeature: Feature = new Feature();
    private extraTripFeature: Feature = new Feature();

    private LocationLayer: VectorLayer;
    private accuracyFeature: Feature = new Feature();
    private positionFeature: Feature = new Feature();

    private currLocation: number[] = [];
    private id: number | undefined;

    private mapCallbacks!: MapCallbacks;
    private mapElement!: React.MutableRefObject<HTMLDivElement>;

    static getInstance(): MapHandler {
        if (!MapHandler.instance) {
            MapHandler.instance = new MapHandler();
        }
        return MapHandler.instance;
    }

    private constructor() {
        this.tileLayer = new TileLayer({
            source: new OSM({}),
        });

        this.stopsFeature.setGeometryName(MapFeatureTypes.StopsFeature.toString());
        this.tripFeature.setGeometryName(MapFeatureTypes.TripFeature.toString());
        this.extraTripFeature.setGeometryName(MapFeatureTypes.ExtraTripFeature.toString());
        this.stopFeature.setGeometryName(MapFeatureTypes.StopFeature.toString());
        this.accuracyFeature.setGeometryName(MapFeatureTypes.AccuracyFeature.toString());
        this.positionFeature.setGeometryName(MapFeatureTypes.PositionFeature.toString());

        // create and add vector source layer
        this.tripFeature.setStyle(tripFeatureStyle());
        this.positionFeature.setStyle(positionFeatureStyle());
        this.stopFeature.setStyle(stopFeatureStyle());

        this.extraTripFeature.setStyle(extraTripFeatureStyle());

        this.featuresLayer = new VectorLayer({
            source: new VectorSource({
                features: [this.tripFeature, this.stopsFeature, this.stopFeature, this.extraTripFeature],
            }),
        });

        this.LocationLayer = new VectorLayer({
            source: new VectorSource({
                features: [this.accuracyFeature, this.positionFeature],
            }),
        });

        this.view = new View({
            center: fromLonLat(CENTER_LOCATION),
            extent: DublinBoundary,
            zoom: MinZoom,
            maxZoom: MaxZoom,
            minZoom: MinZoom,
            projection: Projection,
        });
    }

    init = (
        mapElement: React.MutableRefObject<HTMLDivElement>,
        mapPopup: React.MutableRefObject<HTMLDivElement>,
        mapCallbacks: MapCallbacks
    ): void => {
        this.mapElement = mapElement;
        this.mapCallbacks = mapCallbacks;
        this.mapPopup = new Overlay({
            element: mapPopup.current,
            autoPan: true,
            autoPanAnimation: { duration: TRANSITION_DURATION },
        });

        this.map = new Map({
            target: this.mapElement.current,
            layers: [this.tileLayer, this.featuresLayer, this.LocationLayer],
            view: this.view,
            controls: [],
            overlays: [this.mapPopup],
        });

        const content = document.getElementById('popup-content');
        const closer = document.getElementById('popup-close');
        if (closer && content) {
            closer.onclick = () => {
                this.mapPopup.setPosition(undefined);
                closer?.blur();
                return false;
            };

            this.map.on('singleclick', (event) => {
                if (this.map.hasFeatureAtPixel(event.pixel) === true) {
                    this.map.forEachFeatureAtPixel(event.pixel, (feature: FeatureLike) => {
                        let currFeat: Geometry | undefined;
                        currFeat = feature.getProperties()[MapFeatureTypes.StopsFeature]
                            ? (feature.getGeometry() as MultiPoint)
                            : undefined;

                        currFeat =
                            !currFeat && feature.getProperties()[MapFeatureTypes.StopFeature]
                                ? (feature.getGeometry() as Point)
                                : currFeat;

                        const stops: ApiStop[] = feature.getGeometry()?.getProperties()?.stops;
                        if (currFeat && stops) {
                            const coordinate = currFeat.getClosestPoint(event.coordinate);

                            stops.forEach((stop) => {
                                if (
                                    transform(stop.point.coordinates, 'EPSG:4326', 'EPSG:3857').toString() ===
                                    coordinate.toString()
                                ) {
                                    content.getElementsByTagName('span')[0].innerText = stop.name;
                                    content!.onclick = () => {
                                        mapCallbacks.dispatch(setSelectedStop(stop));
                                        this.mapPopup.setPosition(undefined);
                                    };
                                    this.mapPopup.setPosition(coordinate);
                                }
                            });
                        }
                    });
                } else {
                    this.mapPopup.setPosition(undefined);
                    closer?.blur();
                }
            });
        }

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
        if (!this.id)
            this.id = window.navigator.geolocation.watchPosition(
                this.updateGeoSuccess,
                this.updateGeoError,
                GeoOptions
            );
    };

    disableLocation = () => {
        if (!!this.id) {
            window.navigator.geolocation.clearWatch(this.id);
            this.accuracyFeature.setGeometry(undefined);
            this.positionFeature.setGeometry(undefined);
            this.id = undefined;
            this.currLocation = [];
        }
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

    setFeature = (newFeature: Geometry | undefined, featureType: MapFeatureTypes): void => {
        let feat: Feature;

        switch (featureType) {
            case MapFeatureTypes.TripFeature:
                feat = this.tripFeature;
                break;
            case MapFeatureTypes.StopsFeature:
                feat = this.stopsFeature;
                break;
            case MapFeatureTypes.ExtraTripFeature:
                feat = this.extraTripFeature;
                break;
            case MapFeatureTypes.StopFeature:
                feat = this.stopFeature;
                break;
            case MapFeatureTypes.PositionFeature:
                feat = this.positionFeature;
                break;
            case MapFeatureTypes.AccuracyFeature:
                feat = this.accuracyFeature;
                break;
        }

        feat.setGeometry(newFeature);
        this.fitFeature(newFeature);
    };

    private fitFeature = (feature: Geometry | undefined): void => {
        !!feature &&
            this.view.fit(feature.getExtent(), {
                padding: Padding,
                maxZoom: MaxZoom,
                duration: MAP_TRANSITION,
            });
    };

    // set the size of the map
    setSize = (width: number, height: number): void => {
        if (width === 0 && height === 0) return;
        this.map.setSize([width, height]);
    };

    // not used but for future may be useful
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

    getCurrentPosition = (
        successCallback?: PositionCallback,
        errorCallback?: PositionErrorCallback | undefined
    ): void => {
        window.navigator.geolocation.getCurrentPosition(
            (pos: GeolocationPosition) => {
                this.updateGeoSuccess(pos);
                this.gotoCenter(fromLonLat([pos.coords.longitude, pos.coords.latitude]));
                successCallback && successCallback(pos);
            },
            (error: GeolocationPositionError) => {
                this.updateGeoError(error);
                errorCallback && errorCallback(error);
            },
            GeoOptions
        );
    };

    gotoCurrentPosition = (): void => {
        this.currLocation.length && this.gotoCenter(this.currLocation);
    };

    resetRotation = (): void => this.view.animate({ rotation: 0, duration: MAP_TRANSITION });

    gotoCenter = (coords: number[]) =>
        this.view.animate({
            center: coords,
            duration: TRANSITION_DURATION,
            zoom: MaxZoom,
        });

    resetFeaturesLayer = (): void => {
        this.featuresLayer.getSource().forEachFeature((feature: Feature<Geometry>) => feature.setGeometry(undefined));
    };
}
