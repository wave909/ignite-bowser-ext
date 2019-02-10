import React, {Component} from 'react'
import {createBasicNavigationOptions, ScreenContainer} from "../style/navigation";
import {Note} from "../services/database/schemas/note";
import {NoteViewModel} from "../view-models/note";
import {NoteStore} from "../stores/note-store";
import {disposeOnUnmount, inject, observer} from "mobx-react";
import {NavigationScreenProps} from "react-navigation";
import {action, observable, reaction} from "mobx";
import {HelperText, IconButton, TextInput} from "react-native-paper";
import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import {T} from "../style/values";
import CommonButton from "../views/button";
import {NavigationStore} from "../../components/navigation/navigation-store";
import {showLongToastOnError} from "../../components/utils/error-utils";
import {showLongToast} from "../../components/utils/toast-utils";

const IS_SHOW_ICON_KEY = 'isShowIcon'
const TITLE_KEY = 'title'
const IS_EDIT_KEY = 'isEdit'
const SWITCH_EDIT_KEY = 'switchEdit'

const styles = StyleSheet.create({
    container: {
        padding: T.spacing.default
    },
    description: {
        flex: 1,
        textAlign: 'left'
    }
})

interface NoteScreenProps extends NavigationScreenProps {
    noteStore?: NoteStore
    navigationStore?: NavigationStore
}

@inject('noteStore')
@inject('navigationStore')
@observer
export class NoteScreen extends Component<NoteScreenProps> {

    static navigationOptions = ({navigation}) => createBasicNavigationOptions(navigation.getParam(TITLE_KEY) || 'Создание заказа',
        navigation.getParam(IS_SHOW_ICON_KEY, false) ? <IconButton
            color={'black'}
            icon={navigation.getParam(IS_EDIT_KEY, false) ? 'check' : "edit"}
            onPress={navigation.getParam(SWITCH_EDIT_KEY)}/> : null)

    readonly viewModel = new NoteViewModel(this.props.noteStore, this.props.navigation.getParam('noteId'))

    @disposeOnUnmount
    noteDisposer = reaction(() => this.viewModel.note,
        (note) => {
            this.props.navigation.setParams({
                [TITLE_KEY]: note ? note.title : undefined,
                [IS_SHOW_ICON_KEY]: !!note
            })
            this.viewModel.updateNoteData()
        })

    @disposeOnUnmount
    isEditDisposer = reaction(() => this.isEdit,
        isEdit => {
            this.props.navigation.setParams({[IS_EDIT_KEY]: isEdit})
        })

    @disposeOnUnmount
    saveNoteErrorDisposer = showLongToastOnError(() => this.viewModel.saveNoteRequest.error)

    @disposeOnUnmount
    saveNoteSuccessDisposer = reaction(() => this.viewModel.saveNoteRequest.data,
        data => {
            if (data) {
                showLongToast(this.viewModel.noteId ? T.string.update_note_success : T.string.write_note_success)
                this.setEdit(false)
                this.viewModel.updateNoteId(data.id)
            }
        })

    @disposeOnUnmount
    deleteNoteErrorDisposer = showLongToastOnError(() => this.viewModel.deleteNoteRequest.error)

    @disposeOnUnmount
    deleteNoteSuccessDisposer = reaction(() => !this.viewModel.deleteNoteRequest.isFetching && !this.viewModel.deleteNoteRequest.error,
        isSuccess => {
            if (isSuccess) {
                showLongToast(T.string.delete_note_success)
                this.props.navigationStore.navigateBack()
            }
        })


    @observable
    isEdit: boolean

    componentDidMount(): void {
        const note = this.viewModel.note

        this.setEdit(!note)

        this.props.navigation.setParams({
            [TITLE_KEY]: note ? note.title : undefined,
            [SWITCH_EDIT_KEY]: this.switchEdit,
            [IS_SHOW_ICON_KEY]: !!note
        });
    }

    @action
    switchEdit = () => {
        this.isEdit = !this.isEdit
    }

    @action
    setEdit(isEdit: boolean) {
        this.isEdit = isEdit
    }

    * renderShowNote() {
        yield (<Text>{"Название: " + this.viewModel.note.title}</Text>)
        yield (<Text style={styles.description}>{"Описание: " + this.viewModel.note.description}</Text>)

        if (this.viewModel.deleteNoteRequest.isFetching) {
            yield (<ActivityIndicator size="large"/>)
        } else {
            yield (<CommonButton onPress={this.viewModel.deletePressed}>Удалить</CommonButton>)
        }
    }

    * renderEditNote() {
        yield (<TextInput
            label='Название'
            value={this.viewModel.title.data}
            onChangeText={this.viewModel.setTitle}/>)
        yield (<HelperText
            type="error"
            visible={!this.viewModel.title.isValid}
        >{this.viewModel.title.error}</HelperText>)

        yield (<TextInput
            style={styles.description}
            label='Описание'
            value={this.viewModel.description.data}
            multiline={true}
            onChangeText={this.viewModel.setDescription}/>)
        yield (<HelperText
            type="error"
            visible={!this.viewModel.description.isValid}
        >{this.viewModel.description.error}</HelperText>)

        if (this.viewModel.saveNoteRequest.isFetching) {
            yield (<ActivityIndicator size="large"/>)
        }
        else {
            yield (<CommonButton onPress={this.viewModel.savePressed}>Сохранить</CommonButton>)
        }
    }

    * renderNote() {
        if (this.viewModel.note && !this.isEdit) {
            yield ([...this.renderShowNote()])
        } else {
            yield ([...this.renderEditNote()])
        }
    }

    render(): React.ReactNode {
        return <ScreenContainer style={styles.container}>
            {[...this.renderNote()]}
        </ScreenContainer>
    }
}

export function routeToNote(navStore: NavigationStore, note?: Note) {
    navStore.navigateTo('Note', note ? {noteId: note.id} : null)
}