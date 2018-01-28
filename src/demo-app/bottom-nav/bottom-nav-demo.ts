/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, ViewEncapsulation} from '@angular/core';


@Component({
  moduleId: module.id,
  selector: 'bottom-nav-demo',
  templateUrl: 'bottom-nav-demo.html',
  styleUrls: ['bottom-nav-demo.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class BottomNavDemo {

  navItems = [
    {label: 'Home', icon: 'home', link: 'home-nav-item'},
    {label: 'Profile', icon: 'person', link: 'profile-nav-item'},
    {label: 'Options', icon: 'build', link: 'options-nav-item'},
  ];

  bottomNavBackground: any = undefined;

}


@Component({
  moduleId: module.id,
  selector: 'home-routed-content',
  template: 'This is the routed body of the home tab.',
})
export class HomeNavContent {}


@Component({
  moduleId: module.id,
  selector: 'profile-routed-content',
  template: 'This is the routed body of the profile tab.',
})
export class ProfileNavContent {}


@Component({
  moduleId: module.id,
  selector: 'options-routed-content',
  template: 'This is the routed body of the options tab.',
})
export class OptionsNavContent {}
