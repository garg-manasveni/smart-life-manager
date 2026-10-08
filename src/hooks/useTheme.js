import { useEffect } from "react";

export default function useTheme(theme) {

    useEffect(() => {

        document.documentElement.dataset.theme = theme;

    }, [theme]);

}