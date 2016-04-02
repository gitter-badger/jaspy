/*
 * Copyright (C) 2016, Maximilian Koehl <mail@koehlma.de>
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

var PyInt = PyObject.extend({
    constructor: function (value, cls) {
        PyObject.call(this, cls || py_int);
        try {
            this.value = bigInt(value);
        } catch (error) {
            raise(TypeError, 'invalid type of native int initializer');
        }
    },

    toString: function () {
        return this.value.toString();
    },

    valueOf: function () {
        return this.number();
    },

    bool: function () {
        return this.value.neq(0);
    },

    is: function (other) {
        if (other instanceof PyInt) {
            return this.value.eq(other.value);
        }
        return false;
    },

    number: function () {
        var number = this.value.toJSNumber();
        if (number == Infinity || number == -Infinity) {
            raise(OverflowError, 'int too large to convert to float');
        }
        return number;
    },

    float: function () {
        return new PyFloat(this.number());
    },

    abs: function () {
        return new PyInt(this.value.abs());
    },

    pos: function () {
        return this;
    },

    neg: function () {
        return new PyInt(this.value.negate());
    },

    invert: function () {
        return new PyInt(this.value.not());
    },

    add: function (other) {
        return new PyInt(this.value.add(other.value));
    },

    sub: function (other) {
        return new PyInt(this.value.subtract(other.value));
    },

    pow: function (other) {
        if (other < 0) {
            return pack_float(Math.pow(this.number(), other.number()));
        }
        return new PyInt(this.value.pow(other.value));
    },

    mul: function (other) {
        return new PyInt(this.value.multiply(other.value));
    },

    floordiv: function (other) {
        return new PyInt(this.value.divide(other.value));
    },

    truediv: function (other) {
        return pack_float(this.number() / other.number());
    },

    mod: function (other) {
        if (!this.value.sign && other.value.sign) {
            return new PyInt(this.value.mod(other.value).substract(other.value));
        } else if (this.value.sign && !other.value.sign) {
            return new PyInt(other.value.substract(this.value.mod(other.value)));
        }
        return new PyInt(this.value.mod(other.value));
    },

    lshift: function (other) {
        return new PyInt(this.value.shiftLeft(other.value));
    },


    rshift: function (other) {
        return new PyInt(this.value.shiftRight(other.value));
    },

    and: function (other) {
        return new PyInt(this.value.and(other.value));
    },

    xor: function (other) {
        return new PyInt(this.value.xor(other.value));
    },

    or: function (other) {
        return new PyInt(this.value.or(other.value));
    },

    lt: function (other) {
        return this.value.lt(other.value);
    },

    le: function (other) {
        return this.value.leq(other.value);
    },

    eq: function (other) {
        return this.value.eq(other.value);
    },

    ne: function (other) {
        return this.value.neq(other.value);
    },

    gt: function (other) {
        return this.value.gt(other.value);
    },

    ge: function (other) {
        return this.value.geq(other.value);
    }
});


PyInt.parse = function (string, base) {
    if (base instanceof PyInt) {
        return new PyInt(bigInt(string, base.value));
    }
    raise(TypeError, 'invalid type of integer base');
};


$.PyInt = PyInt;