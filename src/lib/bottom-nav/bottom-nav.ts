/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directionality} from '@angular/cdk/bidi';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Platform} from '@angular/cdk/platform';
import {ViewportRuler} from '@angular/cdk/scrolling';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Directive,
  ViewEncapsulation,
  ElementRef,
  OnDestroy,
  Input,
  Optional,
  NgZone,
  Attribute,
  AfterContentInit,
  ViewChild,
  ContentChildren,
  forwardRef,
  QueryList,
  Inject,
} from '@angular/core';
import {
  mixinDisableRipple,
  mixinColor,
  CanColor,
  CanDisableRipple,
  mixinDisabled,
  mixinTabIndex,
  CanDisable,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  HasTabIndex,
  RippleTarget,
  RippleRenderer,
  RippleConfig,
  RippleGlobalOptions,
  ThemePalette,
} from '@angular/material/core';
import {Subject} from 'rxjs/Subject';


/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'nav[mat-bottom-nav]',
  host: {'class': 'mat-bottom-nav'}
})
export class MatBottomNavCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'a[mat-bottom-nav-item]',
  host: {'class': 'mat-bottom-nav-item'}
})
export class MatBottomNavItemCssMatStyler {}

// Boilerplate for applying mixins to MatBottomNav.
/** @docs-private */
export class MatBottomNavBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _MatBottomNavMixinBase = mixinDisableRipple(mixinColor(MatBottomNavBase, 'primary'));

/**
 * Material design Bottom Navigation.
 */
@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'matBottomNav',
  inputs: ['color', 'disableRipple'],
  preserveWhitespaces: false,
  selector: `[mat-bottom-nav]`,
  styleUrls: ['bottom-nav.css'],
  templateUrl: 'bottom-nav.html',
  host: {
    '[class.mat-bottom-nav-label-active]': 'active',
  }
})
export class MatBottomNav extends _MatBottomNavMixinBase
    implements CanColor, CanDisableRipple, OnDestroy, AfterContentInit {

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  _activeItemChanged: boolean;
  _activeItemElement: ElementRef;

  /** Query list of al_backgroundColorl bottom-nav-item's items of the bottomNav. */
  @ContentChildren(forwardRef(() => MatBottomNavItem), {descendants: true})
  _navItems: QueryList<MatBottomNavItem>;

  /** Background color of the bottom nav. */
  @Input()
  get backgroundColor(): ThemePalette { return this._backgroundColor; }
  set backgroundColor(value: ThemePalette) {
    const nativeElement: HTMLElement = this._elementRef.nativeElement;

    nativeElement.classList.remove(`mat-background-${this.backgroundColor}`);

    if (value) {
      nativeElement.classList.add(`mat-background-${value}`);
    }

    this._backgroundColor = value;
  }
  @Input() active: boolean;
  private _backgroundColor: ThemePalette;

  /** Whether ripples should be disabled for all links or not. */
  get disableRipple() { return this._disableRipple; }
  set disableRipple(value: boolean) {
    this._disableRipple = coerceBooleanProperty(value);
    this._setLinkDisableRipple();
  }
  private _disableRipple: boolean = false;

  constructor(elementRef: ElementRef,
              @Optional() private _dir: Directionality,
              private _ngZone: NgZone,
              private _changeDetectorRef: ChangeDetectorRef,
              private _viewportRuler: ViewportRuler) {
    super(elementRef);
  }

  /** Notifies the component that the active link has been changed. */
  updateActiveLink(element: ElementRef) {
    this._activeItemChanged = this._activeItemElement != element;
    this._activeItemElement = element;

    if (this._activeItemChanged) {
      this._changeDetectorRef.markForCheck();
    }
  }

  ngAfterContentInit(): void {
    this._setLinkDisableRipple();
  }

  /** Checks if the active link has been changed and, if so, will update the ink bar. */
  ngAfterContentChecked(): void {
    if (this._activeItemChanged) {
      this._activeItemChanged = false;
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }



  /** Sets the `disableRipple` property on each link of the navigation bar. */
  private _setLinkDisableRipple() {
    if (this._navItems) {
      this._navItems.forEach(link => link.disableRipple = this.disableRipple);
    }
  }
}



// Boilerplate for applying mixins to matBottomNavItem.
export class MatBottomNavItemBase {}
export const _MatBottomNavItemMixinBase =
  mixinTabIndex(mixinDisableRipple(mixinDisabled(MatBottomNavItemBase)));


/**
 * Material design Bottom Navigation Item.
 */
@Directive({
  selector: '[mat-bottom-nav-item], [matBottomNavItem]',
  exportAs: 'matBottomNavItem',
  inputs: ['disabled', 'disableRipple', 'tabIndex'],
  host: {
    'class': 'mat-bottom-nav-item',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.tabIndex]': 'tabIndex',
    '[class.mat-bottom-nav-disabled]': 'disabled',
    '[class.mat-bottom-nav-label-active]': 'active',
  },
})
export class MatBottomNavItem extends _MatBottomNavItemMixinBase
    implements OnDestroy, CanDisable, CanDisableRipple, HasTabIndex, RippleTarget {

  /** Whether the nav item is active or not. */
  private _isActive = false;

  /** Reference to the RippleRenderer for the bottom-nav-item */
  private _bottomNavItemRipple: RippleRenderer;

  /** Whether the link is active */
  @Input()
  get active(): boolean { return this._isActive; }
  set active(value: boolean) {
    this._isActive = value;
    if (value) {
      this._bottomNav.updateActiveLink(this._elementRef);
    }
  }

  /**
   * Ripple configuration for ripples that are launched on pointer down.
   * @docs-private
   */
  rippleConfig: RippleConfig = {};

  /**
   * Whether ripples are disabled on interaction
   * @docs-private
   */
  get rippleDisabled(): boolean {
    return this.disabled || this.disableRipple;
  }

  constructor(private _bottomNav: MatBottomNav,
              private _elementRef: ElementRef,
              ngZone: NgZone,
              platform: Platform,
              @Optional() @Inject(MAT_RIPPLE_GLOBAL_OPTIONS) globalOptions: RippleGlobalOptions,
              @Attribute('tabindex') tabIndex: string) {
    super();

    this._bottomNavItemRipple = new RippleRenderer(this, ngZone, _elementRef, platform);
    this._bottomNavItemRipple.setupTriggerEvents(_elementRef.nativeElement);

    this.tabIndex = parseInt(tabIndex) || 0;

    if (globalOptions) {
      this.rippleConfig = {speedFactor: globalOptions.baseSpeedFactor};
    }
  }

  ngOnDestroy() {
    this._bottomNavItemRipple._removeTriggerEvents();
  }
}
