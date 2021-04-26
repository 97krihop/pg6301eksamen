import React, { useState } from "react";
import { HttpException } from "./http";

export const useSubmit = (
  subFunc: () => Promise<void>,
  onSubmitSuccess: () => void
) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<
    typeof HttpException | Error | undefined
  >();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(undefined);
    try {
      await subFunc();
      setSubmitting(false);
      onSubmitSuccess();
    } catch (e) {
      setError(e);
      setSubmitting(false);
    }
  };

  return { handleSubmit, submitting, error };
};
