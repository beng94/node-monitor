import {Component, OnInit} from 'angular2/core';
import {DataService} from './data.service';
import { RouteParams} from 'angular2/router';

@Component({
    selector: 'data',
    template: `
        <style>
            thead th {
              background-color: #006DCC;
              color: white;
            }

            .nopadding {
                padding: 0 !important;
                margin: 30 !important;
            }
        </style>


        <h2>Data tag</h2>
		<svg></svg>
                <div class="panel panel-primary nopadding">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Payload</th>
                            </tr>
                        </thead>
                        <tbody *ngFor='#data of datas'>
                            <tr [ngClass]="{info: data.new}" >
                                <td>{{ data.name }}</td>
                                <td>{{ data.time }}</td>
                                <td>{{ JSON.stringify(data.paylog) }}</td>
                            </tr>
                        </tbody>
                    </table>
        </div>
        `,
    providers: [DataService]
})
export class DataComponent implements OnInit {
    datas;
    JSON;
    graphData;

    setPayloadTimer(payload) {
        payload.new = true;
        setTimeout(function() {
            payload.new = false;
        }, 5000);
    }

    maxSamples = 10;

    getRandomColor() {
        const colors = ["red", "blue", "green", "yellow", "pink", "orange"];
        const id = Math.floor(Math.random() * colors.length);
        const color = colors[id];
        console.log(color);
        return color;
    }

    refreshGraphData(data) {
        var paylog = data["paylog"];
        var name = data["name"];

        let update = false;
        let freshFields = [];
        if(!isNaN(paylog)) {
            update = true;
            if(this.graphData[name] == undefined) {
                this.graphData[name] = {};
                this.graphData[name].data = [];
                this.graphData[name].color = this.getRandomColor();
            }

            var dataSet = this.graphData[name].data;
            dataSet.push(paylog);
            if(dataSet.length > this.maxSamples + 1) {
                dataSet.shift();
            }

            freshFields.push(name);
        }

        if(update) {
            this.drawGraph();
        }
    }

    constructor(private route: RouteParams, dataService: DataService) {
        this.JSON = JSON;
        dataService.getDatas(this.route.get('id'))
            .subscribe(
            datas => {
                this.datas = [];
                this.graphData = {};
                for(var i = 0; i < datas.payload.length; i++) {
                    var payload = datas.payload[i].data;
                    this.setPayloadTimer(payload);
                    this.datas.push(payload);
                }
                this.datas.sort(function(a, b) {
                    if(a.time < b.time) return 1;
                    if(a.time > b.time) return -1;
                    return 0;
                });

                let socketTag = datas.socket;
                dataService.watchSocket(socketTag).subscribe(
                datas => {
                    var payload = datas.data;
                    this.setPayloadTimer(payload);
                    this.datas.unshift(payload);
                    this.refreshGraphData(payload);
                });
            }
        );
    }

    w = 400;
    h = 200;
    vis = {};

    drawGraph() {
        const divBorders = d3.select("div").node().getBoundingClientRect();
        this.margin = divBorders.x;
        this.w = divBorders.width - 2 * this.margin;
        var y = d3.scale.linear().domain([0, 10]).range([0 + this.margin, this.h - this.margin]);
        var x = d3.scale.linear().domain([0, this.maxSamples]).range([0 + this.margin, this. w - this.margin]);

        d3.select("svg").selectAll("g").remove();
        var line = d3.svg.line()
            .x(function(d,i) { return x(i); })
            .y(function(d) { return -1 * y(d); })

        this.vis = d3.select("svg")
            .attr("width", this.w)
            .attr("height", this.h);

        var g = this.vis.append("g")
            .attr("transform", "translate(" + divBorders.x + ", 200)");

        for(let topic in this.graphData) {
            const stream = this.graphData[topic];
            g.append("svg:path")
                .attr("d", line(stream.data))
                .attr("fill", "none")
                .attr("stroke", stream.color)
        }

        g.selectAll(".xLabel")
            .data(x.ticks(5))
            .enter().append("svg:text")
            .attr("class", "xLabel")
            .text(String)
            .attr("x", function(d) { return x(d) })
            .attr("y", 0)
            .attr("text-anchor", "middle")

        g.selectAll(".yLabel")
            .data(y.ticks(4))
            .enter().append("svg:text")
            .attr("class", "yLabel")
            .text(String)
            .attr("x", 0)
            .attr("y", function(d) { return -1 * y(d) })
            .attr("text-anchor", "right")
            .attr("dy", 4)

        g.selectAll(".xTicks")
            .data(x.ticks(5))
            .enter().append("svg:line")
            .attr("class", "xTicks")
            .attr("x1", function(d) { return x(d); })
            .attr("y1", -1 * y(0))
            .attr("x2", function(d) { return x(d); })
            .attr("y2", -1 * y(-0.3))

        g.selectAll(".yTicks")
            .data(y.ticks(4))
            .enter().append("svg:line")
            .attr("class", "yTicks")
            .attr("y1", function(d) { return -1 * y(d); })
            .attr("x1", x(-0.3))
            .attr("y2", function(d) { return -1 * y(d); })
            .attr("x2", x(0))
    }
}
