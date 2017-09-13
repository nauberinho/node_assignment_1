/**
 * Created by naube on 2017-09-07.
 */
var express = require('express');
var app = require('express')();
var d3 = require('d3');

var http = require('http');
    var server = http.Server(app);
        var io = require('socket.io')(server);


const pug = require('pug');
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//ROUTES
app.get('/', (req, res) => {res.render('index')})
app.get('/vote', (req, res) => {res.render('vote')})
app.get('/result', (req, res) => {res.render('result')})

function valLokal () {
        this.socialdemokraterna = 0,
        this.centerpartiet = 0,
        this.sverigedemokraterna = 0,
        this.openchurch = 0
}

    var Vasakyrkan = new valLokal(),
        Masthuggskyrkan = new valLokal(),
        Gårdstenskyrkan = new valLokal(),
        Kortedalakyrkan = new valLokal();

var totalVotes = 110000;

var result = [

    {
        parti: 'socialdemokraterna',
        votes: 10000,
        vasakyrkan: 0,
        masthugsskyrkan: 0,
        kortedalakyrkan: 0,
        gardstenskyrkan: 0,
        x_cordinate: 40,
        y_cordinate: 10,
        color: '#af3022'
    },

     {
         parti: 'centerpartiet',
         votes: 30000,
         vasakyrkan: 0,
         masthugsskyrkan: 0,
         kortedalakyrkan: 0,
         gardstenskyrkan: 0,
         x_cordinate: 70,
         y_cordinate: 10,
         color: '#af5223'
    },
    {
        parti: 'sverigedemokraterna',
        votes: 50000,
        vasakyrkan: 0,
        masthugsskyrkan: 0,
        kortedalakyrkan: 0,
        gardstenskyrkan: 0,
        x_cordinate: 100,
        y_cordinate: 10,
        color: '#dd9624'
    },
    {
        parti: 'oppnakyrkan',
        votes: 20000,
        vasakyrkan: 0,
        masthugsskyrkan: 0,
        kortedalakyrkan: 0,
        gardstenskyrkan: 0,
        x_cordinate: 130,
        y_cordinate: 10,
        color: '#ddda25'
    }
]

console.log('result: ' + {result: result, totalVotes: totalVotes})

io.on('connection', function(socket) {
    io.emit('initRendering', {result: result, totalVotes: totalVotes});
    socket.on('saveVote', function (msg) {
        for(var obj in result){
            if(result[obj].parti == msg.parti){

                result[obj].votes += Number(msg.votes);
                totalVotes += Number(msg.votes);

            }
        }
        io.emit('voteSaved', {result: result, totalVotes: totalVotes});
    });
})

server.listen(3000, () => {
    console.log("Nu lyssnar vi på 3000.");
})











