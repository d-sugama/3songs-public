import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { Subscription } from 'rxjs';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'someones3songs';
  loading!: boolean;
  modal!: boolean;
  private subscription = new Subscription();

  /**
   * コンストラクタ
   */
  constructor(
    private loadingService: LoadingService,
    private modalService: ModalService
  ) { }

  /**
   * コンポーネントの初期化処理
   */
  ngOnInit(): void {
    this.subscription.add(
      this.loadingService.status$.subscribe(status => this.loading = status)
    );
    this.subscription.add(
      this.modalService.status$.subscribe(status => this.modal = status)
    );
  }

  /**
   * コンポーネントの修了処理
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
