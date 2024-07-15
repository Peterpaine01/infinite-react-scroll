import React, { useState, useEffect, useRef } from "react";
import usePhotos from "../hooks/usePhotos";

import Spinner from "../assets/spinner.svg";

export default function List() {
  const [query, setQuery] = useState("random");
  const [pageNumber, setPageNumber] = useState(1);
  const lastPicRef = useRef();
  const searchRef = useRef();
  const photosApiData = usePhotos(query, pageNumber);
  console.log("photosApiData > ", photosApiData);

  useEffect(() => {
    if (lastPicRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && photosApiData.maxPages !== pageNumber) {
          setPageNumber(pageNumber + 1);
          lastPicRef.current = null;
          observer.disconnect();
        }
      });
      observer.observe(lastPicRef.current);
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (searchRef.current.value !== query) {
      setQuery(searchRef.current.value);
      setPageNumber(1);
    }
  }

  return (
    <>
      <h1 className="text-4xl">Unsplash Clone.</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search" for="search" className="block mb-4">
          Look for images...
        </label>
        <input
          ref={searchRef}
          type="text"
          for="search"
          id="search"
          placeholder="Look for something..."
          className="block w-full mb-14 text-slate-800 py-3 px-2 text-md outline-gray-500 rounded border border-slate-400"
        />
      </form>
      {/* Affichage erreur */}
      {photosApiData.error.state && <p>{photosApiData.error.msg}</p>}

      {/* Pas d'erreur mais pa de résultats */}
      {photosApiData.photos.length === 0 &&
        !photosApiData.error.state &&
        !photosApiData.loading && <p>No image available for this query</p>}

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] auto-rows-[175px] gap-4 justify-center">
        {!photosApiData.loader &&
          photosApiData.photos.length !== 0 &&
          photosApiData.photos.map((photo, index) => {
            if (photosApiData.photos.length === index + 1) {
              return (
                <li ref={lastPicRef} key={`${photo.id}-${index}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />
                </li>
              );
            } else {
              return (
                <li key={`${photo.id}-${index}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />
                </li>
              );
            }
          })}
      </ul>
      {/* LOADER */}
      {photosApiData.loading && !photosApiData.error.state && (
        <img className="block mx-auto" src={Spinner} />
      )}

      {/* Quand on atteint la dernière page */}
      {photosApiData.maxPages === pageNumber && (
        <p className="mt-10 pb-20">No more images to show for this query</p>
      )}
    </>
  );
}
