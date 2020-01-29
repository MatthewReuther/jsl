<div class="map-container">
		<!--The div element for the map -->
    <div id="map" style="height: 100%;"></div>
    <script>
    	
// Initialize and add the map
function initMap() {
  // The location of cj Advertising
  var cjaLoc = {lat: 36.163226, lng: -86.779007};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {
      	zoom: 18,
      	center: cjaLoc,
      	draggable: false,
      	scrollwheel: false,
      	zoomControl: false,

      });
  

  // Custom Styling JSON code created here -> https://mapstyle.withgoogle.com/
  var noPoi = [
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];

var cjaIcon = templateUrl + "/img/icons/cj-pin.png";
var cjPin = {
  url: cjaIcon,
  scaledSize: new google.maps.Size(50, 66), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(50,66) // anchor

};
map.setOptions({styles: noPoi});

  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({
    position: cjaLoc, 
    map: map, 
    icon: cjPin
  });
}
    </script>

    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCX4sGArEQbKg_GlHC4KrFOU8L8F-R3oKQ&callback=initMap">
    </script>
	</div>
