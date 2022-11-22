import { setActivePinia, createPinia } from 'pinia'
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { useTodoStore } from './todo'

beforeAll(() => {
  setActivePinia(createPinia())
})

describe('runs', () => {
  test('it works', () => {
    expect(true).toBe(true)
  })

  let store: ReturnType<typeof useTodoStore>
  beforeEach(() => {
    store = useTodoStore()
  })

  afterEach(() => {
    store.$reset()
  })

  test('create a store', () => {
    expect(store).toBeDefined()
  })

  test('initialize with empty items', () => {
    expect(store.items).toStrictEqual([])
  })

  test('create a todo', () => {
    store.add({title: 'test my code'})
    expect(store.items[0]).toBeDefined()
    expect(store.items[0].title).toBe('test my code')
  })

  test('gets by id', () => {
    store.add({title: 'test'})
    const item = store.items[0]
    const todo = store.getById(item.id)

    expect(todo).toStrictEqual(item)
  })

  test('gets ordered todos without mutating state', () => {
    const items = [
      {
        createdAt: new Date(2021, 11, 14)
      },
      {
        createdAt: new Date(2022, 2, 6)
      },
      {
        createdAt: new Date(2020, 6, 24)
      },
    ]
    // @ts-ignore
    store.items = items
    const storeItems = store.items

    const orderedTodos = store.getOrderedTodos
    expect(orderedTodos[0].createdAt.getFullYear()).toBe(2020)
    expect(orderedTodos[1].createdAt.getFullYear()).toBe(2021)
    expect(orderedTodos[2].createdAt.getFullYear()).toBe(2022)
  
    expect(storeItems).toBe(store.items)
  })

  test('removes a todo', () => {
    store.add({title: 'test'})
    const todo = store.items[0]
    store.remove(todo.id)
    expect(store.items).toStrictEqual([])
  })

  test('update a todo done', () => {
    store.add({title: 'test'})
    const todo = store.items[0]
    store.update(todo.id, {done: true})
    expect(store.items[0].done).toBe(true)
  })

  test('update a todo title', () => {
    store.add({title: 'test'})
    const todo = store.items[0]
    store.update(todo.id, {title: 'changed'})
    expect(store.items[0].title).toBe('changed')
  })
})