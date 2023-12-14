import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-aside-dynamic',
  templateUrl: './asidebar-dynamic.component.html',
  styleUrls: ['./asidebar-dynamic.component.scss']
})
export class AsideDynamicComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  public sidebarShow: boolean = false;


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {


  }


  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
