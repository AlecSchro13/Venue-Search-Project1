const searchForm = document.querySelector(".form1");
const genreForm = document.querySelector(".form2");

const venueInputEl = document.querySelector(".venueInput");
const genreSelectEl = document.querySelector("#genreOptions");
const venueUpcomingEvents = document.querySelector(".upcomingevents");

const popularbutton = document.querySelector(".popBtns");
//const statusEl = document.querySelector("#status")
var prevS = document.querySelector(".prevS");
var localS = []

let apiKey = "JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3";

popularbutton.addEventListener("click", (event) => {
  event.preventDefault();
  let userClick = event.target.getAttribute("data-venue");
  if (event.target.nodeName == "BUTTON") {
    searchVenue(userClick);
  }
});

prevS.addEventListener("click", (e) => {
  if (e.target.nodeName == "BUTTON") {
    searchVenue(e.target.textContent);
  }
});

searchForm.addEventListener("submit", submitFormHandler);
genreForm.addEventListener("submit", genreFormHandler);

function genreFormHandler(e) {
  e.preventDefault();
  //selects the option chosen from dropdown menue
  let genreChoiceValue = genreSelectEl.options[genreSelectEl.selectedIndex].value;

  if (genreChoiceValue) {
    getGenreEvents(genreChoiceValue);
    venueUpcomingEvents.innerHTML = "";
  }
}

function submitFormHandler(e) {
  e.preventDefault();

  let userVenue = venueInputEl.value.trim();

  if (userVenue) {
    searchVenue(userVenue);
  } else {
    venueUpcomingEvents.innerHTML = "";
    let emptyValue = document.createElement("h2");
    emptyValue.textContent = "Please Type in a Venue to get upcoming events...";
    let example = document.createElement("h4");
    example.textContent =
      "or Choose a Genre option to view events on a Genre!😅";
    let example2 = document.createElement("h4");
    example2.textContent =
      "You can also select one of our Popular venues if you're unfamilliar with the area!";
    venueUpcomingEvents.append(emptyValue, example, example2);
  }
}

function searchVenue(userVenue) {
  var requestUrl = `https://app.ticketmaster.com/discovery/v2/venues.json?keyword=${userVenue}&stateCode=CO&size=5&apikey=${apiKey}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      const venueName = data._embedded.venues[0].name;
      const venueId = data._embedded.venues[0].id;

      saveToLocalStorage(venueName); 
      upcomingEvents(venueId, venueName);
    })
    .catch(() => {
      venueUpcomingEvents.innerHTML = "";
      let error = document.createElement("h2");
      error.textContent = "oops.. Something went wrong";
      let example = document.createElement("h4");
      example.textContent =
        "Looks like we found an error.. Please try again!😅";
      venueUpcomingEvents.append(error, example);
    });
}

function upcomingEvents(venueId, venueName) {
  const requestUrlEvents = `https://app.ticketmaster.com/discovery/v2/events.json?&venueId=${venueId}&size=15&sort=date,asc&segmentName=music&apikey=${apiKey}`;

  fetch(requestUrlEvents)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      const futureEventsArray = data._embedded.events;
      //this function call is to render upcoming events to screen (and passing venue name over to next function)
      displayUpcomingEvents(futureEventsArray, venueName);
    })
    .catch(() => {
      venueUpcomingEvents.innerHTML = "";
      let noEvents = document.createElement("h2");
      noEvents.textContent = "No events found for this venue";
      let example = document.createElement("h4");
      example.textContent =
        "try something like Summit or Fillmore Auditorium 😅";
      venueUpcomingEvents.append(noEvents, example);
    });
}

function displayUpcomingEvents(futureEventsArray, venueName) {
  //clearing start page events to begin with on HTML
  venueUpcomingEvents.innerHTML = "";

  let titleEl = document.createElement("h4");
  titleEl.textContent = `Showing Events for: ${venueName}`;
  //creating <ol> for <li> tags to be appended to
  let listappender = document.createElement("ol");
  venueUpcomingEvents.append(titleEl, listappender);
 

  for (let index = 0; index < futureEventsArray.length; index++) {
    const eventId = futureEventsArray[index].id;
    const eventName = futureEventsArray[index].name;
    const eventDate = futureEventsArray[index].dates.start.localDate;
    const Genre = futureEventsArray[index].classifications[0].genre.name;

    let listEvent = document.createElement("li");
    listEvent.classList.add("cssListItem");
    let dataLink = document.createElement("a");
    dataLink.setAttribute("href", `./event.html?eventId=${eventId}`);
    dataLink.textContent = `${eventName} playing on ${eventDate} /Genre: ${Genre}`;

    listEvent.append(dataLink);
    listappender.append(listEvent);
  }
}

function getGenreEvents(genreChoiceValue) {
  fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?size=15&stateCode=CO&segmentName=music&classificationName=${genreChoiceValue}&sort=date,asc&apikey=JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3`
  )
    .then((response) => response.json())

    .then((data) => {
      let genreEventArray = data._embedded.events;
      displayGenreUpcomingEvents(genreEventArray, genreChoiceValue);
    })
    .catch((error) => console.log("error", error));
}

function displayGenreUpcomingEvents(genreEventArray, genreChoice) {
  let titleEl = document.createElement("h4");
  titleEl.classList.add("showing-events");
  titleEl.textContent = `Showing Events for: ${genreChoice} Genre`;
  let listappender = document.createElement("ol");
  venueUpcomingEvents.append(titleEl, listappender);

  //starting Loop here
  for (let index = 0; index < genreEventArray.length; index++) {
    const eventId = genreEventArray[index].id
    const eventName = genreEventArray[index].name;
    const eventDate = genreEventArray[index].dates.start.localDate;

    let listEvent = document.createElement("li");
    listEvent.classList.add("cssListItem");
    let dataLink = document.createElement("a");
    dataLink.setAttribute("href", `./event.html?eventId=${eventId}`);
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
      eventArray = data._embedded.events;
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
  let instructions = document.createElement("p");
  instructions.classList.add("upcoming")
  instructions.textContent = "(click on an event to get event details!)";
  let listappender = document.createElement("ol");
  venueUpcomingEvents.append(titleEl, instructions, listappender);
  for (let index = 0; index < eventArray.length; index++) {
    const eventId = eventArray[index].id;
    const nameEvent = eventArray[index].name;
    const dateEvent = eventArray[index].dates.start.localDate;

    let listEvent = document.createElement("li");
    listEvent.classList.add("cssListItem");
    let dataLink = document.createElement("a");
    dataLink.setAttribute("href", `./event.html?eventId=${eventId}`);
    dataLink.textContent = `${nameEvent} playing on: ${dateEvent}`;
    listEvent.append(dataLink);
    listappender.append(listEvent);
  }
}

function saveToLocalStorage(venueName) {
  localStorage.setItem("VenueName", venueName);
  var previous = localStorage.getItem("VenueName");
  
  localS.push(previous);
  localStorage.setItem("VenueNames", JSON.stringify(localS));
  displayPreviousSearchedButtons();
}

//Display the previous searches (venues) to the page
function displayPreviousSearchedButtons() {
  var venuesIds = JSON.parse(localStorage.getItem("VenueNames")) || 0;
  prevS.innerHTML = "";

  for (i = 0; i < venuesIds.length; i++){
    var prevButton = document.createElement("button");
    prevButton.textContent = venuesIds[i];
    prevButton.classList.add("prevBtn");
    prevS.append(prevButton);
  }
}

displayPreviousSearchedButtons();
