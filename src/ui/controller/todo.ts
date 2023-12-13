import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControllerGetParams {
  page: number;
}
async function get(params: TodoControllerGetParams) {
  // Fazer a lógica de pegar os dados
  return todoRepository.get({
    page: params.page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Array<Todo> {
  const homeTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });

  return homeTodos;
}

interface TodoControllerCreateParams {
  content?: string;
  onError: (customMessage?: string) => void;
  onSuccess: (todo: Todo) => void;
}
async function create({
  content,
  onError,
  onSuccess,
}: TodoControllerCreateParams) {
  // Fail fast se não tiver o content
  const parsedParams = schema.string().min(1).safeParse(content);
  if (!parsedParams.success) {
    onError();
    return;
  }

  try {
    const todo = await todoRepository.createByContent(parsedParams.data);

    onSuccess(todo);
  } catch (_) {
    onError();
  }
}

interface TodoControllerToggleDoneParams {
  todoId: string;
  updateTodoOnScreen: () => void;
  onError: () => void;
}

function toggleDone({
  todoId,
  updateTodoOnScreen,
  onError,
}: TodoControllerToggleDoneParams) {
  // Optimistic Update
  // updateTodoOnScreen();

  // Realistic Update
  todoRepository
    .toggleDone(todoId)
    .then(() => updateTodoOnScreen())
    .catch(() => {
      onError();
    });
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
};
