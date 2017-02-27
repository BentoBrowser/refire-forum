import refireApp, { firebase } from 'refire-app'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { momentLocaleSetup } from './utils'
import 'native-promise-only'
import { baseURL } from './config'

injectTapEventPlugin()
momentLocaleSetup()

// import elemental css
import '../../node_modules/elemental/less/elemental.less'
// highlight.js
import '../../node_modules/highlight.js/styles/default.css'

import { userReducer } from './reducers'

import { apiKey, projectId } from './config'
import bindings from './bindings'
import routes from './routes'

import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'

const history = useRouterHistory(createHistory)({
  basename: '/forum'
})

refireApp({
  apiKey,
  projectId,
  bindings,
  routes,
  history,
  reducers: {
    authenticatedUser: userReducer,
  },
  pathParams: (state) => state.routing.params,
  onAuth: (authData, ref) => {
    // update users/:uid with latest user data after successful authentication
    if (authData && authData.uid && !authData.isAnonymous) {
      const { uid, displayName, photoURL, email } = authData
      ref.child(`users/${uid}`).update({
        displayName,
        profileImageURL: photoURL,
        lastLoginAt: firebase.database.ServerValue.TIMESTAMP,
      })
      // set registeredAt to current timestamp if this is the first login
      ref.child(`users/${uid}/registeredAt`).transaction((registeredAt) => {
        if (!registeredAt) {
          return firebase.database.ServerValue.TIMESTAMP
        }
      })
    }
  },
})
