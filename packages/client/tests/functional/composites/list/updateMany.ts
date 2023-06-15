import { faker } from '@faker-js/faker'
import { getQueryEngineProtocol } from '@prisma/internals'

import { setupTestSuite } from './_matrix'
import { commentListDataA } from './_testData'
// @ts-ignore
import type { PrismaClient } from './node_modules/@prisma/client'

declare let prisma: PrismaClient

setupTestSuite(() => {
  let id
  beforeEach(async () => {
    id = faker.database.mongodbObjectId()
    await prisma.commentRequiredList.create({ data: commentListDataA(id) })
  })

  test('set', async () => {
    const comment = await prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        country: 'Mars',
        contents: {
          set: [
            {
              text: 'Goodbye World',
              upvotes: {
                vote: false,
                userId: '42',
              },
            },
          ],
        },
      },
    })

    expect(comment).toEqual({ count: 1 })
  })

  test('set shorthand', async () => {
    const comment = await prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        country: 'Mars',
        contents: {
          text: 'Goodbye World',
          upvotes: {
            vote: false,
            userId: '42',
          },
        },
      },
    })

    expect(comment).toEqual({ count: 1 })
  })

  testIf(getQueryEngineProtocol() !== 'json')('set null', async () => {
    const comment = prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        country: 'France',
        contents: {
          set: null,
        },
      },
    })

    await expect(comment).rejects.toThrow(
      expect.objectContaining({
        message: expect.stringContaining('Argument set for data.contents.set must not be null'),
      }),
    )
  })

  testIf(getQueryEngineProtocol() !== 'json')('set null shorthand', async () => {
    const comment = prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        country: 'France',
        contents: null,
      },
    })

    await expect(comment).rejects.toThrow(
      expect.objectContaining({
        message: expect.stringContaining('Argument contents for data.contents must not be null'),
      }),
    )
  })

  test('set nested list', async () => {
    const comment = await prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        country: 'Mars',
        contents: {
          set: {
            text: 'Goodbye World',
            upvotes: [
              { userId: '10', vote: false },
              { userId: '11', vote: false },
            ],
          },
        },
      },
    })

    expect(comment).toEqual({ count: 1 })
  })

  test('push', async () => {
    const comment = await prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        contents: {
          push: {
            text: 'Goodbye World',
          },
        },
      },
    })

    expect(comment).toEqual({ count: 1 })
  })

  test('updateMany', async () => {
    const comment = await prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        contents: {
          updateMany: {
            data: {
              upvotes: [{ userId: 'Another Comment', vote: true }],
            },
            where: {
              upvotes: {
                isEmpty: false,
              },
            },
          },
        },
      },
    })

    expect(comment).toEqual({ count: 1 })
  })

  test('deleteMany', async () => {
    const comment = await prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        contents: {
          deleteMany: {
            where: {
              upvotes: {
                isEmpty: false,
              },
            },
          },
        },
      },
    })

    expect(comment).toEqual({ count: 1 })
  })

  testIf(getQueryEngineProtocol() !== 'json')('unset', async () => {
    const comment = prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        contents: {
          unset: true,
        },
      },
    })

    await expect(comment).rejects.toThrow(
      expect.objectContaining({
        message: expect.stringContaining(
          'Unknown arg `unset` in data.contents.unset for type CommentContentListUpdateEnvelopeInput',
        ),
      }),
    )
  })

  testIf(getQueryEngineProtocol() !== 'json')('upsert set', async () => {
    const comment = prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        contents: {
          upsert: {
            update: {},
            set: {
              text: 'Hello World',
            },
          },
        },
      },
    })

    await expect(comment).rejects.toThrow(
      expect.objectContaining({
        message: expect.stringContaining(
          'Unknown arg `upsert` in data.contents.upsert for type CommentContentListUpdateEnvelopeInput',
        ),
      }),
    )
  })

  testIf(getQueryEngineProtocol() !== 'json')('upsert update', async () => {
    const comment = prisma.commentRequiredList.updateMany({
      where: { id },
      data: {
        contents: {
          upsert: {
            update: {
              text: 'Hello World',
              upvotes: {
                push: {
                  userId: '10',
                  vote: true,
                },
              },
            },
            set: {
              text: 'Hello World',
            },
          },
        },
      },
    })

    await expect(comment).rejects.toThrow(
      expect.objectContaining({
        message: expect.stringContaining(
          'Unknown arg `upsert` in data.contents.upsert for type CommentContentListUpdateEnvelopeInput',
        ),
      }),
    )
  })
})
