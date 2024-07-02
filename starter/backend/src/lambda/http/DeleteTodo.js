import cors from "@middy/http-cors";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import {createLogger} from '../../logger/LoggerUtils.mjs'
import {deleteTodoLogic} from "../../business-logic/TodoLogic.js";

const log = createLogger('Event: Delete todo!')

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
    .handler(async (ev) => {
        console.log('Event: ', ev)
        const todoId = await deleteTodoLogic(ev);
        log.info('Deleted successfully!', {
            todoId: todoId
        })
        return {
            statusCode: 200,
            body: 'Deleted successfully!'
        }
    })
