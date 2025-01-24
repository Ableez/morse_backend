import React from "react";

type Props = {
  text?: string;
  textColor?: string;
};

const IconText = ({ text, textColor }: Props) => {
  if (text) {
    return (
      <h4
        className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 text-center font-serif font-semibold italic"
        style={{ color: textColor ?? "#000" }}
      >
        {text}
      </h4>
    );
  } else {
    return null;
  }
};

export default IconText;
