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
	push_front(val: T) {
		if (this.first == null) {
			this.first = this.last = new ListNode<T>(val);
		}
		else {
			var tmp: ListNode<T> = this.first;
			this.first = new ListNode<T>(val);
			this.first.next = tmp;
		}
	}
	push_back(val: T) {
		if (this.first == null) {
			this.push_front(val);
		}
		else {
			this.last.next = new ListNode<T>(val);
			this.last = this.last.next;
		}
	}
	pop_front() {
		this.first = this.first.next;
	}
	toString() {
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