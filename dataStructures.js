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
var Vec = /** @class */ (function () {
    function Vec(i, j) {
        this.i = i;
        this.j = j;
    }
    Vec.prototype.mult = function (c) {
        this.i *= c;
        this.j *= c;
    };
    Vec.prototype.div = function (c) {
        this.i /= c;
        this.j /= c;
    };
    Vec.prototype.mag = function () {
        return Math.sqrt(this.i * this.i + this.j * this.j);
    };
    Vec.prototype.normalize = function () {
        this.div(this.mag());
    };
    Vec.prototype.dist = function (rhs) {
        var di = rhs.i - this.i;
        var dj = rhs.j - this.j;
        return Math.sqrt(di * di + dj * dj);
    };
    return Vec;
}());
