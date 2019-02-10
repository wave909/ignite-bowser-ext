import {NoteStore} from "../stores/note-store";
import {createContentStore} from "../../components/content-store";
import {ConnectionError} from "../../components/utils/error-utils";


export class NoteListViewModel {
    noteListRequest = createContentStore<void, ConnectionError>()

    constructor(private readonly noteStore: NoteStore) {
        this.loadNoteList()
    }

    loadNoteList = () => {
        this.noteListRequest.setLoading()

        this.noteStore.fetchNoteList()
            .then(this.noteListRequest.setData)
            .catch(this.noteListRequest.setError)
    }
}