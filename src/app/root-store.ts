import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { getNavigationStoreModel } from '../../components/navigation/navigation-store'
import { DEFAULT_STATE, RootNavigator } from '../navigation/root-navigator'
import { NoteStoreModel } from '../stores/note-store'

/**
 * An RootStore model.
 */
// tslint:disable-next-line:variable-name
export const RootStoreModel = types.model('RootStore').props({
  navigationStore: getNavigationStoreModel(RootNavigator, DEFAULT_STATE),
  noteStore: NoteStoreModel,
})

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
