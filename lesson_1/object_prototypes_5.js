let fooProto = { a: 1, b: 2 };
let foo = { c: 3 };
Object.setPrototypeOf(foo, fooProto);

for (let property in foo) {
  console.log(`${property}: ${foo[property]}`);
}

Object.keys(foo).forEach(property => {
  console.log(`${property}: ${foo[property]}`);
});