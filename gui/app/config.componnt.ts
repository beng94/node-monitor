import { Component } from 'angular2/core';
import { ConfigService } from './config.service';
import { RouteParams } from 'angular2/router';

@Component({
    selector: 'data',
    template: `
        <h2>Configuration</h2>
        <ul>
            <li *ngFor='#conf of configs'>
                {{ conf.name }}
                {{ conf.interval }}
                {{ conf.script }}
            </li>
        </ul>
        `,
    providers: [ConfigService]
})
export class ConfigComponent {
    configs;
    JSON;

    constructor(private route: RouteParams, configService: ConfigService) {
        this.JSON = JSON;
        configService.getConfigs(this.route.get('id'))
            .subscribe(
            configs => this.configs = configs;
        );
    }
}
