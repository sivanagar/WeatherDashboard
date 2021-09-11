var searchHistory = []
var searchCityInput = document.getElementById("searchCity");
var todayWeatherEl = document.getElementById("todayWeather");
var apiKey="ef360dfd13065444f31dda06f4972fc0"
var todayWeather = {}


var displayHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("citySearched"));
    if (!searchHistory) {
        searchHistory = [];
        return
    }
    $(searchHistory).each(function(index) {
        addHistory(index)
    })
}

var addHistory = function (index) {
    var searchItem = $("<li>")
            .addClass("list-group-item list-group-item-action searchItem")
            .attr("data-id",index)
            .text(searchHistory[index])
    $("#searchHistory").append(searchItem);
}

function displayWeather(data) {
    const todayWeather = 
    `<div class="row jumbotron">
        <div class="col-4">
            <h3 class="card-title">${cityName}, ${cityState}</h3>
            <h6 class="card-subtitle">${moment(data.current.dt,"HH:mm")}</h6>
            <div>
                <span>${data.current.temp}°</span>
                <span>
                <img src=" http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png"/></span>
            </div>
        </div>
        <div class="col-4">
            <div>
                <span><i class="fas fa-tint"></i> Humidity</span>
                <span>${data.current.humidity}%</span>
            </div>
            <div>
                <span><i class="fas fa-wind"></i> Wind Speed</span>
                <span>${data.current.wind_speed} mph</span>
            </div>
            <div>
                <span><i class="fas fa-sun"></i> UV Index</span>
                <span>${data.current.uvi} of 10</span>
            </div>
        </div>
    </div>
    `
    todayWeatherEl.innerHTML=todayWeather;
}

function searchCity() {
    //send to api
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ cityLat +'&lon='+ cityLng +'&units=imperial&appid='+apiKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //use data to show info
            console.log(data);
            displayWeather(data);
        })
}


$("#search").on("click",function(event) {
    event.preventDefault();   
    searchCity();
    searchHistory.push(cityName);
    addHistory(searchHistory.length - 1);
    //save search localStorage
    localStorage.setItem("citySearched", JSON.stringify(searchHistory));
    
});

displayHistory();
//$(".searchItem").on("click",function(event) {
//    searchCityInput = $(this)
//        .text();
//    searchCity();
//})

//Google API Autocomplete
let autocomplete;

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(searchCityInput, {
    types: ["(cities)"],
    componentRestrictions: {
      country: "us",
    },
  });
  autocomplete.addListener("place_changed", onCityChanged);
}

function onCityChanged() {
    var place = autocomplete.getPlace();
    //   console.log("place from Google API", place.address_components[2].short_name);
    cityLat = place.geometry.location.lat();
    cityLng = place.geometry.location.lng();
    cityName = place.vicinity;
    cityState = place.address_components[2].short_name;
    searchCity();
}
  