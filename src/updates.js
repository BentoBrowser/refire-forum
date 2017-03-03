import { firebase } from 'refire-app'
import includes from 'lodash/includes'
import {baseURL} from './config'

export function newThread({ boardId, topic, text, user }) {
  const ref = firebase.database().ref()
  const threadKey = ref.child(`${baseURL}threads`).push().key
  const postKey = ref.child(`${baseURL}posts`).push().key

  return {
    [`${baseURL}boards/${boardId}/threads/${threadKey}`]: true,
    [`${baseURL}threads/${threadKey}`]: {
      title: topic,
      boardId: boardId,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      lastPostAt: firebase.database.ServerValue.TIMESTAMP,
      user: {
        displayName: user.displayName,
        image: user.profileImageURL,
        id: user.uid,
      },
      posts: {
        [postKey]: true,
      },
    },
    [`${baseURL}posts/${postKey}`]: {
      body: text,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      threadId: threadKey,
      user: {
        displayName: user.displayName,
        image: user.profileImageURL,
        id: user.uid,
      },
    },
    [`${baseURL}users/${user.uid}/threadsStarted/${threadKey}`]: true,
    [`${baseURL}users/${user.uid}/posts/${postKey}`]: true,
  }
}

export function deleteThread({ threadKey, thread }) {
  const posts = Object.keys(thread.posts).reduce((paths, postId) => {
    return {
      ...paths,
      [`${baseURL}posts/${postId}`]: null,
      [`${baseURL}users/${thread.user.id}/posts/${postId}`]: null,
    }
  }, {})

  return {
    ...posts,
    [`${baseURL}threads/${threadKey}`]: null,
    [`${baseURL}boards/${thread.boardId}/threads/${threadKey}`]: null,
    [`${baseURL}users/${thread.user.id}/threadsStarted/${threadKey}`]: null,
  }
}

export function toggleThreadLocked({ threadKey, thread }) {
  return {
    [`${baseURL}threads/${threadKey}/locked`]: !thread.locked,
  }
}

export function replyToThread({ threadKey, text, replyToKey, user }) {
  const ref = firebase.database().ref()
  const postKey = ref.child(`${baseURL}posts`).push().key
  replyToKey = replyToKey === undefined ? null : replyToKey

  return {
    [`${baseURL}threads/${threadKey}/posts/${postKey}`]: true,
    [`${baseURL}threads/${threadKey}/lastPostAt`]: firebase.database.ServerValue.TIMESTAMP,
    [`${baseURL}posts/${postKey}`]: {
      body: text,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      threadId: threadKey,
      replyTo: replyToKey,
      user: {
        displayName: user.displayName,
        image: user.profileImageURL,
        id: user.uid,
      },
    },
    [`${baseURL}users/${user.uid}/posts/${postKey}`]: true,
  }
}

export function deletePost({ postKey, post }) {
  return {
    [`${baseURL}threads/${post.threadId}/posts/${postKey}`]: null,
    [`${baseURL}posts/${postKey}`]: null,
    [`${baseURL}users/${post.user.id}/posts/${postKey}`]: null,
  }
}

export function saveSetting({ userId, setting, value }) {
  return {
    [`${baseURL}users/${userId}/settings/${setting}`]: value,
  }
}

export function toggleUpvote({ postKey, post, user }) {
  const value = includes(Object.keys(post.value.likes || {}),user.uid) ? null : true
  return {
    [`${baseURL}posts/${postKey}/likes/${user.uid}`]: value,
    [`${baseURL}users/${user.uid}/likes/${postKey}`]: value,
  }
}

export function savePost({ postKey, text, user }) {
  return {
    [`${baseURL}posts/${postKey}/body`]: text,
    [`${baseURL}posts/${postKey}/edited`]: true,
    [`${baseURL}posts/${postKey}/editedLast`]: firebase.database.ServerValue.TIMESTAMP,
    [`${baseURL}posts/${postKey}/editedBy`]: user.uid,
  }
}
