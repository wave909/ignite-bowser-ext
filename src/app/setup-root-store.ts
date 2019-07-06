import { onSnapshot } from 'mobx-state-tree'
import Realm from 'realm'
import * as storage from '../../components/storage'
import { Note } from '../services/database/schemas/note'
import { Reactotron } from '../services/reactotron'
import { Environment } from './environment'
import { RootStore, RootStoreModel } from './root-store'

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = 'root'

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  let rootStore: RootStore
  let data: any

  // prepare the environment that will be associated with the RootStore.
  const env = await createEnvironment()
  try {
    // load data from storage
    data = (await storage.load(ROOT_STATE_STORAGE_KEY)) || {}
    rootStore = RootStoreModel.create(data, env)
  } catch (e) {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    rootStore = RootStoreModel.create({} as any, env)

    // but please inform us what happened
    // tslint:disable-next-line:no-unused-expression
    __DEV__ && console.error(e.message, null)
  }

  // reactotron logging
  if (__DEV__) {
    env.reactotron.setRootStore(rootStore, data)
  }

  // Put here stores, which don't save onSnapshot
  const unsaveStores = {}

  // track changes & save to storage
  onSnapshot(rootStore, snapshot => {
    storage.save(ROOT_STATE_STORAGE_KEY, { ...snapshot, ...unsaveStores })
  })

  return rootStore
}

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment() {
  const env = new Environment()

  // create each service
  env.reactotron = new Reactotron()

  // allow each service to setup
  await env.reactotron.setup()

  env.realm = await Realm.open({
    schema: [Note.schema],
    schemaVersion: 1,
    deleteRealmIfMigrationNeeded: true,
  })

  return env
}
