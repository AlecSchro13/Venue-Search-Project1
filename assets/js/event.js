const link = document.querySelector(".linkSec");
let usersLocation;
let venueLocation;
let userLat;
let userLon;

function convert(input) {
  return moment(input, "HH:mm:ss").format("h:mm A");
}

function convert2(input) {
  return moment(input).format("LL");
}

function geoFindMe() {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    userLat = latitude;
    userLon = longitude;
    usersLocation = new google.maps.LatLng(
      parseFloat(latitude),
      parseFloat(longitude)
    );
    getEventId();
  }

  function error() {
    console.log(error);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

geoFindMe();

function getEventId() {
  var htmlInfo = document.location.search;
  var eventId = htmlInfo.split("=")[1];

  if (eventId) {
    fetchEventInfo(eventId);
  } else {
    document.location.replace("./index.html");
  }
}

function fetchEventInfo(eventId) {
  let apiUrl = `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3`;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let eventName = data.name;
      document.getElementById("eventName").textContent = eventName;
      let venueName = data._embedded.venues[0].name;
      document.getElementById("venueName").textContent = venueName;
      let address = data._embedded.venues[0].address.line1;
      document.getElementById("address").textContent = address;
      let genre = data.classifications[0].genre.name;
      document.getElementById("genre").textContent = genre;
      let eventDate = data.dates.start.localDate;
      document.getElementById("eventDate").textContent = convert2(eventDate);
      let startTime = data.dates.start.localTime;
      document.getElementById("startTime").textContent = convert(startTime);
      let city = data._embedded.venues[0].city.name;
      document.getElementById("city").textContent = city;
      let state = data._embedded.venues[0].state.stateCode;
      document.getElementById("stateCode").textContent = state;
      let zipCode = data._embedded.venues[0].postalCode;
      document.getElementById("zipCode").textContent = zipCode;
      let imgUrl;

      for (let index = 0; index < data.images.length; index++) {
        let eventImage = data.images[index].height;

        if (eventImage > "600") {
          imgUrl = data.images[index].url;
        }
        if (eventImage > "1200") {
          imgUrl = data.images[index].url;
          break;
        }
      }
      const img = document.getElementById("imgsrc");
      let image = document.createElement("img");

      image.src = imgUrl;
      img.append(image);
      let icon = document.createElement("i");
      icon.classList.add("fa");
      icon.classList.add("fa-map-marker");
      icon.setAttribute("aria-hidden", "true");
      let postCode = data._embedded.venues[0].postalCode;
      let completeAddress = `${address}+${city}+${state}+${postCode}`;
      let buttonLink = document.createElement("button");
      buttonLink.classList.add("buy-tickets");
      let DirectionLink = document.createElement("a");
      DirectionLink.textContent = "Click Here for Directions!";
      DirectionLink.setAttribute(
        "href",
        `https://www.google.com/maps/dir/${userLat},${userLon}/${completeAddress}`
      );
      DirectionLink.setAttribute("target", "_blank");
      buttonLink.append(icon, DirectionLink);
      link.append(buttonLink);

      const ticketUrl = document.getElementById("ticketUrl");
      let url = data.url;

      ticketUrl.setAttribute("href", `${url}`);
      ticketUrl.setAttribute("target", "_blank");

      venueLocation = completeAddress;
      initMap(parseFloat(userLat), parseFloat(userLon));
      calcRoute();
    })
    .catch((e) => {
      console.log(e);
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
  var start = usersLocation;
  var end = venueLocation;
  var request = {
    origin: start,
    destination: end,
    travelMode: "DRIVING",
  };
  directionsService.route(request, function (result, status) {
    if (status == "OK") {
      directionsRenderer.setDirections(result);
    }
  });
}
