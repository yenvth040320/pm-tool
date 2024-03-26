export default function({ store, redirect }) {
  const projectId = store.state.project.id
  const categoryId = store.state.category.id

  if (projectId === 0 && categoryId === 0) {
    return redirect('/project')
  } else if (projectId !== 0 && categoryId === 0) {
    return redirect('/category')
  }
}
