///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>
///<reference path="../../node_modules/angular2/typings/es6-collections/es6-collections.d.ts"/>
///<reference path="../../node_modules/angular2/typings/es6-promise/es6-promise.d.ts"/> 

import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {FORM_PROVIDERS} from 'angular2/common';

import {AppComponent} from './app.component';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    FORM_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy })]);
