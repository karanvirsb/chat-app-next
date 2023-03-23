import React, { useState, useEffect, useRef } from "react";
/**
 * Hook is used to check the visibility of an element usually a pop up menu
 * @returns Object {ref: the reference to the pop up element, isComponentVisible: whether the ref is visible, setIsComponentVisible: setting visibility of element}
 */

type IUseComponentVisible = {
    ref: React.RefObject<any>;
    isComponentVisible: boolean;
    setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useComponentVisible(): IUseComponentVisible {
    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const ref: React.RefObject<HTMLElement> = useRef(null);

    const handleClickOutside = (event: Event): void => {
        if ((ref.current != null) && !ref.current.contains(event.target as Node)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("pointerup", handleClickOutside, true);
        return () => {
            document.removeEventListener("pointerup", handleClickOutside, true);
        };
    }, []);

    return { ref, isComponentVisible, setIsComponentVisible };
}
