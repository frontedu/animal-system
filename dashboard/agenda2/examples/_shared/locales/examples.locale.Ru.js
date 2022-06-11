import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import Ru from '../../../lib/Calendar/localization/Ru.js';
import SharedRu from './shared.locale.Ru.js';

const examplesRuLocale = LocaleHelper.mergeLocales(SharedRu, {

    extends : 'Ru'

});

LocaleHelper.publishLocale('Ru', Ru);
LocaleHelper.publishLocale('RuExamples', examplesRuLocale);

export default examplesRuLocale;
//</umd>

LocaleManager.extendLocale('Ru', examplesRuLocale);
