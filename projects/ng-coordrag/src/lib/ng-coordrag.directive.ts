import { Directive, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges, OnDestroy } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subscription, Subject, fromEvent } from 'rxjs';

@Directive({
  selector: 'appCoordrag'
})
export class NgCoordragDirective implements OnChanges, OnDestroy {
  private mousedown$!: Observable<MouseEvent>;
  private mouseup$!: Observable<MouseEvent>;
  private mousemove$!: Observable<MouseEvent>;
  private mouseholdSubscription!: Subscription;
  private unsubscribe$ = new Subject<void>();

  // enable this directive or not
  @Input() appMousemoveOnMousedown = false;

  @Output() onEleIsMousedDown = new EventEmitter<MouseEvent>();
  @Output() onEleIsMousedMove = new EventEmitter<MouseEvent>();
  @Output() onEleIsMousedUp = new EventEmitter<MouseEvent>();

  constructor(private hostEle: ElementRef) {
    if (!this.appMousemoveOnMousedown) { return; }

    this.init();
  }

  private init(): void {
    const { nativeElement } = this.hostEle;

    this.mousedown$ = fromEvent(nativeElement, 'mousedown').pipe(
      takeUntil<any>(this.unsubscribe$)
    ) as Observable<MouseEvent>;

    this.mousedown$.subscribe((e: MouseEvent): void => {
      e.preventDefault();

      this.onEleIsMousedDown.emit(e);
    });

    this.mousemove$ = fromEvent(nativeElement, 'mousemove').pipe(
      takeUntil<any>(this.unsubscribe$)
    ) as Observable<MouseEvent>;

    this.mouseup$ = fromEvent(nativeElement, 'mouseup').pipe(
      takeUntil<any>(this.unsubscribe$)
    ) as Observable<MouseEvent>;

    this.mouseup$.subscribe((e: MouseEvent): void => {
      e.preventDefault();

      this.unsubscribeMousehold();
      this.subscribeToNewMousehold();
      this.onEleIsMousedUp.emit(e);
    });

    this.subscribeToNewMousehold();
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    const { appMousemoveOnMousedown } = simpleChanges;

    if (appMousemoveOnMousedown) {
      if (!appMousemoveOnMousedown.currentValue) {
        this.unsubscribe$.next();
        return;
      }

      this.init();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private subscribeToNewMousehold(): void {
    const mousehold$ = this.mousedown$.pipe(
      // switch to the mousemove$ observable
      switchMap((): Observable<MouseEvent> => this.mousemove$),
      takeUntil(this.unsubscribe$),
      takeUntil(this.mouseup$)
    );

    this.mouseholdSubscription = mousehold$.subscribe((e: MouseEvent): void => {
      e.preventDefault();

      this.onEleIsMousedMove.emit(e);
    });
  }

  unsubscribeMousehold() {
    if (this.mouseholdSubscription) {
      this.mouseholdSubscription.unsubscribe();
    }
  }
}
