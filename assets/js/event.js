const navText = document.querySelector(".jsNav");

function getEventId() {
  var htmlInfo = document.location.search;
  console.log(htmlInfo);
  var eventId = htmlInfo.split("=")[1];
  console.log(eventId);

  if (eventId) {
    navText.innerHTML = "";
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
<<<<<<< HEAD
=======
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
>>>>>>> 0effd22ebbb2ef1f7b8395c595abe91032f88d80
    })
    .catch((e) => {
      console.log(e);
    });
}

getEventId();
