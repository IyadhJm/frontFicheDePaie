import {Component} from '@angular/core';
import { MenuService } from './app.menu.service';
import {PrimeNGConfig} from 'primeng/api';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
})
export class AppMainComponent {

    sidebarStatic: boolean=true;

    sidebarActive = false;

    staticMenuMobileActive: boolean=true;

    menuClick: boolean=true;

    topbarItemClick: boolean=true;

    activeTopbarItem: any;

    topbarMenuActive: boolean=true;

    searchClick = false;

    search = false;

    rightPanelClick: boolean=true;

    rightPanelActive: boolean=true;

    configActive: boolean=true;

    configClick: boolean=true;

    menuHoverActive = false;

    constructor(private menuService: MenuService, private primengConfig: PrimeNGConfig, public app: AppComponent) {
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick && (this.isHorizontal() || this.isSlim())) {
            this.menuService.reset();
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        if (!this.menuClick) {
            if (this.staticMenuMobileActive) {
                this.staticMenuMobileActive = false;
            }

            this.menuHoverActive = false;
            this.unblockBodyScroll();
        }

        if (!this.searchClick) {
            this.search = false;
        }

        this.searchClick = false;
        this.configClick = false;
        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }

    onMenuButtonClick(event:any) {
        this.menuClick = true;
        this.topbarMenuActive = false;
        this.rightPanelActive = false;

        if (this.isMobile()) {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
            if (this.staticMenuMobileActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        }

        event.preventDefault();
    }

    onTopbarItemClick(event:any, item:any) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        if (item.className === 'topbar-item search-item') {
            this.search = !this.search;
            this.searchClick = !this.searchClick;
        }

        event.preventDefault();
    }

    onRightPanelClick(event:any) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;

        this.staticMenuMobileActive = false;

        event.preventDefault();
    }

    onRippleChange(event:any) {
        this.app.ripple = event.checked;
        this.primengConfig.ripple = event.checked;
    }

    onConfigClick(event:any) {
        this.configClick = true;
    }

    onSidebarClick($event:any) {
        this.menuClick = true;
    }

    onToggleMenu(event:any) {
        this.menuClick = true;
        this.sidebarStatic = !this.sidebarStatic;

        event.preventDefault();
    }

    onSidebarMouseOver(event:any) {
        if (this.app.menuMode === 'sidebar' && !this.sidebarStatic) {
            this.sidebarActive = !this.isMobile();
        }
    }

    onSidebarMouseLeave($event:any) {
        if (this.app.menuMode === 'sidebar' && !this.sidebarStatic) {
            setTimeout(() => {
                this.sidebarActive = false;
            }, 250);
        }
    }

    isSlim() {
        return this.app.menuMode === 'slim';
    }

    isHorizontal() {
        return this.app.menuMode === 'horizontal';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return window.innerWidth <= 991;
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
}
