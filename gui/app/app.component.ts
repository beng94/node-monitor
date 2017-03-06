import {Component} from 'angular2/core';
import {DataComponent} from './data.component'

@Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1><data></data>',
    directives: [DataComponent]
})
export class AppComponent { }
