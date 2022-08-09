const searchForm = document.querySelector(".form1");
const genreForm = document.querySelector(".form2");
const venueInputEl = document.querySelector(".venueInput");
const genreSelectEl = document.querySelector("#genreOptions");
const venueUpcomingEvents = document.querySelector(".upcomingevents");

results.style.display = "none";

const autocomplete = document.querySelector("#inputGroup-sizing-lg");
const venueResults = document.getElementById("results");

const popularbutton = document.querySelector(".popV");
//const statusEl = document.querySelector("#status")
var prevS = document.querySelector(".prevS");

const venueArray = [
  "Grizzly Rose",
  "Summit",
  "Larimer Lounge",
  "Marquis Theatre",
  "Mission Ballroom",
  "Red Rocks Amphitheatre",
  "Summits",
  "Globe Hall",
  "Fiddler’s Green Amphitheatre",
  "Hi-Dive",
  "Levitt Pavilion Denver",
  "Bellco Theatre",
  "Ortiental Theater",
  "Gothic Theatre",
  "Mishawaka Amphitheatre",
  "Boettcher Hall",
  "Dillon Amphitheatre",
  "Fillmore Auditorium",
  "Paramount Theatre",
  "Pikes Peak Center",
  "The Black Buzzard",
  "Washingtons",
  "Denver Coliseum",
  "Lulu’s Downstairs",
  "Vilar Performing Arts Center",
  "Denver Center for the Performing Arts",
  "Chautauqua Auditorium",
  "Ophelia’s Electric Soapbox",
  "Arvada Center Outdoor Amphitheatre",
  "Empower Field at Mile High",
  "DICK’S Sporting Goods Park",
  "Philip S. Miller Park",
  "Black Sheep",
  "Fox Theatre and Cafe",
  "Boulder Theatre",
  "Aggie Theatre",
  "Moxi Theater",
  "Avalon Theatre",
  "Belly Up Aspen",
  "Fiddler’s Green Amphitheatre",
  "Loaded",
  "Armory Event Center",
  "Telluride Town Park",
  "1st Bank Center",
  "Moon Room at Summit",
  "Budweiser Events Center",
  "Renewal Festival Grounds",
];

var prevTitle = document.createElement("h4");
var localS = [];

let apiKey = "JjOAUr2y2Gxq070TMAOGO7RzAV4JBKi3";

prevTitle.classList.add = "PrevTitle";

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
  let genreChoiceValue =
    genreSelectEl.options[genreSelectEl.selectedIndex].value;

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

function convert2(input) {
  return moment(input).format("L");
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
    dataLink.textContent = `${eventName} playing on ${convert2(
      eventDate
    )} /Genre: ${Genre}`;

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
    const eventId = genreEventArray[index].id;
    const eventName = genreEventArray[index].name;
    const eventDate = genreEventArray[index].dates.start.localDate;

    let listEvent = document.createElement("li");
    listEvent.classList.add("cssListItem");
    let dataLink = document.createElement("a");
    dataLink.setAttribute("href", `./event.html?eventId=${eventId}`);
    dataLink.textContent = `${eventName} playing on: ${convert2(eventDate)}`;
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
  instructions.classList.add("upcoming");
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
    dataLink.textContent = `${nameEvent} playing on: ${convert2(dateEvent)}`;
    listEvent.append(dataLink);
    listappender.append(listEvent);
  }
}

autocomplete.addEventListener("input", function () {
  let results = [];
  const venueInput = this.value;
  venueResults.innerHTML = "";
  if (venueInput.length > 0) {
    results = getResults(venueInput);
    venueResults.style.display = "block";
    for (i = 0; i < results.length; i++) {
      venueResults.innerHTML += "<li>" + results[i] + "</li>";
    }
  }
});

function getResults(input) {
  const results = [];
  for (i = 0; i < venueArray.length; i++) {
    if (
      input.toLowerCase() === venueArray[i].slice(0, input.length).toLowerCase()
    ) {
      results.push(venueArray[i]);
    }
  }
  return results;
}

venueResults.addEventListener("click", function (event) {
  const setValue = event.target.innerText;
  autocomplete.value = setValue;
  this.innerHTML = "";
  results.style.display = "none";
});

function saveToLocalStorage(venueName) {
  // console.log(Parker ${venueName});
  console.log(`Venue Name:${venueName}`);
  localStorage.setItem("VenueName", venueName);
  var previous = localStorage.getItem("VenueName");
  console.log(`This is previous ${previous}`);
  localS.push(previous);
  console.log(localS);
  localStorage.setItem("VenueNames", JSON.stringify(localS));
  // console.log(localS);
  displayVenue();
}
//Display and append the user's input to the previous searches
function displayVenue() {
  // prevButton.textContent = previous;
  var venuesId = localStorage.getItem("VenueName");
  console.log(venuesId);
  console.log("Neww Array?");
  var prevButton = document.createElement("button");
  prevButton.textContent = venuesId;
  prevButton.classList.add("prevBtn");
  console.log(prevButton);
  prevS.append(prevButton);
}

//Display the previous searches (venues) to the page
function displayPreviousSearchedButtons() {
  var venuesIds = localStorage.getItem("VenueNames");
  venuesIds = JSON.parse(venuesIds);
  for (i = 0; i < venuesIds.length; i++) {
    var prevButton = document.createElement("button");
    prevButton.textContent = venuesIds[i];
    prevButton.classList.add("prevBtn");
    prevS.append(prevButton);
  }
}

displayPreviousSearchedButtons();
