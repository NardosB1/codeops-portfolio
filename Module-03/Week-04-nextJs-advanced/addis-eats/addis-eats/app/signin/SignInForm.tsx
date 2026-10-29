"use client"; // useActionState gives pending + error state

import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/actions";

export default function SignInForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={state.phone ?? ""}
          aria-invalid={!!fe.phone}
          aria-describedby={fe.phone ? "phone-error" : undefined}
          className="w-full rounded border border-gray-400 px-3 py-2"
        />
        {fe.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-700">
            {fe.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!fe.password}
          aria-describedby={fe.password ? "password-error" : undefined}
          className="w-full rounded border border-gray-400 px-3 py-2"
        />
        {fe.password && (
          <p id="password-error" className="mt-1 text-sm text-red-700">
            {fe.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-black px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
