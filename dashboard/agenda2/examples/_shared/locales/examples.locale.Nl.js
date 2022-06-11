import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import Nl from '../../../lib/Calendar/localization/Nl.js';
import SharedNl from './shared.locale.Nl.js';

const examplesNlLocale = LocaleHelper.mergeLocales(SharedNl, {

    extends : 'Nl'

});

LocaleHelper.publishLocale('Nl', Nl);
LocaleHelper.publishLocale('NlExamples', examplesNlLocale);

export default examplesNlLocale;
//</umd>

LocaleManager.extendLocale('Nl', examplesNlLocale);
