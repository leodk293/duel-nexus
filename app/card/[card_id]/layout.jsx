import React from "react";

export async function generateMetadata({ params }, parent) {
  const id = params.card_id;

  const res = await fetch(
    `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`,
  );
  const result = await res.json();

  if (result) {
    return {
      title: `${result?.data[0]?.name} - DUEL NEXUS`,
    };
  }
}

export default function layout({ children }) {
  return <>{children}</>;
}
