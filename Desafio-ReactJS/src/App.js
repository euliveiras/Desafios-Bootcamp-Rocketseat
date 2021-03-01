import React, { useState, useEffect } from "react";

import api from "./services/api"

import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);

  useEffect(
    () => {
      api.get("/repositories")
      .then(response => {
        setRepositories([...response.data])
      });
    }, []
  )

  async function handleAddRepository() {
    const response  = await api.post("/repositories", {
      title: `Desafio ReactJS`,
      url: "www.globo.com",
      techs: ["NodeJS", "ReactJS"]
    })
    setRepositories([ ...repositories, response.data ])
  };

  async function handleRemoveRepository(id) {
   api.delete(`/repositories/${id}`)
   const newProjects = repositories.filter((project) => project.id !== id)
   setRepositories([...newProjects])
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {(repositories.map(
          (repository) => {
            return  <li key = {repository.id} >
                {repository.title}
              <button type ="button" onClick={() => handleRemoveRepository(repository.id)}>
                  Remover
              </button>
              </li>
        
          }
        )
        )
        }
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
