/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  Linking,
  Image,
  TouchableOpacity,
  View,
  Alert,
  ImageBackgroundComponent
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

import SearchBar from './SearchBar';
import { Double, Float } from 'react-native/Libraries/Types/CodegenTypes';
import MarkerView from './MarkerView';
import POIDetail from "./POIDetail";
import {lineString as makeLineString} from '@turf/helpers'; 
// import TestView from "./TestView";

// Will be null for most users (only Mapbox authenticates this way).
// Required on Android. See Android installation notes.
MapLibreGL.setAccessToken(null);
var polyline = require('@mapbox/polyline');
const styles = StyleSheet.create({
  page: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "tomato"
  },
  bar: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  bottom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  map: {
    flex: 8,
    alignSelf: 'stretch',
  },
  absolute: {
    position: "absolute",
    left: 10,
    bottom: 10,
    zIndex: 2
  },
  logo: {
    flex: 10,
    width: 100,
    height: 40,
    resizeMode: "contain"
  },
  separator: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey'
}
});

type searchProps = {
  placeId: number,
  name: String,
  address: String,
  type: String,
  score: Float
}

type placeProps = {

}
var placeResult: searchProps;
var placeDetail: null;
const baatoToken = 'xxx';

export default function App() {

  // this.handleMarkerEvent = this.handleMarkerEvent.bind(this);
  // handleMarkerEvent(markerDetail) {
  //   // console.log(markerDetail);
  //   this.setState({
  //     markerDetail: markerDetail,
  //     isVisible: true,
  //   })
  // }
  // type pressCoord = {
  //   lat: Float,
  //   lon: Float
  // }
  const [markerVisible, setMarkerVisible] = useState(false);
  const [querySearch, setSearchQuery] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([85.31853583740946, 27.701739466949107]);
  const [detailVisiblity, setDetailVisiblity] = useState(false);
  const [poiDetail, setPoiDetail] = useState([]);
  const [pressCoord, setPressCoord] = useState({lat: 0, lon: 0});
  const [userCoord, setUserCoord] = useState({lat: 0, lon: 0});
  const [queryRoute, setQueryRoute] = useState(false);
  const [routeCoord, setRouteCoord] = useState([]);
  const [routeVisible, setRouteVisible] = useState(false);
  
  function parentToChild(props: searchProps) {
    placeResult = props
    setSearchQuery(!querySearch);
  }
  function renderDetail(props) {
    setPoiDetail(props);
    setDetailVisiblity(true);
  }

  function computeRoute() {
    setQueryRoute(!queryRoute);
  }
  //   setRouteVisible(true);
  //   console.log(routeVisible);
  // }
  useEffect(() => {
    if(queryRoute) {
  // function computeRoute() {
    fetch(
          `https://api.baato.io/api/v1/directions?key=${baatoToken}`
          + `&points[]=${poiDetail.centroid.lat},${poiDetail.centroid.lon}`
          + `&points[]=${userCoord.lat},${userCoord.lon}`
          + `&mode=foot`
          + `&alternatives=false`
          + `&forMapbox=true`
          + `&instructions=true`
          + `&locale=en_US`)
      .then(response => response.json()
      .then(data => {
          setQueryRoute(!queryRoute);
        // async () => {
          const route = polyline.toGeoJSON(`${data.data.routes[0].geometry}`, 6);
          setRouteCoord(route);
          setRouteVisible(true);
        //   console.log("HELLO");
        //   if (!didCancel) {
            
        //   }
        // };
        // return () => {
        //   didCancel = true;
        // };
      }).catch(error => {
        console.error(error);
        setQueryRoute(!queryRoute);
        setRouteVisible(!routeVisible);
      }));
    // }
    }
  }, [queryRoute]);

  useEffect(() => {
    if (querySearch) {
      setRouteVisible(false)
      fetch(`https://api.baato.io/api/v1/places?key=${baatoToken}&placeId=${placeResult.placeId}`)
        .then(response => response.json()
          .then(data => {
            placeDetail = data.data;
            setMarkerVisible(true);
            setSearchQuery(!querySearch);
            setCameraPosition([data.data[0].centroid.lon, data.data[0].centroid.lat]);
            setPoiDetail(data.data[0]);
            setDetailVisiblity(true);
          }).catch(error => {
            setMarkerVisible(false);
            setSearchQuery(!querySearch);
            console.error(error);
          }));
    }
  }, [querySearch]);

  useEffect(() => {
    if (pressCoord.lat > 10) {
      setRouteVisible(false);
      console.log("inside 2");
      fetch(`https://api.baato.io/api/v1/reverse?key=${baatoToken}&lat=${pressCoord.lat}&lon=${pressCoord.lon}`)
        .then(response => response.json()
          .then(data => {
            console.log(data.data[0]);
            placeDetail = data.data;
            setMarkerVisible(true);
            setCameraPosition([data.data[0].centroid.lon, data.data[0].centroid.lat]);
            setDetailVisiblity(true)
            setPressCoord({lat: 0, lon: 0})
            setPoiDetail(data.data[0]);
          }).catch(error => {
            setMarkerVisible(false);
            console.error(error);
          }));
    }
  }, [pressCoord]);
  const renderRoute =() => {
    console.log("hello hello");
    return (
      <MapLibreGL.ShapeSource id="routeSource" shape={routeCoord}>
        <MapLibreGL.LineLayer
          id="routeFill"
        />
      </MapLibreGL.ShapeSource>
    );
  }
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {/* <View> */}
          <SearchBar onData={parentToChild}/>
        {/* </View> */}
        <MapLibreGL.MapView
          styleURL="https://api.baato.io/api/v1/styles/outdoor?key=${baatoToken}"
          style={styles.map}
          logoEnabled={false}
          attributionEnabled={false}
          onPress= {() => setDetailVisiblity(false)}
          onLongPress={(feature)=>setPressCoord({lat:feature.geometry.coordinates[1],lon:feature.geometry.coordinates[0]})}
        >
          <MapLibreGL.UserLocation
          visible={true}
          onUpdate={(location)=> setUserCoord({lat:location.coords.latitude, lon:location.coords.longitude})}/>
          <MapLibreGL.Camera
            zoomLevel={12}
            centerCoordinate={cameraPosition}
            animationDuration={500}
          />
          {markerVisible ? <MarkerView data={placeDetail}
          callBack ={renderDetail}/> : null}
          {
            routeVisible ?
              renderRoute() : null
          }
        </MapLibreGL.MapView>
        {/* <TestView style = {styles.bottom}/> */}
        { detailVisiblity ? 
            <View style = {styles.bottom} onTouchMove={()=>setDetailVisiblity(false)}><POIDetail 
            data = {poiDetail}
            callBack = {computeRoute}/></View> : null
        }
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://baato.io");
          }}
          style={styles.absolute}
        ><Image
          source={require("./logo.png")}
          style={styles.logo}
          resizeMode="center"
        ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}