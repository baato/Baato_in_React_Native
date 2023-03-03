import React, { useState } from "react";
import {View, Text, TouchableOpacity, Alert, LogBox} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
// import POIDetail from "./POIDetail"; 
  const MarkerView = ({data, callBack}) => {
    const [selectM, setSelectM] = useState(false);

    if(data != null) {
    return(
        <MapLibreGL.PointAnnotation
            coordinate={[data[0].centroid.lon, data[0].centroid.lat]}
            id = {`${data[0].placeId}`}
            anchor={{x: 0, y: 0.5}}
            title={`${data[0].name}`}
            onSelected = { e => {
              // console.log("selected");
              callBack(data[0]);
              setSelectM(true);
            }}
            >
              {/* {setSelectM ? POIDetail( data[0]) : null} */}
              {/* <MapLibreGL.Callout
              title={`${data[0].name}`}
              style={{color: 'black'}}
            /> */}
            {/* <AnnotationContent title={ data[0].name}/> */}
          </MapLibreGL.PointAnnotation>
    )
          }
}

export default MarkerView;
