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
    list.prototype.push_front = function (val) {
        if (this.first == null) {
            this.first = this.last = new ListNode(val);
        }
        else {
            var tmp = this.first;
            this.first = new ListNode(val);
            this.first.next = tmp;
        }
    };
    list.prototype.push_back = function (val) {
        if (this.first == null) {
            this.push_front(val);
        }
        else {
            this.last.next = new ListNode(val);
            this.last = this.last.next;
        }
    };
    list.prototype.pop_front = function () {
        this.first = this.first.next;
    };
    list.prototype.toString = function () {
        var res = "";
        for (var a = this.first; a != null; a = a.next) {
            res += a.val;
            if (a.next != null) {
                res += ", ";
            }
        }
        return res;
    };
    return list;
}());
