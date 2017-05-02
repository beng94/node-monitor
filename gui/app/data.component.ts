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

    setPayloadTimer(payload) {
        payload.new = true;
        setTimeout(function() {
            payload.new = false;
        }, 5000);
    }

    constructor(private route: RouteParams, dataService: DataService) {
        this.JSON = JSON;
        dataService.getDatas(this.route.get('id'))
            .subscribe(
            datas => {
                this.datas = [];
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
                });
            }
        );
    }

    ngOnInit() {
        var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 7],
        w = 400,
        h = 200,
        margin = 20,
        y = d3.scale.linear().domain([0, d3.max(data)]).range([0 + margin, h - margin]),
        x = d3.scale.linear().domain([0, data.length]).range([0 + margin, w - margin])

        var vis = d3.select("svg")
            .attr("width", w)
            .attr("height", h);

        var g = vis.append("svg:g")
            .attr("transform", "translate(0, 200)");

        var line = d3.svg.line()
            .x(function(d,i) { return x(i); })
            .y(function(d) { return -1 * y(d); })

        g.append("svg:path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", "blue";

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
