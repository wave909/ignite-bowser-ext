import { action, computed, observable } from 'mobx'
import { createContentStore } from '../../components/content-store'
import { FormField, validate } from '../../components/fields/form-field'
import { StringEmptyOptions } from '../../components/fields/string-options'
import { ConnectionError } from '../../components/utils/error-utils'
import { Note } from '../services/database/schemas/note'
import { NoteStore } from '../stores/note-store'
import { T } from '../style/values'

export class NoteViewModel {
  @observable
  public noteId: number

  public readonly title = new FormField(
    new StringEmptyOptions(T.string.empty_title_text),
  )
  public readonly description = new FormField(
    new StringEmptyOptions(T.string.empty_description_text),
  )

  public readonly saveNoteRequest = createContentStore<Note, ConnectionError>()
  public readonly deleteNoteRequest = createContentStore<
    void,
    ConnectionError
  >()

  constructor(private readonly noteStore: NoteStore, noteId: number) {
    this.noteId = noteId
    this.updateNoteData()
  }

  @computed get note(): Note {
    if (this.noteId === undefined || this.noteId === null) return null

    return this.noteStore.noteList.find(item => item.id === this.noteId)
  }

  public setTitle = (title: string) => {
    this.title.setData(title)
  }

  public setDescription = (description: string) => {
    this.description.setData(description)
  }

  public savePressed = () => {
    if (validate(this.title, this.description)) {
      let savePromise
      if (this.noteId) {
        if (
          this.title.data === this.note.title &&
          this.description.data === this.note.description
        ) {
          this.title.setError(T.string.no_changes_note_error)
          return
        }

        savePromise = this.noteStore.updateNote(
          this.noteId,
          this.title.data,
          this.description.data,
        )
      } else {
        savePromise = this.noteStore.createNote(
          this.title.data,
          this.description.data,
        )
      }

      this.saveNoteRequest.setLoading()

      savePromise
        .then(this.saveNoteRequest.setData)
        .catch(this.saveNoteRequest.setError)
    }
  }

  public deletePressed = () => {
    this.deleteNoteRequest.setLoading()

    this.noteStore
      .deleteNote(this.note)
      .then(this.deleteNoteRequest.setData)
      .catch(this.deleteNoteRequest.setError)
  }

  @action
  public updateNoteId(noteId: number) {
    this.noteId = noteId
  }

  public updateNoteData() {
    if (this.note) {
      this.title.setData(this.note.title)
      this.description.setData(this.note.description)
    }
  }
}
