import { createStackNavigator, NavigationActions } from 'react-navigation'
import { MainNavigator } from './main-navigator'

export const RootNavigator = createStackNavigator(
  {
    Main: { screen: MainNavigator },
  },
  {
    headerMode: 'none',
    navigationOptions: { gesturesEnabled: false },
  },
)

export const DEFAULT_STATE = RootNavigator.router.getStateForAction(
  NavigationActions.init(),
  null,
)
