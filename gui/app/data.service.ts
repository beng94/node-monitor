import {Http, Response, RequestOptions, Headers, Request, RequestMethod} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Injectable} from 'angular2/core';

import 'rxjs/Rx';

@Injectable()
export class DataService {

    constructor(private http: Http) {

    }

    getDatas() : Observable<Object> {
        let url = 'http://localhost:3000/data';
        let headers = new Headers({ 'Content-type': 'application/json' });
        let body =  JSON.stringify({ clientId: "58b2129df96aa153315b2813"});
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, body, options)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
}
