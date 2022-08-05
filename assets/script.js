//THIS CONST would be connected to a class that is in a <Form> tag
const searchForm = document.querySelector(".form1");
const genreForm = document.querySelector(".form2");
//this Const would be connected to a class that is in the <input> tag
const venueInputEl = document.querySelector(".venueInput");
const genreSelectEl = document.querySelector("#genreOptions");
const venueUpcomingEvents = document.querySelector(".upcomingevents");

//popular venue button DOM
const popularbutton = document.querySelector(".popBtns");
// const statusEl = document.querySelector("#status")
var prevS = document.querySelector(".prevS");
var localS = [];
var page = 0;

let apiKey = "JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3";

popularbutton.addEventListener("click", (event) => {
  event.preventDefault();
  let userClick = event.target.getAttribute("data-venue");
  console.log(userClick);
  searchVenue(userClick);
});

searchForm.addEventListener("submit", submitFormHandler);
genreForm.addEventListener("submit", genreFormHandler);

function genreFormHandler(e) {
  e.preventDefault();
  //selects the option chosen from dropdown menue
  let genreChoiceValue =
    genreSelectEl.options[genreSelectEl.selectedIndex].value;
  console.log(genreChoiceValue);

  if (genreChoiceValue) {
    getGenreEvents(genreChoiceValue);
    venueUpcomingEvents.innerHTML = "";
  }
}

function submitFormHandler(e) {
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
      saveToLocalStorage(venueName);

      //these variables will be used for google maps... TBD
      const lat = data._embedded.venues[0].location.latitude;
      const lon = data._embedded.venues[0].location.longitude;
      const coordinates = `${lat},${lon}`;
      console.log(coordinates);

      upcomingEvents(venueId, venueName);
    });

  // Should change from jQuery to Javascript? Good practices?
  $(function autoComplete() {
    $("venueInput").autocomplete({
      source: venueName,
    });
  })
    //possibly add a 404.html?
    .catch((error) => console.log("error", error));
}

function upcomingEvents(venueId, venueName) {
  const requestUrlEvents = `https://app.ticketmaster.com/discovery/v2/events.json?&venueId=${venueId}&size=15&sort=date,asc&segmentName=music&apikey=${apiKey}`;

  fetch(requestUrlEvents)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const futureEventsArray = data._embedded.events;
      console.log(futureEventsArray);
      //this function call is to render upcoming events to screen (and passing venue name over to next function)
      displayUpcomingEvents(futureEventsArray, venueName);
    })
    .catch((error) => console.log("error", error));
}

function displayUpcomingEvents(futureEventsArray, venueName) {
  //clearing start page events to begin with on HTML
  venueUpcomingEvents.innerHTML = "";

  let titleEl = document.createElement("h4");
  titleEl.textContent = `Showing Events for: ${venueName}`;
  //creating <ol> for <li> tags to be appended to
  let listappender = document.createElement("ol");
  venueUpcomingEvents.append(titleEl, listappender);
  //sort array before going through for loop

  for (let index = 0; index < futureEventsArray.length; index++) {
    const eventName = futureEventsArray[index].name;
    //console.log(eventName);
    const eventDate = futureEventsArray[index].dates.start.localDate;
    //console.log(eventDate);
    const Genre = futureEventsArray[index].classifications[0].genre.name;
    //console.log(Genre);
    let listEvent = document.createElement("li");
    listEvent.classList.add("cssListItem");
    let dataLink = document.createElement("a");
    dataLink.setAttribute("href", "./event.html");
    dataLink.textContent = `${eventName} playing on ${eventDate} /Genre: ${Genre}`;
    listEvent.append(dataLink);
    listappender.append(listEvent);
  }
}

function getGenreEvents(genreChoiceValue) {
  fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?size=10&stateCode=CO&segmentName=music&classificationName=${genreChoiceValue}&sort=date,asc&apikey=JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3`
  )
    .then((response) => response.json())

    .then((data) => {
      console.log(data);
      let genreEventArray = data._embedded.events;
      console.log(genreEventArray);
      displayGenreUpcomingEvents(genreEventArray, genreChoiceValue);
    })
    .catch((error) => console.log("error", error));
}

function displayGenreUpcomingEvents(genreEventArray, genreChoice) {
  let titleEl = document.createElement("h4");
  titleEl.textContent = `Showing Events for: ${genreChoice} Genre`;
  let listappender = document.createElement("ol");
  venueUpcomingEvents.append(titleEl, listappender);

  //starting Loop here
  for (let index = 0; index < genreEventArray.length; index++) {
    const eventName = genreEventArray[index].name;
    console.log(eventName);
    const eventDate = genreEventArray[index].dates.start.localDate;
    console.log(eventDate);

    let listEvent = document.createElement("li");
    listEvent.classList.add("cssListItem");
    let dataLink = document.createElement("a");
    dataLink.setAttribute("href", "./event.html");
    dataLink.textContent = `${eventName} playing on: ${eventDate}`;
    listEvent.append(dataLink);
    listappender.append(listEvent);
  }
}

//Start function displays events at start page
function startPageEvents() {
  fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?size=15&stateCode=CO&segmentName=music&sort=date,asc&apikey=JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3`
  )
    .then((response) => response.json())

    .then((data) => {
      console.log(data);
      eventArray = data._embedded.events;
      console.log(eventArray);
      showStartPageEvents(eventArray);
    })

    .catch((error) => console.log("error", error));
}

startPageEvents();

function showStartPageEvents(eventArray) {
  var userNear = document.querySelector(".nearUser");
  userNear.textContent = "";
  let titleEl = document.createElement("h4");
  titleEl.classList.add("upcoming");
  titleEl.textContent = `Upcoming Events near Denver, CO`;
  let listappender = document.createElement("ol");
  venueUpcomingEvents.append(titleEl, listappender);
  for (let index = 0; index < eventArray.length; index++) {
    const nameEvent = eventArray[index].name;
    console.log(nameEvent);
    console.log(eventArray);
    const dateEvent = eventArray[index].dates.start.localDate;
    console.log(dateEvent);

    let listEvent = document.createElement("li");
    listEvent.classList.add("cssListItem");
    let dataLink = document.createElement("a");
    dataLink.setAttribute("href", "./event.html");
    dataLink.textContent = `${nameEvent} playing on: ${dateEvent}`;
    listEvent.append(dataLink);
    listappender.append(listEvent);
  }
}

//Saves the input (venue) of the user to local storage
function saveToLocalStorage(venueName) {
  localStorage.setItem("VenueName", venueName);
  var previous = localStorage.getItem("VenueName"); 
  
  localS.push(previous)
  localStorage.setItem("VenueNames", JSON.stringify(localS));
  displayVenue();
}

//Display and append the user's input to the previous searches
function displayVenue() {
  var venuesId = localStorage.getItem("VenueName");
  var prevButton = document.createElement("button");
  prevButton.classList.add("btn btn-secondary btn-lg");
  var previous = localStorage.getItem("VenueName");
  localS.push(previous);

  localStorage.setItem("Venue Names", localS);
  var venuesIds = localStorage.getItem("Venue Names");

  prevButton.textContent = venuesId;
  prevButton.classList.add("prevBtn");
  prevS.append(prevButton);
}

//Display the previous searches (venues) to the page
function displayPreviousSearchedButtons() {

  var venuesIds = localStorage.getItem("VenueNames");
  venuesIds = JSON.parse(venuesIds);
  
  for (i = 0; i < venuesIds.length; i++){
    var prevButton = document.createElement("button");
    prevButton.textContent = venuesIds[i];
  }
  for (i = 0; i < localS.length; i++) {
    prevButton.textContent = localS[i];
    prevButton.classList.add("prevBtn");
    console.log(prevButton);
    prevS.append(prevButton);
  }
}

displayPreviousSearchedButtons();
