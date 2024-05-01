import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

let apiLoaded = false;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() set playerVars(playerVars: YT.PlayerVars) {
    this._playerVars = playerVars;
  }
  _playerVars: YT.PlayerVars = {}
  @Output() stateChange = new EventEmitter<YT.OnStateChangeEvent>();
  set _stateChange(event: YT.OnStateChangeEvent) {
    this.stateChange.emit(event);
  }
  @Output() error = new EventEmitter<YT.OnErrorEvent>();
  set _error(event: YT.OnErrorEvent) {
    this.error.emit(event);
  }

  /**
   * コンポーネントの初期化
   */
  ngOnInit(): void {
    if (!apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }
  }

}
