const useNumberFortmatterHook = () => {

    const format = (number) => {
        return Math.abs(number) > 999 ? Math.sign(number)*((Math.abs(number)/1000).toFixed(1)) + 'k' : Math.sign(number)*Math.abs(number)
    }

    return {format}
}

export default useNumberFortmatterHook;