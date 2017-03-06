import {Component} from 'angular2/core'
import {DataService} from './data.service'

@Component({
    selector: 'data',
    template: `
        <h2>Data tag</h2>
        <ul>
            <li *ngFor='#data of datas'>
                {{data}}
            </li>
        </ul>
        `,
    providers: [DataService]
})
export class DataComponent {
    datas;

    constructor(dataService: DataService) {
        this.datas = dataService.getDatas();
    }
}
