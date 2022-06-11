import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import SvSE from '../../../lib/Calendar/localization/SvSE.js';
import SharedSvSE from './shared.locale.SvSE.js';

const examplesSvSELocale = LocaleHelper.mergeLocales(SharedSvSE, {

    extends : 'SvSE'

});

LocaleHelper.publishLocale('SvSE', SvSE);
LocaleHelper.publishLocale('SvSEExamples', examplesSvSELocale);

export default examplesSvSELocale;
//</umd>

LocaleManager.extendLocale('SvSE', examplesSvSELocale);
