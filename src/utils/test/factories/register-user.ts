import { faker } from '@faker-js/faker'

interface RegisterRequestData {
  name: string
  email: string
  password: string
}

export function registerRandomUser(): RegisterRequestData {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}
