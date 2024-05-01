import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const routeSpy = {} as ActivatedRouteSnapshot;
  const stateSpy = {} as RouterStateSnapshot;

  /**
   * テストのセットアップ
   * @param authState 想定される AuthService の状態
   */
  function setup(authState: boolean) {
    const authSpy = jasmine.createSpyObj('AuthService', ['dummy'], { authState$: of(authState) });
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
      ]
    });
    guard = TestBed.inject(AuthGuard);
  }

  it('認証されていた場合に true が返る', (done) => {
    setup(true);

    (guard.canActivate(routeSpy, stateSpy) as Observable<boolean | UrlTree>).subscribe(x => {
      expect(x).toBeTrue();
      done();
    });
  });

  it('未認証の場合に UrlTree が返る', (done) => {
    setup(false);

    (guard.canActivate(routeSpy, stateSpy) as Observable<boolean | UrlTree>).subscribe(x => {
      expect(x instanceof UrlTree).toBeTrue();
      done();
    });
  })

});
