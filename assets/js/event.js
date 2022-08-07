 const navText = document.querySelector(".jsNav")


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
        document.getElementById("eventName").textContent = eventName;
      let venueName = data._embedded.venues[0].name;
        document.getElementById("venueName").textContent = venueName;
      let address = data._embedded.venues[0].address.line1;
        document.getElementById("address").textContent = address;
      let genre = data.classifications[0].genre.name;
        document.getElementById("genre").textContent = genre;
      let eventDate = data.dates.start.localDate;  
        document.getElementById("eventDate").textContent = eventDate
      let startTime = data.dates.start.localTime;
        document.getElementById("startTime").textContent = startTime
      let city = data._embedded.venues[0].city.name;
        document.getElementById("city").textContent = city;
      let state = data._embedded.venues[0].state.stateCode;
        document.getElementById("stateCode").textContent = state;
      let imgUrl = data.images[1].url;
  
      const img = document.getElementById("imgsrc");
      let image = document.createElement("img");

      image.src = imgUrl;
      img.append(image);
     })
    .catch((e) => {
        console.log(e)
    });
}

getEventId ();

