import { Component } from 'angular2/core';
import { ConfigService } from './config.service';
import { RouteParams } from 'angular2/router';
import { FormsModule } from 'angular2/forms';

@Component({
    selector: 'data',
    template: `
        <style>
            /* Remove spinner from number input */
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            input[type="number"] {
                -moz-appearance: textfield;
            }

        </style>

        <h2>Configuration</h2>
        <div class="container">
            <div class="row">
                <div class="panel panel-primary colg-lg-4 nopadding" *ngFor='#conf of configs'>
                    <div class="panel-heading">
                        <h4 class="panel-title">{{ conf.name }}</h4>
                    </div>
                    <div class="panel-body">
                        <p>
                            <label>Name</label>
                            <br>
                            <input type="text" [(ngModel)]="conf.name">
                        </p>
                        <p>
                            <label>Interval</label>
                            <br>
                            <input type="number" [(ngModel)]="conf.interval">
                        </p>
                        <p>
                            <label>Script</label>
                            <br>
                            <textarea [(ngModel)]="conf.script"></textarea>
                        </p>
                        <p>
                            <button class="btn btn-primary" (click)="onSave($event)">Save</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>

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
