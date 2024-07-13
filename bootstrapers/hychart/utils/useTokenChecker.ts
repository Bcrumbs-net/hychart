import { auth } from "@bcrumbs.net/bc-api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useTokenChecker = () => {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if the URL has a 'token' query parameter
    const { token } = router.query;

    if (token) {
      auth.setToken(token as string);
      // Remove the 'token' query parameter from the URL
      const { pathname, query, ...rest } = router;
      router.replace(
        {
          pathname: router.pathname,
          query: query
            ? Object.fromEntries(
                Object.entries(query).filter(([key]) => key !== "token")
              )
            : {},
        },
        undefined,
        { shallow: true }
      );
    }

    // Check if there's a token stored in the auth module
    const checkToken = () => {
      try {
        if (!!auth.getToken()) {
          const token = auth.getToken();
          setHasToken(!!token);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setHasToken(false);
      }
    };

    checkToken();
  }, [router]);

  return { hasToken, setHasToken };
};
