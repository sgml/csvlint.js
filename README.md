# CSVLint

Linting CSV file and report warnings or errors, implementing specification rfc4180.

http://tools.ietf.org/html/rfc4180

## Origin

CSV files are using in various of fields like Scientests, programmers, and ... . Because of the popularity of `CSV`, having a right convention is really important. So this is `CSVLint` come up with.

## Install

```javascript
npm install csvlint
```

## Usage

```javascript
var rs = fs.createReadStream('./test/test6.csv');
var ws = fs.createWriteStream('./test/output.csv');
var csvlint = csvlint();
rs.pipe(csvlint).pipe(ws);

csvlint.on('readable', function() {
})

csvlint.on('data', function(data) {
    console.log(data)
})
```

Using `CSVlint` you could pipe into another stream after lint is done. As the sample above after linting pipe into a write stream to file `./test/output.csv`

## Options (csvlint(options))

Options are optional. 

- encoding: default to `utf8`
- delimiter: default to `,`
- newlint: default to `\n`
- quote: default to `\"`

## Definitions

For definitions we implement the definition in `rfc4180`

1.  Each record is located on a separate line, delimited by a line break (CRLF).

2.  The last record in the file may or may not have an ending line break.

3.  There maybe an optional header line appearing as the first line of the file with the same format as normal record lines.  This header will contain names corresponding to the fields in the file and should contain the same number of fields as the records in the rest of the file (the presence or absence of the header line should be indicated via the optional "header" parameter of this MIME type). 

4.  Within the header and each record, there may be one or more fields, separated by commas.  Each line should contain the same number of fields throughout the file.  Spaces are considered part of a field and should not be ignored.  The last field in the record must not be followed by a comma.

5.  Each field may or may not be enclosed in double quotes (however some programs, such as Microsoft Excel, do not use double quotes at all).  If fields are not enclosed with double quotes, then double quotes may not appear inside the fields.

6.  If double-quotes are used to enclose fields, then a double-quote appearing inside a field must be escaped by preceding it with another double quote.

## Inspired by

http://csvlint.io/ 

## License

MIT
