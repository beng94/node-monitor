import {Component} from 'angular2/core';
import {DataComponent} from './data.component';
import {RouteConfig,  ROUTER_DIRECTIVES} from 'angular2/router';

import { ClientComponent } from './client.component';

@Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1><router-outlet></router-outlet>',
    directives: [DataComponent, ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/data', component: DataComponent },
    { path: '/client', component: ClientComponent }
])
export class AppComponent { }
