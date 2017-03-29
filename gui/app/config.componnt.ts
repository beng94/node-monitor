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

            .btn-header {
                background-color: #286090;
            }

        </style>


        <div class="container">
            <div class="row">
                <div class="panel panel-primary nopadding">
                    <div class="panel-heading">
                        <h2>
                            <span>Configuration</span>
                            <button class="btn btn-primary btn-header pull-right" (click)="onNew($event)">Create new</button>
                        </h2>
                    </div>
                </div>
            </div>
        </div>

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

                        <button class="btn btn-primary" (click)="onSave($event)">Save</button>
                        <button class="btn btn-danger" (click)="onDelete($event)" id="{{ conf._id}}" name="{{ conf.name }}">Delete</button>
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
        this.refresh();
    }

    refresh() {
        this.configService.getConfigs(this.route.get('id'))
            .subscribe(
            configs => {
                console.log("refreshed");
                this.configs = configs;
            }
        );
    }

    onNew(event) {
        var newConfig = {
            name: "",
            interval: 5000,
            script: "'test return'"
        };
        this.configs.unshift(newConfig);
    }

    onSave(event) {
        this.configService.postConfigs(this.route.get('id'), this.configs)
        .subscribe(
            response => {
                console.log(response);
                this.refresh();
            });
    }

    findConfig(config) : number {
        for(var i = 0; i < this.configs.length; i++) {
            var conf = this.configs[i];
            if(conf.name === config.name &&
               conf._id === config.name) {
               return i;
            }
        }

        return -1;
    }

    onDelete(event) {
        var target = event.target || evenet.srcElement || event.currentTarget;
        var conf = {
            _id: target.attributes.id.value,
            name: target.attributes.name.value
        };

        /* New config is being deleted */
        if(!conf._id) {
            var index = this.findConfig(conf);
            this.configs.splice(index, 1);

            return;
        }

        this.configService.deleteConfig(conf._id)
        .subscribe(
            response => {
                console.log(response);
                var index = this.findConfig(conf);
                this.configs.splice(index, 1);
            }
        );
    }
}
