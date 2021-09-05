var searchHistory = []
var searchCityInput = ""
var apiKey="ef360dfd13065444f31dda06f4972fc0"


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
            .addClass("list-group-item list-group-item-action")
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
            var todayWeather = {
                "city" : data.name,
                "date" : data.dt,
                "icon": data.weather[0].icon,
                "temperature" : data.main.temp,
                "humidity" : data.main.humidity, 
                "windspeed" : data.wind.speed,
                "uvIndex" : ""
            }
            console.log(todayWeather)
        })
    
    
}



$("#search").on("click",function(event) {
    event.preventDefault();   
    searchCityInput = $("#searchCity")
        .val()
        .trim();
    searchCity();
    searchHistory.push(searchCityInput);
    addHistory(searchHistory.length - 1);
    //save search localStorage
    localStorage.setItem("citySearched", JSON.stringify(searchHistory));
    
});

displayHistory();