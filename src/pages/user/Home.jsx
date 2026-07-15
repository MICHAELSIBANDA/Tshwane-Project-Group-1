import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { getProfile } from "../../services/userService";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
        async function loadProfile() {
            try {
                const profile = await getProfile();
                setUser(profile);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally{
                setLoading(false);
            }
        }
        loadProfile();
    };

        fetchProfile();
}, []);

  if (loading){
    return <div className="home-loading">Loading your account...</div>;
  }

  return (
    <div className="home">
        <div className="hero">
            <div className="bus-icon">🚌</div>
            <h1>Tshwane</h1>
            <p className="subtitle">Tshwane Bus System</p>
            <p className="greeting">greetings, {user?.name}!</p>
            <p className="welcome-text">Welcome back . usuzohamba futhi!!</p>
        </div>

        <div className="content">
            <div className="balance-card">
                <p className="balance-label">Available Balance</p>
                <p className="balance-amount">R {user?.balance?.toFixed(2)}</p>
            </div>

            <button className="btn btn-primary" onClick={() => navigate("/payment")}>Load Funds</button>

            <button className="btn btn-secondary" onClick={() => navigate("/change-password")}>Change Password</button>

            <button className="btn btn-logout" onClick={() => navigate("/login")}>Logout</button>
        </div>
    </div>
  );
}

export default Home;