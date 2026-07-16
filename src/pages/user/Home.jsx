import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeData } from "../../services/userService"
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const govId = localStorage.getItem("gov_id");

    if (!govId) {
      navigate("/login");
      return;
    }

    async function loadHomeData() {
      try {
        const data = await getHomeData(govId);
        setUser(data);
      } catch (err) {
        console.error("Failed to load home data", err);
        setError("Couldn't load your account. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, [navigate]);

  if (loading) {
    return <div className="home-loading">Loading your account...</div>;
  }

  if (error) {
    return <div className="home-loading">{error}</div>;
  }

  const displayName = user?.first_name || "user";
  const balance = Number(user?.balance ?? 0);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-inner">
          <svg className="bus-icon-front" viewBox="0 0 140 170" aria-hidden="true">
            <path
              d="M29 38C31 17 49 7 70 7s39 10 41 31l9 72H20l9-72Z"
              fill="#202020"
            />
            <rect x="45" y="27" width="50" height="10" rx="5" fill="#ffffff" />
            <path
              d="M42 50h56c5 0 8 3 9 8l7 42c1 5-3 10-8 10H34c-5 0-9-5-8-10l7-42c1-5 4-8 9-8Z"
              fill="#ffffff"
            />
            <circle cx="42" cy="125" r="10" fill="#ffffff" />
            <circle cx="98" cy="125" r="10" fill="#ffffff" />
            <rect x="27" y="113" width="86" height="17" fill="#202020" />
            <rect x="25" y="121" width="18" height="38" rx="9" fill="#202020" />
            <rect x="97" y="121" width="18" height="38" rx="9" fill="#202020" />
          </svg>

          <h1 className="hero-title">Tshwane</h1>
          <p className="hero-subtitle">Bus Service</p>
          <p className="greeting">Greetings, {displayName}!</p>
          <p className="welcome-text">
            Welcome back! Ready for your
            <br />
            next journey?
          </p>
        </div>

        <svg className="city-skyline hero-skyline" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 260V180h20v-35h36v-22h31v56h22v-68h28v36h27v-17h33v49h19v-95h22v-18h28v113h29v-130h29v130h35v-32h21v-28h32v60h26v-42h26v-18h34v60h42v-87h18V54h22v125h29v-96h20V54h24v125h36v-59h22v-35h31v94h34v-50h18v-74h14V34h9v21h16v31h18v93h40v-60h21v-38h29v98h30v-25h25v-51h33v76h18v81H0Z" />
        </svg>
      </section>

      <section className="content">
        <svg className="city-skyline content-skyline" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 260V170h21v-44h39v73h38v-35h18v-52h12v-25h12v25h20v88h31v-30h40v-22h42v72h116v-92h41V93h20v35h25v92h43v-165h63v165h34v-108h22v-28h31v136h42v-54h24v-35h31v89h36v-47h20v-28h28v75h39v-40h44v-31h33v71h33v40H0Z" />
        </svg>

        <div className="balance-card">
          <svg className="bus-watermark" viewBox="0 0 140 170" aria-hidden="true">
            <path d="M29 38C31 17 49 7 70 7s39 10 41 31l9 72H20l9-72Z" fill="currentColor" />
            <rect x="45" y="27" width="50" height="10" rx="5" fill="#4b9651" />
            <path d="M42 50h56c5 0 8 3 9 8l7 42c1 5-3 10-8 10H34c-5 0-9-5-8-10l7-42c1-5 4-8 9-8Z" fill="#4b9651" />
            <circle cx="42" cy="125" r="10" fill="#4b9651" />
            <circle cx="98" cy="125" r="10" fill="#4b9651" />
            <rect x="27" y="113" width="86" height="17" fill="currentColor" />
            <rect x="25" y="121" width="18" height="38" rx="9" fill="currentColor" />
            <rect x="97" y="121" width="18" height="38" rx="9" fill="currentColor" />
          </svg>

          <svg className="wallet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M4.5 7.5h14A2.5 2.5 0 0 1 21 10v8.5a2 2 0 0 1-2 2H4.5A2.5 2.5 0 0 1 2 18V10a2.5 2.5 0 0 1 2.5-2.5Z" />
            <path d="M6 7.5 15.5 3 18 7.5" />
            <path d="M16 12.5h5v4h-5a2 2 0 0 1 0-4Z" />
            <circle cx="17.5" cy="14.5" r="0.7" fill="currentColor" stroke="none" />
          </svg>

          <p className="balance-label">Available balance</p>
          <p className="balance-amount">
            R {balance.toFixed(2).replace(".", ",")}
          </p>
          <hr />
          <p className="last-updated">Last updated: Today 09:35</p>
        </div>

        <button className="btn btn-load" onClick={() => navigate("/payment")}>
          Load Funds
        </button>

         <button className="btn btn-load" onClick={() => navigate("/change-password")}>
          Change Password
        </button>

        <button
          className="btn btn-logout"
          onClick={() => {localStorage.removeItem("gov_id");
          navigate("/login");
          }}
        >
          Logout
        </button>
      </section>
    </main>
  );
}

export default Home;
