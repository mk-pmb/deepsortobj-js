/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

(function readmeDemo() {
  //#u
  var sortObj = require('deepsortobj'), pets = {
    dog: { sounds: [ 'woof' ],            colors: [ 'grey', 'white' ] },
    cat: { colors: [ 'white', 'orange' ], sounds: [ 'meow', 'purr' ]  },
    ant: { colors: [ 'red', 'black' ],    canRideOn: [ 'tree leaf' ]  },
  };
  pets.ant.canRideOn.push(pets.dog);
  pets.dog.favoritePassenger = pets.ant;
  console.dir(sortObj(pets), { depth: 23 });
  //#r
  //= `{ ant: `
  //= `   { canRideOn: `
  //= `      [ 'tree leaf',`
  //= `        { colors: [ 'grey', 'white' ],`
  //= `          favoritePassenger: [Circular],`
  //= `          sounds: [ 'woof' ] } ],`
  //= `     colors: [ 'red', 'black' ] },`
  //= `  cat: { colors: [ 'white', 'orange' ], sounds: [ 'meow', 'purr' ] },`
  //= `  dog: `
  //= `   { colors: [ 'grey', 'white' ],`
  //= `     favoritePassenger: `
  //= `      { canRideOn: [ 'tree leaf', [Circular] ],`
  //= `        colors: [ 'red', 'black' ] },`
  //= `     sounds: [ 'woof' ] } }`
  //#e
}());
