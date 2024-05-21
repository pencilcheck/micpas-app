import { render, redirect } from 'vike/abort'

export const guard = (pageContext) => {
  const { user } = pageContext
  if (user) {
    throw redirect('/ywwu') // login automatically
  }
}
