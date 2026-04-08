import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="container navbar__inner">
          <div className="navbar__brand">Lesson Simplifier</div>

          <nav className="navbar__links">
            <a href="#features">Features</a>
            <a href="#example">Example</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <button
            className="navbar__cta"
            onClick={() => navigate("/app/generate")}
          >
            Try it now
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__content">
              <div className="hero__badge">
                Built for FE, Functional Skills and adult learning
              </div>

              <h1 className="hero__title">Simplify Your Lesson in Seconds</h1>

              <p className="hero__text">
                Turn complex topics into clear, step-by-step explanations with
                UK-relevant examples and quick classroom tasks for different
                learner levels.
              </p>

              <div className="hero__actions">
                <button
                  className="hero__primary"
                  onClick={() => navigate("/app/generate")}
                >
                  Simplify a lesson
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
                <div className="preview-label">Teaching request</div>
                <div className="preview-title">
                  Teach percentages to a weak Level 1 student
                </div>
                <div className="preview-list">
                  <div>Subject: Maths</div>
                  <div>Level: Level 1</div>
                  <div>Format: Simple explanation + examples + mini tasks</div>
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
              <h3 className="feature-card__title">Save planning time</h3>
              <p className="feature-card__text">
                Generate simplified teaching content in seconds instead of
                rewriting lessons manually.
              </p>
            </article>

            <article className="feature-card">
              <h3 className="feature-card__title">Different learner levels</h3>
              <p className="feature-card__text">
                Adapt explanations for Entry Level, Level 1, Level 2 and GCSE
                pathways.
              </p>
            </article>

            <article className="feature-card">
              <h3 className="feature-card__title">Classroom-ready output</h3>
              <p className="feature-card__text">
                Get plain English explanations, real-life examples and mini
                practice tasks teachers can use straight away.
              </p>
            </article>
          </div>
        </section>

        <section className="example" id="example">
          <div className="container">
            <div className="section-heading">
              <p className="section-heading__eyebrow">See how it works</p>
              <h2 className="section-heading__title">
                A clear lesson output teachers can use immediately
              </h2>
              <p className="section-heading__text">
                Every response is structured to reduce prep time and support
                learners who need simpler explanations without losing meaning.
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
                <h2>Support your learners without doubling your workload</h2>
                <p>
                  Create calmer, clearer lesson materials for mixed-ability
                  classrooms in just a few clicks.
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
              AI support for teachers who need faster, clearer lesson prep.
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
