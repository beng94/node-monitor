import {bootstrap}    from 'angular2/platform/browser';
import { provide } from 'angular2/core';
import {AppComponent} from './app.component';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import { APP_BASE_HREF } from 'angular2/router';

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, {useValue: '/'})
]);
