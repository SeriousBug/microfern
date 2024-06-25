import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: JSX.Element;
  Img: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "runs anywhere",
    Img: require("@site/static/img/runs-anywhere.png").default,
    description: (
      <p>
        <a className="link" href="https://nodejs.org/en">
          Node.js
        </a>
        , browsers (
        <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>,{" "}
        <a href="https://www.google.com/chrome/">Chrome</a>,{" "}
        <a href="https://www.apple.com/safari/">Safari</a>), Edge functions such
        as <a href="https://workers.cloudflare.com">Cloudflare Workers</a> or{" "}
        <a href="https://vercel.com/blog/edge-functions-generally-available">
          Vercel Edge Functions
        </a>
        , and <a href="https://bun.sh">Bun</a>. All tested with 100% coverage.
      </p>
    ),
  },
  {
    title: "simple but powerful",
    Img: require("@site/static/img/simple-but-powerful.png").default,
    description: (
      <p>
        No compilation steps, template inheritance, recursive definitions, or
        files. Bring your own templates. Get your variables from a map, or write
        a custom provider. Extend with your own plugin functions.
      </p>
    ),
  },
  {
    title: "minimal",
    Img: require("@site/static/img/minimal.png").default,
    description: (
      <>
        No dependencies. The core export is under 1kb minzipped, and everything
        fits within a few kb minzipped. Keep your bundle size small.
      </>
    ),
  },
];

function Feature({ title, description, ...props }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        {<img className={styles.featureImg} src={props.Img} alt={title} />}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
