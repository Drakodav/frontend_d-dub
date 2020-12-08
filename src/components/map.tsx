import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

type Props = {};

// export const PublicMap: FunctionComponent<Props> = (Props) => {
//   const map = new Map({
//     target: 'my-map',
//     layers: [
//       new TileLayer({
//         source: new OSM(),
//       }),
//     ],
//     view: new View({
//       center: [0, 0],
//       zoom: 2,
//     }),
//   });
//   console.log(map, 'hello');

//   useEffect(() => {
//     map.setTarget('my-map');
//   });

//   return (
//     <div id='my-map' style={{ width: '100%', height: '500px' }}>
//       {/* <button onClick={(e) => this.userAction()}>setState on click</button> */}
//     </div>
//   );
// };

export class PublicMap extends React.Component<Props> {
  componentDidMount() {
    // create feature layer and vector source
    // var featuresLayer = new Vector({
    //   source: new Vector({
    //     features: [],
    //   }),
    // });

    // create map object with feature layer
    var map = new Map({
      target: 'mapContainer',
      layers: [
        //default OSM layer
        new TileLayer({
          source: new OSM(),
        }),
        // featuresLayer,
      ],
      view: new View({
        center: [0, 0], //Boulder, CO
        zoom: 0,
      }),
    });

    // save map and layer references to local state
    this.setState({
      map: map,
      // featuresLayer: featuresLayer,
    });
  }

  render() {
    return (
      <div id='mapContainer' style={{ width: '100%', height: '500px' }}>
        {' '}
      </div>
    );
  }
}
