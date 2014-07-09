var shoule = require('should');
var csvlint = require('../csvlint');
var fs = require('fs');

// describe('should test test1.csv, test1_err.csv file', function() {
// 	it('should test test1.csv file', function() {
		var rs = fs.createReadStream('./test/test5.csv');
		rs.pipe(csvlint());
	// });

	// it('should test test1_err.csv file', function() {
		// var rs_err = fs.createReadStream('./test/test1_err.csv');
		// rs_err.pipe(csvlint())
// })
