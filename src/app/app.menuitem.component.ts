import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MenuService} from './app.menu.service';
import {AppMainComponent} from './app.main.component';

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-menuitem]',
    /* tslint:enable:component-selector */
    template: `
		<ng-container>
			<a [attr.href]="item.url" (click)="itemClick($event)" *ngIf="!item.routerLink || item.items" (mouseenter)="onMouseEnter()"
			   (keydown.enter)="itemClick($event)" [ngClass]="item.class" pRipple
			   [attr.target]="item.target" [attr.tabindex]="0">
				<i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.label}}</span>
				<i class="pi pi-fw pi-chevron-down layout-submenu-toggler" *ngIf="item.items"></i>
			</a>
			<a (click)="itemClick($event)" (mouseenter)="onMouseEnter()" *ngIf="item.routerLink && !item.items"
			   [routerLink]="item.routerLink" routerLinkActive="active-route" [ngClass]="item.class" pRipple
			   [routerLinkActiveOptions]="{exact: true}" [attr.target]="item.target" [attr.tabindex]="0">
				<i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.label}}</span>
				<i class="pi pi-fw pi-chevron-down layout-submenu-toggler" *ngIf="item.items"></i>
			</a>
            <div class="layout-menu-tooltip">
                <div class="layout-menu-tooltip-arrow"></div>
                <div class="layout-menu-tooltip-text">{{item.label}}</div>
            </div>
			<ul *ngIf="item.items && active" [@children]="((appMain.isSlim()||appMain.isHorizontal()) && !appMain.isMobile() && root) ? (active ? 'visible' : 'hidden') :
				(active ? 'visibleAnimated' : 'hiddenAnimated')" role="menu">
				<ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
					<li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass"></li>
				</ng-template>
			</ul>
		</ng-container>
    `,
    host: {
        '[class.active-menuitem]': 'active'
    },
    animations: [
        trigger('children', [
            state('void', style({
                height: '0px'
            })),
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*',
                'z-index': 100
            })),
            state('hidden', style({
                height: '0px',
                'z-index': '*'
            })),
            state('slimVisibleAnimated', style({
                opacity: 1,
                transform: 'none'
            })),
            state('slimHiddenAnimated', style({
                opacity: 0,
                transform: 'translateX(20px)'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('void => visibleAnimated, visibleAnimated => void',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('void => slimVisibleAnimated', animate('400ms cubic-bezier(.05,.74,.2,.99)')),
            transition('slimHiddenAnimated => slimVisibleAnimated', animate('400ms cubic-bezier(.05,.74,.2,.99)'))
        ])
    ]
})
export class AppMenuitemComponent implements OnInit, OnDestroy {

    @Input() item: any;

    @Input() index: number=1;

    @Input() root: boolean=true;

    @Input() parentKey: string='';

    active = false;

    menuSourceSubscription: Subscription;

    menuResetSubscription: Subscription;

    key: string='';

    constructor(public appMain: AppMainComponent, public router: Router, private cd: ChangeDetectorRef, private menuService: MenuService) {
        this.menuSourceSubscription = this.menuService.menuSource$.subscribe(key => {
            // deactivate current active menu
            if (this.active && this.key !== key && key.indexOf(this.key) !== 0) {
                this.active = false;
            }
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(params => {
                if (this.appMain.isSlim() || this.appMain.isHorizontal()) {
                    this.active = false;
                } else {
                    if (this.item.routerLink) {
                        this.updateActiveStateFromRoute();
                    } else {
                        this.active = false;
                    }
                }
            });
    }

    ngOnInit() {
        if (!(this.appMain.isSlim() || this.appMain.isHorizontal()) && this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }

        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
    }

    updateActiveStateFromRoute() {
        this.active = this.router.isActive(this.item.routerLink[0], !this.item.items);
    }

    itemClick(event: Event): void{
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return ;
        }

        // navigate with hover in horizontal mode
        if (this.root) {
            this.appMain.menuHoverActive = !this.appMain.menuHoverActive;
        }

        // notify other items
        this.menuService.onMenuStateChange(this.key);

        // execute command
        if (this.item.command) {
            this.item.command({originalEvent: event, item: this.item});
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;
        } else {
            // activate item
            this.active = true;

            // reset horizontal menu
            if (this.appMain.isSlim() || this.appMain.isHorizontal()) {
                this.menuService.reset();
            }

            this.appMain.staticMenuMobileActive = false;
            this.appMain.menuHoverActive = !this.appMain.menuHoverActive;

            this.appMain.unblockBodyScroll();
        }
    }

    onMouseEnter() {
        // activate item on hover
        if (this.root && this.appMain.menuHoverActive &&
            (this.appMain.isSlim() || this.appMain.isHorizontal()) && this.appMain.isDesktop()) {
            this.menuService.onMenuStateChange(this.key);
            this.active = true;
        }
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }

        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
}
