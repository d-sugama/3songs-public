import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   * コンストラクタ
   */
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  /**
   * 認証の状態を確認し、未認証であればトップページへ強制遷移させる。
   */
  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.authState$.pipe(
      map(x => x ? true : this.router.parseUrl('/'))
    );
  }
}
