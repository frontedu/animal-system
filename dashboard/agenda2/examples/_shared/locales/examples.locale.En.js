import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import En from '../../../lib/Calendar/localization/En.js';
import SharedEn from './shared.locale.En.js';

const examplesEnLocale = LocaleHelper.mergeLocales(SharedEn, {

    extends : 'En'

});

LocaleHelper.publishLocale('En', En);
LocaleHelper.publishLocale('EnExamples', examplesEnLocale);

export default examplesEnLocale;
//</umd>

LocaleManager.extendLocale('En', examplesEnLocale);
