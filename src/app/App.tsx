import { Provider } from 'mobx-react'
import { contains } from 'ramda'
import React, { Component } from 'react'
import { StatefulNavigator } from '../../components/navigation'
import { BackButtonHandler } from '../../components/navigation/back-button-handler'
import { DEFAULT_NAVIGATION_CONFIG } from '../navigation/navigation-config'
import { RootStore } from './root-store'
import { setupRootStore } from './setup-root-store'

interface RootComponentState {
  rootStore?: RootStore
}

interface Props {}
export default class App extends Component<Props, RootComponentState> {
  public static canExit(routeName: string) {
    return contains(routeName, DEFAULT_NAVIGATION_CONFIG.exitRoutes)
  }
  public async componentDidMount() {
    this.setState({
      rootStore: await setupRootStore(),
    })
  }

  public render() {
    const rootStore = this.state && this.state.rootStore

    // Before we show the app, we have to wait for our state to be ready.
    // In the meantime, don't render anything. This will be the background
    // color set in native by rootView's background color.
    //
    // This step should be completely covered over by the splash screen though.
    //
    // You're welcome to swap in your own component to render if your boot up
    // sequence is too slow though.
    if (!rootStore) {
      return null
    }

    // otherwise, we're ready to render the app

    return (
      <Provider rootStore={rootStore} {...rootStore}>
        <BackButtonHandler canExit={App.canExit}>
          <StatefulNavigator />
        </BackButtonHandler>
      </Provider>
    )
  }
}
