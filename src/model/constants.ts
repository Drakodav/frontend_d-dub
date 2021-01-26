// meant to represent duration in milliseconds
export const TRANSITION_DURATION: number = 300 as const;

// MapHandler Constants
export const CENTER_LOCATION: number[] = [-6.266155, 53.35014];
// const Projection: string = 'EPSG:3857'
export const MAP_TRANSITION = TRANSITION_DURATION * 2;
export const MaxZoom: number = 18;
export const MinZoom: number = 11;
export const Padding: number[] = [10, 10, 10, 10];
export const GeoOptions = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 1000,
};
