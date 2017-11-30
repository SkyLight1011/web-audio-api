import {sliderComponent} from './slider/slider.component.js';

export const commonModule = angular.module('common', [])
  .component('slider', sliderComponent)
  .name;
