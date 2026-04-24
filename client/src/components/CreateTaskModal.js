import { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';

export default function CreateTaskModal({ columnId, task, onClose, onSave }) {
  const [form, setForm] = useState({ title:'', description:'', due_date:'', UserId:'' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/users').then(res => setUsers(res.data)).catch(() => {});
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        UserId: task.UserId || ''
      });
    }
  }, [task]);

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    try {
      if (task) {
        await API.put(`/tasks/${task.id}`, form);
        toast.success('Task updated!');
      } else {
        await API.post('/tasks', { ...form, ColumnId: columnId });
        toast.success('Task created!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ marginTop:0 }}>{task ? 'Edit Task' : 'Create Task'}</h3>
        <input style={input} placeholder="Title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea style={{ ...input, height:'80px' }} placeholder="Description" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />
        <input style={input} type="date" value={form.due_date}
          onChange={e => setForm({ ...form, due_date: e.target.value })} />
        <select style={input} value={form.UserId}
          onChange={e => setForm({ ...form, UserId: e.target.value })}>
          <option value="">Assign to user...</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <div style={{ display:'flex', gap:'10px', marginTop:'10px' }}>
          <button style={saveBtn} onClick={handleSave}>Save</button>
          <button style={cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlay = { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 };
const modal = { background:'white', padding:'24px', borderRadius:'10px', width:'350px', boxShadow:'0 4px 20px rgba(0,0,0,0.2)' };
const input = { width:'100%', padding:'10px', marginBottom:'12px', borderRadius:'6px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'14px' };
const saveBtn = { padding:'8px 20px', background:'#0052cc', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' };
const cancelBtn = { padding:'8px 20px', background:'#ddd', color:'#333', border:'none', borderRadius:'6px', cursor:'pointer' };