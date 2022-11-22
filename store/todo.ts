import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'

export interface Todo {
  id: string
  title: string
  done: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TodoUpdate {
  title?: string
  done?: boolean
}

export interface TodoState {
  items: Todo[] | undefined[]
}

export interface TodoAdd {
  title: string
}

const state = (): TodoState => ({
  items: []
})
const getters = {
  getById: (state: TodoState) => (id: string) => {
    return state.items.find((item: Todo) => item.id === id)
  },
  getOrderedTodos: (state: TodoState) => {
    return [...state.items].sort((a: Todo, b: Todo) => {
      return (a.createdAt.getTime() - b.createdAt.getTime())
    })
  }
}
const actions = {
  add(partialTodo: TodoAdd) {
    const todo: Todo = {
      id: uuid(),
      ...partialTodo,
      done: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.items.push(todo)
  },
  updateTodoHelper: (items: Todo[], id: string, handler: (index: number) => void) => {
    const index = items.findIndex(todo => todo.id === id)
    if (index !== -1) {
      handler(index)
    } else {
      console.log('wrong todo id')
    }
  },
  remove(id: string) {
    actions.updateTodoHelper(this.items, id, (index) => {
      this.items.splice(index, 1)
    })
  },
  update(id: string, update: TodoUpdate) {
    actions.updateTodoHelper(this.items, id, (index) => {
      this.items[index] = {...this.items[index],  ...update, updatedAt: new Date()}
    })
  }
}

export const useTodoStore = defineStore('todoStore', {
  state,
  getters,
  actions
})
