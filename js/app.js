var map;
var infoWindows = [];
var markers = [];
var blurb;
var contentString = "Loading"

//Initialize the Map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 41.385064,
            lng: 2.173403
        },
        zoom: 12
    })

    ko.applyBindings(new ViewModel());

};

// handle map error
function googleMapsError() {
    alert('An error occurred with Google Maps!');
}
//Adds the marker on the map based on the location passed
var addMarker = function(location) {

    var marker = new google.maps.Marker({
        position: location.latlong,
        map: map,
        title: location.title
    });

    marker.addListener('click', function() {
        closeAllInfoWIndows();//close all the infowindows if a new infowindow is opened.
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1000);

        infowindow = createInfoWindow(marker.title);
        infowindow.open(map, marker);
    });
    markers.push(marker);
};

//Close all the infowindows by setting setMap to null
var closeAllInfoWIndows = function() {
    infoWindows.forEach(function(infowindow) {
        infowindow.setMap(null);
    });
}

//Create the infowindow and fetch the details using the wikipedia api
var createInfoWindow = function(title) {
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    try {
        var search = title.replace(" ", "_")//replace the space with underscore from the place name
    } catch (err) {
        console.log("error")
    }
    $.ajax({
        type: "GET",
        url: `http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=${search}&callback=?`,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            var result = data.parse.text["*"]

            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);


            // remove links 
            blurb.find('a').each(function() {
                $(this).replaceWith($(this).html());
            });

            // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            blurb.find('.mw-references-wrap').remove();
            blurb.find('table').remove();
            blurb.find('.hatnote').remove();

            //fetch the first and second paragraph
            var para_first = blurb.find("p:nth-child(1)");

            var para_second = blurb.find("p:nth-child(2)");

            //contentString=$('#article').html($(blurb).find('p'));
            if (typeof para_first.html() === "undefined") {//if the first paragraph returns undefined
                infowindow.setContent(para_second.html());
            } else {
                infowindow.setContent(para_first.append(para_second).html());
            }

        },
        error: function(errorMessage) {
            infowindow.setContent("error loading data");
        }
    });


    infoWindows.push(infowindow);
    return infowindow;
}

//Initialize the view model
var ViewModel = function() {
    var self = this;
    //Create markers based on the places in the locations.js file
    locations.forEach(function(location) {
        addMarker(location)
    });
    //Convert into an observable array
    self.locationsarray = ko.observableArray(locations);
    query = ko.observable('');
    //Search function, filters the markers and the results based on the query entered
    self.filterPins = ko.computed(function() {
        var search = this.query().toLowerCase();
        //Destroy all markers
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        const result = locations.filter(location => location.title.toLowerCase().indexOf(search) >= 0);
        result.forEach(function(location) {
            addMarker(location)
        });
        return ko.utils.arrayFilter(self.locationsarray(), function(pin) {
            return pin.title.toLowerCase().indexOf(search) >= 0;
        });
    });
    //Open the infowindow when the location name is clicked from the List view
    openInfoWindow = function(place) {
        var title = place.title;
        markers.forEach(function(marker) {
            if (marker.title === title) {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1000);
                infowindow = createInfoWindow(marker.title);
                closeAllInfoWIndows();
                infowindow.open(map, marker);
            }
        });
    };


};