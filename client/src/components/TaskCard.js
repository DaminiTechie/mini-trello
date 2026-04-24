import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '../context/AuthContext';

export default function TaskCard({ task, onDelete, onEdit }) {
  const { user } = useAuth();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: 'white',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    cursor: 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <p style={{ margin:'0 0 6px 0', fontWeight:'bold', color:'#333' }}>{task.title}</p>
      {task.description && <p style={{ margin:'0 0 6px 0', fontSize:'12px', color:'#666' }}>{task.description}</p>}
      {task.User && <p style={{ margin:'0 0 6px 0', fontSize:'12px', color:'#0052cc' }}>👤 {task.User.name}</p>}
      {task.due_date && <p style={{ margin:'0', fontSize:'11px', color:'#999' }}>📅 {new Date(task.due_date).toLocaleDateString()}</p>}
      <div style={{ display:'flex', gap:'6px', marginTop:'8px' }}>
        {user?.role === 'admin' && (
          <>
            <button onPointerDown={e => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              style={editBtn}>Edit</button>
            <button onPointerDown={e => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              style={deleteBtn}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

const editBtn = { padding:'4px 10px', background:'#faad14', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'12px' };
const deleteBtn = { padding:'4px 10px', background:'#ff4d4f', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'12px' };