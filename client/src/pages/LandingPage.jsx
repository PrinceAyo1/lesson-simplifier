import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);

    navigate("/");
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="container navbar__inner">
          <div
            className="navbar__brand"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Lesson Simplifier
          </div>

          <nav className="navbar__links">
            <a href="#features">Features</a>
            <a href="#example">Example</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="navbar__actions">
            {user ? (
              <>
                <button
                  className="navbar__secondary"
                  onClick={() => navigate("/app/generate")}
                >
                  Go to app
                </button>

                <button className="navbar__cta" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="navbar__secondary"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </button>

                <button
                  className="navbar__cta"
                  onClick={() => navigate("/app/generate")}
                >
                  Try it now
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__content">
              <div className="hero__badge">
                For learners, teachers, tutors and parents
              </div>

              <h1 className="hero__title">
                Make Difficult Topics Easier to Understand
              </h1>

              <p className="hero__text">
                Turn complex topics into clear, step-by-step explanations,
                practical examples, and simple practice tasks for different
                levels.
              </p>

              <div className="hero__actions">
                <button
                  className="hero__primary"
                  onClick={() => navigate("/app/generate")}
                >
                  Simplify a topic
                </button>

                <button
                  className="hero__secondary"
                  onClick={() => {
                    document.getElementById("example").scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  See example output
                </button>
              </div>
            </div>

            <div className="hero__preview">
              <div className="preview-card">
                <div className="preview-label">Learning request</div>

                <div className="preview-title">
                  Explain percentages for a Level 1 learner
                </div>

                <div className="preview-list">
                  <div>Subject: Maths</div>
                  <div>Level: Level 1</div>
                  <div>Format: Explanation + examples + mini tasks</div>
                </div>
              </div>

              <div className="preview-card">
                <div className="preview-label">Generated preview</div>

                <div className="preview-title">Simple explanation</div>

                <div className="preview-list">
                  <div>Percent means out of 100.</div>
                  <div>50% means 50 out of 100.</div>
                  <div>You can think of 50% as one half.</div>
                </div>
              </div>

              <div className="preview-card">
                <div className="preview-label">Mini task</div>

                <div className="preview-task">
                  What is 50% of 20?
                  <br />
                  <strong>Answer:</strong> 10
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="container features__grid">
            <article className="feature-card">
              <h3 className="feature-card__title">Clearer understanding</h3>

              <p className="feature-card__text">
                Break difficult topics into simpler language and manageable
                steps.
              </p>
            </article>

            <article className="feature-card">
              <h3 className="feature-card__title">
                Different levels supported
              </h3>

              <p className="feature-card__text">
                Adapt explanations for Entry Level, Level 1, Level 2 and GCSE
                pathways.
              </p>
            </article>

            <article className="feature-card">
              <h3 className="feature-card__title">
                Useful for learning and revision
              </h3>

              <p className="feature-card__text">
                Get explanations, examples and practice tasks that are easy to
                use for study, teaching or support at home.
              </p>
            </article>
          </div>
        </section>

        <section className="example" id="example">
          <div className="container">
            <div className="section-heading">
              <p className="section-heading__eyebrow">See how it works</p>

              <h2 className="section-heading__title">
                A clear output for learning, revision and support
              </h2>

              <p className="section-heading__text">
                Every response is designed to make difficult ideas easier to
                follow without losing the key meaning.
              </p>
            </div>

            <div className="example__grid">
              <article className="output-card">
                <h3>Simple Explanation</h3>

                <ul>
                  <li>A percentage is an amount out of 100.</li>
                  <li>25% means 25 out of 100.</li>
                  <li>It can also be written as a fraction or decimal.</li>
                </ul>
              </article>

              <article className="output-card">
                <h3>Examples</h3>

                <ul>
                  <li>20% off a £10 item means £2 off.</li>
                  <li>8 out of 10 in a quiz is 80%.</li>
                  <li>50% of a class means half the class.</li>
                </ul>
              </article>

              <article className="output-card">
                <h3>Mini Tasks</h3>

                <ul>
                  <li>What is 10% of 50?</li>
                  <li>What is 25% of 40?</li>
                  <li>What is 50% of 18?</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="cta-banner">
          <div className="container">
            <div className="cta-banner__inner">
              <div>
                <h2>Get clear explanations without the stress</h2>

                <p>
                  Use Lesson Simplifier to make learning, revision and topic
                  support faster and easier.
                </p>
              </div>

              <button onClick={() => navigate("/app/generate")}>
                Get started
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <div className="footer__brand">Lesson Simplifier</div>

            <p className="footer__text">
              AI support for clearer understanding, learning and revision.
            </p>
          </div>

          <div className="footer__links">
            <a href="#features">Features</a>
            <a href="#example">Example</a>
            <a href="#pricing">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
