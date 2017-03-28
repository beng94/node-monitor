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
                        <form class="form-inline">
                            <div class="form-group">
                                <label class="control-label">Name</label>
                                <br>
                                <div class="input-group">
                                    <input type="text" [(ngModel)]="conf.name"/>
                                </div>
                            </div>
                        </form>

                        <form class="form-inline">
                            <div class="form-group">
                                <label class="control-label">Interval</label>
                                <br>
                                <div class="input-group">
                                    <input type="number" class="form-control" [(ngModel)]="conf.interval"/>
                                    <span class="input-group-addon">ms</span>
                                </div>
                            </div>
                        </form>

                        <form class="form-inline">
                            <div class="form-group">
                                <label class="control-label">Script</label>
                                <br>
                                <div class="input-group">
                                    <textarea [(ngModel)]="conf.script"></textarea>
                                </div>
                            </div>
                        </form>

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
