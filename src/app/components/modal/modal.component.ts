import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';

/**
 * ボーダーカラーの別名オブジェクト
 */
const ColorMap = {
  'info': 'border-blue-400',
  'warning': 'border-orange-400',
  'danger': 'border-red-600'
} as const;

/**
 * モーダルコンポーネント
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  text!: string;
  color!: string;
  private subscription!: Subscription;

  /**
   * コンストラクタ
   */
  constructor(private modal: ModalService) { }

  /**
   * コンポーネントの初期化処理
   */
  ngOnInit(): void {
    this.subscription = this.modal.params$.subscribe(params => {
      if(params) {
        this.text = params.text;
        this.color = ColorMap[params.color];
      }
    });
  }

  /**
   * コンポーネントの終了処理
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * モーダルを閉じる
   */
  close() {
    this.modal.close();
  }

}
