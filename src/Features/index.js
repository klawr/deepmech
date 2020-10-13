
export { default as store } from './store';
export {
    actions as UIactions,
    select as UIselect,
} from './UISlice';
export {
    changeMode,
    selectMode,
} from './DeepmechSlice';
export {
    add,
    undo,
    redo,
    pause,
    toggleRun,
    toggleGravity,
    toggleDarkmode,
    updateId,
    selectModel,
} from './MecModelSlice';
