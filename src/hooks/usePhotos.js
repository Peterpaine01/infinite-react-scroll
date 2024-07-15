import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";

export default function usePhotos(querySearch, pageIndex) {
  const [error, setError] = useState({
    msg: "",
    state: false,
  });
  const [photos, setPhotos] = useState([]);
  const [maxPages, setMaxPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (photos.lenght !== 0 && maxPages !== 0) {
      setPhotos([]);
      setMaxPages(0);
    }
  }, [querySearch]);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${querySearch}&client_id=${
        import.meta.env.VITE_UNSPLASH_KEY
      }`
    )
      .then((response) => {
        //console.log(response);
        if (!response.ok)
          throw new Error(`${response.status} Error, Something went wrong`);
        return response.json();
      })
      .then((data) => {
        if (data.error) return null;
        setPhotos((state) => [...state, ...data.results]);
        setMaxPages(data.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        setError({
          msg: err.message,
          state: true,
        });
        setLoading(false);
      });
  }, [querySearch, pageIndex]);

  //console.log(photos);

  return { error, photos, maxPages, loading };
}
