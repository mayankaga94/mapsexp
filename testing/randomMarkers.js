const fs = require('fs');

var bounds = {
  "south":28.377204135019763,
  "west":76.91898114301762,
  "north":28.491626188177214,
  "east":77.18265301801762
};
console.log(bounds.north.toFixed(6));
function getRandom(max,min){
  //console.log(typeof max);
  //console.log( max);
  // max = max.toFixed(6);
  // min = min.toFixed(6);
  var value = Math.random() * (max-min) + min;
  return parseFloat(value.toFixed(6));
}

var str = "";
for(var i = 0 ; i < 20 ; i++){

  var lat = getRandom(bounds.north,bounds.south);
  var lng = getRandom(bounds.east,bounds.west);
  //console.log(lat);
  var obj = {
    "coords": {
      "lat": lat,
      "lng": lng
    }
  };
  obj = JSON.stringify(obj);
  str += obj;
  str += "\n";
  obj = {};
};

fs.writeFile('sampledata.json',str, (err) => {
  if(err) throw err;

  console.log("successfull");
})
