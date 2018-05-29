var map;
var infoWindows=[];
var markers=[];
var blurb;
var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

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

  infowindow=createInfoWindow();
   

  marker.addListener('click', function() {
  	closeAllInfoWIndows();
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
  try {
    var search=title.replace(" ","_")
}
catch(err) {
    console.log("error")
}
  $.ajax({
        type: "GET",
        url: `http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=${search}&callback=?`,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
          var result=data.parse.text["*"]
          console.log(contentString)
          contentString=result


        },
        error: function (errorMessage) {
          console.log("error here")
        }
    });


	var infowindow = new google.maps.InfoWindow({
       content: contentString
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





