"use strict";

/*

Given a set of N objects
union command: connect two objects
find/connected query: is there a path connecting the two objects?

we assume "is connected to" is an equivalence relation: 

- reflexive: p is connected to p;
- symmetric: if p is connected to q, then q is connected to p;
- transitive: if p is connected to q and q is connected to r, then p is connected to r;

{0} {1 4 5} {2 3 6 7} - 3 connected components which contains objects
properties: any two objects in them are connected, and there is no object outside that's gonna connect into those components or algorithm will gain efficiency by maintaining connected components and using that knowledge to efficiently answer the query the presented way


Implementing Operations

find query: check if two objects are in the same component.
union command: replace components containing two objects with their union.

{0} {1 4 5} {2 3 6 7} 
union(2, 5)
{0} {1 2 3 4 5 6 7}


quick-find [eager approach]

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

*/

// union-find

let id = [];

const quickFindUF = function (N) {
  // setting id of each object to itself (N array accesses)
  for (let i = 0; i < N; i++) {
    id[i] = i;
  }

  console.log(id);
};

const connected = (p, q) => id[p] === id[q];

quickFindUF(10);
