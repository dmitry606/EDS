import Queue from "./MinPQ";

console.log("- begin");

var q = new Queue<number>((a, b) => a - b);
q.insert(5);
q.insert(2);
q.insert(3);

for(var el of q) {
    console.log(el);
}