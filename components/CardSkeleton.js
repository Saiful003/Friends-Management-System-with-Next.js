import React from "react";
import Skeleton from "react-loading-skeleton";

function CardSkeleton({ cardCount = 1 }) {
  const elements = Array(cardCount).fill(0);

  return (
    <>
      {elements.map((_, index) => (
        <CardSkeletonJSX key={index} />
      ))}
    </>
  );
}

function CardSkeletonJSX() {
  return (
    <div className="rounded-md">
      <div className="relative w-full h-[250px]">
        <Skeleton className="h-full" />
      </div>
      <div className="border p-5">
        <div className="flex flex-col gap-1">
          <Skeleton className="py-2 mb-2" />
          <Skeleton count={4} />
        </div>
        <div className="flex gap-2 mt-4">
          <Skeleton width={80} height={20} />
          <Skeleton width={80} height={20} />
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;
