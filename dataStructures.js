// welp, javascript doesn't even have linked list
var ListNode = /** @class */ (function () {
    function ListNode(val) {
        this.val = val;
        this.next = null;
    }
    return ListNode;
}());
var list = /** @class */ (function () {
    function list() {
        this.first = this.last = null;
        this.size = 0;
    }
    list.prototype.front = function () {
        return this.first.val;
    };
    list.prototype.push_front = function (val) {
        if (this.first === null) {
            this.first = this.last = new ListNode(val);
        }
        else {
            var tmp = this.first;
            this.first = new ListNode(val);
            this.first.next = tmp;
        }
        this.size++;
    };
    list.prototype.push_back = function (val) {
        if (this.first === null) {
            this.push_front(val);
            return;
        }
        this.last.next = new ListNode(val);
        this.last = this.last.next;
        this.size++;
    };
    list.prototype.pop_front = function () {
        this.first = this.first.next;
        this.size--;
    };
    list.prototype.toString = function () {
        var res = "";
        for (var a = this.first; a !== null; a = a.next) {
            res += a.val;
            if (a.next !== null) {
                res += ", ";
            }
        }
        return res;
    };
    return list;
}());
// class Vec {
// 	i: number;
// 	j: number;
// 	constructor(i: number, j: number) {
// 		this.i = i;
// 		this.j = j;
// 	}
// 	mult(c: number) : void {
// 		this.i *= c;
// 		this.j *= c;
// 	}
// 	div(c: number) : void {
// 		this.i /= c;
// 		this.j /= c;
// 	}
// 	dist(rhs: Vec) : number {
// 		var di: number = rhs.i - this.i;
// 		var dj: number = rhs.j - this.j;
// 		return Math.sqrt(di * di + dj * dj);
// 	}
// }
