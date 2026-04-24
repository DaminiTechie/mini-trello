import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

export default function Column({ column, onDeleteTask, onEditTask, onAddTask, isAdmin }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div style={styles.column}>
      <div style={styles.header}>
        <h3 style={styles.title}>{column.title}</h3>
        <span style={styles.count}>{column.Tasks?.length || 0}</span>
      </div>

      <SortableContext items={column.Tasks?.map(t => t.id) || []} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={styles.taskList}>
          {column.Tasks?.map(task => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onEdit={onEditTask} />
          ))}
        </div>
      </SortableContext>

      {isAdmin && (
        <button style={styles.addBtn} onClick={() => onAddTask(column.id)}>+ Add Task</button>
      )}
    </div>
  );
}

const styles = {
  column: { background:'#ebecf0', borderRadius:'10px', padding:'12px', width:'280px', minHeight:'400px', flexShrink:0 },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' },
  title: { margin:0, fontSize:'16px', fontWeight:'bold', color:'#333' },
  count: { background:'#ddd', borderRadius:'50%', padding:'2px 8px', fontSize:'12px' },
  taskList: { minHeight:'300px' },
  addBtn: { width:'100%', padding:'8px', background:'rgba(0,0,0,0.1)', border:'none', borderRadius:'6px', cursor:'pointer', marginTop:'8px', color:'#333' }
};