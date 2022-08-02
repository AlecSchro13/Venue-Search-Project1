//TBD- the classes will possibly be renamed depending on HTML
//THIS CONST would be connected to a class that is in a <Form> tag
const searchForm = document.querySelector(".form1");
//this Const would be connected to a class that is in the <input> tag
const venueInputEl = document.querySelector(".venueInput");
//const statusEl = document.querySelector("#status")

let apiKey = "JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3";


searchForm.addEventListener("submit", submitFormHandler)

function submitFormHandler (e) {

  e.preventDefault();

  let userVenue = venueInputEl.value.trim();

  if (userVenue) {
    //tbd..
    //statusEl.textContent = "Searching Events... ";

    searchVenue(userVenue);
  } else {
    //also tbd
    alert("Please Enter a Venue Name OR choose a Genre");
  }
}

function searchVenue(userVenue) {
  var requestUrl = `https://app.ticketmaster.com/discovery/v2/venues.json?keyword=${userVenue}&stateCode=CO&size=5&apikey=${apiKey}`;

  fetch(requestUrl)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const venueName = data._embedded.venues[0].name;
      console.log(venueName);
      const venueId = data._embedded.venues[0].id;
      console.log(venueId);

      //this is Calling a NEW function TBD
      //saveToLocalStorage(venueName);

      //these variables will be used for google maps... TBD
      const lat = data._embedded.venues[0].location.latitude;
      const lon = data._embedded.venues[0].location.longitude;
      const coordinates = `${lat},${lon}`;
      console.log(coordinates);

      upcomingEvents(venueId, venueName);
    })
    //possibly add a 404.html?
    .catch((error) => console.log("error", error));
}

function upcomingEvents(venueId, venueName) {
  const requestUrlEvents = `https://app.ticketmaster.com/discovery/v2/events.json?&venueId=${venueId}&size=15&apikey=${apiKey}`;

  fetch(requestUrlEvents)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const futureEventsArray = data._embedded.events;
      console.log(futureEventsArray);
      //this function call is to render upcoming events to screen (and passing venue name over to next function)
      //renderUpcomingEvents(futureEventsArray, venueName);
    })
    .catch((error) => console.log("error", error));
}

//function displayUpcomingEvent (futureEventsArray) {
//TBD.........
//}

//Start function displays events at start page
function startPageEvents () {
    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=8&stateCode=CO&segmentName=music&apikey=JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3`)
    .then(response => response.json())

    .then((data) => {
      console.log(data);
      eventArray = data._embedded.events;
      console.log(eventArray);
      //showStartPageEvents(eventArray);
    })

    .catch((error) => console.log("error", error));
}

startPageEvents();

//function showStartPageEvents (eventArray) {
//TBD........
//}

//funnction saveToLocalStorage(venueName) {
//displayPreviousSearchedButtons();
//};

//function displayPreviousSearchedButtons() {
//}
