import React from "react";
import { useLoading } from "../lib/useLoading";

interface data {
  name: string;
  picture: string;
}

export function Profile({ loadProfile }: { loadProfile: () => Promise<data> }) {
  const { loading, error, data } = useLoading<data>(loadProfile);

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div>
        <h1>An error occurred</h1>
        <div>{error}</div>
      </div>
    );

  if (data)
    return (
      <div>
        <h1>Profile</h1>
        <div>{data.name}</div>
        {data.picture && (
          <div>
            <img src={data.picture} alt="pic" />
          </div>
        )}
      </div>
    );

  return <></>;
}
