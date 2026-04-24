 import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import CreateTaskModal from '../components/CreateTaskModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function BoardView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [board, setBoard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [showColumnInput, setShowColumnInput] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchBoard = async () => {
    try {
      const res = await API.get(`/boards/${id}`);
      setBoard(res.data);
    } catch (err) {
      toast.error('Failed to load board');
    }
  };

useEffect(() => {
  fetchBoard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [fetchBoard]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id;
    const newColumnId = over.id;

    // Check if dropped on a column
    const isColumn = board.Columns.some(c => c.id === newColumnId);
    if (!isColumn) return;

    try {
      await API.put(`/tasks/${taskId}`, { ColumnId: newColumnId });
      fetchBoard();
    } catch (err) {
      toast.error('Failed to move task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success('Task deleted!');
      fetchBoard();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setEditTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setSelectedColumn(task.ColumnId);
    setShowModal(true);
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) return toast.error('Enter column title');
    try {
      await API.post('/columns', { title: newColumnTitle, boardId: id });
      setNewColumnTitle('');
      setShowColumnInput(false);
      fetchBoard();
      toast.success('Column added!');
    } catch (err) {
      toast.error('Failed to add column');
    }
  };

  if (!board) return <div style={styles.loading}>Loading board...</div>;

  return (
    <div style={{ minHeight:'100vh', background:'#0052cc' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.boardTitle}>{board.title}</h2>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div style={styles.columnsRow}>
            {board.Columns?.map(column => (
              <Column
                key={column.id}
                column={column}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                onAddTask={handleAddTask}
                isAdmin={user?.role === 'admin'}
              />
            ))}

            {/* Add Column */}
            {user?.role === 'admin' && (
              <div style={styles.addColumn}>
                {showColumnInput ? (
                  <div style={styles.columnInputBox}>
                    <input style={styles.columnInput} placeholder="Column title..."
                      value={newColumnTitle}
                      onChange={e => setNewColumnTitle(e.target.value)} />
                    <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                      <button style={styles.addColBtn} onClick={handleAddColumn}>Add</button>
                      <button style={styles.cancelColBtn} onClick={() => setShowColumnInput(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button style={styles.newColBtn} onClick={() => setShowColumnInput(true)}>+ Add Column</button>
                )}
              </div>
            )}
          </div>
        </DndContext>
      </div>

      {showModal && (
        <CreateTaskModal
          columnId={selectedColumn}
          task={editTask}
          onClose={() => setShowModal(false)}
          onSave={fetchBoard}
        />
      )}
    </div>
  );
}

const styles = {
  loading: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontSize:'18px' },
  container: { padding:'24px' },
  boardTitle: { color:'white', fontSize:'24px', marginBottom:'20px' },
  columnsRow: { display:'flex', gap:'16px', overflowX:'auto', alignItems:'flex-start', paddingBottom:'20px' },
  addColumn: { flexShrink:0, width:'280px' },
  columnInputBox: { background:'#ebecf0', padding:'12px', borderRadius:'10px' },
  columnInput: { width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd', boxSizing:'border-box' },
  addColBtn: { padding:'6px 14px', background:'#0052cc', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' },
  cancelColBtn: { padding:'6px 14px', background:'#ddd', color:'#333', border:'none', borderRadius:'6px', cursor:'pointer' },
  newColBtn: { width:'100%', padding:'12px', background:'rgba(255,255,255,0.2)', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'14px' }
};