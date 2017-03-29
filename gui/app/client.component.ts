import { Component } from 'angular2/core'
import { ClientService } from './client.service'

@Component({
    selector: 'clients',
    template: `
    <style>
    .nopadding {
       padding: 0 !important;
       margin: 10 !important;
    }

    .btn-client {
        width: 49%;
    }

    .btn-header {
        background-color: #286090;
    }

    .red {
        color: red;
    }

    .glyphicon {
        font-size: 25px;
    }

    </style>

    <div class="container">
        <div class="row">
            <div class="panel panel-primary col-lg-8 nopadding">
                <div class="panel-heading">
                    <h2>
                        <span>Clients</span>
                        <button class="btn btn-primary btn-header pull-right" (click)="onNew($event)">Create new</button>
                    </h2>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row">
            <div class="panel panel-default col-lg-4 nopadding" *ngFor='#client of newClients'>
                <div class="panel-heading">
                    <h4 class="panel-title"> {{ client.name }} </h4>
                </div>
                <div class="panel-body">
                        <form class="form-inline">
                            <div class="form-group">
                                <label class="control-label">Name</label>
                                <div class="input-group">
                                    <input type="text" [(ngModel)]="client.name"/>
                                </div>
                            </div>
                        </form>
                    <a class="btn btn-client btn-primary center" name="{{ client.name }}"(click)="onSaveNew($event)">Save</a>
                    <a class="btn btn-client btn-primary center" name="{{ client.name }}"(click)="onDeleteNew($event)">Delete</a>
                </div>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="row">
            <div class="panel panel-default col-lg-4 nopadding" *ngFor='#client of clients'>
                <div class="panel-heading">
                        <span>{{client.name }}</span>
                        <a id="{{ client._id }}" name="{{ client.name }}" (click)="onDelete($event)" class="glyphicon glyphicon-remove-sign pull-right red"></a>
                </div>
                <div class="panel-body">
                    <a class="btn btn-client btn-primary center" [routerLink]="['/Data', {id: client._id}]">Details</a>
                    <a class="btn btn-client btn-primary center" [routerLink]="['/Config', {id: client._id}]">Config</a>
                </div>
            </div>
        </div>
    </div>
    `,
    providers: [ClientService]
})
export class ClientComponent {
    newClients;
    clients;
    JSON;

    constructor(private clientService: ClientService) {
        this.JSON = JSON;
        this.newClients = [];
        this.refresh();
    }

    refresh() {
        this.clientService.getClients()
            .subscribe(
            clients => {
                this.clients = clients;
            }
        );
    }

    findNewClientIndex(name) {
        for(var i = 0; i < this.newClients.length; i++) {
            var client = this.newClients[i];
            if(client.name === name) {
                return i;
            }
        }

        return -1;
    }

    findClientIndex(client) {
        for(var i = 0; i < this.clients.length; i++) {
            var cli = this.clients[i];
            if(client.name === cli.name &&
               client._id === cli._id) {
                return i;
            }
        }

        return -1;
    }

    onNew(event) {
        this.newClients.push({});
        console.log('New called');
    }

    onSaveNew(event) {
        console.log("Save new");

        var target = event.target || evenet.srcElement || event.currentTarget;
        var name = target.attributes.name.value;
        var index = this.findNewClientIndex(name);
        var client = this.newClients[index];

        this.clientService.postClient(client)
        .subscribe(
            client => {
                this.newClients.splice(index, 1);
                this.refresh();
            }
        );

    }

    onDeleteNew(event) {
        console.log("Delete new");
        var target = event.target || evenet.srcElement || event.currentTarget;
        var name = target.attributes.name.value;
        var index = this.findNewClientIndex(name);

        this.newClients.splice(index, 1);
    }

    onDelete(event) {
        console.log("Delete called");

        var target = event.target || evenet.srcElement || event.currentTarget;
        var id = target.attributes.id.value;
        var name = target.attributes.name.value;
        var client = {
            _id: id,
            name: name
        };
        var index = this.findClientIndex(client);

        this.clientService.deleteClient(id)
        .subscribe(
            response => {
                this.clients.splice(index, 1);
            }
        );
    }
}
