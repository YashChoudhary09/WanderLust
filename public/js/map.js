
mapboxgl.accessToken = mapToken; // for authentication to use mapbox services
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: parsedCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

   console.log(parsedCoordinates);
    const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(parsedCoordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML(`<h3>${listing.location}</h3> <p>Find Your Place!</p>`)
      
    )
        .addTo(map);