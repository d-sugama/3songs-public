import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, distinctUntilChanged, filter, map, take } from 'rxjs';

/**
 * YouTube のURLからID部分のみを抽出する処理。
 * URLからID部分を抽出するのみで、正しい(存在する)IDかどうかは検証しない。
 * @param url 抽出対象のURL
 * @returns 抽出されたID。対象がなければ空文字を返却。
 */
export function extractIdfromYouTubeUrl(url: string) {
  if (isYouTubeUrl(url)) {
    return url.replace('https://youtu.be/', '').replace('https://www.youtube.com/watch?v=', '').replace(/([^?]*)\?.*/, '$1');
  }
  return '';
}

/**
 * 引き数として与えられた文字列が YouTube のURLかを判定する処理
 * @param url 検査対象のURL
 * @returns YouTube のURLであれば true
 */
function isYouTubeUrl(url: string) {
  return /^https:\/\/youtu.be\//.test(url) || /^https:\/\/www.youtube.com\/watch\?v=/.test(url);
}

@Component({
  selector: 'app-song-input',
  templateUrl: './song-input.component.html',
  styleUrls: ['./song-input.component.css']
})
export class SongInputComponent implements OnInit {

  @Input() control!: FormControl<string | null>;
  @Input() videoId = '';
  playerError$ = new Subject<boolean>();

  /**
   * コンポーネントの初期化処理
   */
  ngOnInit(): void {
    // 入力フォームに YouTube Player に連動した非同期バリデーションを設定
    this.control.addAsyncValidators(() => {
      return this.playerError$.pipe(
        take(1),
        map(isError => isError ? { playerError: isError } : null)
      );
    });
    this.control.updateValueAndValidity();

    // 入力フォームの変更検知
    this.control.valueChanges.pipe(
      distinctUntilChanged(),
      map(x => x ?? ''),
      filter(x => !x || isYouTubeUrl(x)),
    ).subscribe(input => {
      const id = extractIdfromYouTubeUrl(input);
      this.videoId = id;
    });
  }
}
