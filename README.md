
<!--#echo json="package.json" key="name" underline="=" -->
deepsortobj
===========
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Deep-copy an object, with keys sorted. Supports circular references and custom
sort order.
<!--/#echo -->


API
---

### sortObj(obj[, how])

The module exports this function.

Returns a sorted deep copy of `obj`.

`how` can be a function or an options object.
If it's a function, it's treated as the `sort` option.
Supported options, all optional:

  * `isArray`: How to decide whether to copy an object as an
    Array (with ascending indexes)
    or as a dictionary object, with keys sorted.
    Supported values:
    * `undefined` (default): Use `Array.isArray`
    * `false`: Always sort.
    * any function: Should accept the object as its first argument and return
      the decision as boolean.
      All other arguments should be ignored because I haven't decided them yet.

  * `dictKeys`: How to enumerate a dictionary's keys.
    Supported values:
    * `undefined` (default): Use `sortObj.dictKeys`
    * any function: The function should accept the object as its first
      argument and return either `false` (if the object is not a dictionary)
      or an Array of its keys.

  * `sortKeys`: Determine which keys to copy from a dictionary,
    and in which order. Supported values:
    * `undefined` (default) or `true`: Use `sortObj.numsLast`
    * `false`: Don't modify the input array.
    * `"fast"`: Just use the input array's `.sort()` with no arguments.
    * any function: The function should accept an array of keys as its first
      argument and must return an array of keys.

  * `circular`: How to deal with circular references. Supported values:
    * `undefined` (default) or `"copy"`:
      Try to maintain the structure by putting a reference to the sorted
      version of the object that's
    * `"ign"`: Disable checking for CR.
      This should speed up stringification of non-circular objects,
      at the risk of running into infinite recursion if `obj`
      does contain a CR.
    * `"err"`: Throw an exception when a CR is encountered.
      The exception thrown will be, or inherit from, an Error object, and it
      will have a `circRef` property with a value other than `undefined`.
    * any function: Put the function's result instead of the CR. The function
      should ignore all arguments because I haven't decided them yet.


### sortObj.numsLast(keys)

`keys` must be an array of strings.
`.numsLast` returns a copy of `keys`, sorted in order
"texts first, numbers last, both ascending",
where "number" is defined as any non-empty string that consist entirely of
digits `0`..`9`, and a "text" is any string that's not a number.


### sortObj.dictKeys(x)

If `x` is deemed some kind of dictionary,
return them as an Array, else return `false`.
Currently, `x` is considered a dictionary if it is an object but none of these:

  * Array
  * Buffer
  * (Future versions might exclude more types, like typed arrays.)



<!--#toc stop="scan" -->


Usage
-----

From [test/usage.demo.js](test/usage.demo.js):

<!--#include file="test/usage.demo.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="10" -->
```javascript
var sortObj = require('deepsortobj'), pets = {
  dog: { sounds: [ 'woof' ],            colors: [ 'grey', 'white' ] },
  cat: { colors: [ 'white', 'orange' ], sounds: [ 'meow', 'purr' ]  },
  ant: { colors: [ 'red', 'black' ],    canRideOn: [ 'tree leaf' ]  },
};
pets.ant.canRideOn.push(pets.dog);
pets.dog.favoritePassenger = pets.ant;
console.dir(sortObj(pets), { depth: 23 });
```
<!--/include-->

Output:

<!--#include file="test/usage.demo.js" start="  //#r" stop="  //#e"
  outdent="  //= `" cut-tail="`" code="javascript" -->
<!--#verbatim lncnt="16" -->
```javascript
{ ant: 
   { canRideOn: 
      [ 'tree leaf',
        { colors: [ 'grey', 'white' ],
          favoritePassenger: [Circular],
          sounds: [ 'woof' ] } ],
     colors: [ 'red', 'black' ] },
  cat: { colors: [ 'white', 'orange' ], sounds: [ 'meow', 'purr' ] },
  dog: 
   { colors: [ 'grey', 'white' ],
     favoritePassenger: 
      { canRideOn: [ 'tree leaf', [Circular] ],
        colors: [ 'red', 'black' ] },
     sounds: [ 'woof' ] } }
```
<!--/include-->



Known issues
------------

  * Needs more tests.


Related projects
----------------

  * [sortedjson](https://github.com/mk-pmb/sortedjson-js)
    and lots of other "sorted json" modules
  * [sorted-object](https://github.com/domenic/sorted-object)
  * [sort-keys](https://github.com/sindresorhus/sort-keys)
  * [sort-object](https://github.com/doowb/sort-object)



License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
