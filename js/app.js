var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.385064, lng: 2.173403},
    zoom: 8
     })

    ko.applyBindings(new ViewModel());
 };

var addMarker=function(location){

	var marker = new google.maps.Marker({
    position: location.latlong,
    map: map,
    title: location.title
  });
};

var ViewModel=function(){
    var self=this;
    locations.forEach(function(location){addMarker(location)});
    self.locationsarray = ko.observableArray(locations);


};


