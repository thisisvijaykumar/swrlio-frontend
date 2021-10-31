import { Popover } from "antd";
import React from "react";
import RatingComponent from "../Rating";

interface Props {
  // id: string;
  rating?: number;
  movieTitle: string;
  onSaveRating: (rating: number) => void;
  // children?: React.ReactNode;
}
export default function MovieRating(props: Props) {
  return (
    <div>
      <h3>{props.movieTitle}</h3>
      <RatingComponent rating={props.rating} onSaveRating={props.onSaveRating} />
    </div>
  );
}
