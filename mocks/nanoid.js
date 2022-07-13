jest.mock('nanoid', () => {
  return { nanoid: () => (Math.random() + 1).toString(36).substring(7) }
})
