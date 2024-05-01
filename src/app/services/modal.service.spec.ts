import { TestBed } from '@angular/core/testing';

import { ModalParams, ModalService } from './modal.service';
import { skip } from 'rxjs';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('open メソッドのテスト', () => {
    const data: ModalParams = { text: 'Test', color: 'info' };
    service.status$.subscribe(res => {
      expect(res).toBeTrue();
    });
    service.params$.subscribe(res => {
      expect(res).toEqual(data);
    });
    service.open(data);
  });

  it('close メソッドのテスト', () => {
    const data: ModalParams = { text: 'Test', color: 'info' };
    service.status$.pipe(
      skip(1) // open 時の値はスキップする
    ).subscribe(res => {
      expect(res).toBeFalse();
    });
    service.params$.pipe(
      skip(1) // open 時の値はスキップする
    ).subscribe(res => {
      expect(res).toBeNull();
    });
    service.open(data);
    service.close();
  });
});
