'use strict';

/*

Given a set of N objects
union command: connect two objects
find/connected query: is there a path connecting the two objects?

we assume "is connected to" is an equivalence relation: 

- reflexive: p is connected to p;
- symmetric: if p is connected to q, then q is connected to p;
- transitive: if p is connected to q and q is connected to r, then p is connected to r;

{0} {1 4 5} {2 3 6 7} - 3 connected components which contains objects

properties: any two objects in them are connected, and there is no object outside that's gonna connect into those components

Implementing Operations

find query: check if two objects are in the same component.
union command: replace components containing two objects with their union.

{0} {1 4 5} {2 3 6 7} 
union(2, 5)
{0} {1 2 3 4 5 6 7}


/////////////////////////////////////
QUICK-FIND [eager approach]

data structure: an array index by object;
interpretation: two objects p and q are connected iff they have the same id;

id = [0, 1, 1, 8, 8, 0, 0, 1, 8, 8] 
// 0, 5 and 6 are connected;
// 1, 2 and 7 are connected;
// 3, 4, 8 and 9 are connected;

Find. check if p and q have the same id;
for example: 
id[6] = 0; id[1] = 1;
6 and 1 are not connected, so we can merge components;

Union. To merge components containing p and q, change all entries whose id equals id[p] to id[q].
for example, a[6] is set to 0, and a[1] is set to 1,(p = 6, q = 1) so all the entries with 0 needs to be replaced by value of 1;

union(p, q) where p and q is an indexes, and it replaces value in index of p by value that in index of q

///////////////////////////////////////
QUICK-UNION [lazy approach]
data structure: an array id
interpretation: id[i] is parent of i;
root of i is id[id[id[...id[i]...]]]. // keep going until it doesn't change (algorithm ensures no cycles)
  //
we gonna think of that array as representing a set of trees it's called a forest as depicted it right;
each entry in the array is gonna contain reference to it's parent in the tree
each entry in the array has associated(связанный) with it, a root that's a root of it's tree, elements that are all by themselves in just own connected component point to themselves, so one points to itself, but also 9 points to itself, it's the root of the tree containing 2, 4 and 3
so from this data structure we can associate with each item, - a root which is representative say if it connected component

FIND. Check if p and q have the same root.
UNION. To merge components containing p and q, set the id of p's root to the id of q's root.
*/

// union-find

let id = [];

const quickFindUF = function (N) {
  // setting id of each object to itself (N array accesses)
  // go through and set the value corresponding to each index i to i, straight forward
  for (let i = 0; i < N; i++) {
    id[i] = i;
  }

  console.log(id);
};

const connected = (p, q) => id[p] === id[q]; // checks whether they id entries are equal

const union = function (p, q) {
  //for (let i in id) {
  //if (id[i] === id[p]) id[i] = id[q];
  //}

  id = id.map(x => (x === id[p] ? id[q] : x));
  console.log(id);
};

quickFindUF(10);

union(3, 4);
union(2, 4);
union(0, 9);
union(1, 0);
union(0, 4);
union(0, 7);
union(1, 8);
