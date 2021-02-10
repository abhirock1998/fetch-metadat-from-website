import Axios from "axios";
import React, { useState } from "react";
import "./meta.css";
function Meta() {
  const [meta, setMeta] = useState({
    meta: false,
    data: null,
    input: "",
    isLoaded: false,
  });

  const isdisabled =
    meta.input === ""  ? true : false;

  const isValidUrl = (string) => {
    try {
      var link = new URL(string);
      return (link.protocol === "https" || link.protocol === "https") &&
        link.hostname !== ""
        ? true
        : false;
    } catch (e) {
      console.log(e)
      alert("Enter Valid URL");
    }
  };

  const handlefetch = async (e) => {
    e.preventDefault();
    if (isValidUrl(meta.input)) {
      setMeta((pre) => {
        return { ...pre, isLoaded: !pre.isLoaded };
      });
      await Axios.get(
        `https://opengraph.io/api/1.1/site/${encodeURIComponent(
          meta.input
        )}?accept_lang=auto&app_id=cc0cddc3-fdd4-4125-9376-37adc2a38173`
      )
        .then(async (data) => {
          setMeta((prev) => {
            return { ...prev, data: data.data };
          });
          setTimeout(() => {
            setMeta((pre) => {
              return { ...pre, meta: !pre.meta, isLoaded: !pre.isLoaded };
            });
          },5000);
        })
        .catch((e) => {
          setMeta((pre) => {
            return { ...pre, isLoaded: !pre.isLoaded };
          });
          alert("Error in fetch Meta Detail ");
          console.log("error", e, meta.data);
        });
    }
  };

  return (
    <>
      {meta.isLoaded && (
        <img
          src="https://lh3.googleusercontent.com/proxy/d2QSQDWQVpXN5I74yB2iRA-Tka-Ojh-LvnM7Y9itDfs0IvG3gXPVv8qKyfGcREc8omX24A138kJgHYlv8mmUM0xjYH1EJxiE6lqUYuLkLPmbNslB9JG4RZht2V6zD2_1VtX1kA-M2IedCvj5cAgHQXw"
          alt="spinner"
          className="meta__spinner"
        />
      )}
      <div className="meta" style={{ opacity: `${meta.isLoaded ? "0" : "1"}` }}>
        <form className="meta__form">
          <input
            value={meta.input}
            onChange={(e) => setMeta({ input: e.target.value })}
            type="url"
            placeholder="Enter https website url"
          />
          <button onClick={handlefetch} disabled={isdisabled} type="submit">
            fetch Meta tag from Given URL
          </button>
        </form>
        {meta.meta && (
          <div className="meta__data">
            <div className="meta__image">
              <img
                src={
                  meta.data?.htmlInferred.images.length !== 0
                    ? meta.data.htmlInferred.image
                    : meta.data.htmlInferred.favicon
                }
                alt=""
              />
            </div>
            <div className="meta__detail">
              <a
                rel="noreferrer"
                href={meta.data?.htmlInferred.url}
                target="_blank"
              >
                {meta.data?.htmlInferred.url}
              </a>
              <h5>{meta.data?.htmlInferred.title}</h5>
              <p>{meta.data?.htmlInferred.description}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Meta;
