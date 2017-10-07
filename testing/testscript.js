//var locations;
var form = "<div id = 'form'><table><tr><th>Name:</th><td><input type = 'text' id = 'name'></td></tr><tr><th>Tags:</th><td><input type = 'text' id = 'tags' placeholder = 'Seperate by tags'></td>\
</tr><tr><td><button id = 'submit'>Submit</button></td></tr></table></div>";
var infowindow;
var markers = [''];
function initMap(){

  var loc;
  infowindow = new google.maps.InfoWindow();
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition( (position) => {
      // current location coordinates
      loc = {
        "lat" : 28.417389,
        "lng" : 77.039662
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
        console.log(markers);
        if(markers[0] !== ''){
        for(var i = 0 ; i < markers.length ; i++){
          markers[i].setMap(null);
        }
        }
        markers = [];
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200){

            var locations = JSON.parse(this.responseText);
            //console.log(locations);
            //loop through the locations array and place a marker for each of them
            for(var i = 0 ; i < locations.length ; i++){
                var message = "<ul><li>Lat:" + locations[i].coords.lat + "</li><li>Lng:" + locations[i].coords.lng +"</li><li>Name:"+locations[i].name+"<li>Tags:"+locations[i].tags+"</li><li><a href='#' id ='edit'>Edit</a></li></ul>";

                markers[i] = new google.maps.Marker({
                  position : locations[i].coords,
                  map: map,
                  info: message
                });
                google.maps.event.addListener(markers[i],'click',function(){
                  var marker2 = this;
                  infowindow.close();
                  infowindow.setContent(this.info);
                  infowindow.open(map,this);
                  //console.log(this.position.lng());
                  var mapDiv = document.getElementById('edit');
                  google.maps.event.addDomListener(mapDiv, 'click', function() {
                    infowindow.close();
                    infowindow.setContent(form);
                    infowindow.open(map,marker2);
                    //console.log(form);
                    google.maps.event.addDomListener(document.getElementById('submit'),'click',function(){
                      var data = {
                        coords : {
                          lat : marker2.position.lat(),
                          lng : marker2.position.lng()
                        },
                        name : document.getElementById('name').value,
                        tags : document.getElementById('tags').value
                      };
                      //console.log(data);
                        UpdateData(data);
                        var content = "<ul><li>Name:"+data.name+"</li><li>Tags:"+data.tags+"</li></ul>";
                        addInfoWindow(marker2,content,map);
                    });
                  });
                });
            }
          }
        };

        xhttp.open("POST","http://localhost/node",true);
        xhttp.setRequestHeader("Content-type","application/json");
        xhttp.send(bounds);
     });

      var marker = new google.maps.Marker({
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

function UpdateData(data){
  var xhttp = new XMLHttpRequest();
  var data2 = JSON.stringify(data);
  xhttp.onreadystatechange = function(){
    if(this.readyState === 4 && this.status === 200){
      //console.log(this.responseText);
      console.log(true);
    }
  };
  xhttp.open("POST","http://localhost/node/update",true);
  xhttp.setRequestHeader("Content-type","application/json");
  xhttp.send(data2);
}

function addInfoWindow(marker,content,map){
  infowindow.close();
  infowindow.setContent(content);
  infowindow.open(map,marker);
}
function hideAll(){
  setMapOnAll(null);
}
function setMapOnAll(map){
  for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
  console.log(map);
}
