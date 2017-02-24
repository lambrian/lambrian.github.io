import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import React, { Component } from 'react';
import places from '../data/coordinates.json';

class RestaurantMap extends Component {
  render() {
    return (
      <ReactMapboxGl
      style="mapbox://styles/mapbox/light-v9"
      accessToken="pk.eyJ1IjoiYnJpYW5sYW0iLCJhIjoiY2lsYWFwa24zMDM0enU2bHgzbzl5aW1vZyJ9.6WCDzB1Ebikdf7DEwzHtEg"
      containerStyle={{
        height: "100vh",
          width: "100vw"
      }}
      minZoom={12}
      center={[-122.41941550000001, 37.7749295]}>
      <Layer
      type="symbol"
      id="marker"
      layout={{ "icon-image": "marker-15" }}>
      {places.map(place => {
        return (
          <Feature coordinates={[place.location.lng, place.location.lat]}/>
        );
      })}
      </Layer>
      </ReactMapboxGl>
    );
  }
}

export default RestaurantMap;
