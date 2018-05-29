var map;
var infoWindows=[];
var markers=[];
var blurb;
var contentString = "Loading"

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.385064, lng: 2.173403},
    zoom: 12
     })
    
    ko.applyBindings(new ViewModel());

 };

var addMarker=function(location){

	var marker = new google.maps.Marker({
    position: location.latlong,
    map: map,
    title: location.title
  });
   
  marker.addListener('click', function() {
  	closeAllInfoWIndows();
    console.log("sending from event listener "+marker.title)
    infowindow=createInfoWindow(marker.title);
    infowindow.open(map, marker);
  });
  markers.push(marker);
};
var closeAllInfoWIndows=function(){
	infoWindows.forEach(function(infowindow){
  		infowindow.setMap(null);
  	});
}

var createInfoWindow=function(title){
  var infowindow = new google.maps.InfoWindow({
       content: contentString
        });
  console.log("create infowindow "+title)
  try {
    var search=title.replace(" ","_")
}
catch(err) {
    console.log("error")
}
  $.ajax({
        type: "GET",
        url: `http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Camp_Nou&callback=?`,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
          var result=data.parse.text["*"]
          console.log(contentString)
          var markup = data.parse.text["*"];
          var blurb = $('<div></div>').html(markup);
          console.log("here is 1"+blurb)
 
            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
 
            // remove any references
            blurb.find('sup').remove();
 
            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            console.log("this is "+new String(blurb))
            //contentString=$('#article').html($(blurb).find('p'));
            infowindow.setContent(data.parse.text["*"]);



        },
        error: function (errorMessage) {
          console.log("error here")
        }
    });


    infoWindows.push(infowindow);
    return infowindow;
}

var ViewModel=function(){
    var self=this;
    locations.forEach(function(location){addMarker(location)});
    self.locationsarray = ko.observableArray(locations);
    query=ko.observable('');
    self.filterPins = ko.computed(function () {
    var search = this.query().toLowerCase();
    return ko.utils.arrayFilter(self.locationsarray(), function (pin) {
        return pin.title.toLowerCase().indexOf(search) >= 0;
    });
  });
    openInfoWindow=function(place){
   	var title=place.title;
   	markers.forEach(function(marker){
   		if(marker.title===title){
   			  infowindow=createInfoWindow(marker.title);
   			  closeAllInfoWIndows();
   			  infowindow.open(map, marker);
   			}
   		});
   	};
    
          
   };





