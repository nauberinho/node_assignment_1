/**
 * Created by naube on 2017-09-12.
 */

    var socket = io();

    var totalVotes;

    console.log('d3.select("svg")getBoundingClientRect().width: ' + d3.select('svg'))

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

        d3.select('.val-info-div').data(data).append('text').text('Total votes: ' + totalVotes)


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
            .on("mouseover", function (d) {
                d3.select(this).raise()
                    .append('text')
                    .attr('class', 'parti-text')
                    .style('text-anchor', 'middle')
                    .style('font-size', '2em')
                    .attr('color', function(d){
                        return d.color
                    })
                    .attr('alignment-baseline', "central")
                    .attr('dx', 50)
                    .attr('dy', 50)

                    .html(function (d) {
                        return String(d.votes)
                    })
            })
            .on("mouseout", function () {
                d3.selectAll(".parti-text").remove()
            });


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
                return 4 * d.x_cordinate;
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

            for(var obj in msg.result){
                console.log('totalVotes: ' + totalVotes)
                totalVotes = msg.totalVotes;
                d3.select("#" + msg.result[obj].parti)
                    .attr('r', function (d) {
                        return (msg.result[obj].votes / totalVotes) * 200;
                    })

            }





    })
})








