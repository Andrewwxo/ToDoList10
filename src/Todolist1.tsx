import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {TodolistType} from './AppWithRedux';
import {useDispatch, useSelector} from 'react-redux';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer';
import {AppRootStateType} from './state/state';
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from './state/todolists-reducer';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export function Todolist1({todolist}: PropsType) {
    const {id, title, filter} = {...todolist}
    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id])

    const dispatch = useDispatch()

    const addTask = (title: string) => {
        dispatch(addTaskAC(title, id))
    }

    const removeTodolist = () => {
        let action = removeTodolistAC(id)
        dispatch(action)
    }
    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleAC(id, title))
    }

    const onAllClickHandler = () => dispatch(changeTodolistFilterAC(id, 'all'))
    const onActiveClickHandler = () => dispatch(changeTodolistFilterAC(id, 'active'))
    const onCompletedClickHandler = () => dispatch(changeTodolistFilterAC(id, 'completed'))


    if (filter === 'active') {
        tasks = tasks.filter(t => t.isDone === false);
    }
    if (filter === 'completed') {
        tasks = tasks.filter(t => t.isDone === true);
    }

    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks.map(t => {
                    const onClickHandler = () => {
                        let action = removeTaskAC(t.id, id)
                        dispatch(action)
                    }
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, id))
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch(changeTaskTitleAC(t.id, newValue, id))
                    }


                    return <div key={t.id} className={t.isDone ? 'is-done' : ''}>
                        <Checkbox
                            checked={t.isDone}
                            color="primary"
                            onChange={onChangeHandler}
                        />

                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton onClick={onClickHandler}>
                            <Delete/>
                        </IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <Button variant={filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'default'}
            >All
            </Button>
            <Button variant={filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
}


