import cors from '@middy/http-cors'
import middy from '@middy/core'
import {createLogger} from '../../logger/LoggerUtils.mjs'
import httpErrorHandler from '@middy/http-error-handler'
import {createTodoLogic} from '../../business-logic/TodoLogic.js'

const log = createLogger('Event: Create todo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
        credentials: true
    })
  )
  .handler(async (ev) => {
      console.log('Event: ', ev)
      const taskTodo = await createTodoLogic(ev);
      log.info('Created success', {
          todo: taskTodo
      })
      return {
          statusCode: 201,
          body: JSON.stringify({
              item: taskTodo
          })
      }
  })

