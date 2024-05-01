import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * パラメータのインターフェイス
 */
export interface ModalParams {
  text: string;
  color: 'info' | 'warning' | 'danger';
}

/**
 * モーダルサービス
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private status = new Subject<boolean>();
  status$ = this.status.asObservable();
  
  private params = new Subject<ModalParams | null>();
  params$ = this.params.asObservable();

  /**
   * モーダルを表示する。
   * @param params モーダル表示のパラメータ。
   */
  open(params: ModalParams) {
    this.params.next(params);
    this.status.next(true);
  }

  /**
   * モーダルを閉じる。
   */
  close() {
    this.params.next(null);
    this.status.next(false);
  }
}
