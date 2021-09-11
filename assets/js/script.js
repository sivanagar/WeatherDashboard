var searchHistory = []
var searchCityInput = document.getElementById("searchCity");
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

function searchCity() {
    //send to api
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+searchCityInput+ '&units=imperial&appid=' + apiKey)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //use data to show info
            console.log(data);
            todayWeather = {
                "city" : data.name,
                "coord" : {"lat": data.coord.lat,
                            "lon": data.coord.lon},
                "date" : data.dt,
                "icon": data.weather[0].icon,
                "temperature" : data.main.temp,
                "humidity" : data.main.humidity, 
                "windspeed" : data.wind.speed,
                "uvIndex" : ""
            }
            console.log(todayWeather)
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ todayWeather.coord.lat+'&lon='+ todayWeather.coord.lon+'&units=imperial&appid='+apiKey)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    console.log(data)
                })
            
        })
    
    
}


$("#search").on("click",function(event) {
    event.preventDefault();   
    searchCity();
    searchHistory.push(searchCityInput);
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
    
}
  