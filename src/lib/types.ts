export interface Plan {
    id: string
    name: string
    amount: number
    image: string
    status: string
    tenure: number
    description: string
    createdAt: Date
}

export interface Store {
    id: string
    name: string
    amount: number
    image: string
    status: string
    tenure: number
    description: string
    createdAt: Date
}

export interface State {
  name: string,
  lgas: string[],
}

export interface Prospect {
    id: string
    name: string
    amount: number
    image: string
    status: string
    tenure: number
    description: string
    createdAt: Date
}

export interface Branches {
    id: string
    name: string
    createdAt: Date
}
