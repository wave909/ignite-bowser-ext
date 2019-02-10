import {Instance, SnapshotOut, types} from "mobx-state-tree"
import {RootNavigator, DEFAULT_STATE} from "../navigation/root-navigator";
import {NoteStoreModel} from "../stores/note-store";
import {getNavigationStoreModel} from "../../components/navigation/navigation-store";

/**
 * An RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    navigationStore: getNavigationStoreModel(RootNavigator, DEFAULT_STATE),
    noteStore: NoteStoreModel,
});

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
