import {synthComponent} from './synth/synth.component.js';

export const dawModule = angular.module('daw', [])
  .component('synth', synthComponent)
  .name;
