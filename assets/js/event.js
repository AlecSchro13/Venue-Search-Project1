const navText = document.querySelector(".jsNav")
const mapBox = document.querySelector(".topBox")
let usersLocation;
let venueLocation;
let userLat;
let userLon;

function geoFindMe() {
  function success(position) {
    
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`${latitude}, ${longitude}`)
    userLat = latitude;
    userLon = longitude;
    usersLocation = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude))
    getEventId ();
  }

  function error() {
    console.log("error");
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

geoFindMe ();

function getEventId () {
    var htmlInfo = document.location.search;
    console.log(htmlInfo)
    var eventId = htmlInfo.split('=')[1];
    console.log(eventId);

    if (eventId) {
        navText.innerHTML = "";
        fetchEventInfo(eventId);
      } else {
        document.location.replace('./index.html');
    }
};

function fetchEventInfo(eventId) {
    let apiUrl = `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3`

    fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let eventName = data.name;
      //console.log(data.name);
        document.getElementById("eventName").textContent = eventName;
      let venueName = data._embedded.venues[0].name;
      //console.log(data._embedded.venues[0].name);
        document.getElementById("venueName").textContent = venueName;
      let address = data._embedded.venues[0].address.line1;
        //console.log(data._embedded.venues[0].address.line1);
        document.getElementById("address").textContent = address;
      let genre = data.classifications[0].genre.name;
      //console.log(data.classifications[0].genre.name);
        document.getElementById("genre").textContent = genre;
      let eventDate = data.dates.start.localDate;
      //console.log(data.dates.start.localDate);
        document.getElementById("eventDate").textContent = eventDate
      let startTime = data.dates.start.localTime;
      //console.log(data.dates.start.localTime);
        document.getElementById("startTime").textContent = startTime

      let imgUrl = data.images[1].url
      console.log(imgUrl)
      const img = document.getElementById("imgsrc")
      let image = document.createElement("img")

      image.src = imgUrl
      img.append(image)

    
      let city = data._embedded.venues[0].city
      let stateCode = data._embedded.venues[0].state.stateCode
      let postCode = data._embedded.venues[0].postalCode
      let completeAddress = `${address}+${city}+${stateCode}+${postCode}`

      let DirectionLink = document.createElement("a")
      DirectionLink.textContent = "Click Here for Directions!"
      DirectionLink.setAttribute("href", `https://www.google.com/maps/dir/${userLat},${userLon}/${completeAddress}`)
      mapBox.append(DirectionLink);

      venueLocation = completeAddress
      initMap(parseFloat(userLat), parseFloat(userLon));
      calcRoute();

    })
    .catch((e) => {
        console.log(e)
    });
}

var directionsService = new google.maps.DirectionsService();
var directionsRenderer = new google.maps.DirectionsRenderer();

function initMap(lat, lon) {

  var userLocation = new google.maps.LatLng(lat, lon);
  var mapOptions = {
    zoom: 17,
    center: userLocation,
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  directionsRenderer.setMap(map);
}

function calcRoute() {

  var start = usersLocation
  var end = venueLocation;
  var request = {
    origin: start,
    destination:end,
    travelMode: "DRIVING",
  };
  directionsService.route(request, function (result, status) {
    if (status == "OK") {
      directionsRenderer.setDirections(result);
    }
  }); 
}

