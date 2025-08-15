import './About.css'

const About = () => {
  return (
    <div className="about">
      <h1>About Blog Platform</h1>
      <div className="about-content">
        <section>
          <h2>Our Mission</h2>
          <p>
            Blog Platform is designed to provide a simple, fast, and beautiful way 
            to share your thoughts and stories with the world. We believe that 
            everyone has a story worth telling.
          </p>
        </section>
        
        <section>
          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <h3>Frontend</h3>
              <ul>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Vite</li>
                <li>React Router</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express</li>
                <li>TypeScript</li>
                <li>CORS</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
