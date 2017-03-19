import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from 'angular2/http';
import { Observable} from 'rxjs/Observable';
import { Injectable} from 'angular2/core';

import 'rxjs/Rx';

@Injectable()
export class ConfigService {

    constructor(private http: Http) {}

    getConfigs(id) : Observable<Object> {
        let url = 'http://localhost:3000/config/' + id;
        let headers = new Headers({ 'Content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(url, {}, options)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }
}
