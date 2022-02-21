/*
input:
  -object
output:
  -n/a, potentially mutates input objects

rules:
  -search the prototype chain of an object for a given property
  and assign it a new value
  -if property does not exist in any of the prototype objects,
  function should do nothing

while (Object.getPrototypeOf(obj)
  if (obj.hasOwnProperty(prop)) prop = val;
  obj = Object.getPrototypeOf(obj);
}

-given the prop and obj,
-while the obj's prototype is not null
  -check for the prop in the object
  -if it exists, change it,
  -set the obj to the prototype of the current obj
*/

function assignProperty(obj, prop, val) {
  while (obj !== null) {
    if (obj.hasOwnProperty(prop)) obj[prop] = val;
    obj = Object.getPrototypeOf(obj);
  }
}

let fooA = { bar: 1 };
let fooB = Object.create(fooA);
let fooC = Object.create(fooB);

assignProperty(fooC, "bar", 2);
console.log(fooA.bar); // 2
console.log(fooC.bar); // 2

assignProperty(fooC, "qux", 3);
console.log(fooA.qux); // undefined
console.log(fooC.qux); // undefined
console.log(fooA.hasOwnProperty("qux")); // false
console.log(fooC.hasOwnProperty("qux")); // false