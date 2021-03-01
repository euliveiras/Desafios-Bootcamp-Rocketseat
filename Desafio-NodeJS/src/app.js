const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//{ id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 }

app.route("/repositories")
  .get(
    (request, response) => {
      return response.json(repositories)
      }
    )  
  .post(
    (request, response) => {
      const { title, url, techs }= request.body;
      const id = v4();
      const project = {
        id,
        title,
        url,
        techs,
        likes: 0
      };
      repositories.push(project);
      response.json(project);
});

app.route("/repositories/:id")
  .put(
    (request, response) => {
      const { id } = request.params;
      const { title, url, techs } = request.body;

      const repositoryIndex = repositories.findIndex((project) => project.id === id);

      if( repositoryIndex < 0 ) return response.status(400).json({error: "Repositório não encontrado"})

      const repository = {
        title,
        url,
        techs
      }

      repositories[repositoryIndex] = {...repositories[repositoryIndex], ...repository}
      
      response.json(repositories[repositoryIndex])
})
  .delete(
    (request, response) => {
      const { id } = request.params;

      const repositoryIndex = repositories.findIndex((project) => project.id === id);

      if( repositoryIndex < 0 ) return response.status(400).json({error: "Repositório não encontrado"})

      repositories.splice(repositoryIndex, 1)

      return response.status(204).send()
      
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex((project) => project.id === id);

  if( repositoryIndex < 0 ) return response.status(400).json({error: "Repositório não encontrado"});

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
