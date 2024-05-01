import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';
import { skip } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('true と同数の false がセットされたときにステータスが変更される（正常系）', (done) => {
    const testData = [false, true, true, false, false];
    service.status$.pipe(
      skip(testData.length - 1) // 最後のデータ以外はスキップ
    ).subscribe(bool => {
      expect(bool).toBeFalse();
      done();
    });
    for (let data of testData) {
      service.load = data;
    }
  });

  it('true と同数の false がセットされたときにステータスが変更される（異常系）', (done) => {
    const testData = [false, true, true, false];
    service.status$.pipe(
      skip(testData.length - 1) // 最後のデータ以外はスキップ
    ).subscribe(bool => {
      expect(bool).toBeTrue();
      done();
    });
    for (let data of testData) {
      service.load = data;
    }
  });
});
