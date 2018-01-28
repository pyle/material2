/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCommonModule, MatRippleModule} from '@angular/material/core';
import {A11yModule} from '@angular/cdk/a11y';

import {
  MatBottomNav, MatBottomNavItem, MatBottomNavCssMatStyler, MatBottomNavItemCssMatStyler
} from './bottom-nav';

@NgModule({
  imports: [
    CommonModule,
    MatRippleModule,
    MatCommonModule,
    A11yModule,
  ],
  exports: [
    MatCommonModule,
    MatBottomNav,
    MatBottomNavItem,
    MatBottomNavCssMatStyler,
    MatBottomNavItemCssMatStyler,
  ],
  declarations: [
    MatBottomNav,
    MatBottomNavItem,
    MatBottomNavCssMatStyler,
    MatBottomNavItemCssMatStyler,
  ],
})
export class MatBottomNavModule {}
