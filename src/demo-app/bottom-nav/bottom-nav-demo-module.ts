/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {
  BottomNavDemo, HomeNavContent, ProfileNavContent, OptionsNavContent
} from './bottom-nav-demo';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    HomeNavContent,
    ProfileNavContent,
    OptionsNavContent,
  ],
})
export class BottomNavDemoModule { }
