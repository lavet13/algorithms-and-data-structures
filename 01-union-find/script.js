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
UNION. To merge components containing p and q(indexes), set the id of p's root to the id of q's root.
union(9, 6) // SET ID OF P'S ROOT TO THE ID OF Q'S ROOT;
before: id = [0, 1, 9, 4, 9, 6, 6, 7, 8, 9]
after: id = [0, 1, 9, 4, 9, 6, 6, 7, 8, 6]


Summarize: 
QUICK-FIND defect:
- Union too expensive (N array accesses).
- Trees are flat, but too expensive to keep them flat.

QUICK-UNION defect:
- Trees can get tall.
- Find too expensive (could be N array accesses).



Weighted QUICK-UNION:
- Modify QUICK-UNION to avoid tall trees.
- Keep track of size of each tree (number of objects).
- Balance by linking root of smaller tree to root of larger tree.
on the paper it's more convenient to understand

Data structure. Same as QUICK-UNION, but maintain extra array sz[i] to count number of objects in the tree rooted at i.
Find. Identical to QUICK-UNION
  return root(p) === root(q)

Union. Modify QUICK-UNION to:
- Link root of smaller tree to root of larger tree.
- Update the sz[] array.

let i = root(p)
let j = root(q)
if(i === j) return;
if(sz[i] < sz[j]) {
  id[i] = j;
  sz[j] += sz[i];
} else {
  id[j] = i;
  sz[i] += sz[j];
}

Improvement. path compression
QUICK-UNION with path compression. Just after computing the root of p, set the id of each examined node to point to that root.

Two-pass implementation: add second loop to root() to set the id[] of each examined node to the root

Simpler one-pass variant: Make every other node in path point to it's grandparent (thereby halving path length).

const root = function (i) { // chase parent pointers until reach root (depth of i array accesses)
  while (i !== id[i]) {
    id[i] = id[id[i]]; // only one extra line of code
    i = id[i];
  }

  return i;
};

In practice. No reason not to! Keeps tree almost completely flat.

UNION-FIND applications
- Percolation.
- Games (Go, HEX).
- Dynamic connectivity
- Least common ancestor.
- Equivalence of finite state automata.
- Hoshen- Kopelman algorithm in physics.
- Hinley-Milner polymorphic type inference.
- Kruskal's minimum spanning tree algorithm.
- Compiling equivalence statements in Fortran.
- Morphological attribute openings and closings.
Matlab's bwlabel() function in image processing.

*/

// union-find
let id = [];
let sz = [];

function initialization(N) {
  // setting id of each object to itself (N array accesses)
  for (let i = 0; i < N; i++) {
    id[i] = i;
    sz[i] = i;
  }
}

const quickFindUF = function (N, { union, connected }) {
  initialization(N);

  if (union.length !== 0) {
    for (const [p, q] of union) {
      //for (const i in id) {
      //if (id[i] === id[p]) id[i] = id[q];
      //}

      id = id.map(x => (x === id[p] ? id[q] : x));
      console.log(id);
    }
  }

  if (connected.length !== 0) {
    for (const [p, q] of connected) {
      console.log(`connected(${p}, ${q}) ${id[p] === id[q]}`);
    }
  }
};

const quickUnionUF = function (N, { union, connected }) {
  initialization(N);

  const root = function (i) {
    // chase parent pointers until reach root (depth of i array accesses)
    while (i !== id[i]) i = id[i];
    return i;
  };

  if (union.length !== 0) {
    for (const [p, q] of union) {
      // change root of p to point to root of q (depth of p and q array accesses)
      let i = root(p);
      let j = root(q);
      id[i] = j;
    }
  }

  if (connected.length !== 0) {
    for (const [p, q] of connected) {
      // check if p and q have same root (depth of p and q array accesses)
      console.log(`connected(${p}, ${q}) ${root(p) === root(q)}`);
    }
  }
};

const quickUnionWeightedUF = function (N, { union, connected }) {
  initialization(N);

  const root = function (i) {
    // chase parent pointers until reach root (depth of i array accesses)
    while (i !== id[i]) {
      id[i] = id[id[i]]; // this line represents "path compression"
      i = id[i];
    }

    return i;
  };

  if (union.length !== 0) {
    for (const [p, q] of union) {
      // change root of p to point to root of q (depth of p and q array accesses)
      let i = root(p);
      let j = root(q);

      if (i === j) return;

      if (sz[i] < sz[j]) {
        id[i] = j;
        sz[j] += sz[i];
      } else {
        id[j] = i;
        sz[i] += sz[j];
      }

      console.log(id);
    }
  }

  if (connected.length !== 0) {
    for (const [p, q] of connected) {
      // check if p and q have same root (depth of p and q array accesses)
      console.log(`connected(${p}, ${q}) ${root(p) === root(q)}`);
    }
  }
};

//quickFindUF(10, {
//union: [
//[3, 4],
//[2, 4],
//[0, 9],
//[1, 0],
//[0, 4],
//[0, 7],
//[1, 8],
//],
//connected: [],
//});

quickUnionWeightedUF(10, {
  union: [
    [4, 3],
    [3, 8],
    [6, 5],
    [9, 4],
    [2, 1],
    [5, 0],
    [7, 2],
    [6, 1],
    [7, 3],
  ],
  connected: [],
});
