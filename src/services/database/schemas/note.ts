export class Note {
    constructor(public id: number, public title: string, public description: string) {
    }

    static schema = {
        name: 'Note',
        primaryKey: 'id',
        properties: {
            id: 'int',
            title: 'string',
            description: 'string'
        }
    };
}