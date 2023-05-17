# Project Setup 
> This example usage [MapLibre GL SDK for React Native](https://github.com/maplibre/maplibre-react-native).
> 
> Example showcase [baato API] (https://baato.io) usage for 
> 1. Search (Autocomplete)
> 2. Reverse-search
> 3. Map tile and style
> 4. Place
> 5. Direction


### Dependencies
<pre>
<code class="language-js">
"dependencies": {
    "@mapbox/polyline": "^1.1.1",
    "@maplibre/maplibre-react-native": "^9.0.0",
    "@turf/turf": "^6.5.0",
    "react": "18.2.0",
    "react-native": "0.71.3"
  }
  </code>
  </pre>


### Autocomplete search
> Obtain baatoToken from https://baato.io/account
> Here queryparameter is q
> Number of search result per q is indicated by limit which is 20 for this example. 
<pre><code class="language-js">
  fetch(`https://api.baato.io/api/v1/search?key=${baatoToken}&q=${text}&limit=20`)
                .then(response => response.json()
                    .then(data => {
                        setResult(data.data);
                    }).catch(error => {
                        console.error(error);
                    }))
</code></pre>
> Full implementation of this code is available on [github](https://github.com/baato/Baato_in_React_Native/blob/master/SearchBar.js)

### Reverse Search
>In this example pressCoord is latitude and longitude for reverse geocoding
<pre><code class="language-js">
 useEffect(() => {
      fetch(`https://api.baato.io/api/v1/reverse?key=${baatoToken}&lat=${pressCoord.lat}&lon=${pressCoord.lon}`)
        .then(response => response.json()
          .then(data => {
            console.log(data.data[0]);
            placeDetail = data.data;
          }).catch(error => {
            setMarkerVisible(false);
            console.error(error);
          }));
  }, [pressCoord]);
  </code></pre>
> Full implementation of this code is available on [github](https://github.com/baato/Baato_in_React_Native/blob/master/App.tsx)


### Place detail
> For requesting place detail placeId is needed which can be obtained from search or reverse-search
<pre><code class="language-js">
fetch(`https://api.baato.io/api/v1/places?key=${baatoToken}&placeId=${placeResult.placeId}`)
        .then(response => response.json()
          .then(data => {
            placeDetail = data.data;
          }).catch(error => {
            console.error(error);
          }));
</code></pre>
> Full implementation of this code is available on [github](https://github.com/baato/Baato_in_React_Native/blob/master/App.tsx)


### Map Display
> Obtain styleURL from [baato](https://baato.io/account/styles)
```
    <MapLibreGL.MapView
          styleURL="https://api.baato.io/api/v1/styles/outdoor?key=${baatoToken}"
          style={styles.map}
          logoEnabled={false}
          attributionEnabled={false}
        />
```

> Full implementation of this code is available on [github](https://github.com/baato/Baato_in_React_Native/blob/master/App.tsx)


 ### Direction
 > For requesting direction API, array of coordinate i.e points[] in this setup, and mode are required parameters.
 > 
 > If forMapbox = true and instructions = true are set then the response and instructions are in detail and similar to mapbox navigation.
 > 
 > The route is encoded polyline with precision level of 6 so, if points are needed then can use polyline decoder as shown below.
 > 
<pre><code class="language-js">
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
          const route = polyline.toGeoJSON(`${data.data.routes[0].geometry}`, 6);
          setRouteCoord(route);
        
      }).catch(error => {
        console.error(error);
      }));
</code></pre>
> Full implementation of this code is available on [github](https://github.com/baato/Baato_in_React_Native/blob/master/App.tsx)
