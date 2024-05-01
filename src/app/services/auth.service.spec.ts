import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';

describe('AuthService', () => {
  let service: AuthService;

  // 依存サービスのモック
  let authSpy: Auth;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('Auth', ['signOut']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: authSpy }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('signIn メソッドのテスト', (done) => {
    done.fail();
  });

  it('signOut メソッドのテスト', () => {
    service.signOut();
    expect(authSpy.signOut).toHaveBeenCalled();
  });
});
