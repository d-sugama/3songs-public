import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, filter, map, merge, tap, throttleTime } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Recommend, RecommendService } from 'src/app/services/recommend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  playerState = new Subject<YT.OnStateChangeEvent>();
  playerError = new Subject<YT.OnErrorEvent>();
  playerVars: YT.PlayerVars = {};
  recommend = {} as Recommend;

  /**
   * コンストラクタ
   */
  constructor(
    private auth: AuthService,
    private recommends: RecommendService,
    private router: Router
  ) { }

  /**
   * コンポーネントの初期化処理
   */
  ngOnInit(): void {
    this.auth.signOut();

    // 認証状態を購読し、ログイン → 編集画面への遷移
    this.subscriptions.add(this.auth.authState$.pipe(
      filter(x => Boolean(x)) // ユーザー情報がなければ無視
    ).subscribe(() => {
      this.router.navigateByUrl('/edit');
    }));

    // プレイリストを購読
    this.subscriptions.add(this.recommends.recommend$.subscribe(recommend => {
      this.playerVars = {
        autoplay: 1, // 何故か定数が効かないんですが…
        playlist: recommend.playlist.join(',')
      };
      this.recommend = recommend;
    }));

    // Player の状態を購読
    const stateChange$ = this.playerState.pipe(
      tap(x => this.skipTooLongVideo(x)), // 再生時間内の動画かチェック
      filter(x => x.data === YT.PlayerState.ENDED), // 再生終了のみ値を流す
      throttleTime(500), // ENDEDが複数回流れることがあるため、一定時間値を無視する
    );
    const onError$ = this.playerError.pipe(
      tap(x => console.error(`Error when playing video: ${x.data}`))
    );
    this.subscriptions.add(merge(stateChange$, onError$).pipe(
      map(x => x.data)
    ).subscribe(() => {
      this.recommends.next();
    }));
  }

  /**
   * コンポーネントの終了処理
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * ログイン処理
   */
  signIn() {
    this.auth.signIn();
  }

  /**
   * Twitter へのリンクを開く
   * @param recommend Recommendオブジェクト
   */
  openTwitter(recommend: Recommend) {
    if (recommend.anonymity) {
      return;
    }
    window.open(`https://twitter.com/${recommend.twitter_name}`, '_balnk', 'noreferrer');
  }

  /**
   * 動画の再生時間をチェックし、制限時間を超えていた場合は次の動画へスキップする。
   * @param event YT.OnStateChangeEvent オブジェクト
   */
  private skipTooLongVideo(event: YT.OnStateChangeEvent) {
    // 再生中の以外のステータスは無視
    if (event.data !== YT.PlayerState.PLAYING) {
      return;
    }

    // 制限時間内であれば何もしない
    const player = event.target;
    const limit = 900; // 動画の制限時間（15分）
    const duration = player.getDuration();
    if (duration < limit) {
      return;
    }

    // 制限時間を超えている場合は動画をスキップする
    player.getPlaylistIndex() < 2 ? player.nextVideo() : player.seekTo(duration, true);
  }

}
