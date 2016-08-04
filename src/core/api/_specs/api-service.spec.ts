import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { API_BASE_URL, CLIENT_ID_PARAM, PAGINATION_PARAMS } from 'src/core/constants';
import { ApiService } from '../api-service';
import { PaginatedData } from '../interfaces';


describe('api', () => {
  describe('ApiService', () => {
    let backend: MockBackend;
    let service: ApiService;


    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        ApiService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend: ConnectionBackend, options: BaseRequestOptions): Http => {
            return new Http(backend, options);
          }
        }
      ]);

      backend = injector.get(MockBackend);
      service = injector.get(ApiService);
    });


    afterEach(() => backend.verifyNoPendingRequests());


    describe('requestArgs()', () => {
      it('should set RequestArgs.url with provided url', () => {
        let requestArgs = service.requestArgs({url: API_BASE_URL});
        expect(requestArgs.url).toBe(API_BASE_URL);
      });

      it('should add client id param to RequestArgs.search', () => {
        let requestArgs = service.requestArgs({url: API_BASE_URL});
        expect(requestArgs.search).toMatch(CLIENT_ID_PARAM);
      });

      it('should NOT add client id param to RequestArgs.search if url already contains client id', () => {
        let requestArgs = service.requestArgs({url: `${API_BASE_URL}?${CLIENT_ID_PARAM}`});
        expect(requestArgs.search).not.toMatch(CLIENT_ID_PARAM);
      });

      it('should add pagination params to RequestArgs.search if RequestOptions.paginate is true', () => {
        let requestArgs = service.requestArgs({paginate: true, url: API_BASE_URL});
        expect(requestArgs.search).toMatch(PAGINATION_PARAMS);
      });

      it('should NOT add pagination params to RequestArgs.search by default', () => {
        let requestArgs = service.requestArgs({url: API_BASE_URL});
        expect(requestArgs.search).not.toMatch(PAGINATION_PARAMS);
      });

      it('should set RequestArgs.method to RequestMethod.Get by default', () => {
        let requestArgs = service.requestArgs({url: API_BASE_URL});
        expect(requestArgs.method).toEqual(RequestMethod.Get);
      });

      it('should set RequestArgs.method with provided method', () => {
        let requestArgs = service.requestArgs({method: RequestMethod.Post, url: API_BASE_URL});
        expect(requestArgs.method).toEqual(RequestMethod.Post);
      });
    });


    describe('requests', () => {
      let paginatedDataResponse;

      beforeEach(() => {
        paginatedDataResponse = new Response(new ResponseOptions({
          body: JSON.stringify({collection: []})
        }));
      });

      describe('fetch()', () => {
        it('should perform GET request to provided url', () => {
          backend.connections.subscribe((c: MockConnection) => {
            expect(c.request.method).toBe(RequestMethod.Get);
            expect(c.request.url).toMatch(API_BASE_URL);
            expect(c.request.url).toMatch(CLIENT_ID_PARAM);
          });

          service.fetch(API_BASE_URL);
        });

        it('should return response data', () => {
          backend.connections.subscribe((c: MockConnection) => c.mockRespond(paginatedDataResponse));
          service.fetch(API_BASE_URL)
            .subscribe((res: PaginatedData) => {
              expect(res).toBeDefined();
              expect(Array.isArray(res.collection)).toBe(true);
            });
        });
      });
    });
  });
});
