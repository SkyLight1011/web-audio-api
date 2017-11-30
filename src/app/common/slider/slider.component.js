import {SliderComponentController} from './slider.controller.js';

export const sliderComponent = {
  bindings: {
    param: '<'
  },
  controller: SliderComponentController,
  require: {
    modelCtrl: 'ngModel'
  },
  templateUrl: '/app/common/slider/slider.component.html'
};
