var Transform = require('stream').Transform || require('readable-stream').Transform;
var util = require('util');

module.exports = CSVLint;


function CSVLint (opts, cb) {
	if(!(this instanceof CSVLint))
		return new CSVLint(opts, cb);

	Transform.call(this, opts);

	if(typeof opts === "function") {
		cb = opts;
		opts = {};
	}else {
		opts = opts || {};
	}

	this.encoding = opts.encoding || 'utf8';
	this.delimiter = opts.delimiter || ',';
	this.newline = opts.newline || '\n';
	this.quote = opts.quote || '\"';
	
}

util.inherits(CSVLint, Transform);

CSVLint.prototype._transform = function(chunk, encoding, cb) {
	var chunk = chunk.toString(this.encoding);
	var bkl_arr = this._br_line(chunk);
	this._search_d(bkl_arr, cb);

}

CSVLint.prototype._br_line = function(chunk) {
	var bkl_reg = new RegExp('([^' + this.newline + ']*)','g');
	var bkl_result = chunk.match(bkl_reg);
	return bkl_result;
}

// searching delimiter
CSVLint.prototype._search_d = function (bkl_arr, cb) {
	for (var i = 0; i < bkl_arr.length; i++) {
		if(bkl_arr[i] !== '') {
			console.log(bkl_arr[i])
			var d_reg = new RegExp('([^' + this.delimiter + ']*)','g');
			var d_result = bkl_arr[i].match(d_reg);
			var n_d_result = [];
			for(var j = 0; j < d_result.length; j++) {
				if(d_result[j] !== '') {
					// have value
					n_d_result.push(d_result[j]);
				}
			}
			if(!this._field_length) {
				this._field_length = d_result.length;
			}else {
				console.log(this._field_length);
				console.log(d_result.length);
				if(d_result.length !== this._field_length) {
					// error the field lenght is not the same
					throw new Error('Field length is not the same');
				}
			}
		}
	}
}
