/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/rules-of-hooks */
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link as LinkScroll } from "react-scroll";
import { Header } from "../../components/Header";
import api from "../../_services/api";
import styles from "./dashboard.module.scss";

interface IUser {
  avatar_url: string;
  login: string;
  name: string;
  bio: string;
  location: string;
  company: string;
  twitter_username: string;
}

interface IRepository {
  id: number;
  name: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}
export function Home() {
  const [username, setUsername] = useState("");
  const [repositories, setRepositories] = useState<IRepository[]>([]);
  const [inputError, setInputError] = useState("");
  const [typeRepository, setTypeRepository] = useState("");

  const [user, setUser] = useState<IUser>(() => {
    // ARMAZENAMENTO USUÀRIOS LOCALSTORAGE
    const storagedRepositories = localStorage.getItem("@GithubExplorer:user");

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    } else {
      return [];
    }
  });

  // ARMAZENAMENTO USUÀRIOS LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("@GithubExplorer:user", JSON.stringify(user));
  }, [user]);

  /**
   *  Chamada endpoint de acordo o value
   * @function handleGetRepository
   * @param {*} value repos ou starred
   * @param {*} username  login do usuário
   * Endpoint: https://api.github.com/users/username/@value (repos) ou (starred)
   */
  const handleGetRepository = useCallback(
    async (value: string) => {
      if (value) {
        const reposResponse = await api.get<IRepository[]>(
          `${user?.login}/${value}`
        );
        setRepositories(reposResponse.data);
      }
    },
    [user?.login]
  );

  /**
   *
   * @function handleSubmit
   * * @param {*} event pegando os eventos padrões do formulário.
   *  Fazendo a primeira chamada api onde,
   *  encontramos o usuário digitado @username
   *  Endpoint user: https://api.github.com/users/@username
   */
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!username) {
        setInputError("Digite seu login do github");
        return;
      }

      try {
        const profileResponse = await api.get<IUser>(`${username}`);
        if (profileResponse) {
          setUser(profileResponse.data);
        }
        setInputError(""); //LIMPANDO A MENSAGEM DE ERRO.
        setRepositories([]);
        setUsername("");
      } catch (error) {
        console.log(error);
        setInputError(" Erro na busca por esse usuário");
      }
    },
    [username]
  );

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Explore repositórios no Github</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            placeholder="Pesquisar usuários"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // evento de mudança
          />
          <button type="submit">Pesquisar</button>
        </form>
        {inputError && <span className={styles.errorInput}>{inputError}</span>}{" "}
        {user?.name && (
          <div className={styles.respositories}>
            <a key={user?.name} href={`/repositories/${user?.name}`}>
              <img src={user?.avatar_url} alt={user?.name} />

              <div>
                <strong>{user?.name}</strong>
                <p>{user.login}</p>
                <p>{user?.bio}</p>
              </div>
            </a>
            <div className={styles.groupButton}>
              <LinkScroll
                className={styles.button}
                to="table"
                smooth
                duration={2000}
                onClick={() => {
                  handleGetRepository("repos");
                  setTypeRepository("repos");
                }}
              >
                Visualizar Repositórios
              </LinkScroll>
              <LinkScroll
                className={styles.button}
                to="table"
                smooth
                duration={2000}
                onClick={() => {
                  handleGetRepository("starred");
                  setTypeRepository("starred");
                }}
              >
                Mais visitados
              </LinkScroll>
            </div>
            <span id="table" />

            <div>
              {typeRepository === "repos" && repositories.length > 0 && (
                <h2>Repositórios</h2>
              )}
              {typeRepository === "starred" && repositories.length > 0 && (
                <h2>Mais Visitados</h2>
              )}
              {repositories.map((repository) => (
                <a
                  href={repository.html_url}
                  key={repository.id}
                  target="_blank"
                  className={styles.repo}
                >
                  <div className={styles.repository}>
                    <strong>{repository.name}</strong>
                    <div>
                      <span>Starts:{repository.stargazers_count}</span>
                      <span>Forks:{repository.forks_count}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        <div id="table" />
      </main>
    </>
  );
}
