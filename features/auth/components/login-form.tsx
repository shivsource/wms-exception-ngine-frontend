"use client";

import { Boxes } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-context";
import { useLogin } from "@/features/auth/hooks";
import { HttpError } from "@/lib/api/http-error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  function validate(): boolean {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(trimmedEmail)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (result) => login(result.email),
        onError: (error) => {
          setFormError(
            error instanceof HttpError ? error.message : "Unable to connect to server. Please try again.",
          );
        },
      },
    );
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Boxes className="h-6 w-6 text-primary" aria-hidden />
          <h1 className="text-lg font-semibold tracking-tight">WMS Intelligence</h1>
          <p className="text-sm text-muted-foreground">Sign in to the operator dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              disabled={loginMutation.isPending}
            />
            {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email}</p> : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              disabled={loginMutation.isPending}
            />
            {fieldErrors.password ? <p className="text-xs text-destructive">{fieldErrors.password}</p> : null}
          </div>

          {formError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          ) : null}

          <Button type="submit" disabled={loginMutation.isPending} className="w-full justify-center">
            {loginMutation.isPending ? "Logging in…" : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
