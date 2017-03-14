import {Http, Response, RequestOptions, Headers, Request, RequestMethod} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Injectable} from 'angular2/core';

import 'rxjs/Rx';
import * as io from 'socket.io-client';

@Injectable()
export class DataService {

    private socket;

    constructor(private http: Http) {}

    getDatas() : Observable<Object> {
        let url = 'http://localhost:3000/data';
        let headers = new Headers({ 'Content-type': 'application/json' });
        let body =  JSON.stringify({ clientId: "58c44cfa81371cad1bba2cf5"});
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, body, options)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }

    watchSocket(socketTag) : Observable<Object> {
        let observable = new Observable(observer => {
            this.socket = io.connect('http://localhost:3001');
            this.socket.on(socketTag, (data) => observer.next(data));

            return () => this.socket.disconnect();
        });

        return observable;
    }
}
