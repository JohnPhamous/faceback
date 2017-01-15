var express = require('express')
var path = require('path')
var compression = require('compression')

var app = express();

app.use(compression())
app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

var PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Magic happens on localhost:${ PORT }`)
})
