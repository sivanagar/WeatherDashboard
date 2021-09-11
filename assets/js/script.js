var searchHistory = []
var searchCityInput = document.getElementById("searchCity");
var todayWeatherEl = document.getElementById("todayWeather");
var forcastEl = document.getElementById("forcast");
let cityName = "";
let cityState = "";
let cityLat = 0;
let cityLng = 0;

var apiKey="ef360dfd13065444f31dda06f4972fc0"

var displayHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("citySearched"));
    if (!searchHistory) {
        searchHistory = [];
        return
    }
    searchHistory.forEach((city,index) => {
        addHistory(city.cityName,index)
    })
}

var addHistory = function (cityName,id) {
    var searchItem = $("<li>")
            .addClass("list-group-item list-group-item-action searchItem")
            .attr("data-id",id)
            .text(cityName)
    $("#searchHistory").append(searchItem);
}

function displayWeather(data) {
    const todayWeather = 
        `<div class="row jumbotron">
            <div class="col-4">
                <h3 class="card-title">${cityName}, ${cityState}</h3>
                <h6 class="card-subtitle">Today ${moment.unix(data.current.dt).format("HH:mm")}</h6>
                <div>
                    <img src=" http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png"/></div>
                    <div>
                    <i class="fas fa-thermometer-half"></i> ${data.current.temp}°</div>
                    
                    
                
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
    $("#forcastHeader").text("5-Day Forecast");
    forcastEl.innerHTML=''
    data.daily.slice(1,6).map((day) => {
        const forcast =`
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">${moment.unix(day.dt).format('ddd D')}</h4>
                <div class="icon"><img src=" http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/></div>
                <div class="temp"><i class="fas fa-thermometer-half"></i> ${day.temp.day}°</div>
                <div class="wind"><i class="fas fa-wind"></i> ${day.wind_speed} mph</div>
                <div class="humidity"><i class="fas fa-tint"></i> ${day.humidity}%</div>
            </div>
        </div>`
    forcastEl.innerHTML += forcast
    })
   
}

function searchCity() {
    //send to api
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ cityLat +'&lon='+ cityLng +'&units=imperial&appid='+apiKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //use data to show info
            displayWeather(data);
        })
}

displayHistory();
$(".searchItem").on("click",function(event) {
    const indexClick = this.getAttribute("data-id");
    cityName = searchHistory[indexClick].cityName;
    cityState = searchHistory[indexClick].cityState;
    cityLat = searchHistory[indexClick].cityLat;
    cityLng = searchHistory[indexClick].cityLng;
    searchCity();
   
})


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
  //make api work on enter and not only clicks
  google.maps.event.addDomListener(searchCityInput, 'keydown', function(e) { 
    if (e.keyCode == 13 && $('.pac-container:visible').length) { 
        e.preventDefault(); 
    }
}); 
}



function onCityChanged() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
        searchCityInput ="Please select city from the list"
    } else {
    cityLat = place.geometry.location.lat();
    cityLng = place.geometry.location.lng();
    cityName = place.vicinity;
    cityState = place.address_components[2].short_name;
    searchHistory.push({"cityName": cityName,"cityLat": cityLat,"cityLng": cityLng, "cityState": cityState});
    searchCity();
    addHistory(cityName,searchHistory.length-1);
    localStorage.setItem("citySearched", JSON.stringify(searchHistory));
    }
}
  