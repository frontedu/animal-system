import Model from '../../../lib/Core/data/Model.js';

export default class Room extends Model {
    static get fields() {
        return [{
            name : 'name'
        }, {
            name : 'capacity',
            type : 'number'
        }];
    }
}
