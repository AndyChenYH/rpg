// welp, javascript doesn't even have linked list

class ListNode<T> {
	val: T;
	next: ListNode<T>;
	constructor(val: T) {
		this.val = val;
		this.next = null;
	}
}
class list<T> {
	first: ListNode<T>;
	last: ListNode<T>;
	size: number;
	constructor() {
		this.first = this.last = null;
		this.size = 0;
	}
	front() : T {
		return this.first.val;
	}
	push_front(val: T) : void {
		if (this.first === null) {
			this.first = this.last = new ListNode<T>(val);
		}
		else {
			var tmp: ListNode<T> = this.first;
			this.first = new ListNode<T>(val);
			this.first.next = tmp;
		}
		this.size ++;
	}
	push_back(val: T) : void {
		if (this.first === null) {
			this.push_front(val);
			return;
		}
		this.last.next = new ListNode<T>(val);
		this.last = this.last.next;
		this.size ++;
	}
	pop_front() : void {
		this.first = this.first.next;
		this.size --;
	}
	toString() : string {
		var res = "";
		for (var a: ListNode<T> = this.first; a != null; a = a.next) {
			res += a.val;
			if (a.next != null) {
				res += ", ";
			}
		}
		return res;
	}
}