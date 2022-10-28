import React from "react";
import { useNavigate } from "react-router-dom";

export const Navigator = ({ destination }) => {
  const navigate = useNavigate();
  navigate(destination);
};
