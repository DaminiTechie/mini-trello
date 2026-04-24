import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      toast.success('Registered! Please login.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Name"
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} placeholder="Email" type="email"
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} placeholder="Password" type="password"
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <select style={styles.input} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.btn} type="submit">Register</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/">Login</Link></p>
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