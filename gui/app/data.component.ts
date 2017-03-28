import {Component} from 'angular2/core';
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
                <div class="panel panel-primary nopadding">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Payload</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor='#data of datas'>
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
export class DataComponent {
    datas;
    JSON;

    constructor(private route: RouteParams, dataService: DataService) {
        this.JSON = JSON;
        dataService.getDatas(this.route.get('id'))
            .subscribe(
            datas => {
                this.datas = [];
                for(var i = 0; i < datas.payload.length; i++) {
                    var payload = datas.payload[i].data;
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
                    this.datas.unshift(payload);
                });
            }
        );
    }
}
