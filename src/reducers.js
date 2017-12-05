import { USER_AUTHENTICATED, USER_UNAUTHENTICATED, firebase } from 'refire-app'

export const userReducer = (state = null, action) => {
  const { payload } = action
  if (action.type === USER_AUTHENTICATED && !firebase.auth().currentUser.isAnonymous) {
    const { uid, providerId, displayName, photoURL, email } = payload
    return {
      uid,
      displayName,
      profileImageURL: photoURL,
    }
  } else if (action.type === USER_UNAUTHENTICATED) {
    return null
  } else {
    return state
  }
}
