import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import { TemplateRepl } from "../components/TemplateRepl";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Minimal JavaScript & TypeScript string templating engine that runs anywhere"
    >
      <HomepageHeader />
      <main>
        <div className={styles.container}>
          <p className={styles.description}>
            Microfern uses a simple templating language inspired by Nunjucks.
            Play around with the interactive example below, or click{" "}
            <a href="/docs/intro">here</a> to get started.
          </p>
          <TemplateRepl
            template="This is an interactive example for {{ project }}! Change the template and variables to see the output update. When you're ready to get started, click {{ button | titleCase }} above."
            variables={{ project: "microfern", button: "get started" }}
          />
        </div>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
