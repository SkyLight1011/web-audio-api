import {DAWService} from './daw.service.js';
import {synthComponent} from './synth/synth.component.js';
import {synthTrinityComponent} from './synth/trinity/synth-trinity.component.js';

export const dawModule = angular.module('daw', [])
  .service('DAWService', DAWService)
  .component('synth', synthComponent)
  .component('synthTrinity', synthTrinityComponent)
  .name;
