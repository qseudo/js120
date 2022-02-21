let obj = Object.create(null);

if (Object.getPrototypeOf(obj)) {
  console.log('Object has a prototype');
} else {
  console.log('Object does not have a prototype');
}