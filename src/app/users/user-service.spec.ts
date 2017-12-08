import { TestBed } from '@angular/core/testing';
import { testUtils } from 'app/utils/test';
import { UserService } from './user-service';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ApiService } from '../core/services/api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';


describe('users', () => {
  describe('UserService', () => {
    let service: UserService;
    let apiService: ApiService;
    let testUserData;


    beforeEach(() => {
      let injector = TestBed.configureTestingModule({
        providers: [
          UserService,
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
        ]
      });

      service = injector.get(UserService);
      apiService = injector.get(ApiService);

      testUserData = testUtils.createUser(1);
    });


    describe('currentUser$ observable', () => {
      it('should emit the current user from UsersState', () => {
        let user = null;
        let testUserData2 = testUtils.createUser(456);

        service.currentUser$.subscribe(value => {
          user = value;
        });

        spyOn(apiService, 'fetchUser').and
          .returnValues(Observable.of(testUserData), Observable.of(testUserData2));

        // load user
        service.loadUser(1);

        expect(user.id).toBe(1);

        // load different user
        service.loadUser(2);
        expect(user.id).toBe(456);
      });
    });

  });
});
