/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useEffectAfterMount(fn: () => void, deps: any[] = []) {
    const isMounted = React.useRef<boolean>(false)

    React.useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }

        fn()
    }, deps)
}
