/*
input:
  -array
  -string (delimiter)
  -string (final word)

output:
  -new string

[1] => '1'
[1, 2] => '1 or 2'
[1, 2, 3] => '1, 2, or 3'
[1, 2, 3], ";" => '1; 2; or 3'

[1, 2, 3] -> arr.slice(0, arr.length - 1) + `${arr[arr.length]} ${word}`

-create a shallow copy of the array
-change the last element so that it has the delimiter, word before it
-join the array with the delimiter
*/

function joinOr (choices, delimiter = ', ', word = 'or') {
  if (choices.length === 1) return `${choices[0]}`;
  if (choices.length === 2) return `${choices[0]} ${word} ${choices[1]}`;

  let result = '';
  const lastElementIndex = choices.length - 1;

  result += choices.slice(0, lastElementIndex).join(delimiter);
  result += `${delimiter}${word} ${choices[lastElementIndex]}`;
  return result;
}

// obj is the context for `joinOr`; replace it with the correct context.
console.log(joinOr([1, 2]));
console.log(joinOr([1, 2, 3]));
console.log(joinOr([1, 2, 3], '; '));
console.log(joinOr([1, 2, 3], ', ', 'and'));
console.log(joinOr([1, 2, 3, 4, 5], ', ', 'and'));
