const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function repositoryExists(request, response, next) {
  const { id } = request.params

  const repository = repositories.find((repository) => repository.id === id)

  if(!repository)
    return response.status(404).json({error: "Repository not found"})
  
    request.repository = repository;

    return next()

}


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", repositoryExists, (request, response) => {  
  const { title, url, techs } = request.body;
  let { repository }  = request
  
  repository.title = title ? title : repository.title
  repository.url = url ? url : repository.url
  repository.techs = techs? techs : repository.techs

  return response.json(repository);
});

app.delete("/repositories/:id", repositoryExists, (request, response) => {
  
  const { repository } = request

  const repositoryIndex = repositories.findIndex((auxRepository) => auxRepository.id === repository.id)

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", repositoryExists, (request, response) => {
  const { repository } = request

  ++repository.likes;

  return response.json(repository);
});

module.exports = app;
