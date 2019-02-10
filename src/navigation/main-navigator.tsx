import {createStackNavigator} from "react-navigation"
import {observer} from "mobx-react"
import {NoteListScreen} from "../screens/note-list";
import {NoteScreen} from "../screens/note";

export const MainNavigator = observer(createStackNavigator({
    NoteList: {
        screen: NoteListScreen
    },
    Note: {
        screen: NoteScreen
    }
}));