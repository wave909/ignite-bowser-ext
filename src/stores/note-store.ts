import {getEnv, Instance, types} from "mobx-state-tree";
import {action, mst, shim} from "classy-mst";
import {Environment} from "../app/environment";
import {Note} from "../services/database/schemas/note";
import {Results} from 'realm';
import {T} from "../style/values";
import timer from "../../components/utils/promise-timer";
import {loadString, saveString} from "../../components/storage";
import {formError} from "../../components/utils/error-utils";

const NOTE_KEY_COUNTER_KEY = "prefs:note_key_counter"

const NoteStoreData = types.model({
    noteList: types.array(types.frozen<Note>())
})

class NoteActions extends shim(NoteStoreData) {

    private get env() {
        return (getEnv(this) as Environment);
    }

    fetchNoteList(): Promise<void> {
        return timer(2000)
            .then(() => Promise.resolve(this.env.realm.objects('Note') as Results<Note>))
            .then(data => {
                this.setNoteList(data)
                return Promise.resolve()
            })
            .catch(error => {
                console.tron.log("NoteList error: " + JSON.stringify(error))
                return Promise.reject(formError(error, T.string.get_note_list_error))
            })
    }

    @action
    setNoteList(noteList: Results<Note>) {
        this.noteList.clear()
        noteList.forEach(item => {
            this.noteList.unshift({...item})
        })
    }

    createNote(title: string, description: string): Promise<Note> {
        return timer(2000)
            .then(() => loadString(NOTE_KEY_COUNTER_KEY))
            .then((prevId) => {
                return saveString(NOTE_KEY_COUNTER_KEY, prevId ? (parseInt(prevId) + 1).toString() : "0")
            })
            .then((newId) => new Promise<Note>((resolve, reject) => {
                if (!newId) reject(new Error("ID is null"))
                try {
                    this.env.realm.write(() => {
                        const newNote = this.env.realm.create('Note', new Note(parseInt(newId), title, description))
                        resolve(newNote)
                    })
                } catch (error) {
                    reject(error)
                }
            }))
            .then(data => {
                this.setNewNote(data)
                return Promise.resolve(data)
            })
            .catch(error => {
                console.tron.log("Create note error: " + JSON.stringify(error))
                return Promise.reject(formError(error, T.string.write_note_error))
            })
    }

    updateNote(id: number, title: string, description: string): Promise<Note> {
        return timer(2000)
            .then(() => new Promise<Note>((resolve, reject) => {
                try {
                    this.env.realm.write(() => {
                        const newNote = this.env.realm.create('Note', new Note(id, title, description), true)
                        resolve(newNote)
                    })
                } catch (error) {
                    reject(error)
                }
            }))
            .then(data => {
                this.setUpdatingNote(data)
                return Promise.resolve(data)
            })
            .catch(error => {
                console.tron.log("Update note error: " + JSON.stringify(error))
                return Promise.reject(formError(error, T.string.update_note_error))
            })
    }

    deleteNote(note: Note): Promise<void> {
        return timer(2000)
            .then(() => new Promise<Note>((resolve, reject) => {
                try {
                    this.env.realm.write(() => {
                        const realmNote = this.env.realm.objectForPrimaryKey('Note', note.id)
                        if (realmNote) {
                            this.env.realm.delete(realmNote)
                            resolve()
                        } else {
                            reject(new Error('Failed to delete Note with id: ' + note.id))
                        }
                    })
                } catch (error) {
                    reject(error)
                }
            }))
            .then(() => {
                this.deleteNoteFromList(note)
                return Promise.resolve()
            })
            .catch(error => {
                return Promise.reject(formError(error, T.string.delete_note_error))
            })
    }

    @action
    private setNewNote(note: Note) {
        this.noteList.unshift({...note})
    }

    @action
    private setUpdatingNote(note: Note) {
        const updatedNotePosition = this.noteList.findIndex(item => item.id === note.id)
        if (updatedNotePosition >= 0) {
            this.noteList[updatedNotePosition] = {...note}
        }
    }

    @action
    private deleteNoteFromList(note: Note) {
        this.noteList.remove(note)
    }
}

export const NoteStoreModel = mst(NoteActions, NoteStoreData, 'NoteStore')

export type NoteStore = Instance<typeof NoteStoreModel>