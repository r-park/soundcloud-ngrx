import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { API_TRACKS_URL, CLIENT_ID_PARAM, PAGINATION_PARAMS } from 'src/core/constants';
import { PaginatedData, RequestArgs, RequestOptions } from './interfaces';


@Injectable()
export class ApiService {
  constructor(private http: Http) {}

  fetch(url: string): Observable<any> {
    return this.request({url});
  }

  fetchSearchResults(query: string): Observable<PaginatedData> {
    return this.request({
      paginate: true,
      query: `q=${query}`,
      url: API_TRACKS_URL
    });
  }

  request(options: RequestOptions): Observable<any> {
    const req: Request = new Request(this.requestArgs(options));
    return this.http.request(req)
      .map((res: Response) => res.json());
  }

  requestArgs(options: RequestOptions): RequestArgs {
    const { method, paginate, query, url } = options;
    let search: string[] = [];

    if (!url.includes(CLIENT_ID_PARAM)) search.push(CLIENT_ID_PARAM);
    if (paginate) search.push(PAGINATION_PARAMS);
    if (query) search.push(query);

    return {
      method: method || RequestMethod.Get,
      search: search.join('&'),
      url
    };
  }
}
