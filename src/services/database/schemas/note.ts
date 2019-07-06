export class Note {
  public static schema = {
    name: 'Note',
    primaryKey: 'id',
    properties: {
      id: 'int',
      title: 'string',
      description: 'string',
    },
  }
  constructor(
    public id: number,
    public title: string,
    public description: string,
  ) {}
}
