
<!--#echo json="package.json" key="name" underline="=" -->
deepsortobj
===========
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Deep-copy an object, with keys sorted. Supports circular references and custom
sort order.
<!--/#echo -->


Beware! JS object key order rules
---------------------------------

It's a mess. Detailed discussions on StackOverflow:
[here][stofl-1], [here][stofl-2], [here][stofl-3], [here][stofl-4].

The gist of it: The spec gives some guarantees in some cases but they
sound too complicated for me to memorize them.
However, most JS engines ([test yours](docs/prop-order.js))
keep a tradition that results in:

* Keys that look like they could have been created by
  array operations (i.e. integers 0 &le; n &le; 4294967294 = 2^31-2
  in default notation) always go first.
* Next up are all other string-y keys, in the order they were added.
* … and thus, the `numsLast` code shipped in `deepsortobj` up to v0.1.1
  was totally ineffective, besides being wrong. Starting from v0.1.2,
  the `keyPrefix`/`keySuffix` hack might help in some cases.



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

  * `keyPrefix` and `keySuffix`:
    On the result side (i.e. after `sortKeys`), wrap each key with these
    (default: empty) strings. You can use this to nullify the built-in
    priority of some number-like keys (see warning above).

  * `circular`: How to deal with circular references. Supported values:
    * `undefined` (default) or `"congruent"`:
      Try to maintain the structure by putting a reference to the sorted
      version of the object. (Deprecated alias: `"copy"`)
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
"texts first, integers last, both ascending",
where "integer" is defined as

<!--#include file="deepsortobj.js" start="  // BEGIN define integer key"
  stop="  // ENDOF define integer key" outdent="  EX." code="javascript" -->
<!--#verbatim lncnt="3" -->
```javascript
intRgx = /^0$|^-?[1-9][0-9]*$/;
```
<!--/include-->

and a "text" is any string that's not an integer.


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
  outdent="  //= `" cut-tail="`" code="javascript" transform="trimR" -->
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




  [stofl-1]: https://stackoverflow.com/a/23202095
  [stofl-2]: https://stackoverflow.com/a/30076219
  [stofl-3]: https://stackoverflow.com/a/33049762
  [stofl-4]: https://stackoverflow.com/a/38218582

License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
