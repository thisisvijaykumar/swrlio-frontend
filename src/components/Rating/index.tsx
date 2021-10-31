import React from "react";
import styled from "styled-components";
import RatingIcon from "./Rating-Icon";
// import "./styles.css";

const RatingWrapper = styled.div`
  width: 300px;
  h1 {
    font-size: 20px;
    margin: 0 0 1rem 0;
  }
`;
interface RatingProps {
  rating?: number;
  onSaveRating: (rating: number) => void;
}
export default function RatingComponent(props: RatingProps) {
  const [rating, setRating] = React.useState(props.rating??0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const onMouseEnter = (index: number) => {
    setHoverRating(index);
  };
  const onMouseLeave = () => {
    setHoverRating(0);
  };
  const onSaveRating = (rating: number) => {
    setRating(rating);
    props.onSaveRating(rating);
    console.log(rating, "rating");
  };
  return (
    <RatingWrapper className="flex">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <RatingIcon
            key={index}
            index={index}
            rating={rating}
            hoverRating={hoverRating}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onSaveRating={onSaveRating}
          />
        );
      })}
    </RatingWrapper>
  );
}
