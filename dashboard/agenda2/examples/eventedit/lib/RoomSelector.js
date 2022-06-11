import Combo from '../../../lib/Core/widget/Combo.js';
import Room from './Room.js';
import AjaxStore from '../../../lib/Core/data/AjaxStore.js';

const roomStore = new AjaxStore({
    readUrl    : 'data/rooms.json',
    autoLoad   : true,
    modelClass : Room
});

export default class RoomSelector extends Combo {
    static get type() {
        return 'roomSelector';
    }

    static get configurable() {
        return {
            store        : roomStore,
            displayField : 'name'
        };
    }
}

// Register this type with its factory
RoomSelector.initClass();
