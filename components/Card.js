import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useTheme } from "../hooks/useTheme";
import CardP from "./CardP";
import IconButton from "./IconButton";

function Card({
  age,
  id,
  introduceBy,
  name,
  image,
  profession,
  gender,
  onClick,
}) {
  const router = useRouter();
  const { isLightTheme } = useTheme();

  return (
    <div className="border overflow-hidden rounded-lg">
      <div className="relative w-full h-[250px] overflow-hidden">
        <Image
          src={image.url}
          alt="friend-image"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-1">
          <h2
            className={`text-xl font-medium mb-2 pb-2 border-b border-b-emerald-300  ${
              !isLightTheme && "text-white"
            }`}
          >
            {name}
          </h2>
          <CardP>Age : {age}</CardP>
          <CardP> Profession : {profession} </CardP>
          <CardP> Introduce : {introduceBy} </CardP>
          <CardP> Gender : {gender} </CardP>
        </div>
        <div className="flex gap-2 mt-4">
          <IconButton
            onClick={() => router.push(`/friend/${id}`)}
            icon={<MdModeEdit />}
            text="Edit"
          />
          <IconButton
            onClick={() => onClick(id)}
            deleteFlavour
            icon={<MdDelete />}
            text="Delete"
          />
        </div>
      </div>
    </div>
  );
}

export default Card;
