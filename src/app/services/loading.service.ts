import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * 読み込み（ローディング）の状態を管理するサービス。
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private subject = new Subject<boolean>();
  private status = 0;

  set load(value: boolean) {
    // プロパティの値の変更が Angular のライフサイクルに逆行するため、
    // setTimeout で時差を持たせて値をセットする。
    setTimeout(() => {
      this.setStatus(value)
    }, 0);
  }
  status$: Observable<boolean> = this.subject.asObservable();

  /**
   * this.load に渡された true と false の値が同数になった場合にのみ
   * ステータスに false をセットする（複数個所から並行して呼び出される可能性があるため）。
   * @param value this.load に渡されたローディングの状況。
   */
  private setStatus(value: boolean) {
    value ? this.status++ : this.status--;
    if (this.status < 0) {
      this.status = 0;
    }
    this.subject.next(!!this.status);
  }

}
