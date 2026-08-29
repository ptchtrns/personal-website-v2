import { define } from "../utils.ts";
import { themeScript } from "@/lib/theme.ts";
import { asset } from "fresh/runtime";

export default define.page(function App({ Component }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nikolai Zakharov</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={asset("/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={asset("/favicon-16x16.png")}
        />
        <link rel="apple-touch-icon" href={asset("/apple-touch-icon.png")} />
        {/* Applied before the first paint so the theme does not flash. */}
        <script
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body class="bg-zinc-50 dark:bg-zinc-800 min-h-screen" f-client-nav>
        <Component />
      </body>
    </html>
  );
});
