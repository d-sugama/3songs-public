import { Injectable } from '@angular/core';
import { Auth, TwitterAuthProvider, authState, signInWithPopup } from '@angular/fire/auth';
import { LoadingService } from './loading.service';
import { ModalParams, ModalService } from './modal.service';

/**
 * ユーザー認証サービス
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState$ = authState(this.auth);

  /**
   * コンストラクタ
   */
  constructor(
    private auth: Auth,
    private loading: LoadingService,
    private modal: ModalService
  ) { }

  /**
   * ポップアップウィンドウを開き twitter の認証機能を利用してサインインする。
   */
  signIn() {
    this.loading.load = true;
    signInWithPopup(this.auth, new TwitterAuthProvider()).catch(response => {
      const params: ModalParams = { color: 'warning', text: '認証に失敗しました' };
      if(response.code === 'auth/user-cancelled') {
        params.text = '認証がキャンセルされました';
      }
      this.modal.open(params);
    }).finally(() => {
      this.loading.load = false;
    });
  }

  /**
   * サインアウトする。
   */
  signOut() {
    this.auth.signOut();
  }
}
