import React, { useEffect, useRef, useState } from "react";

import {
  twitter_image,
  telegram_image,
  discord_image,
  facebook_image,
  reddit_image,
  doc_image,
  github_image,
} from "../assets";

const Info = ({ SelectedAsset }) => {
  const [MetaInfo, setMetaInfo] = useState({
    website: [],
    twitter: [],
    telegram: [],
    discord: [],
    facebook: [],
    reddit: [],
    doc: [],
    github: [],
    logo: "",
  });
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    if (SelectedAsset == "" || SelectedAsset == null) {
      return;
    }
    console.log("aaaaaaaaaaaaaaa");
    console.log(SelectedAsset);
    console.log("aaaaaaaaaaaaaaa");
    fetchMetaInfo(SelectedAsset);
  }, [SelectedAsset]);

  useEffect(() => {
    setLoad(false);
  }, [MetaInfo]);

  const fetchMetaInfo = () => {
    fetch(`http://127.0.0.1:5000/metainfo?asset=${SelectedAsset}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        console.log(data);
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        setMetaInfo({
          website: data.website,
          twitter: data.twitter,
          telegram: data.telegram,
          discord: data.discord,
          facebook: data.facebook,
          reddit: data.reddit,
          doc: data.technical_doc,
          github: data.source_code,
          logo: data.logo,
        });
      })
      .catch((error) => console.error("Error fetching :", error));
  };

  return (
    <div style={{ width: "94%", margin: "3.5% 2% 0 4%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Object.entries(MetaInfo).map(
          ([key, value]) =>
            value.length > 0 && (
              <span
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "0 1.2% 0 1.2%",
                }}
              >
                {key === "website" && (
                  <a href={value}>
                    <img
                      src={MetaInfo.logo}
                      alt="Website"
                      target="_blank"
                      style={{ maxWidth: "44px", maxHeight: "44px" }}
                    />
                  </a>
                )}
                {key === "twitter" && (
                  <a href={value}>
                    <img
                      src={twitter_image}
                      alt="Twitter"
                      target="_blank"
                      style={{ maxWidth: "44px", maxHeight: "44px" }}
                    />
                  </a>
                )}
                {key === "telegram" && (
                  <a href={value}>
                    <img
                      src={telegram_image}
                      alt="Telegram"
                      target="_blank"
                      style={{ maxWidth: "44px", maxHeight: "44px" }}
                    />
                  </a>
                )}
                {key === "discord" && (
                  <a href={value}>
                    <img
                      src={discord_image}
                      alt="Discord"
                      target="_blank"
                      style={{ maxWidth: "44px", maxHeight: "44px" }}
                    />
                  </a>
                )}
                {key === "facebook" && (
                  <a href={value}>
                    <img
                      src={facebook_image}
                      alt="Facebook"
                      target="_blank"
                      style={{ maxWidth: "44px", maxHeight: "44px" }}
                    />
                  </a>
                )}
                {key === "reddit" && (
                  <a href={value}>
                    <img
                      src={reddit_image}
                      alt="Reddit"
                      target="_blank"
                      style={{ maxWidth: "44px", maxHeight: "44px" }}
                    />
                  </a>
                )}
                {key === "doc" && (
                  <a href={value}>
                    <img
                      src={doc_image}
                      alt="Doc"
                      target="_blank"
                      style={{ maxWidth: "44px", maxHeight: "44px" }}
                    />
                  </a>
                )}
                {key === "github" && (
                  <a href={value}>
                    <img
                      src={github_image}
                      alt="GitHub"
                      target="_blank"
                      style={{ maxWidth: "44px", maxHeight: "44px" }}
                    />
                  </a>
                )}
              </span>
            )
        )}
      </div>
    </div>
  );
};

export default Info;
