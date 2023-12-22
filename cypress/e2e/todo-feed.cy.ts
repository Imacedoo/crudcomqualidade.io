const BASE_URL = "http://localhost:3000";

describe("/ - Todos feed", () => {
  it("when load, render the page", () => {
    cy.visit(BASE_URL);
  });

  it("when create a new todo, it must appears in the screen", () => {
    // 0 - Interceptações
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "391f70ce-122f-46e8-8caa-7ed7520a8fa5",
            date: "2023-12-13T19:14:16.716Z",
            content: "Test todo",
            done: true,
          },
        },
      });
    }).as("createTodo");

    // 1 - Abrir a página
    cy.visit(BASE_URL);

    // 2 - Selecionar o input de criar nova todo
    // 3 - Digitar no input de criar nova todo
    const inputAddTodo = "input[name='add-todo'";
    cy.get(inputAddTodo).type("Test todo");

    // 4 - Clicar no botão
    const buttonAddTodo = "[aria-label='Adicionar novo item']";
    cy.get(buttonAddTodo).click();

    // 5 - Checar se na página surgiu um novo elemento
    cy.get("table > tbody").contains("Test todo");
  });
});
