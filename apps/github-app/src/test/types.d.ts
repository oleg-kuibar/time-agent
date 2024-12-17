declare namespace jest {
  interface Matchers<R> {
    toBeWithinRange(a: number, b: number): R
  }
}

declare module '@prisma/client' {
  interface PrismaClient {
    $connect: jest.Mock
    $disconnect: jest.Mock
    organization: {
      findMany: jest.Mock
      create: jest.Mock
      findUnique: jest.Mock
      update: jest.Mock
    }
    repository: {
      create: jest.Mock
      findUnique: jest.Mock
      update: jest.Mock
    }
    pullRequest: {
      create: jest.Mock
      update: jest.Mock
      findMany: jest.Mock
    }
    weeklyReport: {
      create: jest.Mock
      update: jest.Mock
      findUnique: jest.Mock
      findMany: jest.Mock
    }
  }
}
