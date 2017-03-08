import {Component} from 'angular2/core'
import {DataService} from './data.service'

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

    constructor(dataService: DataService) {
        this.JSON = JSON;
        dataService.getDatas()
            .subscribe(
                datas => this.datas = datas
        )
    }
}
