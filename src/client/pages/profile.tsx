import React from "react";
import { useLoading } from "../lib/useLoading";
import { ErrorView } from "../components/errorView";
import { fetchJson } from "../lib/http";

interface data {
  name: string;
  picture: string;
}

export function Profile() {
  const { loading, error, data } = useLoading<data>(
    async () => await fetchJson("/api/profile")
  );

  if (loading) return <div>Loading...</div>;

  if (error) return <ErrorView error={error} />;

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
