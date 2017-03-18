import { Component } from 'angular2/core'
import { ClientService } from './client.service'

@Component({
    selector: 'clients',
    template: `
        <h2>Clients </h2>
        <ul>
            <li *ngFor='#client of clients'>
                {{ client.name }}
                {{ client.api_key }}
                <a [routerLink]="['/Data']">Details</a>
            </li>
        </ul>
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