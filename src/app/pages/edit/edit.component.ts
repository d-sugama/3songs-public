import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, finalize, map, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { Recommend, RecommendService } from 'src/app/services/recommend.service';
import { extractIdfromYouTubeUrl } from './song-input/song-input.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  // ユーザーの登録データ
  private userId = '';
  recommend: Recommend = {
    twitter_name: '',
    icon_url: '',
    anonymity: false,
    playlist: ['', '', ''],
    last_update: 0
  };

  // フォーム関連の変数
  private form = this.fb.group({
    twitter_name: [''],
    icon_url: [''],
    anonymity: [false],
    playlist: this.fb.array(['', '', '']),
    last_update: [0]
  }, {
    validators: this.playlistDuplicateValidator()
  });
  get playlist() { return this.form.controls.playlist.controls; }
  get anonymity() { return this.form.controls.anonymity; }


  /**
   * コンストラクタ
   */
  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private recommendService: RecommendService,
    private auth: AuthService,
    private loading: LoadingService,
    private modal: ModalService
  ) { }

  /**
   * コンポーネントの初期化処理
   */
  ngOnInit(): void {
    this.loading.load = true;
    this.auth.authState$.pipe(
      take(1),
      map(user => this.setUserData(user)),
      switchMap(userId => this.recommendService.getRecommend(userId)), // プレイリストの取得に切り替え
      filter(x => Boolean(x.twitter_name)),
      finalize(() => setTimeout(() => this.loading.load = false, 1000)) // 描画の更新にラグがあるため1秒余分に待機
    ).subscribe(recommend => {
      this.recommend.playlist = recommend.playlist;
      for (let i = 0; i < recommend.playlist.length; i++) {
        this.playlist[i].patchValue(`https://youtu.be/${recommend.playlist[i]}`);
      }
    });
  }

  /**
   * コンポーネントの終了処理
   */
  ngOnDestroy(): void {
    // 再生画面へ戻った際に動画の再生がスタートするようにリクエストを仕込む
    setTimeout(() => this.recommendService.next(), 500);
  }

  /**
   * フォームの不正判定。
   * @returns プレイリストの追加バリデーションも含めてすべてクリアであれば false を返す。
   */
  isInvalid() {
    let result = this.form.invalid;
    for (let control of this.playlist) {
      result = result || control.invalid;
    }
    return result;
  }

  /**
   * データの登録処理
   */
  submit() {
    this.loading.load = true;
    const value = this.form.value as Recommend;
    value.playlist = value.playlist.map(url => extractIdfromYouTubeUrl(url));
    value.last_update = this.recommendService.getCurrentTimeStamp();
    this.recommendService.updateRecommend(this.userId, value).pipe(
      take(1),
      finalize(() => this.loading.load = false)
    ).subscribe(() => {
      this.recommendService.refetch();
      this.modal.open({ color: 'info', text: 'データを登録しました(・ω・)' });
      this.backToHome();
    });
  }

  /**
   * 登録のキャンセル処理
   */
  cancel() {
    this.modal.open({ color: 'info', text: '登録をキャンセルしました(・ω・)' });
    this.backToHome();
  }

  /**
   * 削除ボタン押下時の処理
   */
  remove() {
    if (!window.confirm('データを削除します。削除後は復旧できませんがよろしいですか？')) {
      return;
    }

    this.loading.load = true;
    this.recommendService.deleteRecommend(this.userId).pipe(
      take(1),
      finalize(() => this.loading.load = false)
    ).subscribe(() => {
      this.recommendService.refetch();
      this.modal.open({ color: 'warning', text: '登録データを削除しました(・ω・)' });
      this.backToHome();
    });
  }

  /**
   * Auth サービスから取得したデータを this.recommend にセットする。
   * @returns User オブジェクトから取得した uid。
   */
  private setUserData(user: User | null) {
    // 想定外のエラーが発生した場合はトップページへ遷移する
    if (!user) {
      this.modal.open({ color: 'danger', text: 'ユーザー情報の取得に失敗しました。時間をおいて再度お試しください(´・ω・｀)' });
      this.backToHome();
      return '';
    }
    this.userId = user.uid;
    this.recommend.twitter_name = user.displayName!;
    this.recommend.icon_url = user.photoURL!;
    this.form.patchValue(this.recommend);
    return user.uid;
  }

  /**
   * プレイリストの重複検証処理。
   */
  private playlistDuplicateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const values = control.value.playlist;
      return values.length === new Set(values).size ? null : { playlistDuplication: true };
    }
  }

  /**
   * Home ページへ遷移する。
   */
  private backToHome() {
    this.router.navigateByUrl('/');
  }
}
