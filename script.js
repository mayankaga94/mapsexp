var infowindow,markers = [];

function initMap(){
  var loc = {
    "lat" : 28.417389,
    "lng" : 77.039662
  };
  infowindow = new google.maps.InfoWindow();

  var map = new google.maps.Map(document.getElementById('map'),{
    zoom : 15,
    center : loc
  });

  var currMarker = new google.maps.Marker({
    position : loc,
    map : map
  });

  google.maps.event.addListener(map,'click',function(e){
    console.log(e.latLng);
    addMarker(e.latLng,map);
  });
  //Whenever map changes and comes to idle
  google.maps.event.addListener(map,'idle',function(){
    var bounds = JSON.stringify(map.getBounds().toJSON());
    if(markers) setMarkers(null);
    markers = [];

    fetchMarkers(map,bounds);
  });

}

function setMarkers(map){
  for(let i = 0 ; i < markers.length ; i++){
    markers[i].setMap(map);
  }
}

function fetchMarkers(map,bounds){
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function(){
    console.log(this.readyState);
    if(this.readyState == 4 && this.status == 200){
      var markerObject = JSON.parse(this.responseText);
      console.log("te to chala");
      for(var i = 0 ; i < markerObject.length ; i++){
        var marker = new google.maps.Marker({
          position : markerObject[i].coords,
          map : map,
        });
        markers.push(marker);
        content = makeContent(markerObject[i],"get");
        addListener(markerObject[i],markers[i],content,map);
      }
    } else if((this.status === 400 || this.status === 503) && this.readyState === 4)alert("Service Unavailable.Please try after some time.");
  };

  xhttp.open("POST","http://192.168.0.6/node",true);
  xhttp.setRequestHeader("Content-type","application/json");
  xhttp.send(bounds);
}

function makeContent(markerObject,action){
  if(markerObject.name) var name = markerObject.name;
  else var name = "N/A";

  if(markerObject.tags) var tags = markerObject.tags;
  else var tags = "N/A";

  if(action === "get"){
    return "<ul>\
              <li>Name: " + name + "</li>\
              <li>Tags: " + tags + "</li>\
              <li id = 'link'>Edit</li>\
            </ul>";
  } else if(action === "edit"){
    return "<div id = 'form'><table><tr><th>Name:</th><td><input type = 'text' id = 'name' value = "+name+" pattern = '[A-Za-z,]' required></td></tr><tr><th>Tags:</th><td><input type = 'text' id = 'tags' value = "+tags+" pattern = '[A-Za-z,]' required></td>\
    </tr><tr><td><button id = 'submit'>Submit</button></td></tr></table></div>"
  }

}

function addListener(markerObject,marker,content,map){
  google.maps.event.addListener(marker,'click',function(){
    var marker2 = this;
    addInfoWindow(marker2,content,map);
    var edit = document.getElementById('link');
    google.maps.event.addDomListener(edit,'click',function(){
      console.log("clicked on edit");
      addInfoWindow(marker2,makeContent(markerObject,'edit'));
      google.maps.event.addDomListener(document.getElementById('submit'),'click',function(){
        //     ADD DATA FILTER
        //console.log(marker2);
        var data = {
          coords : {
            lat : marker2.position.lat(),
            lng : marker2.position.lng()
          },
          name : document.getElementById('name').value,
          tags : document.getElementById('tags').value
        };
        UpdateData(data,marker2,map);
      });
    });
  });
}

function addInfoWindow(marker,content,map){
  infowindow.close();
  infowindow.setContent(content);
  infowindow.open(map,marker);
}

function UpdateData(data,marker,map){
  var xhttp = new XMLHttpRequest();
  var obj = JSON.stringify(data);
  xhttp.onreadystatechange = function(){
    if(this.readyState === 4 && this.status === 200){
      var content = makeContent(data,'get');
      content = content.replace("<li id = 'link'>Edit</li>","<li id = 'success'>Success</li>");
      console.log(content);
      setMarkers(null);
      markers = [];
      var bounds = JSON.stringify(map.getBounds().toJSON());
      fetchMarkers(map,bounds);
      addInfoWindow(marker,content,map);
      //console.log(true);
    } else if(this.readyState === 4 && this.status === 400){
      console.log("Bad Request");
      var content = makeContent(data,'get');
      content = content.replace("<li id = 'link'>Edit</li>","<li id = 'no-success'>Unsuccessful</li>");
      console.log(content);
      addInfoWindow(marker,content,map);
    }
  };
  xhttp.open("POST","http://192.168.0.6/node/update",true);
  xhttp.setRequestHeader("Content-type","application/json");
  xhttp.send(obj);
}

function addMarker(pos,map){
  var marker = new google.maps.Marker({
    position : pos,
    map : map
  });
  markers.push(marker);
  addInfoWindow(marker,makeContent({},'edit'),map);

  google.maps.event.addDomListener(document.getElementById('submit'),'click',function(){
    var xhttp = new XMLHttpRequest();
    var doc = {
      coords : {
        lat : parseFloat(marker.position.lat().toFixed(6)),
        lng : parseFloat(marker.position.lng().toFixed(6))
      },
      name : document.getElementById('name').value,
      tags : document.getElementById('tags').value
    };
    console.log(doc);
    var data = JSON.stringify(doc);
    xhttp.onreadystatechange = function(){
      if(this.readyState === 4 && this.status === 200){
        var content = makeContent(doc,'get');
        content = content.replace("<li id = 'link'>Edit</li>","<li id = 'success'>Success</li>");
        console.log(content);
        addInfoWindow(marker,content,map);
      } else if(this.readyState === 4 && (this.status === 400 || this.status === 503)){
        var content = makeContent(data,'get');
        content = content.replace("<li id = 'link'>Edit</li>","<li id = 'no-success'>Unsuccessful</li>");
        console.log(content);
        addInfoWindow(marker,content,map);
      }
    };
    xhttp.open('POST','http://192.168.0.6/node/add',true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.send(data);
  });
}
