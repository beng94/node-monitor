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

    .btn {
        width: 49%;
    }
    </style>

    <h2>Clients </h2>
    <div class="container">
        <div class="row">
            <div class="panel panel-default col-lg-4 nopadding" *ngFor='#client of clients'>
                <div class="panel-heading">
                    <h4 class="panel-title"> {{ client.name }} </h4>
                </div>
                <div class="panel-body">
                    <a class="btn btn-primary center" [routerLink]="['/Data', {id: client._id}]">Details</a>
                    <a class="btn btn-primary center" [routerLink]="['/Config', {id: client._id}]">Config</a>
                </div>
            </div>
        </div>
    </div>
    `,
    providers: [ClientService]
})
export class ClientComponent {
    clients;
    JSON;

    constructor(clientService: ClientService) {
        this.JSON = JSON;
        clientService.getClients()
            .subscribe(
            clients => {
                this.clients = clients;
            }
        );
    }
}
