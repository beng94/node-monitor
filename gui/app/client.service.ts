import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from 'angular2/core';

import 'rxjs/Rx';

@Injectable()
export class ClientService {

    constructor(private http: Http) {}

    getClients() : Observable<Object> {
        let url = 'http://localhost:3000/client';
        let headers = new Headers({ 'Content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(url, {}, options)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }

    postClient(client) : Observable<Object> {
        let url = 'http://localhost:3000/client';
        let headers = new Headers({ 'Content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(client);

        return this.http.post(url, body, options)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json() || 'Server error'));

    }
}
