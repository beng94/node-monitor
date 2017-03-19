import { Component } from 'angular2/core';
import { RouteConfig,  ROUTER_DIRECTIVES } from 'angular2/router';

import { ClientComponent } from './client.component';
import { DataComponent } from './data.component';
import { ConfigComponent } from './config.componnt';

@Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1><router-outlet></router-outlet>',
    directives: [DataComponent, ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/data/:id', component: DataComponent, name: 'Data'},
    { path: '/client', component: ClientComponent },
    { path: '/config/:id', component: ConfigComponent, name: 'Config' }
])
export class AppComponent { }
