import * as Bundle from '../../build/calendar.module.js';
import '../data/docs_calendar.js';
import '../data/guides.js';

window.product = 'calendar';
window.productName = 'Calendar';
window.bryntum.silenceBundleException = true;

for (const clsName in Bundle) {
    window[clsName] = Bundle[clsName];
}
