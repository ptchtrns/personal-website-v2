import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to log in");
      }

      setPassword("");
      globalThis.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} class="flex flex-col gap-3">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel for="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onInput={(event) => setPassword(event.currentTarget.value)}
                  required
                />
                {error && <FieldError>{error}</FieldError>}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            type="submit"
            disabled={loading}
            class="w-full"
            variant="ghost"
          >
            {loading ? "Loading..." : "Log in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
