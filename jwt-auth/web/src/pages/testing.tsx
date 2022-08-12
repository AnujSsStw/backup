import React from "react";
import { useMeQuery } from "../generated/graphql";

interface testingProps {}

const Testing: React.FC<testingProps> = ({}) => {
  const { data, loading, error } = useMeQuery();

  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    console.log(error);
    return <div>err</div>;
  }

  return <div>{data ? data.me : <div>null</div>}</div>;
};

export default Testing;
