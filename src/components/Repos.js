import React from "react";
import styled from "styled-components";
import { useCustomContext } from "../context/context";
import { ChartComponent, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { repos } = useCustomContext();

  let languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;

    if (!language) return total; //nothing is gonna happen

    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language].value += 1;
      total[language].stars += stargazers_count;
    }
    // console.log(total);
    return total;
  }, {});

  // console.log(languages);

  let newLanguages = Object.values(languages); //agarra los items de languages y los mete dentro de un array
  // console.log(newLanguages);
  let finalLanguages = newLanguages
    .sort((a, b) => {
      return b.value - a.value; //eso hace que devuelva el valor mas alto primero
    })
    .slice(0, 5);

  // console.log(finalLanguages);
  //most starts per language
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);
  // console.log(mostPopular);

  //stars,forks
  let starForks = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;

      total.stars[stargazers_count] = { label: name, value: stargazers_count };

      total.forks[forks] = { label: name, value: forks };

      return total;
    },
    { stars: {}, forks: {} }
  );
  console.log(starForks);
  const stars = starForks.stars;
  const newStars = Object.values(stars)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);
  // console.log(newStars);
  const forks = starForks.forks;
  const newForks = Object.values(forks)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);
  const chartData = [
    {
      label: "html",
      value: "20",
    },
    {
      label: "CSS",
      value: "40",
    },
    {
      label: "Javascript",
      value: "40",
    },
  ];

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        {/* <ChartComponent data={chartData} /> */}
        <Pie3D data={finalLanguages} />
        <Column3D data={newStars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={newForks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
