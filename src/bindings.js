import {baseURL} from './config';

export default {
  "categories": {
    type: "Array",
    query: (ref) => ref.orderByChild("active").equalTo(true),
    path: `${baseURL}categories`,
  },
  "boards": {
    type: "Array",
    query: (ref) => ref.orderByChild("active").equalTo(true),
    path: `${baseURL}boards`,
  },
  "board": {
    type: "Object",
    path: (state, params) => (
      params.boardId
      ? `${baseURL}boards/${params.boardId}`
        : null
    ),
  },
  "boardThreads": {
    populate: (key) => `${baseURL}threads/${key}`,
    path: (state, params) => (
      params.boardId
      ? `${baseURL}boards/${params.boardId}/threads`
        : null
    ),
  },
  "thread": {
    type: "Object",
    path: (state, params) => (
      params.threadId
      ? `${baseURL}threads/${params.threadId}`
        : null
    ),
  },
  "threadPosts": {
    populate: (key) => `${baseURL}posts/${key}`,
    path: (state, params) => (
      params.threadId
      ? `${baseURL}threads/${params.threadId}/posts`
        : null
    ),
  },
  "user": {
    type: "Object",
    path: (state) => (
      state.firebase.authenticatedUser
        ? `${baseURL}users/${state.firebase.authenticatedUser.uid}`
        : null
    ),
  },
  "profile": {
    type: "Object",
    path: (state, params) => (
      params.uid
        ? `${baseURL}users/${params.uid}`
        : null
    ),
  },
  "profileThreadsStarted": {
    populate: (key) => `${baseURL}threads/${key}`,
    query: (ref) => ref.orderByKey().limitToLast(10),
    path: (state, params) => (
      params.uid
        ? `${baseURL}users/${params.uid}/threadsStarted`
        : null
    ),
  },
  "adminUsers": {
    type: "Array",
    path: (state) => (
      state.firebase.authenticatedUser
        ? `${baseURL}adminUsers`
        : null
    ),
  },
  "settings": {
  path: `${baseURL}settings`,
  },
}
