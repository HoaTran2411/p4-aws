import {
    createTodoAccess,
    deleteTodoAccess,
    getTodoAccess,
    updateTodoAccess,
    updateTodoAttachmentUrlAccess
} from "../data-layer/TodoAccess.js"
import {pushImgToS3} from "../storage-img/imageS3.js"
import {v4 as uuidv4} from "uuid";
import dateFormat from 'dateformat';
import {decode} from "jsonwebtoken";

function parseUserId(jwtToken) {
    const decodedJwt = decode(jwtToken)
    return decodedJwt.sub
}

function getUserId(event) {
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    return parseUserId(jwtToken)
}

const getDatetime = () => {
    return dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss')
}

export async function getTodoLogic(event) {
    const userId = getUserId(event)
    const result = await getTodoAccess(userId);

    return result.Items
}

export async function createTodoLogic(event) {
    const userId = getUserId(event)
    const itemId = uuidv4()
    const parsedBody = JSON.parse(event.body)
    const todo = {
        userId: userId,
        todoId: itemId,
        ...parsedBody,
        createdAt: getDatetime(),
        done: false
    }
    await createTodoAccess(todo);
    return todo;
}

export async function addAttachMentLogic(event) {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const imageId = uuidv4();
    const url = await pushImgToS3(imageId);
    await updateTodoAttachmentUrlAccess(userId, todoId, imageId);
    return url;
}

export async function updateTodoLogic(event) {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
    await updateTodoAccess(userId, todoId, updatedTodo);
    return {
        todoId: todoId,
        done: updatedTodo.done
    };
}

export async function deleteTodoLogic(event) {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    await deleteTodoAccess(userId, todoId);
    return todoId;
}

