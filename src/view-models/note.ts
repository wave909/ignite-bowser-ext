import {NoteStore} from "../stores/note-store";
import {action, computed, observable} from "mobx";
import {Note} from "../services/database/schemas/note";
import {T} from "../style/values";
import {FormField, validate} from "../../components/fields/form-field";
import {StringEmptyOptions} from "../../components/fields/string-options";
import {createContentStore} from "../../components/content-store";
import {ConnectionError} from "../../components/utils/error-utils";


export class NoteViewModel {

    @observable
    noteId: number

    readonly title = new FormField(new StringEmptyOptions(T.string.empty_title_text))
    readonly description = new FormField(new StringEmptyOptions(T.string.empty_description_text))

    readonly saveNoteRequest = createContentStore<Note, ConnectionError>()
    readonly deleteNoteRequest = createContentStore<void, ConnectionError>()

    constructor(private readonly noteStore: NoteStore, noteId: number) {
        this.noteId = noteId
        this.updateNoteData()
    }

    @computed get note(): Note {
        if (this.noteId === undefined || this.noteId === null) return null

        return this.noteStore.noteList.find(item => item.id === this.noteId)
    }

    setTitle = (title: string) => {
        this.title.setData(title)
    }

    setDescription = (description: string) => {
        this.description.setData(description)
    }

    savePressed = () => {
        if (validate(this.title, this.description)) {

            let savePromise
            if (this.noteId) {
                if (this.title.data === this.note.title && this.description.data === this.note.description) {
                    this.title.setError(T.string.no_changes_note_error)
                    return
                }

                savePromise = this.noteStore.updateNote(this.noteId, this.title.data, this.description.data)
            } else {
                savePromise = this.noteStore.createNote(this.title.data, this.description.data)
            }

            this.saveNoteRequest.setLoading()

            savePromise
                .then(this.saveNoteRequest.setData)
                .catch(this.saveNoteRequest.setError)
        }
    }

    deletePressed = () => {
        this.deleteNoteRequest.setLoading()

        this.noteStore.deleteNote(this.note)
            .then(this.deleteNoteRequest.setData)
            .catch(this.deleteNoteRequest.setError)
    }

    @action
    updateNoteId(noteId: number) {
        this.noteId = noteId
    }

    updateNoteData() {
        if (this.note) {
            this.title.setData(this.note.title)
            this.description.setData(this.note.description)
        }
    }
}