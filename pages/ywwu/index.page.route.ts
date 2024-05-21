import { render, redirect } from 'vike/abort'

export const guard = (pageContext) => {
  const { user } = pageContext
  if (!user) {
    // Render the login page while preserving the URL. (This is novel technique
    // which we explain down below.)
    throw render('/?loginfailed')
    /* The more traditional way, redirect the user:
    throw redirect('/login')
    */
  }
}
