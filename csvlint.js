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

	this.lineNo = 0;
	this.buffer = '';
	
}

util.inherits(CSVLint, Transform);

CSVLint.prototype._transform = function(chunk, encoding, cb) {

	var chunk = chunk.toString(this.encoding);

	if(chunk) {
		chunk = this.buffer + chunk;
	}
	var bkl_arr = this._br_line(chunk);
	
	// buffer the last value, cause might be an incomplete value.
	for(var j = bkl_arr.length - 1; j >= 0; j--) {
		if(bkl_arr[j]) {
			// if have value
			this.buffer = bkl_arr[j]
			break;
		}
	}

	if(chunk.indexOf(this.quote) !== -1) {
		// have quote
		for (var i = 0; i < bkl_arr.length; i++) {
			this._quote(bkl_arr[i]);
		}
	}else {
		// no quote
		for (var i = 0; i < bkl_arr.length; i++) {
			this._search_d(bkl_arr[i]);
		}
	}
	cb();
}

CSVLint.prototype._br_line = function(chunk) {
	var bkl_reg = new RegExp('([^' + this.newline + ']*)','g');
	var bkl_result = chunk.match(bkl_reg);
	return bkl_result;
}

// quoting problem
CSVLint.prototype._quote = function(line) {
	if(line !== '') {
		var line_split = line.split(this.delimiter);
		for(var j = 0; j < line_split.length; j++) {
			var line_trim = line_split[j].trim();

			if(line_trim.indexOf(this.quote + this.quote) !== -1) {
				// replace all escape double quotes
				var esc_double_regex  = new RegExp ('(' + this.quote + this.quote + ')*', 'g');
				var esc_line = line_trim.replace(esc_double_regex, "");
			}else {
				esc_line = line_trim;
			}

			if(esc_line.indexOf(this.quote) !== -1) {
				if(!(esc_line.indexOf(this.quote) === 0 && esc_line.lastIndexOf(this.quote) === esc_line.length - 1)) {
					// have encluded with double-quotes
					this.emit('error', new Error('If using double qoutes to start, CSV fields should enclosed with double-quotes. If using double quotes in fields you should escape by using double-quotes. In line ' + this.lineNo))
				}
			}
		}
		this._search_d(line);
	}
}

// searching delimiter
CSVLint.prototype._search_d = function (line) {
	if(line !== '') {
		this.lineNo++;
		var d_length = line.split(this.delimiter).length;
		if(!this._field_length) {
			this._field_length = d_length;
		}else {
			if(d_length !== this._field_length) {
				this.emit('error', new Error('Field length is not the same. In line ' + this.lineNo));
			}
		}
		this.push(line + this.newline)
	}
}

CSVLint.prototype._flush = function(cb) {
	this._field_length = null;
	this.buffer = '';
	this.lineNo;
	cb();
}
