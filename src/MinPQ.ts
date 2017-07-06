/**
 *  Min priority queue. Ported to TypeScript from Robert Sedgewick and Kevin Wayne Java implementation.
 *  For additional documentation, see <a href="http://algs4.cs.princeton.edu/24pq">Section 2.4</a> of
 *  <i>Algorithms, 4th Edition</i> by Robert Sedgewick and Kevin Wayne.
 */
type Comparator<Key> = (a: Key, b: Key) => number;

export default class MinPQ<Key> {
    private pq: Key[];                    // store items at indices 1 to n
    private n: number;                       // number of items on priority queue
    private comparator: Comparator<Key>;  // optional comparator

    /**
     * Initializes an empty priority queue with the given initial capacity.
     *
     * @param  initCapacity the initial capacity of this priority queue
     */
    constructor(comparator: Comparator<Key>, initCapacity?: number) {
        this.pq = new Array(initCapacity || 1);
        this.comparator = comparator;
        this.n = 0;
    }

    /**
     * Returns true if this priority queue is empty.
     *
     * @return {@code true} if this priority queue is empty;
     *         {@code false} otherwise
     */
    public isEmpty() {
        return this.n == 0;
    }

    /**
     * Returns the number of keys on this priority queue.
     *
     * @return the number of keys on this priority queue
     */
    public size() {
        return this.n;
    }

    /**
     * Returns a smallest key on this priority queue.
     *
     * @return a smallest key on this priority queue
     * @throws NoSuchElementException if this priority queue is empty
     */
    public min(): Key {
        if (this.isEmpty()) throw new Error("Priority queue underflow");
        return this.pq[1];
    }

    // helper function to double the size of the heap array
    private resize(capacity: number) {
        var temp = new Array(capacity);
        for (var i = 1; i <= this.n; i++) {
            temp[i] = this.pq[i];
        }
        this.pq = temp;
    }

    /**
     * Adds a new key to this priority queue.
     *
     * @param  x the key to add to this priority queue
     */
    public insert(x: Key) {
        // double size of array if necessary
        if (this.n == this.pq.length - 1) this.resize(2 * this.pq.length);

        // add x, and percolate it up to maintain heap invariant
        this.pq[++this.n] = x;
        this.swim(this.n);
    }

    /**
     * Removes and returns a smallest key on this priority queue.
     *
     * @return a smallest key on this priority queue
     * @throws NoSuchElementException if this priority queue is empty
     */
    public delMin(): Key {
        if (this.isEmpty()) throw new Error("Priority queue underflow");
        var min = this.pq[1];
        this.exch(1, this.n--);
        this.sink(1);
        this.pq[this.n+1] = this.pq[this.n];     // to avoid loiterig and help with garbage collection
        if ((this.n > 0) && (this.n == (this.pq.length - 1) / 4)) this.resize(this.pq.length / 2);
        return min;
    }


   /***************************************************************************
    * Helper functions to restore the heap invariant.
    ***************************************************************************/

    private swim(k: number) {
        while (k > 1 && this.greater(k/2, k)) {
            this.exch(k, k/2);
            k = k/2;
        }
    }

    private sink(k: number) {
        while (2*k <= this.n) {
            var j = 2*k;
            if (j < this.n && this.greater(j, j+1)) j++;
            if (!this.greater(k, j)) break;
            this.exch(k, j);
            k = j;
        }
    }

   /***************************************************************************
    * Helper functions for compares and swaps.
    ***************************************************************************/
    private greater(i: number, j: number) {
        return this.comparator(this.pq[i], this.pq[j]) > 0;
    }

    private exch(i: number, j: number) {
        var swap = this.pq[i];
        this.pq[i] = this.pq[j];
        this.pq[j] = swap;
    }

    // is subtree of pq[1..n] rooted at k a min heap?
    private isMinHeap(k: number = 1): boolean {
        if (k > this.n) return true;
        var left = 2*k;
        var right = 2*k + 1;
        if (left  <= this.n && this.greater(k, left))  return false;
        if (right <= this.n && this.greater(k, right)) return false;
        return this.isMinHeap(left) && this.isMinHeap(right);
    }

    copy() {
        var copy = new MinPQ(this.comparator, 0);
        copy.pq = [...this.pq];
        copy.n = this.n;
        return copy;
    }

    *[Symbol.iterator]() {
        let copy = this.copy();
        while(!copy.isEmpty())
            yield { value: copy.delMin(), done: false }
        yield { done: true }
    }

    /**
     * Returns an iterator that iterates over the keys on this priority queue
     * in ascending order.
     * <p>
     * The iterator doesn't implement {@code remove()} since it's optional.
     *
     * @return an iterator that iterates over the keys in ascending order
     */
    // public Iterator<Key> iterator() {
    //     return new HeapIterator();
    // }

    // private class HeapIterator implements Iterator<Key> {
    //     // create a new pq
    //     private MinPQ<Key> copy;

    //     // add all items to copy of heap
    //     // takes linear time since already in heap order so no keys move
    //     public HeapIterator() {
    //         if (comparator == null) copy = new MinPQ<Key>(size());
    //         else                    copy = new MinPQ<Key>(size(), comparator);
    //         for (int i = 1; i <= n; i++)
    //             copy.insert(pq[i]);
    //     }

    //     public boolean hasNext()  { return !copy.isEmpty();                     }
    //     public void remove()      { throw new UnsupportedOperationException();  }

    //     public Key next() {
    //         if (!hasNext()) throw new NoSuchElementException();
    //         return copy.delMin();
    //     }
    // }


}
