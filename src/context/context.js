import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  //request loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  //error
  const [error, setError] = useState({ show: false, msg: "" });

  const checkRequests = async () => {
    let response = null;
    try {
      response = await axios.get(`${rootUrl}/rate_limit`);
      let remaining = response.data.rate.remaining;
      console.log(remaining);
      setRequests(remaining);

      if (remaining === 0) {
        toggleError(true, "sorry, you have exceeded your hourly rate limit!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //en los parametros pongo los valores default para cuando invoque toggle error

  const searchGithubUser = async (user) => {
    //toggleError
    toggleError(); //le da a error los valores default por defecto

    setIsLoading(true);

    try {
      const response = await axios.get(`${rootUrl}/users/${user}`);
      console.log(response);
      //si pongo un usuario que no existe resposne va a ser undefined
      if (response) {
        setGithubUser(response.data);
        console.log(`user`);

        const { login, followers_url, repos_url } = response.data;

        const repos = axios.get(`${repos_url}?per_page=100`);

        const followers = axios.get(`${followers_url}?per_page=100`);

        const result = await Promise.allSettled([repos, followers]);
        setRepos(result[0].value.data);
        setFollowers(result[1].value.data);

        //repos https://api.github.com/users/john-smilga/repos?per_page=100

        //followers https://api.github.com/users/john-smilga/followers

        //more stuff coming up
      }
    } catch (error) {
      toggleError(true, "there is no user with that username");
      console.log(error);
    }
    setIsLoading(false);
    checkRequests();
  };

  function toggleError(show = false, msg = "") {
    setError({ show: show, msg: msg }); //just to be clear
  }

  //check rate
  useEffect(() => {
    checkRequests();
  }, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

const useCustomContext = () => {
  return useContext(GithubContext);
};

export { GithubProvider, useCustomContext };
