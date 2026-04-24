import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Mini Trello</h2>
      <div style={styles.right}>
        <span style={styles.name}>👤 {user?.name} ({user?.role})</span>
        <button style={styles.btn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 24px', background:'#0052cc', color:'white' },
  logo: { margin:0, fontSize:'20px' },
  right: { display:'flex', alignItems:'center', gap:'15px' },
  name: { fontSize:'14px' },
  btn: { padding:'6px 14px', background:'white', color:'#0052cc', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' }
};