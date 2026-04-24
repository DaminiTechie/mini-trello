import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success('Logged in!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Email" type="email"
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} placeholder="Password" type="password"
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.btn} type="submit">Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  box: { background:'white', padding:'40px', borderRadius:'10px', width:'350px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', marginBottom:'20px', color:'#333' },
  input: { width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'6px', border:'1px solid #ddd', boxSizing:'border-box' },
  btn: { width:'100%', padding:'10px', background:'#0052cc', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'16px' },
  link: { textAlign:'center', marginTop:'15px', fontSize:'14px' }
};