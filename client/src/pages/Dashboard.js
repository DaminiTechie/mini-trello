import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const res = await API.get('/boards');
      setBoards(res.data);
    } catch (err) {
      toast.error('Failed to fetch boards');
    }
  };

  useEffect(() => { fetchBoards(); }, []);

  const createBoard = async () => {
    if (!title.trim()) return toast.error('Enter a board title');
    try {
      await API.post('/boards', { title });
      setTitle('');
      fetchBoards();
      toast.success('Board created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create board');
    }
  };

  const deleteBoard = async (id) => {
    try {
      await API.delete(`/boards/${id}`);
      fetchBoards();
      toast.success('Board deleted!');
    } catch (err) {
      toast.error('Failed to delete board');
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f0f2f5' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Your Boards</h2>

        {user?.role === 'admin' && (
          <div style={styles.createBox}>
            <input style={styles.input} placeholder="New board title..."
              value={title} onChange={e => setTitle(e.target.value)} />
            <button style={styles.btn} onClick={createBoard}>+ Create Board</button>
          </div>
        )}

        <div style={styles.grid}>
          {boards.map(board => (
            <div key={board.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{board.title}</h3>
              <div style={styles.cardActions}>
                <button style={styles.openBtn} onClick={() => navigate(`/board/${board.id}`)}>Open</button>
                {user?.role === 'admin' && (
                  <button style={styles.deleteBtn} onClick={() => deleteBoard(board.id)}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {boards.length === 0 && (
          <p style={styles.empty}>No boards yet. {user?.role === 'admin' ? 'Create one!' : 'Ask admin to create one.'}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding:'30px' },
  heading: { fontSize:'24px', marginBottom:'20px', color:'#333' },
  createBox: { display:'flex', gap:'10px', marginBottom:'30px' },
  input: { padding:'10px', borderRadius:'6px', border:'1px solid #ddd', width:'300px', fontSize:'14px' },
  btn: { padding:'10px 20px', background:'#0052cc', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  grid: { display:'flex', flexWrap:'wrap', gap:'20px' },
  card: { background:'white', borderRadius:'10px', padding:'20px', width:'220px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  cardTitle: { margin:'0 0 15px 0', color:'#333' },
  cardActions: { display:'flex', gap:'8px' },
  openBtn: { padding:'6px 14px', background:'#0052cc', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  deleteBtn: { padding:'6px 14px', background:'#ff4d4f', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  empty: { color:'#999', fontSize:'16px' }
};