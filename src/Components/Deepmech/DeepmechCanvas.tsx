import "./Deepmech.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deepmechAction, deepmechSelect } from "../../Redux/DeepmechSlice";
import { mecModelAction, mecModelSelect } from "../../Redux/MecModelSlice";
import { UIAction } from "../../Redux/UISlice";
import handleDeepmechCanvasInteractor from "../../Services/handleDeepmechCanvasInteractor";

export default function DeepmechCanvas() {
    const deepmech = useSelector(deepmechSelect);
    const mec = useSelector(mecModelSelect);
    const dispatch = useDispatch();

    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = React.useRef(null);

    React.useEffect(() => {
        if (canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
        const [nl, cl] = [mec.nodeLabels, mec.constraintLabels];
        dispatch(mecModelAction.setNodeLabels(false));
        dispatch(mecModelAction.setConstraintLabels(false));
        dispatch(UIAction.right(false));
        return handleDeepmechCanvasInteractor(ctx, deepmech.mode, () => {
            dispatch(mecModelAction.setNodeLabels(nl));
            dispatch(mecModelAction.setConstraintLabels(cl));
        });
    }, [deepmech.mode]);

    return <canvas
        className="deepmechCanvas"
        width={globalThis.innerWidth}
        height={globalThis.innerHeight}
        ref={canvasRef} />
}