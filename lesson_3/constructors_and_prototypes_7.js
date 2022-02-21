let ninjaA;

{
  const Ninja = function() {
    this.swung = false;
  };

  ninjaA = new Ninja();
}

let ninjaB = new ninjaA.constructor();
// create a `ninjaB` object here; don't change anything else

console.log(ninjaA.constructor === ninjaB.constructor); // => true