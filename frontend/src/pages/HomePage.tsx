import { NavLink } from "react-router-dom";

export default function HomePage() {
    return (
        <main className="home">
            {/*  HERO SECTION  */}
            <section className="hero">
                <div className="hero-left">
                    <h1 className="hero-title">YOUR FOOTPRINT, YOUR FUTURE</h1>
                    <p className="hero-text">
                        Carbon Wise helps you measure your footprint in minutes and get happy,
                        healthy steps to lower it — tailored to your city.
                    </p>
                    <NavLink to="/calculator" className="btn hero-btn">
                        Start my 3-minute audit
                    </NavLink>
                </div>
                <div className="hero-right">
                    {/* Replace with your own hero image */}
                    <img src="/Plant.jpg" alt="Hero" />
                </div>
            </section>



            {/*  INFO CARDS SECTION  */}
            <section className="info-cards">
                <h2 className="info-heading">
                    Your Carbon Footprint is More Than a Number, It’s a Wake Up Call
                </h2>

                <div className="card-row">
                    <div className="info-box right-side green">
                        <p className="info-text">
                            Between 2030 and 2050, climate change is projected to cause 250,000 additional deaths per
                            year from undernutrition, malaria, diarrheal diseases, and heat stress. Rising temperatures
                            and erratic weather patterns are already straining health systems, especially in developing
                            countries. Climate-sensitive diseases are spreading, and mental health impacts are rising due
                            to displacement and disaster trauma. Reducing emissions isn’t just an environmental goal—it’s
                            a public health imperative.
                        </p>
                        <img src="/public/HealthRisk.jpg" alt="Health Risk" className="card-img left" />
                    </div>
                </div>

                <div className="card-row">
                    <div className="info-box left-side green">
                        <p className="info-text">
                            Global sea levels have risen by 8–9 inches (21–24 cm) since 1880, and the pace is accelerating.
                            In 2024 alone, sea levels rose faster than expected due to thermal expansion of warming oceans.
                            This rise threatens coastal cities, ecosystems, and freshwater supplies. With nearly 30% of the
                            world’s population living in coastal areas, sea level rise is no longer a distant threat—it’s a
                            daily reality. Carbon reduction is key to slowing this trend and protecting vulnerable communities.
                        </p>
                        <img src="/public/SeaLevelRise.jpg" alt="Sea Level Rise" className="card-img right" />
                    </div>
                </div>

                <div className="card-row">
                    <div className="info-box right-side green">
                        <p className="info-text">
                            Since the Industrial Revolution, Earth’s average surface temperature has increased by over 1.1°C,
                            with 2024 marking the first year to exceed 1.5°C above pre-industrial levels. This seemingly small
                            rise represents an enormous shift in planetary energy balance, driving more frequent heatwaves,
                            wildfires, and ecosystem disruptions. A few degrees may sound minor, but historically, even a
                            1–2°C drop triggered ice ages. Today, the warming trend is reshaping our climate faster than ever.
                        </p>
                        <img src="/public/GlobalWarming.jpg" alt="Global Warming" className="card-img left" />
                    </div>
                </div>

                <div className="card-row">
                    <div className="info-box left-side green">
                        <p className="info-text">
                            An estimated 3.6 billion people—nearly half the global population—live in areas highly vulnerable
                            to climate change. These regions face intensified risks from floods, droughts, cyclones, and heatwaves.
                            In India alone, over 80% of the population resides in districts prone to extreme hydro-meteorological
                            disasters. Vulnerability isn’t just about geography—it’s about infrastructure, preparedness, and the
                            ability to adapt. Carbon auditing helps identify and mitigate these risks before they escalate.
                        </p>
                        <img src="/public/BadWeather.jpg" alt="India Vulnerability" className="card-img right" />
                    </div>
                </div>
            </section>


            {/*  WHY IT MATTERS SECTION  */}
            <section className="why-matters">
                <div className="why-matters-content">
                    <h2 className="section-title">“Why It Matters”</h2>
                    <p>
                        Rising temperatures, extreme weather, and shrinking biodiversity aren’t just numbers—they’re
                        signals. Signals that our choices today shape the world we’ll live in tomorrow. Carbon Auditor
                        helps you turn awareness into action, one footprint at a time.
                    </p>

                    <h2 className="section-title">“Take Action”</h2>
                    <p>
                        Climate data tells the story. Now it’s your turn to rewrite it. Carbon Auditor gives you the tools
                        to measure, reduce, and share your footprint—so you can be part of the solution, not just the
                        conversation.
                    </p>

                    <h2 className="section-title">“Your Role in the Climate Compact”</h2>
                    <p>
                        The Climate Compact is a global effort—but it starts with individual action. By using Carbon
                        Auditor, you’re joining a growing movement of people and businesses committed to transparency,
                        accountability, and real change.
                    </p>
                </div>
            </section>


            {/* Features Section */}

            <section className="features">
                <div className="features-grid">
                    <div className="feature-item">
                        <img src="/public/Calculator.png" alt="Carbon Footprint Tracker" />
                        <h3>Carbon Footprint Tracker</h3>
                        <p>Automatically calculate your personal emissions.</p>
                    </div>

                    <div className="feature-item">
                        <img src="/public/AiBot.png" alt="AI Coach" />
                        <h3>AI Coach</h3>
                        <p>
                            Analyzes user behavior, provides tips to reduce environmental impact.
                            Helps set goals, monitor progress, and make sustainable lifestyle
                            choices with real-time guidance.
                        </p>
                    </div>

                    <div className="feature-item">
                        <img src="/public/Insights.png" alt="Actionable Insights" />
                        <h3>Actionable Insights</h3>
                        <p>Get tailored suggestions to reduce your footprint.</p>
                    </div>
                </div>

                <div className="join-movement">
                    <h2>Join the Movement</h2>
                    <p>
                        Be part of the change. Use Carbon Auditor to take meaningful steps
                        toward a healthier planet.
                    </p>
                </div>

                <hr className="section-divider" />

            </section>




            {/*  FOOTER ONLY FOR HOMEPAGE  */}
            <footer className="footer">
                <p>Made with love for happier and healthier cities.</p>
            </footer>
        </main>
    );
}
