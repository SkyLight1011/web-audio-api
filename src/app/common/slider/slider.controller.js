export class SliderComponentController {
  constructor($attrs, $element, $scope) {
    this.$scope = $scope;
    this.vertical = 'vertical' in $attrs && $attrs.vertical !== 'false';
    this.noLabel = 'noLabel' in $attrs;
    this.control = angular.element($element[0].querySelector('.Slider-control'));
  }

  $onInit() {
    this.min = (this.param.exponential || !this.param.min) ? 0 : this.param.min;
    this.max = (this.param.exponential || !this.param.max) ? 1 : this.param.max;
    this.step = (this.param.exponential || !this.param.step) ? (this.max - this.min) / 100 : this.param.step;

    this.control.on('mousewheel', e => this.incrementValue(this.step * -Math.sign(e.deltaY)));
    this.control.on('input', e => this.updateValue(e.target.value));

    this.modelCtrl.$render = () => {
      this.value = this.modelCtrl.$viewValue;
    };

    if (this.param.exponential) {
      this.modelCtrl.$parsers.push(viewValue => {
        let minv = Math.log(this.param.min);
        let maxv = Math.log(this.param.max);
        let scale = (maxv - minv) / (this.max - this.min);

        return +Math.exp(minv + scale * ((viewValue || this.min) - this.min)).toFixed(2);
      });
      this.modelCtrl.$formatters.push(modelValue => {
        let minv = Math.log(this.param.min);
        let maxv = Math.log(this.param.max);
        let scale = (maxv - minv) / (this.max - this.min);

        return (Math.log(+modelValue || this.param.min) - minv) / scale + this.min;
      });
    }
  }

  incrementValue(by) {
    this.value += by;

    this.$scope.$digest();

    this.updateValue(this.value);
  }

  updateValue(value) {
    this.modelCtrl.$setViewValue(value);
  }
}
