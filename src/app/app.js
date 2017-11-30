import {commonModule} from './common/common.module.js';
import {dawModule} from './daw/daw.module.js';

angular.module('app', [commonModule, dawModule]);

angular.bootstrap(document, ['app']);
