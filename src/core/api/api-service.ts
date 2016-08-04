import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CLIENT_ID_PARAM, PAGINATION_PARAMS } from 'src/core/constants';
import { RequestArgs, RequestOptions } from './interfaces';


@Injectable()
export class ApiService {
  constructor(private http: Http) {}

  fetch(url: string): Observable<any> {
    return this.request({url});
  }

  request(options: RequestOptions): Observable<any> {
    const req = new Request(this.requestArgs(options));
    return this.http.request(req)
      .map((res: Response) => res.json());
  }

  requestArgs(options: RequestOptions): RequestArgs {
    const { method, paginate, url } = options;
    let search = [];

    if (!url.includes(CLIENT_ID_PARAM)) search.push(CLIENT_ID_PARAM);
    if (paginate) search.push(PAGINATION_PARAMS);

    return {
      method: method || RequestMethod.Get,
      search: search.join('&'),
      url
    };
  }
}
