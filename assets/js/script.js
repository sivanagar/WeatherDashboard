var searchHistory = []
var searchCityInput = ""


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
            .addClass("searchItem btn btn-outline-secondary")
            .attr("data-id",index)
            .text(searchHistory[index])
    $("#searchHistory").append(searchItem);
}

function searchCity() {
    //send to api
    //update search history
    console.log("API")
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