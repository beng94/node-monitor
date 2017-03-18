import {Component} from 'angular2/core';
import {DataService} from './data.service';
import { RouteParams} from 'angular2/router';

@Component({
    selector: 'data',
    template: `
        <h2>Data tag</h2>
        <ul>
            <li *ngFor='#data of datas'>
                {{data._id}}
                {{data.clientId}}
                {{JSON.stringify(data.data)}}
            </li>
        </ul>
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
                this.datas = datas.datas;
                let socketTag = datas.socket;
                dataService.watchSocket(socketTag).subscribe(
                data => {
                    console.log('Socket data received: ', data);
                    var payload = {
                        data: data
                        };
                    this.datas.push(payload);
                });
            }
        );
    }
}
