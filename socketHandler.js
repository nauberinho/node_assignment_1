/**
 * Created by naube on 2017-09-12.
 */

    var socket = io();

    var totalVotes;

    console.log('d3.select("svg")getBoundingClientRect().width: ' + d3.select('svg'))

//Listen for clickEvent on submit button and collect values
     $('#submit').click(function(){
         var payload = {
             parti: $('#parti').val(),
             vallokal: $('#vallokal').val(),
             votes: $('#votes').val()
         };
         console.log(payload)
         socket.emit('saveVote', payload);
         return false;
     });

    // Initial render

    socket.on('initRendering', function(msg) {

        console.log('init: ' + msg)
        console.log('data= ' + msg.result)
        var data = msg.result;
        totalVotes = msg.totalVotes;



        var svg = d3.select("div#container")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "-250 -200 1700 500")
            .classed("svg-content", true)

        .append('text')
            .attr('class','val-info-div')
            .html('Total votes: ' + totalVotes)
            .attr('fill', 'grey')
            .attr('font-size', '2.2em')


        var objects = d3.select("svg")
            .selectAll('g')
            .data(data)
            .enter()
            .append("g")
            .attr("class", "Object")
            .attr("cursor", "pointer")
            .attr('tranform', function (d) {
                return "translate(" + "10 *" + d.y_cordinate + ", 10 * " + d.x_cordinate + ")"
            })
            .on("click", function (d) {
                if (d3.selectAll(".parti-text")) {
                    d3.selectAll(".parti-text").remove()
                }

                d3.select(this).raise()
                    .append('text')
                    .attr('class', 'parti-text')
                    .attr('margin', 'auto')
                    .style('text-anchor', 'middle')
                    .style('font-size', '2em')
                    .attr('color', function (d) {
                        return d.color
                    })
                    .attr('alignment-baseline', "central")
                    .attr('dx', 250)
                    .attr('dy', 50)

                    .html(function (d) {
                        return d.parti.charAt(0).toUpperCase() + d.parti.slice(1) + ': ' + String(d.votes) + ' votes'
                    })
                    .data(data)
                    .enter(data)
                    .append('ul')
                    .html(function (d) {
                        for (var vallokal in d.vallokaler) {
                            return vallokal + ': ' + d.vallokaler[vallokal]
                        }

                    })

                    .on("mouseout", function () {

                    });
            })


        objects.append('circle')
            .attr('class', 'circle')
            .attr('id', function(d){
                return d.parti
            })

            .attr('r', function (d) {
                console.log('radie: ' + d.votes / totalVotes * 200)
                return (d.votes / totalVotes) * 200;
            })
            .attr('cx', function (d) {
                return 3 * d.x_cordinate;
            })
            .attr('cy', function (d) {
                return 20 * d.y_cordinate;
            })
            .attr('fill', function (d) {
                return d.color;
            })
            .attr('stroke-width', 5)
            .on("mouseover", function () {
            d3.select(this).style('stroke', 'lightgrey');
            })
            .on("mouseout", function () {
                d3.select(this).style('stroke', 'transparent');
            });

        socket.on('voteSaved', function(msg){
            d3.select('.val-info-div').text('Total votes: ' + msg.totalVotes)


            for(var obj in msg.result){
                if(msg.result[obj].parti == msg.changedParty){
                    d3.select('#' + msg.changedParty)
                        .transition()
                        .duration(300)
                        .attr('r', function (d) {
                            return (msg.result[obj].votes / totalVotes) * 250
                        })
                        .attr('stroke', 'green')
                        .attr('stroke-width', '2')
                        .transition()
                        .duration(300)
                        .attr('r', function (d) {
                            return (msg.result[obj].votes / totalVotes) * 200
                        })
                        .attr('stroke-width', '5')
                        .attr('stroke', 'green')

                }
                console.log('totalVotes: ' + totalVotes)
                totalVotes = msg.totalVotes;
                d3.select("#" + msg.result[obj].parti)


                d3.select("#" + msg.result[obj].parti)
                    .attr('r', function (d) {
                        return (msg.result[obj].votes / totalVotes) * 200;
                    })
            }
    })
})








