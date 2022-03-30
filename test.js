class Rectangle {}

Rectangle.desc = 'This is a static property.';
Rectangle.getDescription = function() {
  console.log(Rectangle.desc);
};