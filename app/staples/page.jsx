"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { nanoid } from "nanoid";

export default function Staples() {
  const [staples, setStaples] = useState({
    error: false,
    loading: false,
    data: [],
  });

  async function fetchStaples() {
    setStaples({
      error: false,
      loading: true,
      data: [],
    });
    try {
      const res = await fetch(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?staple=yes`,
      );
      if (!res.ok) {
        throw new Error("An error has occurred");
      }
      const result = await res.json();
      setStaples({
        error: false,
        loading: false,
        data: result.data,
      });
    } catch (error) {
      setStaples({
        error: true,
        loading: false,
        data: [],
      });
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchStaples();
  }, []);

  if (staples.error) {
    return <p>Something went wrong</p>;
  }

  if (staples.loading) {
    return <p>Loading</p>;
  }
  return (
    <div className=" text-white flex flex-col items-center">
      <h1 className=" text-center">Staples</h1>

      <form className=" flex flex-wrap gap-3" action="">
        <input
          className=" outline-0 p-1 text-lg rounded-sm border border-gray-400"
          type="text"
        />
        <select className="" name="" id="">
          <option value="">Monster</option>
          <option value="">Spell</option>
          <option value="">Trap</option>
        </select>
      </form>

      <div className=" flex flex-wrap gap-2">
        {staples.data.map((staple) => (
          <Link key={nanoid(10)} href={"/"}>
            <Image
              src={staple.card_images.image_url}
              alt={staple.name}
              width={180}
              height={262}
              className=" object-center"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
