//var locations;
var form = document.getElementById('form');
function initMap(){
  var loc;
  var infowindow = new google.maps.InfoWindow();
  var marker;
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition( (position) => {
      // current location coordinates
      loc = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude
      };
      //create map with current location coordinates
      var map = new google.maps.Map(document.getElementById('map'),{
        zoom : 15,
        center : loc
      });

      google.maps.event.addListener(map, 'bounds_changed', function() {
        //var markers = [0];

        var bounds = JSON.stringify(map.getBounds().toJSON());
        //console.log(bounds);
        //get marker locations from servers
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200){

            var locations = JSON.parse(this.responseText);
            console.log(locations);
            //loop through the locations array and place a marker for each of them
            for(var i = 0 ; i < locations.length ; i++){
                var message = "<ul><li>Lat:" + locations[i].coords.lat + "</li><li>Lng:" + locations[i].coords.lng +"</li><li>Name:"+locations[i].name+"<li>Tags:"+locations[i].tags+"</li><li><a href='#' id ='edit'>Edit</a></li></ul>";

                marker = new google.maps.Marker({
                  position : locations[i].coords,
                  map: map,
                  info: message
                });

                google.maps.event.addListener(marker,'click',function(){
                  var marker2 = this;
                  infowindow.close();
                  infowindow.setContent(this.info);
                  infowindow.open(map,this);
                  console.log(this.position.lat());
                  var mapDiv = document.getElementById('edit');
                  google.maps.event.addDomListener(mapDiv, 'click', function() {
                    infowindow.close();
                    console.log(marker2.position.lat());

                    infowindow.setContent(form);
                    infowindow.open(map,marker2);
                    console.log(form);
                  });
                  //console.log(infowindow);
                });
            }
          }
        };

        xhttp.open("POST","http://localhost/node/some",true);
        xhttp.setRequestHeader("Content-type","application/json");
        xhttp.send(bounds);
     });

      var markers = new google.maps.Marker({
        position : loc,
        map:  map
      });
    });

  } else alert("Geolocation not supported");

}

//attaches an infowindow and a click event for every marker
function attachInfoWindow(marker,message){
  infowindow = new google.maps.InfoWindow({
    content: message
  });

  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
  });

}

function saveData(){
  console.log(marker.info);
}
