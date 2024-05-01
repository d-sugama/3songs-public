import { Injectable } from '@angular/core';
import { Database, endBefore, limitToLast, listVal, objectVal, orderByChild, query, ref, remove, set } from '@angular/fire/database';
import { Subject, catchError, from, map, of, take, tap } from 'rxjs';
import { ModalService } from './modal.service';

export type Recommend = {
  twitter_name: string;
  icon_url: string;
  anonymity: boolean;
  last_update: number;
  playlist: string[];
};

@Injectable({
  providedIn: 'root'
})
export class RecommendService {

  private lastIndex = this.getCurrentTimeStamp();
  private recommends: Recommend[] = [];
  private recommend = new Subject<Recommend>();
  recommend$ = this.recommend.asObservable();

  /**
   * コンストラクタ
   */
  constructor(private database: Database, private modals: ModalService) {
    this.next();
  }

  /**
   * recommend へ次のデータを設定する
   */
  next() {
    if (this.recommends.length <= 3) {
      // プレイリストが指定件数以下なら先にフェッチする
      this.fetch().subscribe(() => this.deliver());
    } else {
      this.deliver();
    }
  }

  /**
   * プレイリストのデータを DB から再取得する
   */
  refetch() {
    this.lastIndex = this.getCurrentTimeStamp();
    this.recommends = [];
    this.fetch();
  }

  /**
   * 現在のタイムスタンプを取得
   */
  getCurrentTimeStamp() {
    return Date.now();
  }

  /**
   * 特定のユーザーのプレイリスト情報を取得する
   * @param userId 対象となるユーザーID
   * @returns Observable な Recommend オブジェクト
   */
  getRecommend(userId: string) {
    const dbref = ref(this.database, `recommends/${userId}`);
    return objectVal<Recommend>(dbref).pipe(
      take(1),
      map(data => data ?? {} as Recommend),
      catchError(this.handleError('データの取得に失敗しました。申し訳ございませんが、時間を置いて再度お試しください。', {} as Recommend))
    );
  }

  /**
   * 特定のユーザーのプレイリスト情報を更新する
   * @param uid 対象となるユーザーID
   * @param recommend DBへ登録する Recommend オブジェクト
   * @returns DB側の処理完了を表す Observable な void
   */
  updateRecommend(userId: string, recommend: Recommend) {
    const dbref = ref(this.database, `recommends/${userId}`);
    return from(set(dbref, recommend));
  }

  /**
   * 特定のユーザーのプレイリスト情報を削除する
   * @param uid 対象となるユーザーID
   * @returns DB側の処理完了を表す Observable な void
   */
  deleteRecommend(userId: string) {
    const dbref = ref(this.database, `recommends/${userId}`);
    return from(remove(dbref));
  }

  /**
   * Realtime Database からデータを取得し、recommends へ格納する。
   */
  private fetch() {
    const limit = 100; // 一度の通信で取得する件数の最大値
    const queryRef = query(ref(this.database, 'recommends'), orderByChild('last_update'), endBefore(this.lastIndex), limitToLast(limit));
    return listVal<Recommend>(queryRef).pipe(
      take(1),
      map(data => data ?? []),
      tap(data => this.lastIndex = data.length < limit ? this.getCurrentTimeStamp() : data[0].last_update),
      tap(data => this.recommends = [...data, ...this.recommends]),
      catchError(this.handleError('プレイリストの取得に失敗しました。申し訳ございませんが、時間を置いて再度お試しください。', [] as Recommend[]))
    );
  }

  /**
   * モーダル上にエラーメッセージを表示し、アプリの動作が持続するようオブジェクトを返す
   * @param msg エラーメッセージ
   * @param result observableな結果として返す任意の値
   * @returns rxjs の catchError 関数に渡す関数
   */
  private handleError<T>(msg = 'エラーが発生しました', result?: T) {
    return (error: any) => {
      console.error(error);
      this.modals.open({ color: 'danger', text: msg });
      return of(result as T);
    }
  }

  /**
   * recommends 内の値をシャッフルして recommend へ流す
   */
  private deliver() {
    const targetCount = 3; // シャッフル対象となるレコードの数
    const temp = this.recommends.splice(0 - targetCount);
    const index = Math.floor(Math.random() * targetCount);
    const nextRecommend = temp[index];
    if (nextRecommend) {
      this.recommend.next(nextRecommend);
      delete temp[index];
    }
    this.recommends = [...this.recommends, ...temp.filter(x => x)];
  }
}
