import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import { SectionList, StyleSheet, Text } from 'react-native'
import { FAB, TouchableRipple } from 'react-native-paper'
import ContentState from '../../components/content-state'
import {
  renderEmptyView,
  renderErrorView,
} from '../../components/design/flat-alert'
import { NavigationStore } from '../../components/navigation/navigation-store'
import { Note } from '../services/database/schemas/note'
import { NoteStore } from '../stores/note-store'
import {
  createBasicNavigationOptions,
  ScreenContainer,
} from '../style/navigation'
import { T } from '../style/values'
import { NoteListViewModel } from '../view-models/note-list'
import { buttonProps } from '../views/button'
import { routeToNote } from './note'

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: T.spacing.default,
    backgroundColor: T.color.accent,
    right: 0,
    bottom: 0,
  },
  item: {
    paddingStart: T.spacing.default,
    paddingEnd: T.spacing.default,
    paddingTop: T.spacing.small,
    paddingBottom: T.spacing.small,
  },
})

interface NoteListProps {
  noteStore?: NoteStore
  navigationStore?: NavigationStore
}

@inject('noteStore')
@inject('navigationStore')
@observer
export class NoteListScreen extends Component<NoteListProps> {
  public static navigationOptions = () =>
    createBasicNavigationOptions('Список заметок')

  public static keyExtractor(item: Note) {
    return item.id.toString()
  }

  public readonly viewModel = new NoteListViewModel(this.props.noteStore)

  public renderNoteList = (noteList: Note[]) => (
    <SectionList
      sections={[{ data: noteList }]}
      renderItem={this.renderItem}
      keyExtractor={NoteListScreen.keyExtractor}
    />
  )

  public renderItem = ({ item }: { item: Note }) => (
    <TouchableRipple style={styles.item} onPress={this.routeToNote(item)}>
      <Text>{item.title}</Text>
    </TouchableRipple>
  )

  public routeToNote = (note: Note) => () => {
    routeToNote(this.props.navigationStore, note)
  }

  public routeToCreateNote = () => {
    routeToNote(this.props.navigationStore)
  }

  public render() {
    return (
      <ScreenContainer>
        <ContentState
          isFetching={this.viewModel.noteListRequest.isFetching}
          error={this.viewModel.noteListRequest.error}
          dataSource={
            this.props.noteStore.noteList
              ? this.props.noteStore.noteList.slice()
              : null
          }
          renderData={this.renderNoteList}
          renderEmpty={renderEmptyView(
            T.string.note_list_empty,
            this.viewModel.loadNoteList,
            null,
            null,
            buttonProps,
          )}
          renderError={renderErrorView(
            this.viewModel.loadNoteList,
            null,
            null,
            buttonProps,
          )}
        />
        <FAB
          style={styles.fab}
          icon="add"
          color={'white'}
          onPress={this.routeToCreateNote}
        />
      </ScreenContainer>
    )
  }
}
