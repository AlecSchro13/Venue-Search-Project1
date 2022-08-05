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
      console.log(data)
    })
    .catch((e) => {
        console.log(e)
    });
}

getEventId ();

