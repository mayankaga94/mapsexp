const fs = require('fs');

var bounds = {
  "south":28.377204135019763,
  "west":76.91898114301762,
  "north":28.491626188177214,
  "east":77.18265301801762
};

function getRandom(max,min){
  return Math.random() * (max-min) + min;
}

var str = "";
for(var i = 0 ; i < 20 ; i++){
  var obj = {
    "coords": {
      "lat": 0,
      "lng": 0
    }
  };
  obj.coords.lat = getRandom(bounds.north,bounds.south);
  obj.coords.lng = getRandom(bounds.east,bounds.west);
  obj = JSON.stringify(obj);
  str += obj;
  str += "\n";
  obj = {};
};

fs.writeFile('sampledata.json',str, (err) => {
  if(err) throw err;

  console.log("successfull");
})
