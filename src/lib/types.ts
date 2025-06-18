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
    image: string
    name: string
    // visibility: string
    price: number
    status: string
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

export interface User {
    id: string
    name: string
    email: string
    phoneNumber: number
    state: string
    lga: string
    streetAddress: string
    branch?: string
    role: string
    status: string
    kyc: string
    admins: number
    createdAt: Date
}

export interface Branches {
    id: string
    name: string
    createdAt: Date
}
