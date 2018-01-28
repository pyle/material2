/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Routes} from '@angular/router';

import {HomeNavContent, ProfileNavContent, OptionsNavContent} from '../bottom-nav/bottom-nav-demo';

export const BOTTOM_NAV_DEMO_ROUTES: Routes = [
  {path: '', redirectTo: 'home-nav-item', pathMatch: 'full'},
  {path: 'home-nav-item', component: HomeNavContent},
  {path: 'profile-nav-item', component: ProfileNavContent},
  {path: 'options-nav-item', component: OptionsNavContent},
];
