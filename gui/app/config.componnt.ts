import { Component } from 'angular2/core';
import { ConfigService } from './config.service';
import { RouteParams } from 'angular2/router';
import { FormsModule } from 'angular2/forms';

@Component({
    selector: 'data',
    template: `
        <h2>Configuration</h2>
        <ul>
            <li *ngFor='#conf of configs'>
                <input type="text" [(ngModel)]="conf.name">
                <input type="number" [(ngModel)]="conf.interval">
                <input type="text" [(ngModel)]="conf.script">
            </li>
        </ul>
        <button (click)="onSave($event)">Save</button>
        `,
    providers: [ConfigService]
})
export class ConfigComponent {
    configs;
    JSON;

    constructor(private route: RouteParams, private configService: ConfigService) {
        this.JSON = JSON;
        this.configService.getConfigs(this.route.get('id'))
            .subscribe(
            configs => this.configs = configs;
        );
    }

    onSave(event) {
        this.configService.postConfigs(this.route.get('id'), this.configs)
        .subscribe(
            response => console.log(response);
        );
    }
}
