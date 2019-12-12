// export default function ({store, redirect}) {
//   if (store.state.auth.loggedIn) return redirect('/login')
// }

export default function ({ store, redirect }) {
  if (store.state.auth.loggedIn) {
    return redirect('/dashboard')
  }
}