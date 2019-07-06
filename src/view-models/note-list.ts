import { createContentStore } from '../../components/content-store'
import { ConnectionError } from '../../components/utils/error-utils'
import { NoteStore } from '../stores/note-store'

export class NoteListViewModel {
  public noteListRequest = createContentStore<void, ConnectionError>()

  constructor(private readonly noteStore: NoteStore) {
    this.loadNoteList()
  }

  public loadNoteList = () => {
    this.noteListRequest.setLoading()

    this.noteStore
      .fetchNoteList()
      .then(this.noteListRequest.setData)
      .catch(this.noteListRequest.setError)
  }
}
