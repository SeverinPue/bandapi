"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState, ChangeEvent } from "react";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

interface Band {
  name: string;
  categories: { name: string }[];
  permalink: string;
}

export default function Home() {
  const [suchen, setSuchen] = useState<string>("");
  const [response, setResponse] = useState<Band[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSuchen(event.target.value);
  };

  async function onclick() {
    setResponse([])
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.srgssr.ch/mx3/v2/bands?query=${suchen}`, {
        headers: {
          accept: "application/json",
          authorization: "Bearer cXhrps2Ao1rA8NLmWx17WSsnHSyj",
        },
      });
      const data = await res.json();
      setResponse(data.response.bands);
    } catch (error) {
      console.error(error);
      alert("There has been an Error!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <input
        type="text"
        name="suchen"
        onChange={handleInputChange}
        value={suchen}
        id="suchenEingabe"
      />
      <button onClick={onclick} >Suchen</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Kategorie</th>
            <th>Permalink</th>
          </tr>
        </thead>
        <tbody>
          {response.map((band, idx) => (
            <tr key={idx}>
              <td>{band.name}</td>
              <td>
                {band.categories.map((category) => (
                  <p key={category.name}>{category.name}</p> 
                ))}
              </td>
              <td><a href={band.permalink}>{band.permalink}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && <img width="100px" src="/ladengif.gif"></img>}
    </>
  );
}
