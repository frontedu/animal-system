import Combo from '../../../lib/Core/widget/Combo.js';
import ResourceStore from '../../../lib/Scheduler/data/ResourceStore.js';

export default class InviteeSelector extends Combo {
    static get $name() {
        return 'InviteeSelector';
    }

    static get type() {
        return 'inviteeSelector';
    }

    static get configurable() {
        return {
            store        : new ResourceStore(),
            label        : 'Invitees',
            displayField : 'name',
            multiSelect  : true,
            editable     : false
        };
    }

    construct() {
        super.construct(...arguments);

        this.store = this.crudManager.resourceStore;
    }
}

// Register this type with its factory
InviteeSelector.initClass();
