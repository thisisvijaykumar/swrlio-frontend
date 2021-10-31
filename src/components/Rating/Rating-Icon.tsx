import { StarTwoTone } from "@ant-design/icons";
import React from "react";

export default function RatingIcon(props: any) {
  const {
    index,
    rating,
    hoverRating,
    onMouseEnter,
    onMouseLeave,
    onSaveRating
  } = props;
  const fill = React.useMemo(() => {
    if (hoverRating >= index) {
      return "#f0ca71";
    } else if (!hoverRating && rating >= index) {
      return "#f0ca71";
    }
    return "#ccc";
  }, [rating, hoverRating, index]);
  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={() => onMouseLeave()}
      onClick={() => onSaveRating(index)}
    >
      <StarTwoTone
        style={{ fontSize: "32px", color: "#ccc" }}
        twoToneColor={fill}
      />
    </div>
  );
}
