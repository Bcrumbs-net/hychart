import { auth } from "@bcrumbs.net/bc-api";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useTokenChecker() {
  const router = useRouter();

  useEffect(() => {
    // Check if the URL has a 'token' query parameter
    const { token } = router.query;

    if (token) {
      auth.setToken(token as string);
      // Remove the 'token' query parameter from the URL
      const { pathname, query, ...rest } = router;
      router.replace(
        {
          pathname,
          query: Object.fromEntries(
            Object.entries(query).filter(([key]) => key !== "token")
          ),
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query.token]);

  return null;
}
